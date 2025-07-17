"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import dayjs from "dayjs";
import GameCard from "@/components/GameCard";

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("games")
        .select("*")
        .order("simulated", { ascending: false });
      if (data) setGames(data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-8xl mx-auto">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-2xl font-bold mb-4">Real-time Ranking Games</h1>
        <h1 className="text-white text-md mb-2">
          Updated time : {now.format("HH:mm:ss")}
        </h1>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 xl:grid-cols-8 gap-6">
        {games.map((game, index) => (
          <GameCard key={game.id} game={game} index={index} />
        ))}
      </div>
    </div>
  );
}
