"use client";
import { useState } from "react";

interface Props {
  initialScore?: number;
}

const emojis = [
  { score: 1, emoji: "😔", label: "Terrible" },
  { score: 2, emoji: "😞", label: "Bad" },
  { score: 3, emoji: "😕", label: "Poor" },
  { score: 4, emoji: "😐", label: "Okay" },
  { score: 5, emoji: "🙂", label: "Fine" },
  { score: 6, emoji: "😊", label: "Good" },
  { score: 7, emoji: "😄", label: "Great" },
  { score: 8, emoji: "😁", label: "Amazing" },
  { score: 9, emoji: "🤩", label: "Excellent" },
  { score: 10, emoji: "🥳", label: "Perfect" },
];

export default function MoodInput({ initialScore }: Props) {
  const [selected, setSelected] = useState<number | null>(initialScore || null);
  const [saved, setSaved] = useState(!!initialScore);
  const [loading, setLoading] = useState(false);

  const saveMood = async (score: number) => {
    setSelected(score);
    setLoading(true);
    await fetch("/api/mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score }),
    });
    setLoading(false);
    setSaved(true);
  };

  const selectedEmoji = emojis.find((e) => e.score === selected);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-700">
          How are you feeling today?
        </h2>
        {saved && (
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            ✓ Saved
          </span>
        )}
      </div>

      <div className="flex justify-between mb-3">
        {emojis.map((e) => (
          <button
            key={e.score}
            onClick={() => saveMood(e.score)}
            disabled={loading}
            className={`w-9 h-9 rounded-full text-xl transition hover:scale-110 ${
              selected === e.score
                ? "bg-indigo-50 ring-2 ring-indigo-400 scale-110"
                : "hover:bg-gray-50"
            }`}
            title={e.label}
          >
            {e.emoji}
          </button>
        ))}
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <span>Terrible</span>
        {selectedEmoji && (
          <span className="text-indigo-500 font-medium">
            {selectedEmoji.emoji} {selectedEmoji.label} ({selected}/10)
          </span>
        )}
        <span>Perfect</span>
      </div>
    </div>
  );
}
