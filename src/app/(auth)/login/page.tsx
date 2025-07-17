"use client";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error) router.push("/admin");
  };

  return (
    <div className="p-10 max-w-sm mx-auto">
      <h1 className="text-2xl mb-4">🔐 Admin Login</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full mb-2 border p-2 rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full mb-4 border p-2 rounded"
      />
      <button
        onClick={handleLogin}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
