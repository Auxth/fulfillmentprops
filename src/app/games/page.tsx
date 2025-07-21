"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { Game } from "@/types/Game";
import TopGameCard from "@/components/TopGameCard";
import GameCard from "@/components/GameCard";
import DashboardStatCard from "@/components/DashboardStatCard";
import { FiActivity, FiUsers } from "react-icons/fi";
import { TbCoinFilled } from "react-icons/tb";
import { GiWorld, GiTrophy } from "react-icons/gi";
import { SiApostrophe } from "react-icons/si";

dayjs.extend(relativeTime);

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [lastSimulatedAt, setLastSimulatedAt] = useState<string | null>(null);
  const [lastSimulatedRelative, setLastSimulatedRelative] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("games")
        .select("*")
        .order("simulated", { ascending: false });
      if (data) {
        setGames(data as Game[]);
        const latest = data.reduce((latest, g) => {
          const time = new Date(g.last_simulated_at).getTime();
          return time > latest ? time : latest;
        }, 0);

        const latestDate = new Date(latest);
        latestDate.setHours(latestDate.getHours() + 7); // Force to UTC+7

        setLastSimulatedAt(
          latestDate.toLocaleString("en-GB", {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        setLastSimulatedRelative(dayjs(latestDate).fromNow());
      }
    };
    fetchData();
  }, []);

  const top10Games = games.slice(0, 10);
  const allOtherGames = games.slice(10);

  const totalUsers = games.reduce((acc, g, i) => {
    const isTop10 = i < 10;
    return acc + (g.user_count ?? 0) + (isTop10 ? 1000 : 0);
  }, 0);

  const totalReward = games.reduce((acc, g) => acc + (g.total_payout ?? 0), 0);

  return (
    <div className="p-12 max-w mx-auto text-white bg-[#121212] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white flex items-center gap-2">
            <GiWorld />
            Game Winrate Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Real‑time stats for online game performance
          </p>
        </div>
        <div className="text-sm text-right text-gray-400">
          <p className="mb-1">Last Updated:</p>
          <p className="text-white text-[16px] font-semibold mb-1">
            {lastSimulatedAt ?? "Loading..."}
          </p>
          <p className="text-gray-500 text-xs mb-1">
            ({lastSimulatedRelative})
          </p>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <DashboardStatCard
          title="Total Games"
          value={games.length}
          icon={<FiActivity size={24} className="text-[#00FFC2]" />}
        />
        <DashboardStatCard
          title="Total Users"
          value={totalUsers}
          icon={<FiUsers size={24} className="text-[#00FFC2]" />}
        />
        <DashboardStatCard
          title="Total Reward"
          value={totalReward.toLocaleString()}
          icon={<TbCoinFilled size={24} className="text-[#00FFC2]" />}
        />
      </div>

      {/* Top 10 Section */}
      <section className="mb-10 mx-auto">
        <h2 className="text-2xl font-semibold mb-4 ">
          <div className="flex ">
            <GiTrophy className="text-[#00FFC2]" size={36} />
            <span className="pl-2">Top 10 Games</span>
          </div>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {top10Games.map((game, index) => (
            <TopGameCard key={game.id} game={game} index={index} />
          ))}
        </div>
      </section>

      {/* All Games Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-white">
          <div className="flex ">
            <SiApostrophe className="text-[#00FFC2]" size={36} />
            <span className="pl-4">All Games</span>
          </div>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {allOtherGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>
    </div>
  );
}
