"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white border border-gray-100 rounded-2xl p-10 w-full max-w-sm text-center">
        <div className="text-4xl mb-4">🧠</div>
        <h1 className="text-xl font-medium text-gray-900 mb-2">HabitAI</h1>
        <p className="text-sm text-gray-400 mb-8">
          Track habits. Predict your mood.
        </p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="flex items-center justify-center gap-3 w-full border border-gray-200 rounded-xl py-3 text-sm text-gray-700 hover:bg-gray-50 transition cursor-pointer"
        >
          <img
            src="https://www.google.com/favicon.ico"
            className="w-4 h-4"
            alt="Google"
          />
          Continue with Google
        </button>
      </div>
    </main>
  );
}
