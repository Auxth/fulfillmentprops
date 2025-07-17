"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setErrorMsg(error.message);
    else router.push("/login");
  };

  return (
    <div className="p-10 max-w-sm mx-auto">
      <h1 className="text-2xl mb-4">📝 Register</h1>
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
        className="w-full mb-2 border p-2 rounded"
      />
      {errorMsg && <p className="text-red-500 mb-2">{errorMsg}</p>}
      <button
        onClick={handleRegister}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Register
      </button>
    </div>
  );
}
