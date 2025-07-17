import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: games, error } = await supabase.from("games").select("id, name, rtp, simulated");
  if (error || !games) return new Response("error loading games", { status: 500 });

  const updatedGames = await Promise.all(
    games.map(async (game) => {
      const prev_win_rate = game.simulated || game.rtp;

      // --- Simulate changes ---
      const win_rate = clamp(prev_win_rate + randFloat(-1.5, 1.5), 50, 98);
      const bonus_rate = clamp(randFloat(5, 25), 0, 30); // as %
      const free_spin_rate = clamp(randFloat(3, 20), 0, 25); // as %
      const user_count = Math.floor(randFloat(50, 500));
      const total_payout = +(user_count * randFloat(0.8, 1.5) * 1).toFixed(2);

      const { error: updateErr } = await supabase.from("games").update({
        prev_win_rate,
        simulated: win_rate,
        bonus_rate,
        free_spin_rate,
        user_count,
        total_payout,
        updated_at: new Date().toISOString(),
      }).eq("id", game.id);

      return updateErr ? { id: game.id, status: "fail" } : { id: game.id, status: "ok" };
    })
  );

  return new Response(JSON.stringify({ status: "ok", updated: updatedGames.length }), {
    headers: { "Content-Type": "application/json" },
  });
});

function randFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}