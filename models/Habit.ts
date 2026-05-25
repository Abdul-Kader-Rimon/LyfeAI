import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHabit extends Document {
  name: string;
  description?: string;
  color: string;
  icon: string;
  frequency: "daily" | "weekly";
  userId: string;
  createdAt: Date;
}

const HabitSchema = new Schema<IHabit>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    color: { type: String, default: "#6366f1" },
    icon: { type: String, default: "star" },
    frequency: { type: String, enum: ["daily", "weekly"], default: "daily" },
    userId: { type: String, required: true },
  },
  { timestamps: true },
);

const Habit: Model<IHabit> =
  mongoose.models.Habit || mongoose.model<IHabit>("Habit", HabitSchema);

export default Habit;
