"use client";

import { useState } from "react";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface Props {
  summary: string;
  jobTitle: string;
  onChange: (summary: string) => void;
}

export default function SummarySection({ summary, jobTitle, onChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const enhance = async () => {
    if (!summary.trim()) {
      setError("Please enter a summary first to enhance it.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "summary",
          content: summary,
          context: { jobTitle },
        }),
      });
      const data = await res.json();
      if (data.enhanced) {
        onChange(data.enhanced);
      } else {
        setError(data.error || "Enhancement failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Write 2–4 sentences highlighting your expertise, key achievements, and career goals.
        </p>
        <button
          onClick={enhance}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <SparklesIcon className="w-4 h-4" />
          {loading ? "Enhancing…" : "AI Enhance"}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <textarea
        value={summary}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="Experienced software engineer with 5+ years building scalable web applications…"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
  );
}
