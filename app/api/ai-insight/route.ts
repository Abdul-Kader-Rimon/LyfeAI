import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HabitLog from "@/models/HabitLog";
import MoodEntry from "@/models/MoodEntry";
import Habit from "@/models/Habit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const userId = session.user.email;
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const [habits, logs, moods] = await Promise.all([
    Habit.find({ userId }),
    HabitLog.find({ userId, completedAt: { $gte: fourteenDaysAgo } }),
    MoodEntry.find({ userId, createdAt: { $gte: fourteenDaysAgo } }),
  ]);

  const avgMood = moods.length
    ? (moods.reduce((a, m) => a + m.score, 0) / moods.length).toFixed(1)
    : "N/A";

  const prompt = `
You are a wellness coach. Analyze this user's habit and mood data.

Habits tracked: ${habits.map((h) => h.name).join(", ") || "None yet"}
Total habit completions (last 14 days): ${logs.length}
Mood scores (1-10): ${moods.map((m) => m.score).join(", ") || "None yet"}
Average mood: ${avgMood}

Respond ONLY with this JSON (no extra text, no markdown):
{
  "predictedMood": 7,
  "trend": "improving",
  "insight": "One specific observation about their pattern in 1-2 sentences",
  "topSuggestion": "One actionable tip for tomorrow",
  "streakRisk": "Which habit they might miss or none"
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content || "{}";
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({
      predictedMood: 7,
      trend: "stable",
      insight: "Keep tracking your habits to get personalized insights!",
      topSuggestion: "Try to complete all your habits today.",
      streakRisk: "none",
    });
  }
}
