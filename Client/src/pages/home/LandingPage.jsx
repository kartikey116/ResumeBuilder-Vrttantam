import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, animate } from "framer-motion";
import { UserContext } from "../../context/userContext.jsx";
import ProfileInfoCard from "../../components/Cards/ProfileInfoCard.jsx";

/* ─── Constants ──────────────────────────────────────────────────────── */
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
  { q: "Can I customise the templates?", a: "Yes — edit colors, fonts, section order, and layout to match your personal or industry style. Every element is fully adjustable and changes reflect in real time." },
  { q: "How does the ATS score actually work?", a: "We compare your resume against the job description using keyword matching, skill alignment, experience level analysis, and formatting quality checks. Scores are intentionally strict — most resumes land 40–65%. Above 75% is genuinely strong." },
  { q: "Is my personal data safe?", a: "Your resume data is stored securely and never sold or shared. When publishing to the community, AI replaces all personal details with fictional data before anything is made public." },
  { q: "What file formats can I upload?", a: "Upload PDF or DOCX files. All exports are high-quality, ATS-compatible PDFs optimised for both human readers and automated systems." },
  { q: "Does it work on mobile?", a: "Fully responsive — Vṛttāntam works great on mobile, tablet, and desktop. Build and edit your resume from anywhere." },
  { q: "What does Vṛttāntam mean?", a: "Vṛttāntam (वृत्तान्तम्) is a Sanskrit word meaning 'narrative' or 'account'. We chose it because a resume is more than a list — it's the professional story only you can tell." },
];

const WHY_US = [
  { icon: "◈", title: "Honest feedback, not flattery", body: "We calibrate our ATS engine to mirror real enterprise systems. Most tools inflate scores to keep you happy. We don't — because inflated scores don't get you hired." },
  { icon: "◎", title: "Built around how people job hunt", body: "Not just a template picker. A full toolkit: import, score, optimise, enhance bullets, and publish — covering every stage of the job search in one place." },
  { icon: "◉", title: "Saves hours, not minutes", body: "Import, optimise, and export a polished resume in under 20 minutes. No design skills needed. No formatting headaches. Just focus on the content that gets you hired." },
  { icon: "◆", title: "Privacy by architecture", body: "Your data is yours. We never use your resume to train models, sell to advertisers, or share with third parties. Anonymisation runs client-side before anything reaches the community." },
];

/* ─── Animated Visual Mockups ────────────────────────────────────────── */
const MockATS = ({ isVisible }) => (
  <div className="lp-mock">
    <div className="lp-mock-topbar" />
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
      <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
        <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <circle cx="36" cy="36" r="28" fill="none" stroke="#d97706" strokeWidth="6"
            strokeLinecap="round" strokeDasharray="176"
            strokeDashoffset={isVisible ? "74" : "176"}
            style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1) 0.2s" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: "#d97706", fontFamily: "'DM Serif Display', serif", opacity: isVisible ? 1 : 0, transition: "opacity 1s 0.5s" }}>58%</span>
        </div>
      </div>
      <div style={{ flex: 1, opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(10px)', transition: "all 0.8s ease 0.6s" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>Missing keywords</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {["Kubernetes", "Go", "Terraform", "CI/CD", "gRPC"].map(k => (
            <span key={k} style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>{k}</span>
          ))}
        </div>
      </div>
    </div>
    {[["Work experience", 85, "#dc2626", 0.4], ["Skills section", 63, "#d97706", 0.6], ["Formatting", 74, "#16a34a", 0.8]].map(([name, val, col, delay]) => (
      <div key={name} style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 600, color: "#64748b", marginBottom: 3 }}>
          <span>{name}</span><span style={{ color: col, opacity: isVisible ? 1 : 0, transition: `opacity 0.5s ease ${delay + 0.5}s` }}>{val}%</span>
        </div>
        <div style={{ height: 5, borderRadius: 3, background: "#f1f5f9", overflow: "hidden" }}>
          <div style={{ width: isVisible ? `${val}%` : '0%', height: "100%", borderRadius: 3, background: col, transition: `width 1.2s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s` }} />
        </div>
      </div>
    ))}
  </div>
);

const MockTemplates = ({ isVisible }) => {
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
            opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.15}s`,
            boxShadow: c.active && isVisible ? "0 10px 25px rgba(124,58,237,0.2)" : "none"
          }}>
            {c.active && (
              <span style={{ position: "absolute", top: -1, right: 6, fontSize: 8, background: "#7c3aed", color: "#fff", padding: "2px 6px", borderRadius: "0 0 4px 4px", fontWeight: 800, opacity: isVisible ? 1 : 0, transition: "opacity 0.4s ease 0.8s" }}>Active</span>
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
    </div>
  );
};

const MockImport = ({ isVisible }) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (isVisible) {
      const timers = [
        setTimeout(() => setStep(1), 600),
        setTimeout(() => setStep(2), 1200),
        setTimeout(() => setStep(3), 1600),
        setTimeout(() => setStep(4), 2000),
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      setStep(0);
    }
  }, [isVisible]);

  const items = [["Work experience", "3 roles"], ["Skills", "14 items"], ["Education", "2 degrees"], ["Projects & certs", "5 items"]];

  return (
    <div className="lp-mock">
      <div className="lp-mock-topbar" />
      <div style={{ border: step > 0 ? "2px solid #16a34a" : "2px dashed rgba(255,255,255,0.12)", background: step > 0 ? "rgba(22,163,74,0.08)" : "rgba(255,255,255,0.03)", borderRadius: 10, padding: "16px 12px", textAlign: "center", marginBottom: 12, transition: "all 0.4s ease" }}>
        <div style={{ fontSize: 22, marginBottom: 4, transform: step > 0 ? "scale(1.1)" : "scale(1)", transition: "transform 0.3s" }}>📄</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: step > 0 ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.60)" }}>resume_2024.pdf</div>
        <div style={{ fontSize: 10, color: step > 0 ? "#4ade80" : "rgba(255,255,255,0.30)", marginTop: 2 }}>{step > 0 ? "Analyzed successfully" : "Drop your resume here"}</div>
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Extracted sections</div>
      {items.map(([label, count], i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, marginBottom: 7, opacity: step > i ? 1 : 0, transform: step > i ? 'translateX(0)' : 'translateX(-10px)', transition: "all 0.3s ease" }}>
          <span style={{ color: "#4ade80", fontSize: 13 }}>✓</span>
          <span style={{ color: "rgba(255,255,255,0.80)", fontWeight: 600 }}>{label}</span>
          <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.35)", fontSize: 10 }}>{count}</span>
        </div>
      ))}
      <div style={{ marginTop: 10, background: "linear-gradient(135deg,#7c3aed,#db2777)", borderRadius: 8, padding: "7px 12px", textAlign: "center", color: "#fff", fontSize: 11, fontWeight: 700, opacity: step > 3 ? 1 : 0, transform: step > 3 ? "translateY(0)" : "translateY(10px)", transition: "all 0.4s ease" }}>
        Open in editor →
      </div>
    </div>
  );
};

const MockAnon = ({ isVisible }) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (isVisible) {
      const timers = [
        setTimeout(() => setStep(1), 800),
        setTimeout(() => setStep(2), 1600),
        setTimeout(() => setStep(3), 2400),
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      setStep(0);
    }
  }, [isVisible]);

  const rows = [
    ["RK", "#fce7f3", "#db2777", "rahul.k@gmail.com", "alex.c@email.com"],
    ["RC", "#f3e8ff", "#9333ea", "Infosys, Bangalore", "Nexus Technologies"],
    ["PH", "#e0e7ff", "#4f46e5", "+91 98765 43210", "+1 (555) 820-4391"],
  ];

  return (
    <div className="lp-mock">
      <div className="lp-mock-topbar" />
      <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>Before → After anonymisation</div>
      {rows.map(([init, abg, ac, before, after], i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", background: abg, color: ac, fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{init}</div>
          <span style={{ fontSize: 10, color: step > i ? "#dc2626" : "#334155", textDecoration: step > i ? "line-through" : "none", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "all 0.3s" }}>{before}</span>
          <span style={{ fontSize: 10, color: "#94a3b8", opacity: step > i ? 1 : 0, transition: "opacity 0.3s" }}>→</span>
          <span style={{ fontSize: 10, color: "#16a34a", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", opacity: step > i ? 1 : 0, transform: step > i ? "translateX(0)" : "translateX(-5px)", transition: "all 0.3s" }}>{after}</span>
        </div>
      ))}
      <div style={{ marginTop: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 8, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14 }}>🔒</span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>Zero personal information leaves your account</span>
      </div>
    </div>
  );
};

const MockBullet = ({ isVisible }) => {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (isVisible) {
      const timers = [
        setTimeout(() => setStep(1), 1000),
        setTimeout(() => setStep(2), 2000),
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      setStep(0);
    }
  }, [isVisible]);

  return (
    <div className="lp-mock">
      <div className="lp-mock-topbar" />
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>Original bullet</div>
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 10px", fontSize: 10, color: "#7f1d1d", lineHeight: 1.5, opacity: step === 0 ? 1 : 0.5, transition: "opacity 0.5s" }}>
          Responsible for managing the deployment process for various client-facing features.
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", margin: "6px 0" }}>
        <div style={{ background: step > 0 ? "linear-gradient(135deg,#7c3aed,#db2777)" : "#e2e8f0", color: step > 0 ? "#fff" : "#94a3b8", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 20, transform: step === 1 ? "scale(1.1)" : "scale(1)", transition: "all 0.3s", boxShadow: step === 1 ? "0 0 15px rgba(124,58,237,0.4)" : "none" }}>
          {step > 0 ? "✦ AI Enhanced" : "✦ AI Enhance →"}
        </div>
      </div>
      <div style={{ opacity: step === 2 ? 1 : 0, transform: step === 2 ? "translateY(0)" : "translateY(10px)", transition: "all 0.5s ease" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 5 }}>Enhanced bullet</div>
        <div style={{ background: "rgba(22,163,74,0.10)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 8, padding: "8px 10px", fontSize: 10, color: "#4ade80", lineHeight: 1.5 }}>
          Led end-to-end deployment pipeline for 6 client-facing features, reducing release cycle time by <strong>40%</strong> through automated CI/CD integration.
        </div>
      </div>
    </div>
  );
};

const VISUALS = { ats: MockATS, templates: MockTemplates, import: MockImport, anon: MockAnon, bullet: MockBullet };

/* ─── FAQ Accordion Item ─────────────────────────────────────────────── */
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        border: "1px solid", borderColor: open ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.09)",
        borderRadius: 14, overflow: "hidden", cursor: "pointer",
        background: open ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.04)",
        backdropFilter: "blur(12px)",
        transition: "border-color .2s, background .2s",
      }}
    >
      <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.88)", lineHeight: 1.4 }}>{q}</span>
        <span style={{
          width: 24, height: 24, borderRadius: "50%", background: open ? "#7c3aed" : "rgba(255,255,255,0.08)",
          color: open ? "#fff" : "rgba(255,255,255,0.50)", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0, transition: "all .2s", transform: open ? "rotate(180deg)" : "none",
        }}>⌄</span>
      </div>
      <div style={{ maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height .35s ease" }}>
        <p style={{ padding: "0 20px 16px", fontSize: 13, color: "rgba(255,255,255,0.48)", lineHeight: 1.7 }}>{a}</p>
      </div>
    </div>
  );
};

/* ─── Stat Item with Counter Animation ──────────────────────────────── */
const StatItem = ({ num, label, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [displayNum, setDisplayNum] = useState(0);

  useEffect(() => {
    if (isInView) {
      const match = num.match(/(\d+)(.*)/);
      if (match) {
        const target = parseInt(match[1]);
        const controls = animate(0, target, {
          duration: 0.8,
          ease: [0.42, 0, 1, 1],
          onUpdate: (value) => setDisplayNum(Math.round(value)),
        });
        return () => controls.stop();
      }
    }
  }, [isInView, num]);

  const match = num.match(/(\d+)(.*)/);
  const suffix = match ? match[2] : "";

  return (
    <div ref={ref} className={`lp-stat lp-reveal ${isInView ? "lp-visible" : ""}`} style={{ transitionDelay: `${index * 0.1}s` }}>
      <div className="lp-stat-num lp-grad-text">
        {displayNum}{suffix}
      </div>
      <div className="lp-stat-label">{label}</div>
    </div>
  );
};

/* ─── Floating Particles Background ─────────────────────────────────── */
const FloatingParticles = () => {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: 180 + i * 60,
    x: [10, 25, 55, 70, 35, 80][i],
    y: [15, 65, 20, 75, 45, 40][i],
    delay: i * 0.8,
    duration: 8 + i * 1.5,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          width: p.size,
          height: p.size,
          borderRadius: "50%",
          left: `${p.x}%`,
          top: `${p.y}%`,
          transform: "translate(-50%, -50%)",
          background: p.id % 2 === 0
            ? "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(219,39,119,0.05) 0%, transparent 70%)",
          animation: `float-particle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
        }} />
      ))}
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

  // Carousel
  const carouselRef = useRef(null);
  const featureRefs = useRef([]);
  const [activeFeature, setActiveFeature] = useState(0);
  const autoSwipeRef = useRef(null);
  const isUserInteracting = useRef(false);
  const carouselSectionRef = useRef(null);
  const isSectionVisible = useRef(false);

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
    const COLORS = ["#a855f7", "#ec4899", "#c084fc", "#818cf8", "#06b6d4"];
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

  /* 
   * FIX 1: Use IntersectionObserver on the SECTION (not the slides) 
   * to know if carousel is in the viewport before running auto-swipe.
   */
  useEffect(() => {
    const section = carouselSectionRef.current;
    if (!section) return;

    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        isSectionVisible.current = entry.isIntersecting;
      },
      { threshold: 0.3 }
    );
    sectionObserver.observe(section);
    return () => sectionObserver.disconnect();
  }, []);

  /*
   * FIX 2: Track active slide by reading scrollLeft of the container,
   * not via IntersectionObserver on slides (which was unreliable).
   */
  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    const handleScroll = () => {
      const slideWidth = container.offsetWidth;
      const scrollLeft = container.scrollLeft;
      const newIndex = Math.round(scrollLeft / slideWidth);
      setActiveFeature(Math.min(Math.max(newIndex, 0), FEATURES.length - 1));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  /*
   * FIX 3: Auto-swipe ONLY fires when the carousel section is visible 
   * in the viewport AND user is not interacting.
   */
  const startAutoSwipe = () => {
    if (autoSwipeRef.current) clearInterval(autoSwipeRef.current);
    autoSwipeRef.current = setInterval(() => {
      if (!isSectionVisible.current || isUserInteracting.current) return;

      const container = carouselRef.current;
      if (!container) return;

      const slideWidth = container.offsetWidth;
      const currentScroll = container.scrollLeft;
      const currentIndex = Math.round(currentScroll / slideWidth);
      const nextIndex = (currentIndex + 1) % FEATURES.length;

      scrollToSlide(nextIndex);
    }, 3500);
  };

  useEffect(() => {
    startAutoSwipe();
    return () => {
      if (autoSwipeRef.current) clearInterval(autoSwipeRef.current);
    };
  }, []);

  /*
   * FIX 4: scrollToSlide uses scrollLeft on the container directly — 
   * NOT scrollIntoView which fights with the page scroll.
   */
  const scrollToSlide = (index) => {
    const container = carouselRef.current;
    if (!container) return;
    const slideWidth = container.offsetWidth;
    container.scrollTo({ left: index * slideWidth, behavior: "smooth" });
  };

  const interactionTimeoutRef = useRef(null);

  const handleInteractionStart = () => {
    isUserInteracting.current = true;
    if (autoSwipeRef.current) clearInterval(autoSwipeRef.current);
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
  };

  const handleInteractionEnd = () => {
    isUserInteracting.current = false;
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    interactionTimeoutRef.current = setTimeout(() => {
      if (!isUserInteracting.current) startAutoSwipe();
    }, 4000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Instrument+Sans:wght@400;500;600;700&family=Dancing+Script:wght@700&display=swap');

        /* ═══ GLASSMORPHISM AMBIENT LAYER ═══ */
        .lp-ambient-layer {
          position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
        }
        .lp-orb {
          position: absolute; border-radius: 50%; filter: blur(90px);
          animation: orb-drift 18s ease-in-out infinite alternate;
        }
        .lp-orb-1 {
          width: 700px; height: 700px; top: -200px; left: -150px;
          background: radial-gradient(circle, rgba(124,58,237,0.55) 0%, rgba(79,70,229,0.20) 50%, transparent 70%);
          animation-duration: 22s;
        }
        .lp-orb-2 {
          width: 600px; height: 600px; top: 30%; right: -150px;
          background: radial-gradient(circle, rgba(219,39,119,0.45) 0%, rgba(168,85,247,0.15) 50%, transparent 70%);
          animation-duration: 28s; animation-delay: -6s;
        }
        .lp-orb-3 {
          width: 500px; height: 500px; bottom: 10%; left: 20%;
          background: radial-gradient(circle, rgba(6,182,212,0.35) 0%, rgba(79,70,229,0.10) 50%, transparent 70%);
          animation-duration: 20s; animation-delay: -12s;
        }
        .lp-orb-4 {
          width: 400px; height: 400px; top: 60%; left: 55%;
          background: radial-gradient(circle, rgba(236,72,153,0.30) 0%, transparent 70%);
          animation-duration: 16s; animation-delay: -4s;
        }
        @keyframes orb-drift {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(60px, -80px) scale(1.08); }
          66%  { transform: translate(-40px, 50px) scale(0.95); }
          100% { transform: translate(30px, -30px) scale(1.03); }
        }

        /* ═══ TRUE GLASSMORPHISM PANELS ═══ */
        .glass-section {
          position: relative; z-index: 1;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border-top: 1px solid rgba(255,255,255,0.10);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .glass-card-true {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(255,255,255,0.12);
          border-top: 1px solid rgba(255,255,255,0.20);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.10);
          transition: all 0.3s ease;
        }
        .glass-card-true:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(124,58,237,0.40);
          box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.25), inset 0 1px 0 rgba(255,255,255,0.14);
          transform: translateY(-3px);
        }
        .glass-mock-true {
          background: rgba(255,255,255,0.07);
          backdrop-filter: blur(30px) saturate(200%);
          -webkit-backdrop-filter: blur(30px) saturate(200%);
          border: 1px solid rgba(255,255,255,0.15);
          border-top: 1px solid rgba(255,255,255,0.25);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .glass-hero-tag {
          background: rgba(124,58,237,0.20);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(124,58,237,0.45);
          box-shadow: 0 0 24px rgba(124,58,237,0.30), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .glass-stat-card {
          text-align: center; padding: 2.5rem 2rem;
          border-right: 1px solid rgba(255,255,255,0.07);
          position: relative;
        }
        .glass-stat-card::before {
          content: '';
          position: absolute; inset: 12px; border-radius: 16px;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.06);
          transition: all 0.3s;
        }
        .glass-stat-card:hover::before {
          background: rgba(124,58,237,0.08);
          border-color: rgba(124,58,237,0.20);
        }
        .glass-stat-card:last-child { border-right: none; }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --pu: #7c3aed;
          --pk: #db2777;
          --pu2: #a855f7;
          --pk2: #ec4899;
          --pu-l: rgba(124,58,237,0.15);
          --pk-l: rgba(219,39,119,0.10);
          --bg: #070713;
          --fg: rgba(255,255,255,0.93);
          --fg2: rgba(255,255,255,0.55);
          --fg3: rgba(255,255,255,0.30);
          --border: rgba(255,255,255,0.09);
          --card: rgba(255,255,255,0.05);
          --serif: 'DM Serif Display', Georgia, serif;
          --sans: 'Instrument Sans', system-ui, sans-serif;
          --script: 'Dancing Script', cursive;
        }

        html, body {
          font-family: var(--sans);
          background: var(--bg);
          color: var(--fg);
          overflow-x: hidden;
        }
        body {
          background-image: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.20) 0%, transparent 60%);
        }

        @keyframes float-particle {
          from { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          to   { transform: translate(-50%, -50%) scale(1.3) translate(20px, -15px); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

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
          background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.80);
          padding: 12px 24px; border-radius: 50px;
          font-family: var(--sans); font-size: 14px; font-weight: 600;
          border: 1px solid rgba(255,255,255,0.12); cursor: pointer;
          transition: all .2s;
          backdrop-filter: blur(8px);
        }
        .lp-btn-ghost:hover { border-color: rgba(124,58,237,0.5); color: #a855f7; background: rgba(124,58,237,0.10); }

        /* NAV */
        .lp-nav {
          position: sticky; top: 0; z-index: 50;
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          background: rgba(7,7,19,0.80);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 4px 30px rgba(0,0,0,0.3);
        }
        .lp-nav-inner {
          max-width: 1140px; margin: 0 auto; padding: 0 24px; height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .lp-logo {
          font-family: var(--script); font-size: 2rem;
          background: linear-gradient(135deg, var(--pu), var(--pk));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1;
        }
        .lp-logo-deva { font-size: .75rem; color: rgba(255,255,255,0.30); font-family: var(--sans); font-weight: 500; letter-spacing: .04em; margin-left: 6px; }

        /* HERO */
        .lp-hero-canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
        .lp-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(124,58,237,0.18); border: 1px solid rgba(124,58,237,0.45);
          color: #a855f7; font-size: 11px; font-weight: 700; padding: 7px 16px; border-radius: 20px;
          letter-spacing: .08em; text-transform: uppercase;
          box-shadow: 0 0 28px rgba(124,58,237,0.28);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          animation: fadeUp .5s ease forwards;
        }
        .lp-cursor { display: inline-block; width: 2px; height: 1em; background: #a855f7; margin-left: 2px; vertical-align: middle; animation: blink 1s step-end infinite; }
        @media (max-width: 768px) { .lp-hero-split-right { display: none !important; } }

        /* STATS */
        .lp-stats { max-width: 1140px; margin: 0 auto; padding: 5rem 24px; }
        .lp-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        @media (max-width: 600px) { .lp-stats-grid { grid-template-columns: 1fr; } }
        .lp-stat { text-align: center; padding: 3rem 2rem; border-right: 1px solid rgba(255,255,255,0.07); }
        .lp-stat:last-child { border-right: none; }
        .lp-stat-num { font-family: var(--serif); font-size: 3.5rem; line-height: 1; margin-bottom: .5rem; }
        .lp-stat-label { font-size: 13px; color: rgba(255,255,255,0.45); font-weight: 500; }

        /* ── CAROUSEL SECTION ── */
        .lp-carousel-section {
          width: 100%;
          padding: 6rem 0 3rem;
          background: var(--bg);
          position: relative;
          overflow: hidden;
        }

        /* Soft gradient fade at section edges — purely decorative */
        .lp-carousel-section::before,
        .lp-carousel-section::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0;
          width: 120px;
          z-index: 4;
          pointer-events: none;
        }
        .lp-carousel-section::before {
          left: 0;
          background: linear-gradient(to right, var(--bg) 0%, transparent 100%);
        }
        .lp-carousel-section::after {
          right: 0;
          background: linear-gradient(to left, var(--bg) 0%, transparent 100%);
        }

        /* The actual scrollable strip */
        .lp-carousel-container {
          display: flex;
          overflow-x: scroll;
          scroll-snap-type: x mandatory;  /* RE-ENABLED — but on container only */
          -ms-overflow-style: none;
          scrollbar-width: none;
          /* Do NOT use scroll-behavior: smooth here — it fights with programmatic scrollTo */
        }
        .lp-carousel-container::-webkit-scrollbar { display: none; }

        .lp-carousel-slide {
          flex: 0 0 100%;
          min-width: 100%;
          scroll-snap-align: center;
          display: flex;
          justify-content: center;
          padding: 1rem 48px 3rem;
          box-sizing: border-box;
        }

        .lp-slide-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 960px;
          width: 100%;
          gap: 5rem;
        }

        /* Focused / dimmed state — driven by activeFeature class */
        .lp-slide-text {
          flex: 1;
          opacity: 0;
          transform: translateX(-28px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lp-slide-visual {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          opacity: 0;
          transform: translateX(28px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lp-carousel-slide.active .lp-slide-text,
        .lp-carousel-slide.active .lp-slide-visual {
          opacity: 1;
          transform: translateX(0);
        }

        /* Progress bar indicator (replaces plain dots) */
        .lp-carousel-progress {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 6px;
          margin-top: 1.5rem;
          padding-bottom: 0.5rem;
        }
        .lp-progress-pill {
          height: 4px;
          border-radius: 2px;
          background: rgba(255,255,255,0.12);
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          width: 24px;
        }
        .lp-progress-pill.active {
          background: linear-gradient(90deg, #7c3aed, #db2777);
          width: 48px;
          box-shadow: 0 0 10px rgba(124,58,237,0.5);
        }

        /* Slide counter badge (top-right of section) */
        .lp-slide-counter {
          position: absolute;
          top: 1.5rem;
          right: 2rem;
          font-size: 12px;
          font-weight: 700;
          color: var(--fg3);
          letter-spacing: 0.08em;
          z-index: 5;
        }

        /* Feature tag */
        .lp-feat-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #a855f7; margin-bottom: .75rem; }
        .lp-feat-tag::before { content: ''; width: 18px; height: 1.5px; background: linear-gradient(90deg, #7c3aed, #db2777); display: block; border-radius: 2px; }
        .lp-feat-h2 { font-family: var(--serif); font-size: clamp(1.7rem, 3vw, 2.4rem); font-weight: 400; line-height: 1.2; color: rgba(255,255,255,0.93); margin-bottom: 1rem; }
        .lp-feat-body { font-size: 15px; color: rgba(255,255,255,0.52); line-height: 1.8; margin-bottom: 1.5rem; }
        .lp-perk-list { display: flex; flex-direction: column; gap: 8px; }
        .lp-perk { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.82); }
        .lp-perk-dot { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, #7c3aed, #db2777); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 9px; }

        /* Mock card */
        .lp-mock {
          width: 100%; max-width: 360px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.08);
        }
        .lp-mock-topbar { height: 5px; border-radius: 3px; margin-bottom: 20px; background: linear-gradient(90deg, var(--pu), var(--pk)); width: 55%; }

        /* Mobile */
        @media (max-width: 900px) {
          .lp-slide-inner { flex-direction: column; gap: 2.5rem; }
          .lp-carousel-slide { padding: 1rem 24px 3rem; }
          .lp-slide-text { max-width: 100%; text-align: center; }
          .lp-slide-visual { justify-content: center; width: 100%; }
          .lp-feat-tag { margin-inline: auto; }
          .lp-perk-list { align-items: center; }
          .lp-carousel-section::before,
          .lp-carousel-section::after { display: none; }
        }

        /* Why Us */
        .lp-why { background: linear-gradient(170deg, rgba(124,58,237,0.08) 0%, rgba(219,39,119,0.05) 100%); position: relative; overflow: hidden; }
        .lp-why-inner { max-width: 1140px; margin: 0 auto; padding: 6rem 24px; position: relative; z-index: 1; }
        .lp-why-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 3rem; }
        @media (max-width: 600px) { .lp-why-grid { grid-template-columns: 1fr; } }
        .lp-why-card { background: rgba(255,255,255,0.04); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-radius: 16px; padding: 28px; border: 1px solid rgba(255,255,255,0.08); transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s; }
        .lp-why-card:hover { box-shadow: 0 12px 40px rgba(124,58,237,0.18), 0 0 0 1px rgba(124,58,237,0.25); transform: translateY(-3px); border-color: rgba(124,58,237,0.28); }
        .lp-why-icon { font-size: 20px; color: var(--pu2); margin-bottom: 14px; display: block; }
        .lp-why-name { font-size: 15px; font-weight: 700; color: rgba(255,255,255,0.90); margin-bottom: 8px; }
        .lp-why-body { font-size: 13px; color: rgba(255,255,255,0.50); line-height: 1.7; }

        /* FAQ */
        .lp-faq { max-width: 760px; margin: 0 auto; padding: 6rem 24px; }
        .lp-faq-list { display: flex; flex-direction: column; gap: 8px; margin-top: 2.5rem; }

        /* Stamp Scene (Formerly Laptop Scene) */
        .lp-stamp-scene {
          position: relative; width: 100%; padding: 8rem 0 12rem; display: flex;
          flex-direction: column; align-items: center; justify-content: center;
          overflow: hidden; z-index: 1;
          background: linear-gradient(180deg, rgba(4,4,14,0) 0%, rgba(25,30,50,0.3) 15%, rgba(110,125,160,0.7) 28%, rgba(240,244,255,1) 45%, rgba(248,250,252,1) 100%);
          color: #0f172a;
        }
        .lp-stamp-wrapper {
          position: relative; width: 600px; max-width: 92vw;
          margin-bottom: 2rem; display: flex; justify-content: center;
        }
        


        /* The Floating Resume Document */
        .lp-doc-slide {
          position: relative;
          width: 70%;
          border-radius: 6px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 30px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
          z-index: 10;
        }
        .lp-doc-slide img { width: 100%; height: auto; display: block; }

        /* Stamp */
        .lp-stamp {
          position: absolute;
          left: 50%; top: 20%;
          transform: translateX(-50%) translateY(200px) scale(0.3) rotate(-15deg);
          width: 180px; height: 180px;
          z-index: 20;
          opacity: 0;
          pointer-events: none;
        }
        .lp-stamp-ring {
          width: 100%; height: 100%; border-radius: 50%;
          border: 8px solid rgba(59,130,246,0.9);
          display: flex; align-items: center; justify-content: center;
          flex-direction: column;
          background: rgba(255,255,255,0.8);
          box-shadow: 0 0 20px rgba(59,130,246,0.3);
        }
        .lp-stamp-text-top {
          font-size: 10px; font-weight: 900; color: rgba(59,130,246,0.9);
          letter-spacing: 0.15em; text-transform: uppercase; font-family: var(--sans);
        }
        .lp-stamp-main {
          font-size: 20px; font-weight: 900; color: rgba(59,130,246,1);
          letter-spacing: 0.05em; text-transform: uppercase; font-family: var(--sans);
          line-height: 1.1; margin: 4px 0;
        }
        .lp-stamp-text-bot {
          font-size: 9px; font-weight: 800; color: rgba(59,130,246,0.8);
          letter-spacing: 0.12em; text-transform: uppercase; font-family: var(--sans);
        }

        /* CTA */
        .lp-cta { max-width: 860px; margin: 0 auto; padding: 0 24px 6rem; }
        .lp-cta-inner {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border-radius: 28px;
          padding: 5rem 3rem;
          text-align: center;
          color: #fff;
          position: relative;
          overflow: hidden;
          /* gradient border via box-shadow */
          box-shadow: 0 0 0 1px rgba(124,58,237,0.35), 0 0 80px rgba(124,58,237,0.18), 0 32px 64px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.10);
          border-top: 1px solid rgba(255,255,255,0.18);
        }
        .lp-cta-inner::before {
          content: ''; position: absolute; inset: 0; pointer-events: none; border-radius: 28px;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,58,237,0.20) 0%, transparent 70%);
        }
        .lp-cta-h2 { font-family: var(--serif); font-size: clamp(2rem, 4vw, 3rem); font-weight: 400; margin-bottom: 1rem; position: relative;
          background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(192,132,252,0.90)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .lp-cta-body { font-size: 15px; color: rgba(255,255,255,0.55); line-height: 1.75; margin-bottom: 2.5rem; position: relative; }
        .lp-btn-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, #7c3aed, #db2777);
          color: #fff; padding: 14px 36px; border-radius: 50px;
          font-family: var(--sans); font-size: 15px; font-weight: 700; border: none; cursor: pointer;
          box-shadow: 0 4px 24px rgba(124,58,237,0.40); transition: transform .2s, box-shadow .2s; position: relative;
        }
        .lp-btn-cta:hover { transform: scale(1.04); box-shadow: 0 8px 36px rgba(124,58,237,0.55); }

        /* Hero 3D Cascade Showcase */
        .lp-hero-visual {
          position: relative; display: flex; justify-content: center; align-items: center;
          perspective: 1500px; height: 650px; margin-top: -2rem;
        }
        
        /* The Massive Diagonal Aura */
        .lp-light-beam {
          position: absolute; top: -100px; right: -200px;
          width: 800px; height: 800px; z-index: 0; pointer-events: none;
          background: radial-gradient(circle at center, rgba(192,132,252,0.3) 0%, rgba(219,39,119,0.15) 40%, transparent 70%);
          transform: rotateZ(-30deg) scaleY(1.5);
          filter: blur(60px);
          animation: auraPulse 6s ease-in-out infinite alternate;
        }
        @keyframes auraPulse {
          from { opacity: 0.6; transform: rotateZ(-30deg) scaleY(1.5) translateX(0); }
          to { opacity: 1; transform: rotateZ(-30deg) scaleY(1.6) translateX(-30px); }
        }

        .lp-cascade-container {
          position: relative;
          width: 340px; height: 460px;
          transform-style: preserve-3d;
          transform: rotateZ(-25deg) rotateY(20deg) rotateX(15deg);
          animation: cascadeFloat 8s ease-in-out infinite alternate;
          cursor: crosshair;
        }
        @keyframes cascadeFloat {
          from { transform: rotateZ(-25deg) rotateY(20deg) rotateX(15deg) translateY(0); }
          to { transform: rotateZ(-23deg) rotateY(18deg) rotateX(12deg) translateY(-25px); }
        }

        /* Base styling for all layers */
        .lp-cascade-layer {
          position: absolute; inset: 0; border-radius: 8px; overflow: hidden;
          transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        /* Deep Background Layer (Ghost wireframe) */
        .lp-layer-bg {
          transform: translateZ(-100px) translateX(-50px) translateY(50px);
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          filter: brightness(0.4) blur(1px);
        }
        
        /* Center Layer (The Bright Resume) */
        .lp-layer-center {
          transform: translateZ(0) translateX(0) translateY(0);
          background: #fff;
          box-shadow: -30px 40px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.2), 0 0 40px rgba(192,132,252,0.3);
        }
        
        /* Foreground Layer (Ghost glass panel) */
        .lp-layer-fg {
          transform: translateZ(100px) translateX(50px) translateY(-50px);
          background: linear-gradient(135deg, rgba(255,255,255,0.05), transparent);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          pointer-events: none;
        }

        /* Hover spreading effect */
        .lp-cascade-container:hover .lp-layer-bg { transform: translateZ(-140px) translateX(-70px) translateY(70px); }
        .lp-cascade-container:hover .lp-layer-center { transform: translateZ(20px); }
        .lp-cascade-container:hover .lp-layer-fg { transform: translateZ(160px) translateX(80px) translateY(-80px); }

        .lp-resume-img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; filter: contrast(1.02); }
        
        /* Dummy wireframe content for ghost layers */
        .lp-wireframe { padding: 24px; display: flex; flex-direction: column; gap: 12px; height: 100%; opacity: 0.3; }
        .lp-wf-line { height: 6px; background: rgba(255,255,255,0.4); border-radius: 4px; }

        /* Footer */
        .lp-footer { background: rgba(4,4,14,0.95); border-top: 1px solid rgba(255,255,255,0.07); color: rgba(255,255,255,0.40); }
        .lp-footer-inner { max-width: 1140px; margin: 0 auto; padding: 4rem 24px 2rem; }
        
        /* Giant Animated Footer Logo */
        .lp-footer-giant {
          font-family: var(--sans);
          font-size: clamp(5rem, 20vw, 18rem);
          font-weight: 800;
          text-align: center;
          line-height: 0.9;
          margin-top: 1rem;
          color: #04040e; /* inside is dark, matching background */
          -webkit-text-stroke: 1px rgba(255,255,255,0.15); /* Base outline */
          position: relative;
          letter-spacing: -0.04em;
          user-select: none;
          padding-bottom: 2rem;
          cursor: crosshair;
        }
        
        /* The glow layer that follows the mouse */
        .lp-footer-giant::after {
          content: "Vṛttāntam.";
          position: absolute;
          inset: 0;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: transparent;
          -webkit-text-stroke: 2px transparent; 
          background: radial-gradient(circle 350px at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(236,72,153,1) 0%, rgba(124,58,237,1) 40%, transparent 80%);
          -webkit-background-clip: text;
          background-clip: text;
          pointer-events: none;
        }
        .lp-footer-col h4 { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.70); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 1rem; }
        .lp-footer-col a { display: block; font-size: 13px; color: rgba(255,255,255,0.35); text-decoration: none; margin-bottom: .5rem; transition: color .15s; }
        .lp-footer-col a:hover { color: #c084fc; }
        .lp-footer-copy { border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1.5rem; font-size: 12px; text-align: center; color: rgba(255,255,255,0.25); }

        /* Section header */
        .lp-sec-header { text-align: center; margin-bottom: 1rem; }
        .lp-sec-eyebrow { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #a855f7; margin-bottom: .75rem; }
        .lp-sec-h2 { font-family: var(--serif); font-size: clamp(1.8rem, 3.5vw, 2.75rem); font-weight: 400; color: rgba(255,255,255,0.93); line-height: 1.2; }
        .lp-sec-sub { font-size: 15px; color: rgba(255,255,255,0.50); line-height: 1.7; max-width: 520px; margin: .75rem auto 0; }

        /* Animations */
        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .lp-reveal { opacity: 0; transform: translateY(24px); transition: opacity .65s ease, transform .65s ease; }
        .lp-reveal.lp-visible { opacity: 1; transform: translateY(0); }

        /* Keyboard nav arrows for carousel */
        .lp-carousel-nav {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 1rem;
        }
        .lp-carousel-arrow {
          width: 38px; height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(8px);
          color: rgba(255,255,255,0.60);
          font-size: 16px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .lp-carousel-arrow:hover {
          border-color: rgba(124,58,237,0.5);
          color: #a855f7;
          background: rgba(124,58,237,0.12);
          transform: scale(1.08);
          box-shadow: 0 0 16px rgba(124,58,237,0.25);
        }
        .lp-carousel-arrow:disabled {
          opacity: 0.25;
          cursor: default;
          transform: none;
        }
      `}</style>

      <ScrollReveal />

      {/* ── AMBIENT GLASSMORPHISM ORBS (always behind everything) ── */}
      <div className="lp-ambient-layer" aria-hidden="true">
        <div className="lp-orb lp-orb-1" />
        <div className="lp-orb lp-orb-2" />
        <div className="lp-orb lp-orb-3" />
        <div className="lp-orb lp-orb-4" />
      </div>

      {/* NAV */}
      <nav className="lp-nav" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
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

      {/* HERO — Aurora Split */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '92vh', display: 'flex', alignItems: 'center', background: 'transparent' }}>
        <canvas ref={canvasRef} className="lp-hero-canvas" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '5rem 32px', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          {/* TEXT */}
          <div>
            <div className="lp-hero-eyebrow glass-hero-tag" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>✦ AI-powered resume builder</div>
            <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(2.8rem,5vw,4.2rem)', fontWeight: 400, lineHeight: 1.1, color: 'rgba(255,255,255,0.96)', margin: '0 0 1.2rem', animation: 'fadeUp .6s .1s ease both' }}>
              Craft the resume<br />that <em className="lp-grad-text">gets you hired</em>
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.50)', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: 460, minHeight: '3.5rem' }}>
              {typedText}{cursorVisible && <span className="lp-cursor" />}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
              <button className="lp-btn-primary" onClick={() => navigate(user ? "/dashboard" : "/login")}>{user ? "Open Dashboard →" : "Start for free →"}</button>
              <button className="lp-btn-ghost" onClick={() => document.getElementById("lp-features")?.scrollIntoView({ behavior: "smooth" })}>See how it works</button>
            </div>

          </div>
          {/* VISUAL - 3D CASCADE SHOWCASE */}
          <div className="lp-hero-visual">
            <div className="lp-light-beam" />

            <div className="lp-cascade-container">
              {/* Background Ghost Layer */}
              <div className="lp-cascade-layer lp-layer-bg">
                <div className="lp-wireframe">
                  <div className="lp-wf-line" style={{ width: '60%', height: '12px', marginBottom: '10px' }} />
                  <div className="lp-wf-line" style={{ width: '100%' }} />
                  <div className="lp-wf-line" style={{ width: '90%' }} />
                  <div className="lp-wf-line" style={{ width: '95%' }} />
                  <div className="lp-wf-line" style={{ width: '40%', marginTop: '20px' }} />
                  <div className="lp-wf-line" style={{ width: '100%' }} />
                  <div className="lp-wf-line" style={{ width: '85%' }} />
                </div>
              </div>

              {/* Center Bright Layer (Actual Image) */}
              <div className="lp-cascade-layer lp-layer-center">
                <img src="/sample-resume.png" alt="Sample Resume" className="lp-resume-img" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.innerHTML = 'Please save image as Client/public/sample-resume.png'; e.target.nextSibling.style.display = 'flex'; e.target.nextSibling.style.alignItems = 'center'; e.target.nextSibling.style.justifyContent = 'center'; e.target.nextSibling.style.color = '#111'; e.target.nextSibling.style.background = '#f8f9fa'; e.target.nextSibling.style.height = '100%'; e.target.nextSibling.style.padding = '20px'; e.target.nextSibling.style.textAlign = 'center'; e.target.nextSibling.style.fontSize = '14px'; e.target.nextSibling.style.fontWeight = '600'; }} />
                <div style={{ display: 'none' }}></div>
              </div>

              {/* Foreground Ghost Layer */}
              <div className="lp-cascade-layer lp-layer-fg">
                <div className="lp-wireframe" style={{ opacity: 0.15 }}>
                  <div className="lp-wf-line" style={{ width: '70%', height: '12px', marginBottom: '10px' }} />
                  <div className="lp-wf-line" style={{ width: '100%' }} />
                  <div className="lp-wf-line" style={{ width: '80%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes heroFloat { from{transform:translateY(0px) rotate(-1deg)} to{transform:translateY(-18px) rotate(1deg)} }
          @media(max-width:768px){.lp-hero-grid>div:last-child{display:none!important}}
        `}</style>
      </section>


      {/* ── CAROUSEL SECTION (true glass panel) ── */}
      <div
        id="lp-features"
        ref={carouselSectionRef}
        className="lp-carousel-section glass-section"
        style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)', borderTop: '1px solid rgba(255,255,255,0.09)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Floating decorative blobs */}
        <FloatingParticles />

        {/* Slide counter */}
        <div className="lp-slide-counter" style={{ position: "absolute", top: "1.5rem", right: "2rem", zIndex: 5 }}>
          <span style={{ color: "var(--pu)", fontWeight: 800 }}>{String(activeFeature + 1).padStart(2, "0")}</span>
          <span style={{ color: "var(--fg3)" }}> / {String(FEATURES.length).padStart(2, "0")}</span>
        </div>

        <div className="lp-sec-header lp-reveal" style={{ marginBottom: "2rem", position: "relative", zIndex: 2 }}>
          <span className="lp-sec-eyebrow">The Toolkit</span>
          <h2 className="lp-sec-h2">Everything you need to <em className="lp-grad-text">stand out</em></h2>
          <p className="lp-sec-sub">Use the arrows or drag to explore each feature.</p>
        </div>

        {/* Scrollable carousel strip */}
        <div
          className="lp-carousel-container"
          ref={carouselRef}
          onMouseEnter={handleInteractionStart}
          onMouseLeave={handleInteractionEnd}
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
          style={{ position: "relative", zIndex: 2 }}
        >
          {FEATURES.map((feat, i) => {
            const Visual = VISUALS[feat.visual];
            return (
              <div
                key={feat.tag}
                ref={(el) => (featureRefs.current[i] = el)}
                className={`lp-carousel-slide ${activeFeature === i ? "active" : ""}`}
              >
                <div className="lp-slide-inner">
                  <div className="lp-slide-text">
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
                  <div className="lp-slide-visual">
                    {Visual && <Visual isVisible={activeFeature === i} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation: arrows + progress pills */}
        <div style={{ position: "relative", zIndex: 3 }}>
          <div className="lp-carousel-nav">
            <button
              className="lp-carousel-arrow"
              disabled={activeFeature === 0}
              onClick={() => {
                const prev = activeFeature - 1;
                scrollToSlide(prev);
                setActiveFeature(prev);
                handleInteractionStart();
                handleInteractionEnd();
              }}
            >‹</button>
            <button
              className="lp-carousel-arrow"
              disabled={activeFeature === FEATURES.length - 1}
              onClick={() => {
                const next = activeFeature + 1;
                scrollToSlide(next);
                setActiveFeature(next);
                handleInteractionStart();
                handleInteractionEnd();
              }}
            >›</button>
          </div>

          <div className="lp-carousel-progress">
            {FEATURES.map((_, i) => (
              <div
                key={i}
                className={`lp-progress-pill ${activeFeature === i ? "active" : ""}`}
                onClick={() => {
                  scrollToSlide(i);
                  setActiveFeature(i);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* STATS — glass panel */}
      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(30px) saturate(180%)', WebkitBackdropFilter: 'blur(30px) saturate(180%)', borderTop: '1px solid rgba(255,255,255,0.10)', borderBottom: '1px solid rgba(255,255,255,0.06)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}>
        <div className="lp-stats">
          <div className="lp-stats-grid">
            {[
              { num: "75%", label: "of resumes are filtered out by ATS before a human reads them" },
              { num: "10s", label: "to import your existing PDF resume — zero copy-pasting" },
              { num: "12+", label: "professionally designed, ATS-safe templates to choose from" },
            ].map(({ num, label }, i) => (
              <StatItem key={i} num={num} label={label} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* WHY US — glass section */}
      <div className="lp-why" style={{ position: 'relative', zIndex: 1 }}>
        <FloatingParticles />
        <div className="lp-why-inner">
          <div className="lp-sec-header lp-reveal">
            <span className="lp-sec-eyebrow">Why Vṛttāntam</span>
            <h2 className="lp-sec-h2">Built around how people <em className="lp-grad-text">actually</em> job hunt</h2>
            <p className="lp-sec-sub">Not just a template picker. A toolkit that covers every stage — from first import to final export.</p>
          </div>
          <div className="lp-why-grid">
            {WHY_US.map((item, i) => (
              <div key={item.title} className="glass-card-true lp-why-card lp-reveal" style={{ transitionDelay: `${i * 0.08}s`, padding: 28 }}>
                <span className="lp-why-icon">{item.icon}</span>
                <div className="lp-why-name">{item.title}</div>
                <p className="lp-why-body">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ — glass panel */}
      <div className="lp-faq" style={{ position: 'relative', zIndex: 1 }}>
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

      {/* CTA — dark glass card */}
      {/* LAPTOP → STAMP CINEMATIC SECTION */}
      <LaptopStampScene navigate={navigate} user={user} />

      {/* CTA — dark glass card */}
      <div className="lp-cta" style={{ position: 'relative', zIndex: 1 }}>
        <div className="lp-cta-inner lp-reveal">
          <h2 className="lp-cta-h2">Ready to build your future?</h2>
          <p className="lp-cta-body">
            Join thousands of professionals creating standout resumes with Vṛttāntam.<br />
            Free to start. No credit card required.
          </p>
          <button className="lp-btn-cta" onClick={() => navigate(user ? "/dashboard" : "/login")}>
            {user ? "Open Dashboard →" : "Start building now →"}
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', paddingBottom: '2rem' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', paddingTop: '2rem', paddingLeft: '24px', paddingRight: '24px', textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.30)', fontFamily: 'var(--sans)' }}>
          © {new Date().getFullYear()} Vṛttāntam. All rights reserved. &nbsp;·&nbsp; वृत्तान्तम् — the art of narrative.
        </div>
        <div
          className="lp-footer-giant"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
            e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.setProperty('--mouse-x', `50%`);
            e.currentTarget.style.setProperty('--mouse-y', `50%`);
          }}
        >
          Vṛttāntam.
        </div>
      </footer>
    </>
  );
}

/* ─── Scroll Reveal ──────────────────────────────────────────────────── */
function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".lp-reveal");
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

/* ─── Scroll Animation Component ─────────────────────────────────────── */
function LaptopStampScene() {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress: 0 when container top hits middle of screen, 1 when container top reaches top of screen
      const startTrigger = windowHeight * 0.8;
      const endTrigger = windowHeight * 0.2;

      let progress = (startTrigger - rect.top) / (startTrigger - endTrigger);
      progress = Math.max(0, Math.min(1, progress));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const slideProgress = Math.min(1, scrollProgress / 0.7);
  // Document slides up slightly into focus
  const translateY = 50 - (slideProgress * 50);
  const opacity = 0.5 + (slideProgress * 0.5);

  let stampScale = 1.3;
  let stampRotation = -20;
  let stampOpacity = 0;

  if (scrollProgress > 0.6) {
    const stampProgress = Math.min(1, (scrollProgress - 0.6) / 0.2);
    stampOpacity = stampProgress;

    if (stampProgress < 1) {
      stampScale = 1.3 - (stampProgress * 0.3);
      stampRotation = -20 + (stampProgress * 8);
    } else {
      stampScale = 1;
      stampRotation = -12;
    }
  }

  return (
    <div className="lp-stamp-scene" ref={containerRef}>

      <div className="lp-stamp-wrapper lp-reveal">
        {/* The Floating Document */}
        <div
          className="lp-doc-slide"
          style={{ transform: `translateY(${translateY}px)`, opacity: opacity }}
        >
          <img src="/sample-resume.png" alt="Exported Resume" onError={(e) => { e.target.style.display = 'none'; }} />

          {/* The Stamp */}
          <div
            className="lp-stamp"
            style={{
              opacity: stampOpacity,
              transform: `translateX(-50%) translateY(0px) scale(${stampScale}) rotate(${stampRotation}deg)`
            }}
          >
            <div className="lp-stamp-ring">
              <div className="lp-stamp-text-top">Certified</div>
              <div className="lp-stamp-main">Shortlisted</div>
              <div className="lp-stamp-text-bot">Top 5% Candidate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="lp-laptop-scene-header lp-reveal" style={{ marginTop: '3rem', zIndex: 10, textAlign: 'center' }}>
        <h2 style={{ fontFamily: "var(--sans)", fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', color: '#0f172a', margin: 0, fontWeight: 500, letterSpacing: '-0.02em' }}>
          Crafted with care, shared with confidence.
        </h2>
        <p style={{ fontFamily: "var(--sans)", fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', color: '#64748b', margin: '0.5rem 0 0 0', fontWeight: 400 }}>
          Let your resume do the talking.
        </p>
      </div>

    </div>
  );
}