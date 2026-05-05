"use client";

import { useState } from "react";
import {
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { ResumeData } from "@/types/resume";
import PersonalInfoSection from "./sections/PersonalInfoSection";
import SummarySection from "./sections/SummarySection";
import WorkExperienceSection from "./sections/WorkExperienceSection";
import EducationSection from "./sections/EducationSection";
import SkillsSection from "./sections/SkillsSection";

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

const tabs = [
  { id: "personal", label: "Personal", icon: UserIcon },
  { id: "summary", label: "Summary", icon: DocumentTextIcon },
  { id: "experience", label: "Experience", icon: BriefcaseIcon },
  { id: "education", label: "Education", icon: AcademicCapIcon },
  { id: "skills", label: "Skills", icon: WrenchScrewdriverIcon },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function ResumeForm({ data, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("personal");

  return (
    <div className="flex flex-col h-full">
      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === "personal" && (
          <PersonalInfoSection
            data={data.personalInfo}
            onChange={(personalInfo) => onChange({ ...data, personalInfo })}
          />
        )}
        {activeTab === "summary" && (
          <SummarySection
            summary={data.summary}
            jobTitle={data.personalInfo.jobTitle}
            onChange={(summary) => onChange({ ...data, summary })}
          />
        )}
        {activeTab === "experience" && (
          <WorkExperienceSection
            items={data.workExperience}
            onChange={(workExperience) => onChange({ ...data, workExperience })}
          />
        )}
        {activeTab === "education" && (
          <EducationSection
            items={data.education}
            onChange={(education) => onChange({ ...data, education })}
          />
        )}
        {activeTab === "skills" && (
          <SkillsSection
            items={data.skillCategories}
            onChange={(skillCategories) => onChange({ ...data, skillCategories })}
          />
        )}
      </div>
    </div>
  );
}
