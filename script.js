const state = {
  experience: [],
  education: [],
  currentStep: 0
};

let modalType = null;
let editIndex = -1;

function switchStep(i) {
  state.currentStep = i;
  document.querySelectorAll('.form-section').forEach((s,j) => s.classList.toggle('active', i===j));
  document.querySelectorAll('.step-btn').forEach((b,j) => b.classList.toggle('active', i===j));
}

function g(id) { return document.getElementById(id); }
function val(id) { return (g(id)?.value || '').trim(); }

function updatePreview() {
  const name = val('name');
  const title = val('title');
  const email = val('email');
  const phone = val('phone');
  const location = val('location');
  const website = val('website');
  const summary = val('summary');
  const skills = val('skills');
  const certs = val('certs');
  const languages = val('languages');

  if (!name && !email && state.experience.length === 0 && state.education.length === 0) {
    g('resume-output').innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">◎</div>
        <div class="empty-title">Your resume will appear here</div>
        <div class="empty-sub">Start filling in your details on the left</div>
      </div>`;
    return;
  }

  let html = '';

  // Header
  html += `<div class="resume-name">${name || 'Your Name'}</div>`;
  if (title) html += `<div class="resume-title">${title}</div>`;

  // Contact
  let contactItems = [];
  if (email) contactItems.push(`<a href="mailto:${email}">${email}</a>`);
  if (phone) contactItems.push(phone);
  if (location) contactItems.push(location);
  if (website) contactItems.push(`<a href="https://${website.replace(/^https?:\/\//,'')}" target="_blank">${website}</a>`);
  if (contactItems.length) html += `<div class="resume-contact">${contactItems.join('')}</div>`;
  else html += '<div style="border-bottom:2px solid #0a0a0a;margin-bottom:26px;padding-bottom:8px;"></div>';

  // Summary
  if (summary) {
    html += `<div class="resume-section">
      <div class="resume-section-title">Summary</div>
      <div class="resume-summary">${summary.replace(/\n/g,'<br>')}</div>
    </div>`;
  }

  // Experience
  if (state.experience.length) {
    html += `<div class="resume-section"><div class="resume-section-title">Experience</div>`;
    state.experience.forEach(exp => {
      html += `<div class="resume-entry">
        <div class="resume-entry-header">
          <div class="resume-entry-title">${exp.role}</div>
          <div class="resume-entry-date">${exp.start}${exp.end ? ' — '+exp.end : ' — Present'}</div>
        </div>
        <div class="resume-entry-sub">${exp.company}${exp.location ? ' · '+exp.location : ''}</div>
        ${exp.desc ? `<div class="resume-entry-desc"><ul>${exp.desc.split('\n').filter(l=>l.trim()).map(l=>`<li>${l.replace(/^[-•]\s*/,'')}</li>`).join('')}</ul></div>` : ''}
      </div>`;
    });
    html += '</div>';
  }

  // Education
  if (state.education.length) {
    html += `<div class="resume-section"><div class="resume-section-title">Education</div>`;
    state.education.forEach(edu => {
      html += `<div class="resume-entry">
        <div class="resume-entry-header">
          <div class="resume-entry-title">${edu.degree}</div>
          <div class="resume-entry-date">${edu.year}</div>
        </div>
        <div class="resume-entry-sub">${edu.school}${edu.location ? ' · '+edu.location : ''}</div>
        ${edu.notes ? `<div class="resume-entry-desc" style="margin-top:4px">${edu.notes}</div>` : ''}
      </div>`;
    });
    html += '</div>';
  }

  // Skills
  if (skills) {
    const skillList = skills.split(',').map(s=>s.trim()).filter(Boolean);
    html += `<div class="resume-section">
      <div class="resume-section-title">Skills</div>
      <div class="resume-skills-grid">
        ${skillList.map(s=>`<div class="skill-tag">${s}</div>`).join('')}
      </div>
    </div>`;
  }

  // Certs
  if (certs) {
    html += `<div class="resume-section">
      <div class="resume-section-title">Certifications</div>
      <div class="resume-entry-desc">${certs.replace(/\n/g,'<br>')}</div>
    </div>`;
  }

  // Languages
  if (languages) {
    html += `<div class="resume-section">
      <div class="resume-section-title">Languages</div>
      <div class="resume-entry-desc">${languages}</div>
    </div>`;
  }

  g('resume-output').innerHTML = html;
}

// ── Entry rendering ──
function renderExpList() {
  const list = g('exp-list');
  list.innerHTML = state.experience.map((e,i) => `
    <div class="entry-card">
      <div class="resume-entry-title">${e.role}</div>
      <div class="entry-card-sub">${e.company} · ${e.start}${e.end?' – '+e.end:' – Present'}</div>
      <button class="entry-remove" onclick="removeExp(${i})">×</button>
    </div>`).join('');
}

function renderEduList() {
  const list = g('edu-list');
  list.innerHTML = state.education.map((e,i) => `
    <div class="entry-card">
      <div class="resume-entry-title">${e.degree}</div>
      <div class="entry-card-sub">${e.school} · ${e.year}</div>
      <button class="entry-remove" onclick="removeEdu(${i})">×</button>
    </div>`).join('');
}

function removeExp(i) { state.experience.splice(i,1); renderExpList(); updatePreview(); }
function removeEdu(i) { state.education.splice(i,1); renderEduList(); updatePreview(); }

// ── Modal ──
function openModal(type) {
  modalType = type;
  const m = g('modal-content');
  if (type === 'exp') {
    m.innerHTML = `
      <div class="modal-title">Add Experience</div>
      <div class="field-group"><label>Job Title</label><input type="text" id="m-role" placeholder="Software Engineer"></div>
      <div class="field-group"><label>Company</label><input type="text" id="m-company" placeholder="Acme Corp"></div>
      <div class="field-group"><label>Location</label><input type="text" id="m-loc" placeholder="Remote / City, State"></div>
      <div class="two-col">
        <div class="field-group"><label>Start Date</label><input type="text" id="m-start" placeholder="Jan 2022"></div>
        <div class="field-group"><label>End Date</label><input type="text" id="m-end" placeholder="Dec 2023 (blank = Present)"></div>
      </div>
      <div class="field-group"><label>Key Achievements (one per line)</label><textarea id="m-desc" rows="4" placeholder="- Built microservices handling 1M req/day&#10;- Led team of 5 engineers"></textarea></div>
      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveExp()">Add</button>
      </div>`;
  } else {
    m.innerHTML = `
      <div class="modal-title">Add Education</div>
      <div class="field-group"><label>Degree & Field</label><input type="text" id="m-degree" placeholder="B.S. Computer Science"></div>
      <div class="field-group"><label>School</label><input type="text" id="m-school" placeholder="MIT"></div>
      <div class="two-col">
        <div class="field-group"><label>Location</label><input type="text" id="m-loc" placeholder="Cambridge, MA"></div>
        <div class="field-group"><label>Graduation Year</label><input type="text" id="m-year" placeholder="2022"></div>
      </div>
      <div class="field-group"><label>Notes (GPA, honors, etc.)</label><input type="text" id="m-notes" placeholder="GPA 3.9 · Dean's List · Phi Beta Kappa"></div>
      <div class="modal-actions">
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveEdu()">Add</button>
      </div>`;
  }
  g('modal-overlay').classList.add('open');
  setTimeout(() => m.querySelector('input')?.focus(), 100);
}

function closeModal() { g('modal-overlay').classList.remove('open'); }
function closeModalOnOverlay(e) { if (e.target === g('modal-overlay')) closeModal(); }

function saveExp() {
  const role = val('m-role'), company = val('m-company');
  if (!role || !company) { showToast('Please fill in title and company'); return; }
  state.experience.push({
    role, company,
    location: val('m-loc'),
    start: val('m-start') || '',
    end: val('m-end') || '',
    desc: val('m-desc')
  });
  closeModal(); renderExpList(); updatePreview();
}

function saveEdu() {
  const degree = val('m-degree'), school = val('m-school');
  if (!degree || !school) { showToast('Please fill in degree and school'); return; }
  state.education.push({
    degree, school,
    location: val('m-loc'),
    year: val('m-year') || '',
    notes: val('m-notes')
  });
  closeModal(); renderEduList(); updatePreview();
}

// ── AI Generation ──
async function generateWithAI() {
  const btn = g('ai-btn');
  const btnText = g('ai-btn-text');
  const btnIcon = g('ai-btn-icon');

  // Build context from form
  const context = {
    name: val('name'),
    title: val('title'),
    email: val('email'),
    summary: val('summary'),
    experience: state.experience,
    education: state.education,
    skills: val('skills'),
    certs: val('certs'),
    languages: val('languages')
  };

  if (!context.name && !context.title && state.experience.length === 0) {
    showToast('Please fill in some details first');
    return;
  }

  const userPrompt = val('ai-prompt') || 'Enhance my resume to be concise, impactful, and ATS-optimized.';

  btn.classList.add('loading');
  btnIcon.innerHTML = '<div class="spinner"></div>';
  btnText.textContent = 'Generating...';

  try {
    const systemPrompt = `You are an expert resume writer. Given a user's resume data and instructions, you will enhance and rewrite the resume content.

Return a JSON object with these fields (only include fields where you have content):
{
  "summary": "enhanced professional summary (2-3 sentences, powerful opening)",
  "experience": [array of experience objects with enhanced "desc" field using bullet points with strong action verbs],
  "skills": "comma-separated enhanced skills list",
  "suggestions": "1-2 brief tips for this resume"
}

Rules:
- Use strong action verbs (Led, Built, Architected, Drove, Delivered, etc.)
- Quantify achievements where possible (even with estimates if not provided)
- Keep descriptions concise and impactful
- Make the summary punchy and memorable
- Return ONLY valid JSON, no markdown, no preamble`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: `User instruction: ${userPrompt}\n\nResume data:\n${JSON.stringify(context, null, 2)}`
        }]
      })
    });

    const data = await response.json();
    const text = data.content?.map(c => c.text || '').join('') || '';

    let parsed;
    try {
      const clean = text.replace(/```json\n?/g,'').replace(/```\n?/g,'').trim();
      parsed = JSON.parse(clean);
    } catch(e) {
      showToast('AI returned unexpected format, try again');
      return;
    }

    // Apply AI results
    if (parsed.summary) {
      g('summary').value = parsed.summary;
    }

    if (parsed.experience && Array.isArray(parsed.experience)) {
      parsed.experience.forEach((aiExp, i) => {
        if (state.experience[i] && aiExp.desc) {
          state.experience[i].desc = aiExp.desc;
        }
      });
      renderExpList();
    }

    if (parsed.skills) {
      g('skills').value = parsed.skills;
    }

    updatePreview();
    showToast('✦ Resume enhanced by AI');

    if (parsed.suggestions) {
      setTimeout(() => showToast('💡 ' + parsed.suggestions), 3200);
    }

  } catch(err) {
    console.error(err);
    showToast('Error connecting to AI — check console');
  } finally {
    btn.classList.remove('loading');
    btnIcon.textContent = '✦';
    btnText.textContent = 'Generate with AI';
  }
}

// ── Utilities ──
function showToast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

function downloadResume() {
  const name = val('name') || 'resume';
  const sheet = g('resume-output');

  if (sheet.querySelector('.empty-state')) {
    showToast('Add some details to your resume first');
    return;
  }

  const btn = document.querySelector('.btn-primary');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<div class="spinner" style="border-top-color:#111;border-color:rgba(0,0,0,0.2);border-top-color:#111"></div> Exporting...';
  btn.style.pointerEvents = 'none';

  const opt = {
    margin: [0, 0, 0, 0],
    filename: `${name.toLowerCase().replace(/\s+/g, '-')}-resume.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(sheet).save().then(() => {
    btn.innerHTML = originalText;
    btn.style.pointerEvents = '';
    showToast('✦ PDF downloaded');
  }).catch(() => {
    btn.innerHTML = originalText;
    btn.style.pointerEvents = '';
    showToast('Export failed — try again');
  });
}

function clearAll() {
  if (!confirm('Clear all resume data?')) return;
  ['name','title','email','phone','location','website','summary','skills','certs','languages'].forEach(id => {
    if (g(id)) g(id).value = '';
  });
  state.experience = [];
  state.education = [];
  renderExpList();
  renderEduList();
  updatePreview();
  showToast('Cleared');
}

// Enter key in modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
