"use client";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export function AdminHeader() {
  const router = useRouter();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="p-4 flex justify-between items-center bg-primary/95 shadow-glow">
      <h1 className="text-2xl font-display">Admin Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
      >
        Logout
      </button>
    </header>
  );
}
