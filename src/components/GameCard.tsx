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

export default function GameCard({ game }: { game: any }) {
  const winRate = game.simulated ?? 0;
  const winRateChange = winRate - (game.prev_win_rate ?? 0);
  const isIncrease = winRateChange >= 0;
  const [barColor, textColor] = getColor(winRate).split(" ");

  return (
    <Card className="bg-[#1b1b1b] text-white w-full max-w-[230px] rounded-2xl border border-gray-700 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.03]">
      <CardContent className="relative p-4">
        {/* รูปเกม */}
        <div className="relative w-full aspect-square rounded-lg overflow-hidden">
          <Image
            src={game.image}
            alt={game.name}
            fill
            className="object-cover"
          />
        </div>

        {/* ผู้เล่น - moved below image */}
        <div className="absolute top-3 left-3 flex items-center gap-1 text-sm bg-black/60 px-2 py-1 rounded-full">
          <FaUserFriends className="text-green-400" />
          <span className="text-white">{game.user_count ?? "-"}</span>
        </div>

        {/* เนื้อหา */}
        <div className="mt-3">
          <h2 className="text-base font-semibold truncate">{game.name}</h2>

          <p className={`text-xl font-bold mt-1 ${textColor}`}>
            {winRate.toFixed(2)}%
            <span
              className={`ml-2 text-sm ${
                isIncrease ? "text-green-400" : "text-red-500"
              }`}
            >
              {isIncrease ? "▲" : "▼"}
            </span>
          </p>

          <div className="flex justify-between text-sm text-gray-300 mt-1">
            <span>Bonus: {game.bonus_rate?.toFixed(2)}%</span>
            <span>Freespin: {game.free_spin_rate?.toFixed(2)}%</span>
          </div>

          <div className="w-full bg-gray-700 h-2 rounded-full my-2">
            <div
              className={`h-full rounded-full ${barColor}`}
              style={{ width: `${winRate}%` }}
            ></div>
          </div>

          <div className="text-right text-sm text-yellow-400 font-semibold">
            {game.total_payout?.toLocaleString()} ฿
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
