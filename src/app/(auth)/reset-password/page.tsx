"use client";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/update-password`,
    });
    if (error) setMessage(error.message);
    else setMessage("📨 Email sent! Please check your inbox.");
  };

  return (
    <div className="p-10 max-w-sm mx-auto">
      <h1 className="text-2xl mb-4">🔑 Reset Password</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="w-full mb-2 border p-2 rounded"
      />
      {message && <p className="text-blue-600 mb-2">{message}</p>}
      <button
        onClick={handleReset}
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Send Reset Email
      </button>
    </div>
  );
}
