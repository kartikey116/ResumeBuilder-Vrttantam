import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext.jsx";
import ProfileInfoCard from "../COmponent/Cards/ProfileInfoCard.jsx";

/* ─── Constants inlined (replaces Constant.jsx imports) ──────────────── */
const FEATURES = [
  {
    tag: "Smart ATS Analysis",
    title: "Know exactly why you're not getting callbacks",
    body: "Our ATS engine dissects your resume against any job description — keyword by keyword. You get a precise score, every missing skill flagged, a section-by-section attention heatmap, and three actionable rewrites. Not just a number — a full diagnostic.",
    perks: ["Keyword gap analysis", "Section heatmap", "Brutally honest scoring", "Quantified feedback"],
    visual: "ats",
  },
  {
    tag: "Professional Templates",
    title: "Designs that speak before you say a word",
    body: "12 templates crafted around how recruiters actually read — visual hierarchy, breathing room, ATS-compatible structure. Every color, font, and section is yours to control. Switch templates without losing a single word of content.",
    perks: ["ATS-safe layouts", "Custom color palettes", "Font control", "One-click PDF export"],
    visual: "templates",
  },
  {
    tag: "AI-Powered Import",
    title: "Upload your PDF. Done in 10 seconds.",
    body: "Already have a resume? Drop any PDF and our AI parses every section — work history, skills, education, projects, certifications — into a fully editable template. No copy-pasting, no reformatting, no lost data.",
    perks: ["PDF & DOCX supported", "All sections extracted", "Editable immediately", "Template-ready output"],
    visual: "import",
  },
  {
    tag: "Community Gallery",
    title: "Share your design. Keep your privacy.",
    body: "Publish your resume template to the community with one click. AI automatically replaces every piece of personal information with realistic dummy data before anything goes public. Your identity stays yours — your design gets discovered.",
    perks: ["Zero PII ever shared", "AI anonymisation", "Community gallery", "One-click publish"],
    visual: "anon",
  },
  {
    tag: "AI Bullet Enhancer",
    title: "Weak bullets are the silent resume killer",
    body: "Paste any resume bullet and our AI rewrites it into an action-oriented, impact-quantified statement tailored to your target role. From 'responsible for managing' to 'Led 4-engineer team, reducing deployment time by 40%'.",
    perks: ["Role-targeted rewrites", "Impact quantification", "Action verb library", "Instant suggestions"],
    visual: "bullet",
  },
];

const FAQS = [
  {
    q: "Can I customise the templates?",
    a: "Yes — edit colors, fonts, section order, and layout to match your personal or industry style. Every element is fully adjustable and changes reflect in real time.",
  },
  {
    q: "How does the ATS score actually work?",
    a: "We compare your resume against the job description using keyword matching, skill alignment, experience level analysis, and formatting quality checks. Scores are intentionally strict — most resumes land 40–65%. Above 75% is genuinely strong.",
  },
  {
    q: "Is my personal data safe?",
    a: "Your resume data is stored securely and never sold or shared. When publishing to the community, AI replaces all personal details with fictional data before anything is made public.",
  },
  {
    q: "What file formats can I upload?",
    a: "Upload PDF or DOCX files. All exports are high-quality, ATS-compatible PDFs optimised for both human readers and automated systems.",
  },
  {
    q: "Does it work on mobile?",
    a: "Fully responsive — Vṛttāntam works great on mobile, tablet, and desktop. Build and edit your resume from anywhere.",
  },
  {
    q: "What does Vṛttāntam mean?",
    a: "Vṛttāntam (वृत्तान्तम्) is a Sanskrit word meaning 'narrative' or 'account'. We chose it because a resume is more than a list — it's the professional story only you can tell.",
  },
];

const WHY_US = [
  {
    icon: "◈",
    title: "Honest feedback, not flattery",
    body: "We calibrate our ATS engine to mirror real enterprise systems. Most tools inflate scores to keep you happy. We don't — because inflated scores don't get you hired.",
  },
  {
    icon: "◎",
    title: "Built around how people job hunt",
    body: "Not just a template picker. A full toolkit: import, score, optimise, enhance bullets, and publish — covering every stage of the job search in one place.",
  },
  {
    icon: "◉",
    title: "Saves hours, not minutes",
    body: "Import, optimise, and export a polished resume in under 20 minutes. No design skills needed. No formatting headaches. Just focus on the content that gets you hired.",
  },
  {
    icon: "◆",
    title: "Privacy by architecture",
    body: "Your data is yours. We never use your resume to train models, sell to advertisers, or share with third parties. Anonymisation runs client-side before anything reaches the community.",
  },
];

/* ─── Visual Mockups ─────────────────────────────────────────────────── */
const MockATS = () => (
  <div className="lp-mock">
    <div className="lp-mock-topbar" />
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
      <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
        <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="36" cy="36" r="28" fill="none" stroke="#f1f5f9" strokeWidth="6" />
          <circle cx="36" cy="36" r="28" fill="none" stroke="#d97706" strokeWidth="6"
            strokeLinecap="round" strokeDasharray="176" strokeDashoffset="74" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#d97706", fontFamily: "'DM Serif Display', serif" }}>58%</span>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>Missing keywords</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {["Kubernetes", "Go", "Terraform", "CI/CD", "gRPC"].map(k => (
            <span key={k} style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>{k}</span>
          ))}
        </div>
      </div>
    </div>
    {[["Work experience", 85, "#dc2626"], ["Skills section", 63, "#d97706"], ["Formatting", 74, "#16a34a"]].map(([name, val, col]) => (
      <div key={name} style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 600, color: "#64748b", marginBottom: 3 }}>
          <span>{name}</span><span style={{ color: col }}>{val}%</span>
        </div>
        <div style={{ height: 5, borderRadius: 3, background: "#f1f5f9", overflow: "hidden" }}>
          <div style={{ width: `${val}%`, height: "100%", borderRadius: 3, background: col, transition: "width 1.2s ease" }} />
        </div>
      </div>
    ))}
  </div>
);

const MockTemplates = () => {
  const cards = [
    { h: "#4f46e5", b: "#e0e7ff", active: false },
    { h: "#dc2626", b: "#fee2e2", active: false },
    { h: "#0f766e", b: "#ccfbf1", active: true },
    { h: "#374151", b: "#f3f4f6", active: false },
  ];
  return (
    <div className="lp-mock">
      <div className="lp-mock-topbar" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {cards.map((c, i) => (
          <div key={i} style={{
            background: c.b, borderRadius: 10, padding: 10, aspectRatio: "3/4",
            border: c.active ? "2px solid #7c3aed" : "1.5px solid transparent",
            position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end",
          }}>
            {c.active && (
              <span style={{ position: "absolute", top: -1, right: 6, fontSize: 8, background: "#7c3aed", color: "#fff", padding: "2px 6px", borderRadius: "0 0 4px 4px", fontWeight: 800 }}>Active</span>
            )}
            <div style={{ height: "35%", position: "absolute", top: 0, left: 0, right: 0, background: c.h, borderRadius: "8px 8px 0 0" }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
              {[80, 55, 65].map((w, j) => (
                <div key={j} style={{ height: 5, borderRadius: 3, background: "rgba(255,255,255,0.55)", width: `${w}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p style={{ textAlign: "center", fontSize: 10, color: "#94a3b8", marginTop: 10, fontWeight: 600 }}>4 of 12 templates · fully customisable</p>
    </div>
  );
};

const MockImport = () => (
  <div className="lp-mock">
    <div className="lp-mock-topbar" />
    <div style={{ border: "2px dashed #e2e8f0", borderRadius: 10, padding: "16px 12px", textAlign: "center", marginBottom: 12 }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>📄</div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#334155" }}>resume_2024.pdf</div>
      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>Drop your resume here</div>
    </div>
    <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Extracted sections</div>
    {[["Work experience", "3 roles"], ["Skills", "14 items"], ["Education", "2 degrees"], ["Projects & certs", "5 items"]].map(([label, count]) => (
      <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, marginBottom: 7 }}>
        <span style={{ color: "#16a34a", fontSize: 13 }}>✓</span>
        <span style={{ color: "#334155", fontWeight: 600 }}>{label}</span>
        <span style={{ marginLeft: "auto", color: "#94a3b8", fontSize: 10 }}>{count}</span>
      </div>
    ))}
    <div style={{ marginTop: 10, background: "linear-gradient(135deg,#7c3aed,#db2777)", borderRadius: 8, padding: "7px 12px", textAlign: "center", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
      Open in editor →
    </div>
  </div>
);

const MockAnon = () => (
  <div className="lp-mock">
    <div className="lp-mock-topbar" />
    <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Before → After anonymisation</div>
    {[
      ["RK", "#fce7f3", "#db2777", "rahul.k@gmail.com", "alex.c@email.com"],
      ["RC", "#fce7f3", "#db2777", "Infosys, Bangalore", "Nexus Technologies"],
      ["PH", "#fce7f3", "#db2777", "+91 98765 43210", "+1 (555) 820-4391"],
    ].map(([init, abg, ac, before, after], i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: abg, color: ac, fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{init}</div>
        <span style={{ fontSize: 10, color: "#dc2626", textDecoration: "line-through", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{before}</span>
        <span style={{ fontSize: 10, color: "#94a3b8" }}>→</span>
        <span style={{ fontSize: 10, color: "#16a34a", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{after}</span>
      </div>
    ))}
    <div style={{ marginTop: 12, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 14 }}>🔒</span>
      <span style={{ fontSize: 10, color: "#64748b", lineHeight: 1.4 }}>Zero personal information leaves your account</span>
    </div>
  </div>
);

const MockBullet = () => (
  <div className="lp-mock">
    <div className="lp-mock-topbar" />
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>Original bullet</div>
      <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 10px", fontSize: 10, color: "#7f1d1d", lineHeight: 1.5 }}>
        Responsible for managing the deployment process for various client-facing features.
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "center", margin: "6px 0" }}>
      <div style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>✦ AI Enhance →</div>
    </div>
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>Enhanced bullet</div>
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px 10px", fontSize: 10, color: "#14532d", lineHeight: 1.5 }}>
        Led end-to-end deployment pipeline for 6 client-facing features, reducing release cycle time by <strong>[X]%</strong> through automated CI/CD integration.
      </div>
    </div>
  </div>
);

const VISUALS = { ats: MockATS, templates: MockTemplates, import: MockImport, anon: MockAnon, bullet: MockBullet };

/* ─── FAQ Accordion Item ─────────────────────────────────────────────── */
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        border: "1px solid", borderColor: open ? "#c4b5fd" : "#e2e8f0",
        borderRadius: 14, overflow: "hidden", cursor: "pointer",
        background: open ? "#faf5ff" : "#fff",
        transition: "border-color .2s, background .2s",
      }}
    >
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b", lineHeight: 1.4 }}>{q}</span>
        <span style={{
          width: 24, height: 24, borderRadius: "50%", background: open ? "#7c3aed" : "#f1f5f9",
          color: open ? "#fff" : "#64748b", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0, transition: "all .2s", transform: open ? "rotate(180deg)" : "none",
        }}>⌄</span>
      </div>
      <div style={{
        maxHeight: open ? 200 : 0, overflow: "hidden",
        transition: "max-height .35s ease",
      }}>
        <p style={{ padding: "0 20px 16px", fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{a}</p>
      </div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function LandingPages() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouse = useRef({ x: null, y: null });
  const [typedText, setTypedText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  const fullText = 'Inspired by वृत्तान्तम् — Sanskrit for "narrative". Because your career deserves more than a bullet list.';

  /* Typing effect */
  useEffect(() => {
    let i = 0;
    setTypedText("");
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        if (i < fullText.length) {
          setTypedText(fullText.slice(0, ++i));
        } else {
          clearInterval(iv);
          setCursorVisible(false);
        }
      }, 30);
      return () => clearInterval(iv);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  /* Canvas dot animation */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const COLORS = ["#a855f7", "#ec4899", "#c084fc", "#f9a8d4", "#818cf8"];
    let W, H, dots = [];

    const resize = () => {
      W = canvas.width = canvas.parentElement.offsetWidth;
      H = canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", onMove);

    for (let i = 0; i < 90; i++) {
      dots.push({
        x: Math.random() * (W || 800),
        y: Math.random() * (H || 600),
        dx: (Math.random() - 0.5) * 0.45,
        dy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.5 + 0.5,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const d of dots) {
        d.x += d.dx; d.y += d.dy;
        if (d.x < 0 || d.x > W) d.dx *= -1;
        if (d.y < 0 || d.y > H) d.dy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.c;
        ctx.fill();
      }
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${(1 - dist / 115) * 0.35})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        if (mouse.current.x !== null) {
          const dx = dots[i].x - mouse.current.x, dy = dots[i].y - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 155) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(mouse.current.x, mouse.current.y);
            ctx.strokeStyle = `rgba(236,72,153,${(1 - dist / 155) * 0.65})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* ── Global Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Instrument+Sans:wght@400;500;600;700&family=Dancing+Script:wght@700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --pu: #7c3aed;
          --pk: #db2777;
          --pu2: #a855f7;
          --pk2: #ec4899;
          --pu-l: #f5f3ff;
          --pk-l: #fdf2f8;
          --bg: #fafaf9;
          --fg: #0f172a;
          --fg2: #475569;
          --fg3: #94a3b8;
          --border: #e2e8f0;
          --card: #ffffff;
          --serif: 'DM Serif Display', Georgia, serif;
          --sans: 'Instrument Sans', system-ui, sans-serif;
          --script: 'Dancing Script', cursive;
        }

        body { font-family: var(--sans); background: var(--bg); color: var(--fg); overflow-x: hidden; }

        /* ── Utility ── */
        .lp-grad-text {
          background: linear-gradient(135deg, var(--pu) 0%, var(--pk) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .lp-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, var(--pu), var(--pk));
          color: #fff; padding: 14px 32px; border-radius: 50px;
          font-family: var(--sans); font-size: 15px; font-weight: 700;
          border: none; cursor: pointer;
          box-shadow: 0 4px 24px rgba(124,58,237,0.28);
          transition: transform .2s, box-shadow .2s;
        }
        .lp-btn-primary:hover { transform: scale(1.04); box-shadow: 0 8px 36px rgba(124,58,237,0.35); }

        .lp-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: var(--fg);
          padding: 12px 24px; border-radius: 50px;
          font-family: var(--sans); font-size: 14px; font-weight: 600;
          border: 1.5px solid var(--border); cursor: pointer;
          transition: border-color .2s, color .2s;
        }
        .lp-btn-ghost:hover { border-color: var(--pu); color: var(--pu); }

        /* ── Nav ── */
        .lp-nav {
          position: sticky; top: 0; z-index: 50;
          backdrop-filter: blur(14px);
          background: rgba(250,250,249,0.82);
          border-bottom: 1px solid var(--border);
        }
        .lp-nav-inner {
          max-width: 1140px; margin: 0 auto;
          padding: 0 24px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .lp-logo {
          font-family: var(--script);
          font-size: 2rem;
          background: linear-gradient(135deg, var(--pu), var(--pk));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          line-height: 1;
        }
        .lp-logo-deva {
          font-size: .75rem; color: var(--fg3); font-family: var(--sans);
          font-weight: 500; letter-spacing: .04em; margin-left: 6px;
        }

        /* ── Hero ── */
        .lp-hero {
          position: relative; overflow: hidden;
          min-height: 92vh;
          display: flex; align-items: center; justify-content: center;
        }
        .lp-hero-canvas {
          position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;
        }
        .lp-hero-inner {
          position: relative; z-index: 2; text-align: center;
          max-width: 780px; padding: 4rem 24px 5rem;
        }
        .lp-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--pu-l); border: 1px solid #ddd6fe;
          color: var(--pu); font-size: 12px; font-weight: 700;
          padding: 6px 14px; border-radius: 20px;
          letter-spacing: .06em; text-transform: uppercase;
          margin-bottom: 1.5rem;
          animation: fadeUp .5s ease forwards;
        }
        .lp-hero-h1 {
          font-family: var(--serif); font-size: clamp(2.8rem, 6vw, 4.5rem);
          font-weight: 400; line-height: 1.12; color: var(--fg);
          margin-bottom: 1.5rem;
          animation: fadeUp .6s .1s ease both;
        }
        .lp-hero-sub {
          font-size: 16px; color: var(--fg2); line-height: 1.75;
          max-width: 560px; margin: 0 auto 2.5rem;
          min-height: 3.5rem;
          animation: fadeUp .6s .2s ease both;
        }
        .lp-hero-actions {
          display: flex; align-items: center; justify-content: center;
          gap: 12px; flex-wrap: wrap;
          animation: fadeUp .6s .3s ease both;
        }
        .lp-cursor {
          display: inline-block; width: 2px; height: 1em;
          background: var(--pu); margin-left: 2px; vertical-align: middle;
          animation: blink 1s step-end infinite;
        }

        /* ── Features ── */
        .lp-features { max-width: 1140px; margin: 0 auto; padding: 6rem 24px; }
        .lp-feat-row {
          display: grid; grid-template-columns: 1fr 1fr;
          align-items: center; gap: 5rem; margin-bottom: 7rem;
        }
        .lp-feat-row:last-child { margin-bottom: 0; }
        @media (max-width: 768px) {
          .lp-feat-row { grid-template-columns: 1fr; gap: 2.5rem; margin-bottom: 4rem; }
          .lp-feat-row.lp-rev .lp-feat-text { order: -1; }
        }
        .lp-feat-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: var(--pu);
          margin-bottom: .75rem;
        }
        .lp-feat-tag::before {
          content: ''; width: 18px; height: 1.5px;
          background: linear-gradient(90deg, var(--pu), var(--pk));
          display: block; border-radius: 2px;
        }
        .lp-feat-h2 {
          font-family: var(--serif); font-size: clamp(1.7rem, 3vw, 2.4rem);
          font-weight: 400; line-height: 1.2; color: var(--fg);
          margin-bottom: 1rem;
        }
        .lp-feat-body { font-size: 15px; color: var(--fg2); line-height: 1.8; margin-bottom: 1.5rem; }
        .lp-perk-list { display: flex; flex-direction: column; gap: 8px; }
        .lp-perk {
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; font-weight: 600; color: var(--fg);
        }
        .lp-perk-dot {
          width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, var(--pu), var(--pk));
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 9px;
        }
        .lp-feat-visual {
          display: flex; align-items: center; justify-content: center;
        }

        /* Mock card */
        .lp-mock {
          width: 100%; max-width: 320px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 20px;
          box-shadow: 0 8px 40px rgba(124,58,237,0.08), 0 2px 8px rgba(0,0,0,0.04);
        }
        .lp-mock-topbar {
          height: 5px; border-radius: 3px; margin-bottom: 16px;
          background: linear-gradient(90deg, var(--pu), var(--pk));
          width: 55%;
        }

        /* ── Divider ── */
        .lp-divider {
          max-width: 1140px; margin: 0 auto; padding: 0 24px;
          border-top: 1px solid var(--border);
        }

        /* ── Why Us ── */
        .lp-why { background: linear-gradient(170deg, var(--pu-l) 0%, var(--pk-l) 100%); }
        .lp-why-inner { max-width: 1140px; margin: 0 auto; padding: 6rem 24px; }
        .lp-why-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 3rem; }
        @media (max-width: 600px) { .lp-why-grid { grid-template-columns: 1fr; } }
        .lp-why-card {
          background: #fff; border-radius: 16px;
          padding: 28px; border: 1px solid rgba(124,58,237,.12);
        }
        .lp-why-icon {
          font-size: 20px; color: var(--pu);
          margin-bottom: 14px; display: block;
        }
        .lp-why-name { font-size: 15px; font-weight: 700; color: var(--fg); margin-bottom: 8px; }
        .lp-why-body { font-size: 13px; color: var(--fg2); line-height: 1.7; }

        /* ── Stat Bar ── */
        .lp-stats { max-width: 1140px; margin: 0 auto; padding: 5rem 24px; }
        .lp-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        @media (max-width: 600px) { .lp-stats-grid { grid-template-columns: 1fr; } }
        .lp-stat {
          text-align: center; padding: 3rem 2rem;
          border-right: 1px solid var(--border);
        }
        .lp-stat:last-child { border-right: none; }
        .lp-stat-num {
          font-family: var(--serif); font-size: 3.5rem;
          line-height: 1; margin-bottom: .5rem;
        }
        .lp-stat-label { font-size: 13px; color: var(--fg2); font-weight: 500; }

        /* ── FAQ ── */
        .lp-faq { max-width: 760px; margin: 0 auto; padding: 6rem 24px; }
        .lp-faq-list { display: flex; flex-direction: column; gap: 8px; margin-top: 2.5rem; }

        /* ── CTA Banner ── */
        .lp-cta {
          max-width: 1140px; margin: 0 auto; padding: 0 24px 6rem;
        }
        .lp-cta-inner {
          background: linear-gradient(135deg, var(--pu) 0%, #4f46e5 40%, var(--pk) 100%);
          border-radius: 24px; padding: 5rem 3rem;
          text-align: center; color: #fff;
          position: relative; overflow: hidden;
        }
        .lp-cta-inner::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          pointer-events: none;
        }
        .lp-cta-h2 {
          font-family: var(--serif); font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 400; margin-bottom: 1rem; position: relative;
        }
        .lp-cta-body { font-size: 16px; opacity: .85; line-height: 1.7; margin-bottom: 2.5rem; position: relative; }
        .lp-btn-white {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: var(--pu);
          padding: 14px 32px; border-radius: 50px;
          font-family: var(--sans); font-size: 15px; font-weight: 700;
          border: none; cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,0,0,.15);
          transition: transform .2s, box-shadow .2s;
          position: relative;
        }
        .lp-btn-white:hover { transform: scale(1.04); box-shadow: 0 8px 32px rgba(0,0,0,.2); }

        /* ── Footer ── */
        .lp-footer { background: #0f172a; color: #94a3b8; }
        .lp-footer-inner { max-width: 1140px; margin: 0 auto; padding: 4rem 24px 2rem; }
        .lp-footer-grid {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem; margin-bottom: 3rem;
        }
        @media (max-width: 700px) {
          .lp-footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
        .lp-footer-logo {
          font-family: var(--script); font-size: 1.75rem;
          background: linear-gradient(135deg, #c084fc, #f472b6);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          margin-bottom: .5rem; display: block;
        }
        .lp-footer-desc { font-size: 13px; line-height: 1.7; margin-bottom: 0; }
        .lp-footer-col h4 { font-size: 12px; font-weight: 700; color: #e2e8f0; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 1rem; }
        .lp-footer-col a { display: block; font-size: 13px; color: #64748b; text-decoration: none; margin-bottom: .5rem; transition: color .15s; }
        .lp-footer-col a:hover { color: #c084fc; }
        .lp-footer-copy {
          border-top: 1px solid #1e293b; padding-top: 1.5rem;
          font-size: 12px; text-align: center; color: #475569;
        }

        /* ── Section header ── */
        .lp-sec-header { text-align: center; margin-bottom: 1rem; }
        .lp-sec-eyebrow {
          display: inline-block; font-size: 11px; font-weight: 700;
          letter-spacing: .1em; text-transform: uppercase;
          color: var(--pu); margin-bottom: .75rem;
        }
        .lp-sec-h2 {
          font-family: var(--serif); font-size: clamp(1.8rem, 3.5vw, 2.75rem);
          font-weight: 400; color: var(--fg); line-height: 1.2;
        }
        .lp-sec-sub { font-size: 15px; color: var(--fg2); line-height: 1.7; max-width: 520px; margin: .75rem auto 0; }

        /* ── Animations ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        /* Scroll fade-in via IntersectionObserver target class */
        .lp-reveal { opacity: 0; transform: translateY(24px); transition: opacity .65s ease, transform .65s ease; }
        .lp-reveal.lp-visible { opacity: 1; transform: translateY(0); }
        .lp-reveal-l { opacity: 0; transform: translateX(-24px); transition: opacity .65s ease, transform .65s ease; }
        .lp-reveal-l.lp-visible { opacity: 1; transform: translateX(0); }
        .lp-reveal-r { opacity: 0; transform: translateX(24px); transition: opacity .65s ease, transform .65s ease; }
        .lp-reveal-r.lp-visible { opacity: 1; transform: translateX(0); }
      `}</style>

      {/* ── Scroll reveal observer ── */}
      <ScrollReveal />

      {/* ── NAV ── */}
      <nav className="lp-nav">
        <div className="lp-nav-inner">
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span className="lp-logo">Vṛttāntam</span>
            <span className="lp-logo-deva">(वृत्तान्तम्)</span>
          </div>
          {user ? (
            <ProfileInfoCard />
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <button className="lp-btn-ghost" onClick={() => navigate("/login")}>Sign in</button>
              <button className="lp-btn-primary" style={{ padding: "10px 22px", fontSize: 14 }} onClick={() => navigate("/login")}>
                Get started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <canvas ref={canvasRef} className="lp-hero-canvas" />
        <div className="lp-hero-inner">
          <div className="lp-hero-eyebrow">
            ✦ AI-powered resume builder
          </div>
          <h1 className="lp-hero-h1">
            Craft the resume that <br />
            <em className="lp-grad-text">gets you the interview</em>
          </h1>
          <p className="lp-hero-sub">
            {typedText}
            {cursorVisible && <span className="lp-cursor" />}
          </p>
          <div className="lp-hero-actions">
            <button className="lp-btn-primary" onClick={() => navigate(user ? "/dashboard" : "/login")}>
              {user ? "Go to Dashboard →" : "Start for free →"}
            </button>
            <button className="lp-btn-ghost" onClick={() => document.getElementById("lp-features")?.scrollIntoView({ behavior: "smooth" })}>
              See how it works
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "#fff" }}>
        <div className="lp-stats">
          <div className="lp-stats-grid">
            {[
              { num: "75%", label: "of resumes are filtered out by ATS before a human reads them" },
              { num: "10s", label: "to import your existing PDF resume — zero copy-pasting" },
              { num: "12+", label: "professionally designed, ATS-safe templates to choose from" },
            ].map(({ num, label }, i) => (
              <div key={i} className="lp-stat lp-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="lp-stat-num lp-grad-text">{num}</div>
                <div className="lp-stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div id="lp-features">
        <div className="lp-features">
          {FEATURES.map((feat, i) => {
            const Visual = VISUALS[feat.visual];
            const isReverse = i % 2 === 1;
            return (
              <div key={feat.tag} className={`lp-feat-row${isReverse ? " lp-rev" : ""}`}>
                <div className={`lp-feat-text ${isReverse ? "lp-reveal-r" : "lp-reveal-l"}`}>
                  <div className="lp-feat-tag">{feat.tag}</div>
                  <h2 className="lp-feat-h2">{feat.title}</h2>
                  <p className="lp-feat-body">{feat.body}</p>
                  <div className="lp-perk-list">
                    {feat.perks.map((p) => (
                      <div key={p} className="lp-perk">
                        <span className="lp-perk-dot">✓</span>
                        {p}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`lp-feat-visual ${isReverse ? "lp-reveal-l" : "lp-reveal-r"}`}>
                  {Visual && <Visual />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── WHY US ── */}
      <div className="lp-why">
        <div className="lp-why-inner">
          <div className="lp-sec-header lp-reveal">
            <span className="lp-sec-eyebrow">Why Vṛttāntam</span>
            <h2 className="lp-sec-h2">Built around how people <em className="lp-grad-text">actually</em> job hunt</h2>
            <p className="lp-sec-sub">Not just a template picker. A toolkit that covers every stage — from first import to final export.</p>
          </div>
          <div className="lp-why-grid">
            {WHY_US.map((item, i) => (
              <div key={item.title} className="lp-why-card lp-reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
                <span className="lp-why-icon">{item.icon}</span>
                <div className="lp-why-name">{item.title}</div>
                <p className="lp-why-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="lp-faq">
        <div className="lp-sec-header lp-reveal">
          <span className="lp-sec-eyebrow">Common questions</span>
          <h2 className="lp-sec-h2">Frequently asked <em className="lp-grad-text">questions</em></h2>
        </div>
        <div className="lp-faq-list">
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div className="lp-cta">
        <div className="lp-cta-inner lp-reveal">
          <h2 className="lp-cta-h2">Ready to build your future?</h2>
          <p className="lp-cta-body">
            Join thousands of professionals creating standout resumes with Vṛttāntam.<br />
            Free to start. No credit card required.
          </p>
          <button className="lp-btn-white" onClick={() => navigate(user ? "/dashboard" : "/login")}>
            {user ? "Open Dashboard →" : "Start building now →"}
          </button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-grid">
            <div>
              <span className="lp-footer-logo">Vṛttāntam</span>
              <p className="lp-footer-desc">Crafting professional narratives that empower your career journey. Inspired by the Sanskrit art of storytelling.</p>
            </div>
            <div className="lp-footer-col">
              <h4>Product</h4>
              <a href="#">Features</a>
              <a href="#">Templates</a>
              <a href="#">ATS Scanner</a>
              <a href="#">Community</a>
            </div>
            <div className="lp-footer-col">
              <h4>Support</h4>
              <a href="#">Help centre</a>
              <a href="#">Contact us</a>
              <a href="#">Privacy policy</a>
              <a href="#">Terms of use</a>
            </div>
            <div className="lp-footer-col">
              <h4>Connect</h4>
              <a href="#">Twitter / X</a>
              <a href="#">LinkedIn</a>
              <a href="#">GitHub</a>
              <a href="#">Discord</a>
            </div>
          </div>
          <div className="lp-footer-copy">
            © {new Date().getFullYear()} Vṛttāntam. All rights reserved. &nbsp;·&nbsp; वृत्तान्तम् — the art of narrative.
          </div>
        </div>
      </footer>
    </>
  );
}

/* ─── Scroll Reveal Hook Component ──────────────────────────────────── */
function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".lp-reveal, .lp-reveal-l, .lp-reveal-r");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("lp-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}