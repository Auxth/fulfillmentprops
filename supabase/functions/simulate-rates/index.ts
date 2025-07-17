// /functions/simulate-rates/index.ts

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  const { data: games, error } = await supabase.from("games").select("*");

  if (error || !games) {
    return new Response(JSON.stringify({
      error,
    }), {
      status: 500,
    });
  }

  const updates = games.map((g) => {
    const id = g.id;
    const name = g.name ?? "Untitled";
    const rtp = g.rtp ?? 96;
    const volatilityRaw = g.volatility ?? "medium";

    const volatility = volatilityRaw === "high"
      ? 2
      : volatilityRaw === "low"
      ? 0.2
      : 1;

    const drift = (Math.random() - 0.5) * volatility * 2;

    const base = g.simulated ?? rtp;
    const simulated = Math.min(99.5, Math.max(base - 15, base + drift));

    return {
      id,
      name,
      rtp,
      volatility: volatilityRaw,
      simulated: parseFloat(simulated.toFixed(2)),
    };
  });

  const { error: updateError } = await supabase
    .from("games")
    .upsert(updates, { onConflict: "id" });

  if (updateError) {
    return new Response(JSON.stringify({
      error: updateError,
    }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({
    status: "ok",
    updated: updates.length,
  }), {
    status: 200,
  });
});
