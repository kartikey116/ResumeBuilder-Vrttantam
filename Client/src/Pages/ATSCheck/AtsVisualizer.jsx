import React, { useState, useContext, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  Area, AreaChart, RadarChart, PolarGrid,
  PolarAngleAxis, Radar
} from 'recharts';
import {
  FiArrowLeft, FiFileText, FiDownload, FiX,
  FiTarget, FiZap, FiTrendingUp, FiAlertCircle,
  FiCheckCircle, FiInfo, FiUpload, FiEye
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../utils/axiosinstance.js';
import { toast } from 'react-hot-toast';
import { UserContext } from '../../context/userContext.jsx';

/* ─── Template Options ──────────────────────────────────────────────── */
const TEMPLATE_OPTIONS = [
  { id: '01', name: 'Classic', color: '#4f46e5', palette: ['#4f46e5', '#818cf8', '#e0e7ff'] },
  { id: '02', name: 'Modern', color: '#0891b2', palette: ['#0891b2', '#22d3ee', '#cffafe'] },
  { id: '03', name: 'Elegant', color: '#7c3aed', palette: ['#7c3aed', '#a78bfa', '#ede9fe'] },
  { id: '04', name: 'Bold', color: '#dc2626', palette: ['#dc2626', '#f87171', '#fee2e2'] },
  { id: '05', name: 'Minimal', color: '#374151', palette: ['#374151', '#6b7280', '#f3f4f6'] },
  { id: '06', name: 'Fresh', color: '#059669', palette: ['#059669', '#34d399', '#d1fae5'] },
  { id: '07', name: 'Sunset', color: '#d97706', palette: ['#d97706', '#fbbf24', '#fef3c7'] },
  { id: '08', name: 'Executive', color: '#1e3a5f', palette: ['#1e3a5f', '#2563eb', '#dbeafe'] },
];

/* ─── Helpers ────────────────────────────────────────────────────────── */
const scoreColor = (n) => {
  if (n >= 75) return { text: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', label: 'Strong Match' };
  if (n >= 50) return { text: '#b45309', bg: '#fffbeb', border: '#fde68a', label: 'Moderate Match' };
  return { text: '#dc2626', bg: '#fef2f2', border: '#fecaca', label: 'Weak Match' };
};

const attnColor = (n) => {
  if (n >= 70) return '#dc2626';
  if (n >= 45) return '#d97706';
  return '#16a34a';
};

const dimColor = (n) => {
  if (n >= 70) return '#16a34a';
  if (n >= 50) return '#d97706';
  return '#dc2626';
};

/* ─── Sub-components ─────────────────────────────────────────────────── */
const ScoreRing = ({ score }) => {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(score, 100) / 100);
  const c = scoreColor(score);
  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#f1f5f9" strokeWidth="10" />
        <circle
          cx="64" cy="64" r={r} fill="none"
          stroke={c.text} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black" style={{ color: c.text, fontFamily: "'DM Serif Display', serif" }}>
          {score}
        </span>
        <span className="text-xs text-slate-400 font-semibold tracking-wide">/ 100</span>
      </div>
    </div>
  );
};

const AnimBar = ({ pct, color, delay = 0 }) => (
  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
    <motion.div
      className="h-full rounded-full"
      style={{ background: color }}
      initial={{ width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: 1.1, delay, ease: [0.4, 0, 0.2, 1] }}
    />
  </div>
);

const Chip = ({ label, variant = 'miss' }) => {
  const styles = {
    miss: 'bg-red-50 text-red-700 border-red-200',
    hot: 'bg-green-50 text-green-700 border-green-200',
    cold: 'bg-amber-50 text-amber-700 border-amber-200',
    dim: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]}`}>
      {label}
    </span>
  );
};

/* Tooltip for the area chart */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value ?? 0;
  return (
    <div className="bg-[#0f172a] text-white text-xs rounded-xl px-3 py-2 shadow-2xl border border-white/10">
      <p className="font-bold mb-0.5">{label}</p>
      <p style={{ color: attnColor(val) }}>Attention: {val}%</p>
      <p className="text-slate-400 mt-0.5 text-[10px]">
        {val >= 70 ? 'Needs most work' : val >= 45 ? 'Moderate focus' : 'Well-handled'}
      </p>
    </div>
  );
};

/* ─── Guide Banner ───────────────────────────────────────────────────── */
const GuideBanner = () => (
  <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50 p-5">
    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
      <FiInfo size={12} /> How to read this report
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
      {[
        { dot: '#dc2626', range: '0–49', name: 'Low', desc: 'Major gaps — likely filtered automatically by ATS.' },
        { dot: '#d97706', range: '50–74', name: 'Moderate', desc: 'Partial match. May pass ATS but won\'t stand out.' },
        { dot: '#16a34a', range: '75–100', name: 'Strong', desc: 'Good alignment. Focus on quantified impact now.' },
      ].map(({ dot, range, name, desc }) => (
        <div key={range} className="flex items-start gap-2.5">
          <span className="mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: dot }} />
          <div>
            <span className="font-bold text-slate-800">{range} — {name}</span>
            <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
          </div>
        </div>
      ))}
    </div>
    <p className="mt-3 text-xs text-slate-400 border-t border-slate-200 pt-3">
      <strong className="text-slate-500">Honest scoring:</strong> Most resumes score 40–65. A high ATS score means keyword compatibility — not a guaranteed interview.
    </p>
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────────── */
const AtsVisualizer = () => {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('resumeId');
  const navigate = useNavigate();
  const { user } = useContext(UserContext) || {};

  // View state: 'INPUT' | 'LOADING' | 'RESULTS'
  const [appView, setAppView] = useState('INPUT');
  const [loadingProgress, setLoadingProgress] = useState(0);

  const [jobDesc, setJobDesc] = useState('');
  const [file, setFile] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [parsedFileData, setParsedFileData] = useState(null);
  const [importing, setImporting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('01');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const loadingSteps = [
    "Extracting text from PDF...",
    "Formatting data structure...",
    "Analyzing keywords and structure...",
    "Comparing against job description...",
    "Calculating ATS score...",
    "Generating insights and improvements...",
    "Finalizing report..."
  ];

  // Derive the active step strictly from the progress percentage
  let currentStepIndex = 0;
  if (loadingProgress === 100) currentStepIndex = 7; // All Done
  else if (loadingProgress >= 95) currentStepIndex = 6;
  else if (loadingProgress >= 80) currentStepIndex = 5;
  else if (loadingProgress >= 60) currentStepIndex = 4;
  else if (loadingProgress >= 40) currentStepIndex = 3;
  else if (loadingProgress >= 25) currentStepIndex = 2;
  else if (loadingProgress >= 10) currentStepIndex = 1;

  React.useEffect(() => {
    let progressInterval;

    if (appView === 'LOADING') {
      // Simulate an AI progress bar creeping up with an exponential slow-down
      progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 98) return prev; // Stall at 98% until API is actually finished

          // Fast at first (parsing), then slower for analysis and insights
          const increment = prev < 25 ? 3 : prev < 60 ? 1.5 : prev < 85 ? 0.8 : 0.2;
          return prev + increment;
        });
      }, 250); // Tick every 250ms for smooth animation
    }

    return () => clearInterval(progressInterval);
  }, [appView]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === 'application/pdf') setFile(f);
    else toast.error('Please drop a PDF file');
  };

  const handleAnalyze = async () => {
    if (!resumeId && !file) return toast.error('No resume selected. Upload a PDF or go to Dashboard.');
    if (!jobDesc.trim()) return toast.error('Please paste a Job Description.');

    // Start loading sequence
    setAppView('LOADING');
    setLoadingProgress(0);
    setParsedFileData(null);

    try {
      let targetResumeData = null;
      if (file) {
        const fd = new FormData();
        fd.append('resumePdf', file);

        const r = await axiosInstance.post('/api/ai/parse-resume', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        targetResumeData = r.data.parsed;
        setParsedFileData(targetResumeData);

        // Jump progress forward when PDF parsing is successfully done
        setLoadingProgress((prev) => Math.max(prev, 25));
      }

      const res = await axiosInstance.post('/api/ai/ats-score', {
        resumeId: !file ? resumeId : undefined,
        resumeDataJson: targetResumeData,
        jobDescription: jobDesc,
      });

      setAiData(res.data.analysis);

      // API is finished! Snap progress to 100%, checking off all remaining steps instantly
      setLoadingProgress(100);

      // Give it 600ms so the user sees all the green ticks check off before the screen swaps
      setTimeout(() => {
        setAppView('RESULTS');
        toast.success('Analysis complete!', { id: 'ats-success' });
      }, 600);

    } catch (err) {
      console.error(err);
      toast.error('Analysis failed. Check your Gemini API key.', { id: 'ats-err' });
      setAppView('INPUT');
    }
  };

  const handleImport = async () => {
    if (!user) { navigate('/login'); return; }
    if (!file) return;
    setImporting(true);
    setShowImportModal(false);
    try {
      const tmpl = TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate);
      const fd = new FormData();
      fd.append('resumePdf', file);
      fd.append('templateTheme', selectedTemplate);
      fd.append('colorPalette', JSON.stringify(tmpl?.palette || []));
      fd.append('fontFamily', 'Inter, sans-serif');
      toast.loading('Importing to Dashboard…', { id: 'imp' });
      const res = await axiosInstance.post('/api/ai/import-resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Imported! Redirecting…', { id: 'imp' });
      navigate(`/resume/${res.data.resumeId}`);
    } catch {
      toast.error('Import failed. Please try again.', { id: 'imp' });
    } finally {
      setImporting(false);
    }
  };

  const score = aiData?.score ?? 0;
  const sc = scoreColor(score);
  const timeline = aiData?.timeline || [];
  const dimensions = aiData?.dimensions || [];
  const hotspots = aiData?.hotspots || [];
  const coldspots = aiData?.coldspots || [];
  const avgAttn = timeline.length
    ? Math.round(timeline.reduce((s, d) => s + d.attention, 0) / timeline.length)
    : 0;

  /* Radar data from dimensions */
  const radarData = dimensions.map(d => ({ subject: d.name.split(' ')[0], A: d.score, fullMark: 100 }));

  return (
    <>
      {/* ── Google Font ── */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap');`}</style>

      <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">

        {/* ── Top Nav ── */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              <FiArrowLeft size={15} /> Back to Dashboard
            </button>
            <span className="text-sm font-bold text-slate-700">ATS Resume Scanner</span>
            <div className="w-24" />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">

          {/* ═════════ INPUT VIEW ═════════ */}
          {appView === 'INPUT' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* ── Hero ── */}
              <div className="text-center space-y-3 mb-8">
                <h1
                  className="text-4xl md:text-5xl font-black text-slate-900 leading-tight"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  Is your resume{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-500">
                    ATS-ready?
                  </span>
                </h1>
                <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
                  75% of resumes are filtered out before a human reads them. Get a detailed breakdown — score, missing keywords, weak phrases, and exactly what to fix.
                </p>
              </div>

              {/* ── Guide ── */}
              <div className="mb-8">
                <GuideBanner />
              </div>

              {/* ── Input Card ── */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Drop Zone */}
                  <div
                    className={`p-6 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col gap-3 transition-colors ${dragOver ? 'bg-violet-50' : 'bg-slate-50/40'
                      }`}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={e => setFile(e.target.files[0])}
                    />
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <FiUpload size={12} /> Resume PDF
                    </label>
                    <div className={`flex-1 flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${file ? 'border-violet-400 bg-violet-50/60' : 'border-slate-200 hover:border-slate-300'
                      }`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${file ? 'bg-violet-100' : 'bg-slate-100'
                        }`}>
                        <FiFileText size={22} className={file ? 'text-violet-600' : 'text-slate-400'} />
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-bold ${file ? 'text-violet-700' : 'text-slate-600'}`}>
                          {file ? file.name : 'Drop your PDF here'}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {file ? 'Click to swap file' : 'or click to browse'}
                        </p>
                      </div>
                      {!file && resumeId && (
                        <div className="mt-1 flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
                          <FiCheckCircle size={12} /> Dashboard resume loaded
                        </div>
                      )}
                    </div>
                  </div>

                  {/* JD Textarea */}
                  <div className="p-6 flex flex-col gap-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <FiTarget size={12} /> Target Job Description
                    </label>
                    <textarea
                      className="flex-1 min-h-[160px] w-full border border-slate-200 rounded-xl p-4 text-sm text-slate-700 bg-slate-50/40 focus:ring-2 focus:ring-violet-400 focus:outline-none resize-none placeholder:text-slate-300 leading-relaxed"
                      placeholder="Paste the full job description here…&#10;&#10;The more detail you include, the more accurate your score will be."
                      value={jobDesc}
                      onChange={e => setJobDesc(e.target.value)}
                    />
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <span className={`w-2 h-2 rounded-full ${(file || resumeId) && jobDesc.trim() ? 'bg-emerald-400' : 'bg-slate-300'
                      }`} />
                    {file ? `PDF ready · ${(file.size / 1024).toFixed(0)} KB`
                      : resumeId ? 'Dashboard resume loaded'
                        : 'No resume selected'}
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={!jobDesc.trim() || (!resumeId && !file)}
                    className="flex items-center gap-2 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-pink-500 hover:from-violet-700 hover:to-pink-600 px-8 py-3 rounded-xl shadow-md shadow-violet-200 disabled:opacity-40 disabled:shadow-none transition-all"
                  >
                    <FiZap size={16} /> Analyse Resume
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═════════ LOADING VIEW ═════════ */}
          {appView === 'LOADING' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="min-h-[50vh] flex flex-col items-center justify-center pt-10"
            >
              <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 w-full max-w-lg mx-auto text-center">
                <h2 className="text-2xl font-black text-slate-800 mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Analyzing your resume...
                </h2>

                {/* Progress Bar */}
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-6 relative">
                  <motion.div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${loadingProgress}%` }}
                    transition={{ ease: "linear", duration: 0.2 }}
                  />
                </div>

                {/* Sequential Checklist */}
                <div className="space-y-3 text-left w-max mx-auto pl-4">
                  {loadingSteps.map((step, index) => {
                    const isDone = currentStepIndex > index;
                    const isActive = currentStepIndex === index;
                    const isPending = currentStepIndex < index;

                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-3 transition-opacity duration-300 ${isPending ? 'opacity-30' : 'opacity-100'}`}
                      >
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                          {isDone && <FiCheckCircle className="text-green-500 text-lg" />}
                          {isActive && (
                            <svg className="animate-spin h-4 w-4 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          )}
                          {isPending && <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                        </div>
                        <span className={`text-sm font-medium transition-colors duration-300 ${isActive ? 'text-slate-800' : isDone ? 'text-slate-500' : 'text-slate-400'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═════════ RESULTS VIEW ═════════ */}
          <AnimatePresence>
            {appView === 'RESULTS' && aiData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: .4 }}
                className="space-y-6"
              >

                {/* ── Action Bar for Results ── */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => { setAppView('INPUT'); setAiData(null); }}
                      className="text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <FiArrowLeft size={14} /> Scan Another Resume
                    </button>
                  </div>

                  {file && (
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="flex items-center gap-2 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-5 py-2 rounded-xl transition-colors"
                    >
                      <FiDownload size={15} />
                      Import to Dashboard
                    </button>
                  )}
                </div>

                {/* ── Row 1: Score + Quick Stats ── */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Overall score', val: `${score}%`, color: sc.text, icon: <FiTrendingUp size={16} /> },
                    { label: 'Missing keywords', val: aiData?.missingKeywords?.length ?? '—', color: '#dc2626', icon: <FiAlertCircle size={16} /> },
                    { label: 'Strong sections', val: hotspots.length || '—', color: '#16a34a', icon: <FiCheckCircle size={16} /> },
                    { label: 'Avg attention score', val: `${avgAttn}%`, color: '#d97706', icon: <FiEye size={16} /> },
                  ].map(({ label, val, color, icon }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-2" style={{ color }}>
                        {icon} <span>{label}</span>
                      </div>
                      <p className="text-2xl font-black" style={{ color, fontFamily: "'DM Serif Display', serif" }}>{val}</p>
                    </div>
                  ))}
                </div>

                {/* ── Row 2: Ring + Experience + Dimensions ── */}
                <div className="grid md:grid-cols-3 gap-4">

                  {/* Score Ring */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col items-center gap-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Match score</p>
                    <ScoreRing score={score} />
                    <span
                      className="text-sm font-bold px-4 py-1.5 rounded-full border"
                      style={{ color: sc.text, background: sc.bg, borderColor: sc.border }}
                    >
                      {sc.label}
                    </span>
                    <p className="text-xs text-slate-400 text-center leading-relaxed">
                      Honest ATS scoring — most resumes land 40–65%.
                    </p>
                  </div>

                  {/* Experience match */}
                  <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Experience match analysis</p>
                    <p className="text-sm text-slate-600 leading-relaxed flex-1">
                      {aiData?.experienceMatch || '—'}
                    </p>
                    {/* Dimension bars */}
                    <div className="space-y-3 mt-2">
                      {dimensions.map((d, i) => (
                        <div key={d.name}>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-slate-600">{d.name}</span>
                            <span style={{ color: dimColor(d.score) }}>{d.score}%</span>
                          </div>
                          <AnimBar pct={d.score} color={dimColor(d.score)} delay={i * 0.08} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Row 3: Timeline Chart ── */}
                <div className="bg-[#0f172a] rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
                  <div className="px-6 pt-6 pb-2 flex flex-wrap justify-between items-start gap-3">
                    <div>
                      <h3 className="text-white font-bold text-base">Section-by-section attention map</h3>
                      <p className="text-slate-400 text-xs mt-1">
                        Bar height = how much attention / improvement each section needs.
                        <span className="text-red-400 font-semibold"> Red = act first.</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      {[['#dc2626', 'Needs work'], ['#d97706', 'Moderate'], ['#16a34a', 'Good']].map(([c, l]) => (
                        <span key={l} className="flex items-center gap-1.5 text-slate-400">
                          <span className="w-2 h-2 rounded-full" style={{ background: c }} /> {l}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Area Chart */}
                  <div className="h-52 px-4 pb-2">
                    {timeline.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={timeline} margin={{ top: 10, left: -20, right: 10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                              <stop offset="0%" stopColor="#f43f5e" />
                              <stop offset="50%" stopColor="#a855f7" />
                              <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" hide />
                          <YAxis hide domain={[0, 100]} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area
                            type="monotone" dataKey="attention"
                            stroke="url(#lineStroke)" strokeWidth={3}
                            fillOpacity={1} fill="url(#areaFill)"
                            activeDot={{ r: 6, fill: '#fff', stroke: '#a855f7', strokeWidth: 2 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Timeline bar grid */}
                  <div className="px-6 pb-6 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mt-2">
                    {timeline.map((item) => (
                      <div key={item.name} className="flex flex-col items-center gap-1.5">
                        <div className="w-full h-1.5 rounded-full bg-slate-700 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: attnColor(item.attention) }}
                            initial={{ width: 0 }}
                            animate={{ width: `${item.attention}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                        <p className="text-[9px] text-slate-500 text-center leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[10px] font-bold" style={{ color: attnColor(item.attention) }}>
                          {item.attention}%
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Row 4: Radar + Keywords + Coldspots ── */}
                <div className="grid md:grid-cols-3 gap-4">

                  {/* Radar chart */}
                  {radarData.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Score radar</p>
                      <ResponsiveContainer width="100%" height={200}>
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="#e2e8f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} />
                          <Radar
                            name="Score" dataKey="A" stroke="#7c3aed"
                            fill="#7c3aed" fillOpacity={0.18} strokeWidth={2}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Missing keywords */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <FiAlertCircle size={11} className="text-red-500" /> Add these keywords
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(aiData?.missingKeywords || []).map((kw) => (
                        <Chip key={kw} label={kw} variant="miss" />
                      ))}
                      {!aiData?.missingKeywords?.length && (
                        <p className="text-xs text-green-600 font-semibold">Perfect keyword match!</p>
                      )}
                    </div>
                  </div>

                  {/* Coldspots */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <FiAlertCircle size={11} className="text-amber-500" /> Weak phrases to rewrite
                    </p>
                    <div className="space-y-3">
                      {coldspots.map((spot, i) => (
                        <div key={i} className="flex gap-2.5">
                          <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </span>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <span className="font-semibold text-slate-800">Rewrite:</span> "{spot}"
                          </p>
                        </div>
                      ))}
                      {!coldspots.length && (
                        <p className="text-xs text-green-600 font-semibold">Your phrasing looks solid!</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Row 5: Hotspots + Feedback ── */}
                <div className="grid md:grid-cols-2 gap-4">

                  {/* Hotspots */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                      <FiCheckCircle size={11} className="text-green-500" /> Strongest sections
                    </p>
                    <div className="space-y-4">
                      {hotspots.map((h, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs font-semibold mb-1.5">
                            <span className="text-slate-700 truncate pr-2" title={h.text}>{h.text}</span>
                            <span style={{ color: dimColor(h.score) }}>{h.score}%</span>
                          </div>
                          <AnimBar pct={h.score} color={dimColor(h.score)} delay={i * 0.1} />
                        </div>
                      ))}
                      {!hotspots.length && (
                        <p className="text-xs text-slate-400">No strong sections detected.</p>
                      )}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                      <FiTrendingUp size={11} className="text-violet-500" /> Actionable improvements
                    </p>
                    <div className="space-y-3">
                      {(aiData?.feedback || []).map((fb, i) => (
                        <div key={i} className="flex gap-3">
                          <span className="mt-0.5 w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                            {i + 1}
                          </span>
                          <p className="text-xs text-slate-600 leading-relaxed">{fb}</p>
                        </div>
                      ))}
                      {!aiData?.feedback?.length && (
                        <p className="text-xs text-slate-400">No suggestions generated.</p>
                      )}
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* ── Import Modal ── */}
      <AnimatePresence>
        {showImportModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowImportModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-colors"
              >
                <FiX size={16} />
              </button>

              <h2 className="text-2xl font-black text-slate-900 mb-1" style={{ fontFamily: "'DM Serif Display', serif" }}>
                Choose a template
              </h2>
              <p className="text-slate-500 text-sm mb-6">
                Pick a design for <strong className="text-slate-700">"{file?.name}"</strong>. Easily changed later in the editor.
              </p>

              <div className="grid grid-cols-4 gap-3 mb-7">
                {TEMPLATE_OPTIONS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all ${selectedTemplate === t.id
                      ? 'border-violet-500 bg-violet-50 shadow-lg shadow-violet-100'
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                      }`}
                  >
                    <div
                      className="w-full h-10 rounded-lg overflow-hidden p-1.5 flex flex-col gap-1"
                      style={{ background: t.palette[2] }}
                    >
                      <div className="h-2 rounded-sm" style={{ background: t.color, width: '70%' }} />
                      <div className="h-1 rounded-sm bg-white/60" style={{ width: '50%' }} />
                      <div className="h-1 rounded-sm bg-white/40" style={{ width: '40%' }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">{t.name}</span>
                    {selectedTemplate === t.id && (
                      <span className="text-[9px] font-black uppercase text-violet-600 tracking-wide">✓ Selected</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 py-3 text-sm font-semibold text-slate-600 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="flex-1 py-3 text-sm font-bold text-white rounded-2xl bg-gradient-to-r from-violet-600 to-pink-500 shadow-lg disabled:opacity-50 transition-all"
                >
                  {importing ? '⏳ Importing…' : '✨ Import with this template'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AtsVisualizer;