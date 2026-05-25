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

  // Last 14 দিনের data collect করো
  const [habits, logs, moods] = await Promise.all([
    Habit.find({ userId }),
    HabitLog.find({ userId, completedAt: { $gte: fourteenDaysAgo } }),
    MoodEntry.find({ userId, createdAt: { $gte: fourteenDaysAgo } }),
  ]);

  const prompt = `
You are a wellness coach. Analyze this user's habit and mood patterns.

Habits tracked: ${habits.map((h) => h.name).join(", ")}

Last 14 days habit completions: ${logs.length} total logs
Mood entries (1-10 scale): ${moods.map((m) => `${m.score}/10`).join(", ")}
Average mood: ${(moods.reduce((a, m) => a + m.score, 0) / (moods.length || 1)).toFixed(1)}

Respond ONLY with this JSON (no extra text):
{
  "predictedMood": 7,
  "trend": "improving",
  "insight": "One specific observation about their pattern",
  "topSuggestion": "One actionable tip for tomorrow",
  "streakRisk": "Which habit they might miss tomorrow"
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
  });

  const raw = completion.choices[0].message.content || "{}";

  try {
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "AI parse failed" }, { status: 500 });
  }
}
