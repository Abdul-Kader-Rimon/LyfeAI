 
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-medium text-gray-900 mb-3">HabitAI</h1>
        <p className="text-gray-500 mb-8">
          Track habits. Predict your mood. Powered by AI.
        </p>
        <Link
          href="/dashboard"
          className="bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm hover:bg-indigo-600 transition"
        >
          Get Started
        </Link>
      </div>
    </main>
  );
}
