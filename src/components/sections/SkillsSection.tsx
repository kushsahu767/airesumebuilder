"use client";

import { useState } from "react";
import { PlusIcon, TrashIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { SkillCategory } from "@/types/resume";

interface Props {
  items: SkillCategory[];
  onChange: (items: SkillCategory[]) => void;
}

const newItem = (): SkillCategory => ({
  id: crypto.randomUUID(),
  category: "",
  skills: "",
});

export default function SkillsSection({ items, onChange }: Props) {
  const [enhancing, setEnhancing] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (id: string, field: keyof SkillCategory, value: string) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const add = () => onChange([...items, newItem()]);
  const remove = (id: string) => onChange(items.filter((item) => item.id !== id));

  const enhance = async (item: SkillCategory) => {
    if (!item.skills.trim()) {
      setErrors((e) => ({ ...e, [item.id]: "Please enter some skills first." }));
      return;
    }
    setEnhancing(item.id);
    setErrors((e) => ({ ...e, [item.id]: "" }));
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "skills",
          content: item.skills,
          context: { category: item.category },
        }),
      });
      const data = await res.json();
      if (data.enhanced) {
        update(item.id, "skills", data.enhanced);
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
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No skills added yet. Click below to add a skill category.
        </p>
      )}
      {items.map((item) => (
        <div key={item.id} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <input
                type="text"
                value={item.category}
                onChange={(e) => update(item.id, "category", e.target.value)}
                placeholder="Programming Languages"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => remove(item.id)}
              className="text-red-400 hover:text-red-600 transition-colors mt-5"
              aria-label="Remove"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-600">Skills</label>
              <button
                onClick={() => enhance(item)}
                disabled={enhancing === item.id}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <SparklesIcon className="w-3.5 h-3.5" />
                {enhancing === item.id ? "Enhancing…" : "AI Expand"}
              </button>
            </div>
            {errors[item.id] && (
              <p className="text-xs text-red-600 mb-1">{errors[item.id]}</p>
            )}
            <input
              type="text"
              value={item.skills}
              onChange={(e) => update(item.id, "skills", e.target.value)}
              placeholder="Python, JavaScript, TypeScript, Go"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Separate skills with commas.</p>
          </div>
        </div>
      ))}

      <button
        onClick={add}
        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 rounded-lg px-4 py-2 transition-colors w-full justify-center"
      >
        <PlusIcon className="w-4 h-4" />
        Add Skill Category
      </button>
    </div>
  );
}
