import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMoodEntry extends Document {
  userId: string;
  score: number; // 1–10
  note?: string;
  createdAt: Date;
}

const MoodEntrySchema = new Schema<IMoodEntry>(
  {
    userId: { type: String, required: true },
    score: { type: Number, required: true, min: 1, max: 10 },
    note: { type: String, default: "" },
  },
  { timestamps: true },
);

const MoodEntry: Model<IMoodEntry> =
  mongoose.models.MoodEntry ||
  mongoose.model<IMoodEntry>("MoodEntry", MoodEntrySchema);

export default MoodEntry;
