"use client";

import { useState, useCallback } from "react";
import { ArrowDownTrayIcon, SparklesIcon } from "@heroicons/react/24/outline";
import ResumeForm from "@/components/ResumeForm";
import ResumePreview from "@/components/ResumePreview";
import { ResumeData, defaultResumeData } from "@/types/resume";

export default function Home() {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [exporting, setExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = useCallback((data: ResumeData) => {
    setResumeData(data);
  }, []);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const { exportToPDF } = await import("@/lib/pdf");
      await exportToPDF(resumeData);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to export PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-blue-600" />
            <h1 className="text-lg font-bold text-gray-900">AI Resume Builder</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile toggle */}
            <button
              onClick={() => setShowPreview((v) => !v)}
              className="lg:hidden text-sm font-medium text-blue-600 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors"
            >
              {showPreview ? "← Edit" : "Preview →"}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              {exporting ? "Exporting…" : "Export PDF"}
            </button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-6 flex gap-6">
        {/* Form panel */}
        <div
          className={`${
            showPreview ? "hidden" : "flex"
          } lg:flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden w-full lg:w-[420px] xl:w-[480px] shrink-0 self-start sticky top-6 max-h-[calc(100vh-5.5rem)]`}
        >
          <ResumeForm data={resumeData} onChange={handleChange} />
        </div>

        {/* Preview panel */}
        <div
          className={`${
            showPreview ? "flex" : "hidden"
          } lg:flex flex-col flex-1 min-w-0`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Live Preview
            </h2>
            <p className="text-xs text-gray-400">A4 format — 210 × 297 mm</p>
          </div>
          <div className="flex-1 overflow-auto rounded-2xl border border-gray-200 shadow-sm">
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </main>
    </div>
  );
}
