"use client";

import Image from "next/image";
import { FaUserFriends } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";

const getColor = (rate: number) => {
  if (rate < 25) return "bg-red-500 text-red-600";
  if (rate < 35) return "bg-orange-600 text-orange-700";
  if (rate < 45) return "bg-orange-400 text-orange-500";
  if (rate < 55) return "bg-amber-400 text-amber-500";
  if (rate < 65) return "bg-yellow-400 text-yellow-600";
  if (rate < 75) return "bg-lime-400 text-lime-600";
  if (rate < 85) return "bg-green-400 text-green-600";
  if (rate < 95) return "bg-emerald-500 text-emerald-600";
  return "bg-green-500 text-green-600";
};

export default function TopGameCard({
  game,
  index,
}: {
  game: any;
  index: number;
}) {
  const winRate = game.simulated ?? 0;
  const winRateChange = winRate - (game.prev_win_rate ?? 0);
  const isIncrease = winRateChange >= 0;
  const [barColor, textColor] = getColor(winRate).split(" ");

  const displayUserCount = (game.user_count ?? 0) + 1000;
  const displayTotalReward = Math.round(game.total_payout ?? 0);

  return (
    <Card className="relative bg-[#181818] text-white rounded-xl border border-[#FFD700] hover:border-[#00FFC2] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03]">
      <CardContent className="p-4">
        <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow">
          🏆 TOP {index + 1}
        </div>

        <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2">
          <Image
            src={game.image}
            alt={game.name}
            fill
            className="object-cover"
            unoptimized
            sizes="(max-width: 640px) 50vw, 220px"
            loading="lazy"
            // priority={index < 3}   // จะพรีโหลดเฉพาะ TOP 3 ก็ได้ (ถ้าต้องการให้ขึ้นไว)
          />
        </div>

        <div className="absolute top-3 left-3 flex items-center gap-1 text-xs bg-black/60 px-2 py-1 rounded-full">
          <FaUserFriends className="text-green-400" />
          <span className="text-white">{displayUserCount}</span>
        </div>

        <h2 className="text-sm font-semibold truncate mb-1">{game.name}</h2>

        <p className={`text-sm font-medium ${textColor}`}>
          Winrate:{" "}
          <span className="text-lg font-bold">{winRate.toFixed(2)}%</span>
          <span
            className={`ml-2 text-sm ${
              isIncrease ? "text-green-400" : "text-red-500"
            }`}
          >
            {isIncrease ? "▲" : "▼"}
          </span>
        </p>

        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>Bonus: {game.bonus_rate?.toFixed(2)}%</span>
          <span>Freespin: {game.free_spin_rate?.toFixed(2)}%</span>
        </div>

        <div className="w-full bg-gray-700 h-2 rounded-full my-2">
          <div
            className={`h-full rounded-full ${barColor}`}
            style={{ width: `${winRate}%` }}
          />
        </div>

        <div className="text-right text-xs font-semibold text-yellow-400">
          Total Reward: {displayTotalReward.toLocaleString()} ฿
        </div>
      </CardContent>
    </Card>
  );
}
