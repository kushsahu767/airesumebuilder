"use client";

import { ResumeData } from "@/types/resume";

interface Props {
  data: ResumeData;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  if (!year) return dateStr;
  if (!month) return year;
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ResumePreview({ data }: Props) {
  const { personalInfo, summary, workExperience, education, skillCategories } = data;

  const hasContent =
    personalInfo.fullName ||
    summary ||
    workExperience.length > 0 ||
    education.length > 0 ||
    skillCategories.length > 0;

  if (!hasContent) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <svg
          className="w-16 h-16 mb-4 text-gray-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-sm">Your resume preview will appear here.</p>
        <p className="text-xs mt-1">Start filling in the form on the left.</p>
      </div>
    );
  }

  return (
    <div
      id="resume-preview"
      className="bg-white text-gray-900 text-[13px] leading-relaxed font-sans p-8 min-h-[297mm] w-full max-w-[210mm] mx-auto shadow-sm"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* Header */}
      <header className="text-center border-b border-gray-200 pb-4 mb-5">
        {personalInfo.fullName && (
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">
            {personalInfo.fullName}
          </h1>
        )}
        {personalInfo.jobTitle && (
          <p className="text-[14px] text-gray-500 mt-0.5">{personalInfo.jobTitle}</p>
        )}
        {(personalInfo.email ||
          personalInfo.phone ||
          personalInfo.location ||
          personalInfo.linkedin ||
          personalInfo.website) && (
          <p className="text-[11px] text-gray-500 mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </p>
        )}
      </header>

      {/* Summary */}
      {summary && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold text-blue-700 uppercase tracking-widest border-b border-blue-200 pb-0.5 mb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {workExperience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold text-blue-700 uppercase tracking-widest border-b border-blue-200 pb-0.5 mb-3">
            Work Experience
          </h2>
          <div className="space-y-4">
            {workExperience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{exp.position}</p>
                    <p className="text-gray-500 text-[12px] italic">
                      {exp.company}
                      {exp.location ? `, ${exp.location}` : ""}
                    </p>
                  </div>
                  {(exp.startDate || exp.endDate) && (
                    <p className="text-[11px] text-gray-400 whitespace-nowrap ml-4">
                      {formatDate(exp.startDate)}
                      {(exp.startDate || exp.current || exp.endDate) && " – "}
                      {exp.current ? "Present" : formatDate(exp.endDate)}
                    </p>
                  )}
                </div>
                {exp.description && (
                  <div className="mt-1.5 text-gray-700 space-y-0.5">
                    {exp.description.split("\n").map((line, i) => {
                      const trimmed = line.trim();
                      if (!trimmed) return null;
                      return (
                        <p key={i} className="pl-3">
                          {trimmed.startsWith("•") ? trimmed : `• ${trimmed}`}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold text-blue-700 uppercase tracking-widest border-b border-blue-200 pb-0.5 mb-3">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ""}
                    </p>
                    <p className="text-gray-500 text-[12px] italic">
                      {edu.institution}
                      {edu.location ? `, ${edu.location}` : ""}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    {(edu.startDate || edu.endDate) && (
                      <p className="text-[11px] text-gray-400 whitespace-nowrap">
                        {formatDate(edu.startDate)}
                        {(edu.startDate || edu.endDate) && " – "}
                        {formatDate(edu.endDate)}
                      </p>
                    )}
                    {edu.gpa && (
                      <p className="text-[11px] text-gray-400">GPA: {edu.gpa}</p>
                    )}
                  </div>
                </div>
                {edu.description && (
                  <p className="text-gray-600 text-[12px] mt-1">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skillCategories.length > 0 && (
        <section>
          <h2 className="text-[11px] font-bold text-blue-700 uppercase tracking-widest border-b border-blue-200 pb-0.5 mb-3">
            Skills
          </h2>
          <div className="space-y-1.5">
            {skillCategories.map((sc) => (
              <p key={sc.id} className="text-gray-700">
                <span className="font-semibold text-gray-900">{sc.category}: </span>
                {sc.skills}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
