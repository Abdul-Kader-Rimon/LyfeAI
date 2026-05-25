import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Habit from "@/models/Habit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const habits = await Habit.find({ userId: session.user.email }).sort({
    createdAt: -1,
  });

  return NextResponse.json(habits);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await connectDB();

  const habit = await Habit.create({
    name: body.name,
    description: body.description || "",
    color: body.color || "#6366f1",
    icon: body.icon || "⭐",
    userId: session.user.email,
  });

  return NextResponse.json(habit, { status: 201 });
}
