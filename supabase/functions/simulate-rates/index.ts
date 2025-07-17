import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  const { data: games, error } = await supabase.from("games").select("*");

  if (error) {
    console.error("Fetch error:", error);
    return new Response("Failed to fetch games", { status: 500 });
  }

  for (const game of games) {
    const prevWinRate = game.simulated ?? 50;
    const simulated = simulateFromRTP(game.rtp, game.volatility);
    const bonus_rate = simulateBonus(game.rtp, game.volatility);
    const free_spin_rate = simulateFreeSpin(game.volatility);
    const user_count = simulateUserCount(game.volatility);
    const total_payout = Math.max(
  50000,
  Math.floor(user_count * game.rtp * Math.random())
);

    const { error: updateError } = await supabase
      .from("games")
      .update({
        prev_win_rate: prevWinRate,
        simulated,
        bonus_rate,
        free_spin_rate,
        user_count,
        total_payout
      })
      .eq("id", game.id);

    if (updateError) {
      console.error(`Error updating game ${game.id}:`, updateError);
    }
  }

  return new Response(JSON.stringify({ status: "ok" }), {
    headers: { "Content-Type": "application/json" },
  });
});

function simulateFromRTP(rtp, volatility) {
  const volFactor = volatility === "high" ? 1.5 : volatility === "low" ? 0.8 : 1.0;
  const base = rtp + Math.random() * 4 - 2;
  const simulated = base * volFactor;
  return parseFloat(Math.min(98.5, simulated).toFixed(2));
}

function simulateBonus(rtp: number, volatility: string): number {
  const base = volatility === "high" ? 15 : volatility === "low" ? 30 : 22;
  const noise = Math.random() * 10 - 5;
  return Math.max(60, parseFloat((base + noise).toFixed(2)));
}

function simulateFreeSpin(volatility: string): number {
  const base = volatility === "high" ? 20 : volatility === "low" ? 10 : 15;
  const noise = Math.random() * 5 - 2.5;
  return Math.max(60, parseFloat((base + noise).toFixed(2)));
}

function simulateUserCount(volatility: string): number {
  const base = volatility === "high" ? 500 : volatility === "low" ? 1500 : 1000;
  return Math.max(100, Math.floor(base + Math.random() * 400 - 200));
}