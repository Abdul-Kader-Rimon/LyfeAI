"use client";
import { useState } from "react";

interface Insight {
  predictedMood: number;
  trend: string;
  insight: string;
  topSuggestion: string;
  streakRisk: string;
}

interface Props {
  initialData?: Insight;
}

export default function AIInsightCard({ initialData }: Props) {
  const [data, setData] = useState<Insight | null>(initialData || null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai-insight");
      const json = await res.json();
      setData(json);
    } catch {
      console.error("Failed to fetch insight");
    }
    setLoading(false);
  };

  const trendIcon =
    data?.trend === "improving"
      ? "📈"
      : data?.trend === "declining"
        ? "📉"
        : "➡️";

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-lg">
            ✨
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-700">AI Insight</h2>
            <p className="text-xs text-gray-400">Based on last 14 days</p>
          </div>
        </div>
        <button
          onClick={fetchInsight}
          disabled={loading}
          className="text-xs border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Get Insight"}
        </button>
      </div>

      {!data && !loading && (
        <div className="text-center py-6">
          <p className="text-sm text-gray-400">
            Click "Get Insight" to see your AI analysis
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-6">
          <div className="text-2xl mb-2">🤔</div>
          <p className="text-sm text-gray-400">Analyzing your patterns...</p>
        </div>
      )}

      {data && !loading && (
        <div>
          {/* Predicted mood */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-medium text-indigo-600">
                {data.predictedMood}
              </div>
              <div className="text-xs text-gray-400 mt-1">/ 10</div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-400 mb-1">
                Tomorrow's predicted mood
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-1">
                {trendIcon} {data.trend}
              </div>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${data.predictedMood * 10}%` }}
                />
              </div>
            </div>
          </div>

          {/* Insight */}
          <div className="border-l-2 border-indigo-400 pl-3 mb-3">
            <p className="text-sm text-gray-600 leading-relaxed">
              {data.insight}
            </p>
          </div>

          {/* Suggestion */}
          <div className="flex items-start gap-2 bg-green-50 rounded-lg p-3 mb-2">
            <span className="text-green-600 text-sm">💡</span>
            <p className="text-sm text-green-700">{data.topSuggestion}</p>
          </div>

          {data.streakRisk && data.streakRisk !== "none" && (
            <div className="flex items-start gap-2 bg-amber-50 rounded-lg p-3">
              <span className="text-amber-600 text-sm">⚠️</span>
              <p className="text-sm text-amber-700">{data.streakRisk}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
