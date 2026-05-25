"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

interface MoodPoint {
  date: string;
  mood: number;
}
interface HabitPoint {
  name: string;
  icon: string;
  completed: number;
  rate: number;
}

interface Props {
  moodData: MoodPoint[];
  habitData: HabitPoint[];
}

const COLORS = [
  "#6366f1",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
];

export default function AnalyticsCharts({ moodData, habitData }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Mood trend */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Mood trend — last 30 days
        </h3>
        {moodData.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            No mood data yet. Start rating your mood daily!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickLine={false}
              />
              <YAxis
                domain={[1, 10]}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "0.5px solid #E5E7EB",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ fill: "#6366f1", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Habit completion */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="text-sm font-medium text-gray-700 mb-4">
          Habit completion rate
        </h3>
        {habitData.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            No habits yet. Add habits to see stats!
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={habitData} barSize={32}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, "Completion rate"]}
                contentStyle={{
                  borderRadius: "8px",
                  border: "0.5px solid #E5E7EB",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                {habitData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
