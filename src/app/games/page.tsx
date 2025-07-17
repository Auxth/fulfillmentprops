"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import dayjs from "dayjs";

const getColor = (rate: number) => {
  if (rate < 52.5) return "bg-red-500 text-red-600";
  if (rate < 56.8) return "bg-orange-600 text-orange-700";
  if (rate < 61.3) return "bg-orange-400 text-orange-500";
  if (rate < 65.8) return "bg-amber-400 text-amber-500";
  if (rate < 70.3) return "bg-yellow-400 text-yellow-600";
  if (rate < 74.8) return "bg-lime-400 text-lime-600";
  if (rate < 79.3) return "bg-green-400 text-green-600";
  if (rate < 83.8) return "bg-emerald-500 text-emerald-600";
  return "bg-green-500 text-green-600";
};

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [now, setNow] = useState(dayjs());
  const [intervalMs, setIntervalMs] = useState(1000); // default 1s

  useEffect(() => {
    const timer = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGames((prev) => {
        const newGames = [...prev].map((g) => {
          const base = g.rtp ?? 96;
          const volatility =
            g.volatility === "high" ? 2 : g.volatility === "low" ? 0.2 : 1;
          const drift = (Math.random() - 0.5) * volatility * 2;
          const raw = g.simulated + drift;
          const clamped = Math.min(99.5, Math.max(base - 15, raw));
          return { ...g, simulated: parseFloat(clamped.toFixed(2)) };
        });
        newGames.sort((a, b) => b.simulated - a.simulated);
        return newGames;
      });
    }, intervalMs);
    return () => clearInterval(interval);
  }, [intervalMs]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("games").select("*");
      if (!data) return;
      const withSim = data.map((g) => ({
        ...g,
        simulated: parseFloat((g.rtp + (Math.random() - 0.5) * 2).toFixed(2)),
      }));
      withSim.sort((a, b) => b.simulated - a.simulated);
      setGames(withSim);
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
        <div className="flex items-center gap-4">
          <label className="text-white text-sm">Refresh every</label>
          <select
            className="bg-gray-800 text-white p-2 rounded"
            value={intervalMs}
            onChange={(e) => setIntervalMs(Number(e.target.value))}
          >
            <option value={1000}>1 sec</option>
            <option value={10000}>10 sec</option>
            <option value={60000}>1 min</option>
            <option value={1800000}>30 min</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 xl:grid-cols-8 gap-6">
        {games.map((game, index) => (
          <div
            key={game.id}
            className="bg-[#111827] p-3 rounded-xl shadow hover:scale-105 transition-transform duration-300"
          >
            <div className="relative w-full aspect-square mb-2 overflow-hidden rounded-lg">
              <Image
                src={game.image}
                alt={game.name}
                fill
                className="object-cover"
              />
            </div>
            <h2
              className="text-sm text-white font-semibold text-center mb-1 truncate"
              title={`#${index + 1} ${game.name}`}
            >
              #{index + 1} {game.name}
            </h2>
            <p
              className={`text-xs font-medium text-center mb-1 ${
                getColor(game.simulated).split(" ")[1]
              }`}
            >
              Win rate: {game.simulated.toFixed(2)}%
            </p>
            <div className="w-full bg-gray-700 h-2 rounded-full">
              <div
                className={`h-full rounded-full ${
                  getColor(game.simulated).split(" ")[0]
                }`}
                style={{ width: `${game.simulated}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
