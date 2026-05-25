import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AnalyticsCharts from "@/components/AnalyticsCharts";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/analytics`, {
    headers: { cookie: "" },
    cache: "no-store",
  });
  const data = await res.json();

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
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium"
            >
              📈 Analytics
            </a>
            <a
              href="/ai-insight"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-50 text-sm"
            >
              ✨ AI Insight
            </a>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-xl font-medium text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-400 mt-1">Last 30 days overview</p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-2xl font-medium text-gray-900">
                {data.avgMood || "—"}
              </div>
              <div className="text-xs text-gray-400 mt-1">Avg mood</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-2xl font-medium text-gray-900">
                {data.totalLogs || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Total completions
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-2xl font-medium text-gray-900">
                {data.totalHabits || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">Habits tracked</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-2xl font-medium text-gray-900">
                {data.moodData?.length || 0}
              </div>
              <div className="text-xs text-gray-400 mt-1">Mood entries</div>
            </div>
          </div>

          {/* Charts */}
          <AnalyticsCharts
            moodData={data.moodData || []}
            habitData={data.habitData || []}
          />
        </main>
      </div>
    </div>
  );
}
