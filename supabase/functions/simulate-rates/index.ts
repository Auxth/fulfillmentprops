import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function gaussianRandom(mean = 0, stdDev = 1): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return mean + stdDev * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function weightedWinRate(): number {
  const roll = Math.random();
  let min = 15, max = 44;
  if (roll < 0.4) [min, max] = [15, 44];         // 40% low
  else if (roll < 0.8) [min, max] = [45, 80];    // 40% mid
  else [min, max] = [81, 98.5];                  // 20% high
  return +(Math.random() * (max - min) + min).toFixed(2);
}


function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: games, error } = await supabaseClient.from("games").select("*");
  if (error || !games) {
    return new Response(JSON.stringify({ error: error?.message || "No data returned" }), { status: 500 });
  }

  const now = new Date().toISOString();

  const tierMap = { low: 1, medium: 2, high: 3 };

  const updates = games.map((game) => {
    const previousSimulated = game.simulated ?? 0;
    const volatilityTier = tierMap[game.volatility] ?? 2;

    const simulated = weightedWinRate();
    const bonusRate = +(randomInRange(60, 90)).toFixed(2);
    const freeSpinRate = +(randomInRange(60, 90)).toFixed(2);

    const avgBet = +(randomInRange(2.0, 6.0)).toFixed(2);
    const userMean = 100 + volatilityTier * 100;
    const userDev = userMean * 0.25;
    const userCount = Math.max(100, Math.round(gaussianRandom(userMean, userDev)));

    const scaleFactor = 345 + volatilityTier * 20;
    let payout = userCount * avgBet * (simulated / 100) * scaleFactor;
    payout *= 1 + gaussianRandom(0, 0.05);
    payout = Math.round(clamp(payout, 50000, 1000000));

    if (payout === 50000) {
      payout = Math.round(randomInRange(50000, 60000));
    }

    return {
      id: game.id,
      simulated,
      prev_win_rate: +previousSimulated.toFixed(2),
      bonus_rate: bonusRate,
      free_spin_rate: freeSpinRate,
      user_count: userCount,
      avg_bet: avgBet,
      total_payout: payout,
      last_simulated_at: now,
      volatility_tier: volatilityTier,
    };
  });

  for (const update of updates) {
    const { error } = await supabaseClient.from("games").update(update).eq("id", update.id);
    if (error) {
      console.error(`Failed to update game ID ${update.id}:`, error.message);
    }
  }

  return new Response(JSON.stringify({ success: true, count: updates.length }), {
    headers: { "Content-Type": "application/json" },
  });
});
