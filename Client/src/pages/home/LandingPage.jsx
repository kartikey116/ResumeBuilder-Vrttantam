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
          <circle cx="36" cy="36" r="28" fill="none" stroke="#f1f5f9" strokeWidth="6" />
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
      <div style={{ border: step > 0 ? "2px solid #16a34a" : "2px dashed #e2e8f0", background: step > 0 ? "#f0fdf4" : "transparent", borderRadius: 10, padding: "16px 12px", textAlign: "center", marginBottom: 12, transition: "all 0.4s ease" }}>
        <div style={{ fontSize: 22, marginBottom: 4, transform: step > 0 ? "scale(1.1)" : "scale(1)", transition: "transform 0.3s" }}>📄</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: step > 0 ? "#14532d" : "#334155" }}>resume_2024.pdf</div>
        <div style={{ fontSize: 10, color: step > 0 ? "#16a34a" : "#94a3b8", marginTop: 2 }}>{step > 0 ? "Analyzed successfully" : "Drop your resume here"}</div>
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Extracted sections</div>
      {items.map(([label, count], i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, marginBottom: 7, opacity: step > i ? 1 : 0, transform: step > i ? 'translateX(0)' : 'translateX(-10px)', transition: "all 0.3s ease" }}>
          <span style={{ color: "#16a34a", fontSize: 13 }}>✓</span>
          <span style={{ color: "#334155", fontWeight: 600 }}>{label}</span>
          <span style={{ marginLeft: "auto", color: "#94a3b8", fontSize: 10 }}>{count}</span>
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
      <div style={{ marginTop: 12, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 10px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14 }}>🔒</span>
        <span style={{ fontSize: 10, color: "#64748b", lineHeight: 1.4 }}>Zero personal information leaves your account</span>
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
        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "8px 10px", fontSize: 10, color: "#14532d", lineHeight: 1.5 }}>
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
      <div style={{ maxHeight: open ? 200 : 0, overflow: "hidden", transition: "max-height .35s ease" }}>
        <p style={{ padding: "0 20px 16px", fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{a}</p>
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

        html, body {
          font-family: var(--sans);
          background: var(--bg);
          color: var(--fg);
          overflow-x: hidden;
        }

        @keyframes float-particle {
          from { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          to   { transform: translate(-50%, -50%) scale(1.3) translate(20px, -15px); opacity: 1; }
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
          background: transparent; color: var(--fg);
          padding: 12px 24px; border-radius: 50px;
          font-family: var(--sans); font-size: 14px; font-weight: 600;
          border: 1.5px solid var(--border); cursor: pointer;
          transition: border-color .2s, color .2s;
        }
        .lp-btn-ghost:hover { border-color: var(--pu); color: var(--pu); }

        /* NAV */
        .lp-nav {
          position: sticky; top: 0; z-index: 50;
          backdrop-filter: blur(14px);
          background: rgba(250,250,249,0.82);
          border-bottom: 1px solid var(--border);
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
        .lp-logo-deva { font-size: .75rem; color: var(--fg3); font-family: var(--sans); font-weight: 500; letter-spacing: .04em; margin-left: 6px; }

        /* HERO */
        .lp-hero {
          position: relative; overflow: hidden; min-height: 68vh;
          display: flex; align-items: center; justify-content: center;
        }
        .lp-hero-canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
        .lp-hero-inner { position: relative; z-index: 2; text-align: center; max-width: 780px; padding: 4rem 24px 5rem; }
        .lp-hero-eyebrow {
          display: inline-flex; align-items: center; gap: 8px; background: var(--pu-l); border: 1px solid #ddd6fe;
          color: var(--pu); font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 20px;
          letter-spacing: .06em; text-transform: uppercase; margin-bottom: 1.5rem; animation: fadeUp .5s ease forwards;
        }
        .lp-hero-h1 { font-family: var(--serif); font-size: clamp(2.8rem, 6vw, 4.5rem); font-weight: 400; line-height: 1.12; color: var(--fg); margin-bottom: 1.5rem; animation: fadeUp .6s .1s ease both; }
        .lp-hero-sub { font-size: 16px; color: var(--fg2); line-height: 1.75; max-width: 560px; margin: 0 auto 2.5rem; min-height: 3.5rem; animation: fadeUp .6s .2s ease both; }
        .lp-hero-actions { display: flex; align-items: center; justify-content: center; gap: 12px; flex-wrap: wrap; animation: fadeUp .6s .3s ease both; }
        .lp-cursor { display: inline-block; width: 2px; height: 1em; background: var(--pu); margin-left: 2px; vertical-align: middle; animation: blink 1s step-end infinite; }

        /* STATS */
        .lp-stats { max-width: 1140px; margin: 0 auto; padding: 5rem 24px; }
        .lp-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        @media (max-width: 600px) { .lp-stats-grid { grid-template-columns: 1fr; } }
        .lp-stat { text-align: center; padding: 3rem 2rem; border-right: 1px solid var(--border); }
        .lp-stat:last-child { border-right: none; }
        .lp-stat-num { font-family: var(--serif); font-size: 3.5rem; line-height: 1; margin-bottom: .5rem; }
        .lp-stat-label { font-size: 13px; color: var(--fg2); font-weight: 500; }

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
          background: var(--border);
          cursor: pointer;
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          width: 24px;
        }
        .lp-progress-pill.active {
          background: linear-gradient(90deg, var(--pu), var(--pk));
          width: 48px;
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
        .lp-feat-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--pu); margin-bottom: .75rem; }
        .lp-feat-tag::before { content: ''; width: 18px; height: 1.5px; background: linear-gradient(90deg, var(--pu), var(--pk)); display: block; border-radius: 2px; }
        .lp-feat-h2 { font-family: var(--serif); font-size: clamp(1.7rem, 3vw, 2.4rem); font-weight: 400; line-height: 1.2; color: var(--fg); margin-bottom: 1rem; }
        .lp-feat-body { font-size: 15px; color: var(--fg2); line-height: 1.8; margin-bottom: 1.5rem; }
        .lp-perk-list { display: flex; flex-direction: column; gap: 8px; }
        .lp-perk { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: var(--fg); }
        .lp-perk-dot { width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, var(--pu), var(--pk)); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 9px; }

        /* Mock card */
        .lp-mock {
          width: 100%; max-width: 360px; background: var(--card); border: 1px solid var(--border); border-radius: 18px;
          padding: 24px; box-shadow: 0 12px 48px rgba(124,58,237,0.1), 0 2px 8px rgba(0,0,0,0.04);
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
        .lp-why { background: linear-gradient(170deg, var(--pu-l) 0%, var(--pk-l) 100%); position: relative; overflow: hidden; }
        .lp-why-inner { max-width: 1140px; margin: 0 auto; padding: 6rem 24px; position: relative; z-index: 1; }
        .lp-why-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 3rem; }
        @media (max-width: 600px) { .lp-why-grid { grid-template-columns: 1fr; } }
        .lp-why-card { background: #fff; border-radius: 16px; padding: 28px; border: 1px solid rgba(124,58,237,.12); transition: box-shadow 0.2s, transform 0.2s; }
        .lp-why-card:hover { box-shadow: 0 8px 32px rgba(124,58,237,0.1); transform: translateY(-2px); }
        .lp-why-icon { font-size: 20px; color: var(--pu); margin-bottom: 14px; display: block; }
        .lp-why-name { font-size: 15px; font-weight: 700; color: var(--fg); margin-bottom: 8px; }
        .lp-why-body { font-size: 13px; color: var(--fg2); line-height: 1.7; }

        /* FAQ */
        .lp-faq { max-width: 760px; margin: 0 auto; padding: 6rem 24px; }
        .lp-faq-list { display: flex; flex-direction: column; gap: 8px; margin-top: 2.5rem; }

        /* CTA */
        .lp-cta { max-width: 1140px; margin: 0 auto; padding: 0 24px 6rem; }
        .lp-cta-inner {
          background: linear-gradient(135deg, var(--pu) 0%, #4f46e5 40%, var(--pk) 100%);
          border-radius: 24px; padding: 5rem 3rem; text-align: center; color: #fff; position: relative; overflow: hidden;
        }
        .lp-cta-inner::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .lp-cta-h2 { font-family: var(--serif); font-size: clamp(2rem, 4vw, 3rem); font-weight: 400; margin-bottom: 1rem; position: relative; }
        .lp-cta-body { font-size: 16px; opacity: .85; line-height: 1.7; margin-bottom: 2.5rem; position: relative; }
        .lp-btn-white {
          display: inline-flex; align-items: center; gap: 8px; background: #fff; color: var(--pu); padding: 14px 32px; border-radius: 50px;
          font-family: var(--sans); font-size: 15px; font-weight: 700; border: none; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,.15); transition: transform .2s, box-shadow .2s; position: relative;
        }
        .lp-btn-white:hover { transform: scale(1.04); box-shadow: 0 8px 32px rgba(0,0,0,.2); }

        /* Footer */
        .lp-footer { background: #0f172a; color: #94a3b8; }
        .lp-footer-inner { max-width: 1140px; margin: 0 auto; padding: 4rem 24px 2rem; }
        .lp-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
        @media (max-width: 700px) { .lp-footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; } }
        .lp-footer-logo { font-family: var(--script); font-size: 1.75rem; background: linear-gradient(135deg, #c084fc, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: .5rem; display: block; }
        .lp-footer-desc { font-size: 13px; line-height: 1.7; }
        .lp-footer-col h4 { font-size: 12px; font-weight: 700; color: #e2e8f0; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 1rem; }
        .lp-footer-col a { display: block; font-size: 13px; color: #64748b; text-decoration: none; margin-bottom: .5rem; transition: color .15s; }
        .lp-footer-col a:hover { color: #c084fc; }
        .lp-footer-copy { border-top: 1px solid #1e293b; padding-top: 1.5rem; font-size: 12px; text-align: center; color: #475569; }

        /* Section header */
        .lp-sec-header { text-align: center; margin-bottom: 1rem; }
        .lp-sec-eyebrow { display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--pu); margin-bottom: .75rem; }
        .lp-sec-h2 { font-family: var(--serif); font-size: clamp(1.8rem, 3.5vw, 2.75rem); font-weight: 400; color: var(--fg); line-height: 1.2; }
        .lp-sec-sub { font-size: 15px; color: var(--fg2); line-height: 1.7; max-width: 520px; margin: .75rem auto 0; }

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
          border: 1.5px solid var(--border);
          background: var(--card);
          color: var(--fg2);
          font-size: 16px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .lp-carousel-arrow:hover {
          border-color: var(--pu);
          color: var(--pu);
          transform: scale(1.08);
        }
        .lp-carousel-arrow:disabled {
          opacity: 0.3;
          cursor: default;
          transform: none;
        }
      `}</style>

      <ScrollReveal />

      {/* NAV */}
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

      {/* HERO */}
      <section className="lp-hero">
        <canvas ref={canvasRef} className="lp-hero-canvas" />
        <div className="lp-hero-inner">
          <div className="lp-hero-eyebrow">✦ AI-powered resume builder</div>
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

      {/* ── CAROUSEL SECTION ── */}
      <div
        id="lp-features"
        ref={carouselSectionRef}
        className="lp-carousel-section"
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

      {/* STATS */}
      <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "#fff" }}>
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

      {/* WHY US */}
      <div className="lp-why">
        <FloatingParticles />
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

      {/* FAQ */}
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

      {/* CTA */}
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

      {/* FOOTER */}
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