import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HabitLog from "@/models/HabitLog";
import MoodEntry from "@/models/MoodEntry";
import Habit from "@/models/Habit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const userId = session.user.email;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [habits, logs, moods] = await Promise.all([
    Habit.find({ userId }),
    HabitLog.find({ userId, completedAt: { $gte: thirtyDaysAgo } }),
    MoodEntry.find({ userId, createdAt: { $gte: thirtyDaysAgo } }).sort({
      createdAt: 1,
    }),
  ]);

  // Last 30 দিনের mood data
  const moodData = moods.map((m) => ({
    date: new Date(m.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    mood: m.score,
  }));

  // প্রতিটা habit এর completion rate
  const habitData = habits.map((h) => {
    const habitLogs = logs.filter(
      (l) => l.habitId.toString() === h._id.toString(),
    );
    return {
      name: h.name,
      icon: h.icon,
      completed: habitLogs.length,
      rate: Math.round((habitLogs.length / 30) * 100),
    };
  });

  // Summary stats
  const avgMood = moods.length
    ? Math.round((moods.reduce((a, m) => a + m.score, 0) / moods.length) * 10) /
      10
    : 0;

  return NextResponse.json({
    moodData,
    habitData,
    totalLogs: logs.length,
    avgMood,
    totalHabits: habits.length,
  });
}
