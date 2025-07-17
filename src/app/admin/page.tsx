import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default async function AdminDashboard() {
  const { data: games } = await supabase.from("games").select("*");

  return (
    <div className="p-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">🎛 Game Dashboard</h1>
        <Link
          href="/admin/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Game
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {games?.map((game) => (
          <div key={game.id} className="border p-4 rounded">
            <h2 className="font-semibold">{game.name}</h2>
            <p>{game.win_rate}%</p>
            <div className="flex gap-2 mt-2">
              <Link href={`/admin/edit/${game.id}`} className="text-blue-600">
                Edit
              </Link>
              <form action={`/admin/delete/${game.id}`} method="post">
                <button type="submit" className="text-red-600">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
