import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AIInsightCard from "@/components/AIInsightCard";

export default async function AIInsightPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-48 min-h-screen bg-white border-r border-gray-100 flex flex-col p-3">
          <div className="flex items-center gap-2 px-2 py-4 mb-2">
            <span className="text-xl">🧠</span>
            <span className="font-medium text-gray-900">HabitAI</span>
          </div>
          <nav className="flex flex-col gap-1">
            <a
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-50 text-sm"
            >
              📊 Dashboard
            </a>
            <a
              href="/analytics"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-50 text-sm"
            >
              📈 Analytics
            </a>
            <a
              href="/ai-insight"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium"
            >
              ✨ AI Insight
            </a>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-xl font-medium text-gray-900">AI Insight</h1>
            <p className="text-sm text-gray-400 mt-1">
              Powered by GPT-3.5 — based on your last 14 days
            </p>
          </div>
          <div className="max-w-xl">
            <AIInsightCard />
          </div>
        </main>
      </div>
    </div>
  );
}
