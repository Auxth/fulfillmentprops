"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleUpdate = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) setMessage(error.message);
    else {
      setMessage("✅ Password updated. Logging in...");
      setTimeout(() => router.push("/admin"), 1500);
    }
  };

  return (
    <div className="p-10 max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">🔐 Set New Password</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="New password"
        className="w-full mb-2 border p-2 rounded"
      />
      {message && <p className="text-blue-600 mb-2">{message}</p>}
      <button
        onClick={handleUpdate}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Update Password
      </button>
    </div>
  );
}
