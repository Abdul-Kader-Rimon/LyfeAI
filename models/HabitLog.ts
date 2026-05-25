import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHabitLog extends Document {
  habitId: mongoose.Types.ObjectId;
  userId: string;
  completedAt: Date;
  note?: string;
}

const HabitLogSchema = new Schema<IHabitLog>({
  habitId: { type: Schema.Types.ObjectId, ref: "Habit", required: true },
  userId: { type: String, required: true },
  completedAt: { type: Date, default: Date.now },
  note: { type: String, default: "" },
});

const HabitLog: Model<IHabitLog> =
  mongoose.models.HabitLog ||
  mongoose.model<IHabitLog>("HabitLog", HabitLogSchema);

export default HabitLog;
