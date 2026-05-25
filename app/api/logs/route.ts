import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HabitLog from "@/models/HabitLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// আজকের habit complete করো
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { habitId } = await req.json();
  await connectDB();

  // আজকে already complete হয়েছে কিনা check করো
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const existing = await HabitLog.findOne({
    habitId,
    userId: session.user.email,
    completedAt: { $gte: today, $lt: tomorrow },
  });

  if (existing) {
    // Already done — undo করো
    await HabitLog.findByIdAndDelete(existing._id);
    return NextResponse.json({ completed: false });
  }

  // নতুন log তৈরি করো
  await HabitLog.create({
    habitId,
    userId: session.user.email,
    completedAt: new Date(),
  });

  return NextResponse.json({ completed: true });
}

// আজকের completed habits আনো
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const logs = await HabitLog.find({
    userId: session.user.email,
    completedAt: { $gte: today, $lt: tomorrow },
  });

  return NextResponse.json(logs.map((l) => l.habitId.toString()));
}
