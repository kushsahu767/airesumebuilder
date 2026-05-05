"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { WorkExperience } from "@/types/resume";

interface Props {
  items: WorkExperience[];
  onChange: (items: WorkExperience[]) => void;
}

const newItem = (): WorkExperience => ({
  id: crypto.randomUUID(),
  company: "",
  position: "",
  location: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
});

export default function WorkExperienceSection({ items, onChange }: Props) {
  const [enhancing, setEnhancing] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (id: string, field: keyof WorkExperience, value: string | boolean) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const add = () => onChange([...items, newItem()]);

  const remove = (id: string) => onChange(items.filter((item) => item.id !== id));

  const enhance = async (item: WorkExperience) => {
    if (!item.description.trim()) {
      setErrors((e) => ({ ...e, [item.id]: "Please enter a description first." }));
      return;
    }
    setEnhancing(item.id);
    setErrors((e) => ({ ...e, [item.id]: "" }));
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "experience",
          content: item.description,
          context: { position: item.position, company: item.company },
        }),
      });
      const data = await res.json();
      if (data.enhanced) {
        update(item.id, "description", data.enhanced);
      } else {
        setErrors((e) => ({ ...e, [item.id]: data.error || "Enhancement failed." }));
      }
    } catch {
      setErrors((e) => ({ ...e, [item.id]: "Network error. Please try again." }));
    } finally {
      setEnhancing(null);
    }
  };

  return (
    <div className="space-y-6">
      {items.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No work experience added yet. Click below to add your first entry.
        </p>
      )}
      {items.map((item, index) => (
        <div key={item.id} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600">
              Experience {index + 1}
            </span>
            <button
              onClick={() => remove(item.id)}
              className="text-red-400 hover:text-red-600 transition-colors"
              aria-label="Remove"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Job Title</label>
              <input
                type="text"
                value={item.position}
                onChange={(e) => update(item.id, "position", e.target.value)}
                placeholder="Software Engineer"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Company</label>
              <input
                type="text"
                value={item.company}
                onChange={(e) => update(item.id, "company", e.target.value)}
                placeholder="Acme Corp"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
              <input
                type="text"
                value={item.location}
                onChange={(e) => update(item.id, "location", e.target.value)}
                placeholder="New York, NY"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                <input
                  type="month"
                  value={item.startDate}
                  onChange={(e) => update(item.id, "startDate", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                <input
                  type="month"
                  value={item.endDate}
                  onChange={(e) => update(item.id, "endDate", e.target.value)}
                  disabled={item.current}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={item.current}
              onChange={(e) => update(item.id, "current", e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Currently working here
          </label>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-600">Description</label>
              <button
                onClick={() => enhance(item)}
                disabled={enhancing === item.id}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <SparklesIcon className="w-3.5 h-3.5" />
                {enhancing === item.id ? "Enhancing…" : "AI Enhance"}
              </button>
            </div>
            {errors[item.id] && (
              <p className="text-xs text-red-600 mb-1">{errors[item.id]}</p>
            )}
            <textarea
              value={item.description}
              onChange={(e) => update(item.id, "description", e.target.value)}
              rows={4}
              placeholder="• Led development of a microservices architecture that improved performance by 40%&#10;• Mentored 3 junior developers on best practices"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">Use bullet points (•) for best results.</p>
          </div>
        </div>
      ))}

      <button
        onClick={add}
        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 rounded-lg px-4 py-2 transition-colors w-full justify-center"
      >
        <PlusIcon className="w-4 h-4" />
        Add Work Experience
      </button>
    </div>
  );
}
