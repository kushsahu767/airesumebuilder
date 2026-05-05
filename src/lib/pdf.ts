import { ResumeData } from "@/types/resume";

export async function exportToPDF(data: ResumeData): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const addSection = (title: string) => {
    checkPageBreak(10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 64, 175);
    doc.text(title.toUpperCase(), margin, y);
    y += 1;
    doc.setDrawColor(30, 64, 175);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + contentWidth, y);
    y += 5;
    doc.setTextColor(0, 0, 0);
  };

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text(data.personalInfo.fullName || "Your Name", pageWidth / 2, y, { align: "center" });
  y += 7;

  if (data.personalInfo.jobTitle) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    doc.text(data.personalInfo.jobTitle, pageWidth / 2, y, { align: "center" });
    y += 5;
  }

  // Contact line
  const contactParts: string[] = [];
  if (data.personalInfo.email) contactParts.push(data.personalInfo.email);
  if (data.personalInfo.phone) contactParts.push(data.personalInfo.phone);
  if (data.personalInfo.location) contactParts.push(data.personalInfo.location);
  if (data.personalInfo.linkedin) contactParts.push(data.personalInfo.linkedin);
  if (data.personalInfo.website) contactParts.push(data.personalInfo.website);

  if (contactParts.length > 0) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    const contactLine = contactParts.join("  |  ");
    const wrapped = doc.splitTextToSize(contactLine, contentWidth);
    doc.text(wrapped, pageWidth / 2, y, { align: "center" });
    y += wrapped.length * 4 + 3;
  }

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, margin + contentWidth, y);
  y += 6;

  // Summary
  if (data.summary) {
    addSection("Professional Summary");
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);
    const summaryLines = doc.splitTextToSize(data.summary, contentWidth);
    checkPageBreak(summaryLines.length * 5);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 5 + 4;
  }

  // Work Experience
  if (data.workExperience.length > 0) {
    addSection("Work Experience");
    for (const exp of data.workExperience) {
      checkPageBreak(20);
      const dateRange = exp.current
        ? `${exp.startDate} – Present`
        : `${exp.startDate} – ${exp.endDate}`;

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 24, 39);
      doc.text(exp.position, margin, y);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99);
      doc.text(dateRange, pageWidth - margin, y, { align: "right" });
      y += 5;

      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(55, 65, 81);
      const companyLocation = exp.location ? `${exp.company}, ${exp.location}` : exp.company;
      doc.text(companyLocation, margin, y);
      y += 5;

      if (exp.description) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(55, 65, 81);
        const lines = exp.description.split("\n").filter(Boolean);
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          const text = trimmed.startsWith("•") ? trimmed : `• ${trimmed}`;
          const wrapped = doc.splitTextToSize(text, contentWidth - 5);
          checkPageBreak(wrapped.length * 5);
          doc.text(wrapped, margin + 2, y);
          y += wrapped.length * 5;
        }
      }
      y += 4;
    }
  }

  // Education
  if (data.education.length > 0) {
    addSection("Education");
    for (const edu of data.education) {
      checkPageBreak(15);
      const degreeText = edu.field ? `${edu.degree} in ${edu.field}` : edu.degree;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 24, 39);
      doc.text(degreeText, margin, y);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99);
      const dateRange = `${edu.startDate} – ${edu.endDate}`;
      doc.text(dateRange, pageWidth - margin, y, { align: "right" });
      y += 5;

      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(55, 65, 81);
      const instLine = edu.location ? `${edu.institution}, ${edu.location}` : edu.institution;
      doc.text(instLine, margin, y);
      if (edu.gpa) {
        doc.setFont("helvetica", "normal");
        doc.text(`GPA: ${edu.gpa}`, pageWidth - margin, y, { align: "right" });
      }
      y += 5;

      if (edu.description) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(55, 65, 81);
        const wrapped = doc.splitTextToSize(edu.description, contentWidth);
        checkPageBreak(wrapped.length * 5);
        doc.text(wrapped, margin, y);
        y += wrapped.length * 5;
      }
      y += 4;
    }
  }

  // Skills
  if (data.skillCategories.length > 0) {
    addSection("Skills");
    for (const sc of data.skillCategories) {
      checkPageBreak(8);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 24, 39);
      doc.text(`${sc.category}: `, margin, y);
      const catWidth = doc.getTextWidth(`${sc.category}: `);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(55, 65, 81);
      const skillsWrapped = doc.splitTextToSize(sc.skills, contentWidth - catWidth);
      doc.text(skillsWrapped, margin + catWidth, y);
      y += skillsWrapped.length * 5;
    }
  }

  const name = data.personalInfo.fullName
    ? data.personalInfo.fullName.replace(/\s+/g, "_")
    : "resume";
  doc.save(`${name}_resume.pdf`);
}
