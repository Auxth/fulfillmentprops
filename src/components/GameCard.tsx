import Image from "next/image";

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

export default function GameCard({
  game,
  index,
}: {
  game: any;
  index: number;
}) {
  const [bg, text] = getColor(game.simulated).split(" ");

  return (
    <div className="bg-[#111827] p-3 rounded-xl shadow hover:scale-105 transition-transform duration-300">
      <div className="relative w-full aspect-square mb-2 overflow-hidden rounded-lg">
        <Image src={game.image} alt={game.name} fill className="object-cover" />
      </div>
      <h2
        className="text-sm text-white font-semibold text-center mb-1 truncate"
        title={`#${index + 1} ${game.name}`}
      >
        #{index + 1} {game.name}
      </h2>
      <p className={`text-xs font-medium text-center mb-1 ${text}`}>
        Win rate: {game.simulated.toFixed(2)}%
      </p>
      <div className="w-full bg-gray-700 h-2 rounded-full">
        <div
          className={`h-full rounded-full ${bg}`}
          style={{ width: `${game.simulated}%` }}
        />
      </div>
    </div>
  );
}
