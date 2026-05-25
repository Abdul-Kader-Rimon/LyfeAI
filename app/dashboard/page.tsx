import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import HabitSection from "@/components/HabitSection";
import MoodInput from "@/components/MoodInput";
import AIInsightCard from "@/components/AIInsightCard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();

  const habits = await Habit.find({
    userId: session.user?.email,
  })
    .sort({ createdAt: -1 })
    .lean();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayLogs = await HabitLog.find({
    userId: session.user?.email,
    completedAt: { $gte: today, $lt: tomorrow },
  }).lean();

  const completedIds = todayLogs.map((l) => l.habitId.toString());

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
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-medium"
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
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:bg-gray-50 text-sm"
            >
              ✨ AI Insight
            </a>
          </nav>
          <div className="mt-auto px-2 py-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-medium">
                {session.user?.name?.[0] ?? "U"}
              </div>
              <span className="text-xs text-gray-500 truncate">
                {session.user?.name}
              </span>
            </div>
          </div>
        </aside>

              <MoodInput />
              <div className="mt-4">
                  <AIInsightCard/>
              </div>
        {/* Main */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-medium text-gray-900">
                Good morning, {session.user?.name?.split(" ")[0]} 👋
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-2xl font-medium text-gray-900">
                {habits.length}
              </div>
              <div className="text-xs text-gray-400 mt-1">Total habits</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-2xl font-medium text-gray-900">
                {completedIds.length}/{habits.length}
              </div>
              <div className="text-xs text-gray-400 mt-1">Done today</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-2xl font-medium text-gray-900">0 🔥</div>
              <div className="text-xs text-gray-400 mt-1">Best streak</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="text-2xl font-medium text-gray-900">—</div>
              <div className="text-xs text-gray-400 mt-1">Avg mood</div>
            </div>
          </div>

          {/* Habit section — client component */}
          <HabitSection
            habits={JSON.parse(JSON.stringify(habits))}
            completedIds={completedIds}
          />
        </main>
      </div>
    </div>
  );
}
