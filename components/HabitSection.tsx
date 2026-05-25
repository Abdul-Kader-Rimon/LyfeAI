"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Habit {
  _id: string;
  name: string;
  icon: string;
  color: string;
}

interface Props {
  habits: Habit[];
  completedIds: string[];
}

export default function HabitSection({ habits, completedIds }: Props) {
  const router = useRouter();
  const [completed, setCompleted] = useState<string[]>(completedIds);
  const [showModal, setShowModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    icon: "⭐",
    color: "#6366f1",
  });
  const [loading, setLoading] = useState(false);

  const toggleHabit = async (habitId: string) => {
    const res = await fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId }),
    });
    const data = await res.json();
    if (data.completed) {
      setCompleted((prev) => [...prev, habitId]);
    } else {
      setCompleted((prev) => prev.filter((id) => id !== habitId));
    }
  };

  const addHabit = async () => {
    if (!newHabit.name.trim()) return;
    setLoading(true);
    await fetch("/api/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newHabit),
    });
    setLoading(false);
    setShowModal(false);
    setNewHabit({ name: "", icon: "⭐", color: "#6366f1" });
    router.refresh();
  };

  const icons = ["⭐", "🏃", "💧", "📚", "🧘", "💪", "🎯", "😴", "🥗", "✍️"];
  const colors = [
    "#6366f1",
    "#EC4899",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
  ];

  return (
    <div>
      {/* Habit list */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-700">Today's habits</h2>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600 transition"
          >
            + Add Habit
          </button>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">🌱</div>
            <p className="text-sm text-gray-400">
              No habits yet. Add your first habit!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {habits.map((habit) => {
              const isDone = completed.includes(habit._id);
              return (
                <div
                  key={habit._id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition"
                >
                  <button
                    onClick={() => toggleHabit(habit._id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition flex-shrink-0 ${
                      isDone
                        ? "bg-indigo-500 border-indigo-500 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {isDone && <span className="text-xs">✓</span>}
                  </button>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: habit.color + "20" }}
                  >
                    {habit.icon}
                  </div>
                  <span
                    className={`text-sm flex-1 ${isDone ? "line-through text-gray-400" : "text-gray-700"}`}
                  >
                    {habit.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Habit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-base font-medium text-gray-900 mb-4">
              Add new habit
            </h3>

            <input
              type="text"
              placeholder="Habit name (e.g. Morning run)"
              value={newHabit.name}
              onChange={(e) =>
                setNewHabit({ ...newHabit, name: e.target.value })
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-4 outline-none focus:border-indigo-400"
            />

            <p className="text-xs text-gray-400 mb-2">Pick an icon</p>
            <div className="flex gap-2 flex-wrap mb-4">
              {icons.map((icon) => (
                <button
                  key={icon}
                  onClick={() => setNewHabit({ ...newHabit, icon })}
                  className={`w-9 h-9 rounded-lg text-lg hover:bg-gray-100 transition ${
                    newHabit.icon === icon
                      ? "bg-indigo-50 ring-2 ring-indigo-400"
                      : ""
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400 mb-2">Pick a color</p>
            <div className="flex gap-2 mb-5">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewHabit({ ...newHabit, color })}
                  className={`w-7 h-7 rounded-full transition ${
                    newHabit.color === color
                      ? "ring-2 ring-offset-2 ring-gray-400"
                      : ""
                  }`}
                  style={{ background: color }}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm py-2.5 rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={addHabit}
                disabled={loading}
                className="flex-1 bg-indigo-500 text-white text-sm py-2.5 rounded-xl hover:bg-indigo-600 transition disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Habit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
