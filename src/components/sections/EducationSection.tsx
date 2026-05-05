"use client";

import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Education } from "@/types/resume";

interface Props {
  items: Education[];
  onChange: (items: Education[]) => void;
}

const newItem = (): Education => ({
  id: crypto.randomUUID(),
  institution: "",
  degree: "",
  field: "",
  location: "",
  startDate: "",
  endDate: "",
  gpa: "",
  description: "",
});

export default function EducationSection({ items, onChange }: Props) {
  const update = (id: string, field: keyof Education, value: string) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const add = () => onChange([...items, newItem()]);
  const remove = (id: string) => onChange(items.filter((item) => item.id !== id));

  return (
    <div className="space-y-6">
      {items.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-4">
          No education added yet. Click below to add your first entry.
        </p>
      )}
      {items.map((item, index) => (
        <div key={item.id} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-600">Education {index + 1}</span>
            <button
              onClick={() => remove(item.id)}
              className="text-red-400 hover:text-red-600 transition-colors"
              aria-label="Remove"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Institution</label>
              <input
                type="text"
                value={item.institution}
                onChange={(e) => update(item.id, "institution", e.target.value)}
                placeholder="Massachusetts Institute of Technology"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Degree</label>
              <input
                type="text"
                value={item.degree}
                onChange={(e) => update(item.id, "degree", e.target.value)}
                placeholder="Bachelor of Science"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Field of Study</label>
              <input
                type="text"
                value={item.field}
                onChange={(e) => update(item.id, "field", e.target.value)}
                placeholder="Computer Science"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
              <input
                type="text"
                value={item.location}
                onChange={(e) => update(item.id, "location", e.target.value)}
                placeholder="Cambridge, MA"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">GPA</label>
              <input
                type="text"
                value={item.gpa}
                onChange={(e) => update(item.id, "gpa", e.target.value)}
                placeholder="3.8 / 4.0"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Additional Details (honors, activities, etc.)
            </label>
            <textarea
              value={item.description}
              onChange={(e) => update(item.id, "description", e.target.value)}
              rows={2}
              placeholder="Dean's List, Phi Beta Kappa, Varsity Chess Team"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      ))}

      <button
        onClick={add}
        className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-400 rounded-lg px-4 py-2 transition-colors w-full justify-center"
      >
        <PlusIcon className="w-4 h-4" />
        Add Education
      </button>
    </div>
  );
}
