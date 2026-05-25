import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import MoodEntry from "@/models/MoodEntry";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { score, note } = await req.json();
  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existing = await MoodEntry.findOne({
    userId: session.user.email,
    createdAt: { $gte: today, $lt: tomorrow },
  });

  if (existing) {
    existing.score = score;
    existing.note = note || "";
    await existing.save();
    return NextResponse.json(existing);
  }

  const entry = await MoodEntry.create({
    userId: session.user.email,
    score,
    note: note || "",
  });

  return NextResponse.json(entry, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const entries = await MoodEntry.find({
    userId: session.user.email,
    createdAt: { $gte: thirtyDaysAgo },
  }).sort({ createdAt: 1 });

  return NextResponse.json(entries);
}
