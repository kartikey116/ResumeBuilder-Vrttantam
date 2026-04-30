import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import DashboardLayout from '../../components/layouts/DashboardLayout.jsx';
import { LuCirclePlus } from 'react-icons/lu';
import { FiActivity, FiFileText, FiTarget, FiUsers, FiX, FiZap } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import Modal from '../../components/ui/Modal.jsx';
import ResumeSummaryCard from '../../components/Cards/ResumeSummaryCard.jsx';
import CreateResumeForm from '../../components/forms/CreateResumeForm.jsx';
import toast from 'react-hot-toast';
import DashboardSkeleton from './DashboardSkeleton.jsx';

function Dashboard() {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allresumes, setAllResumes] = useState([]);
  const [publishModal, setPublishModal] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [publishName, setPublishName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllResumes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.RESUMES.GET_USER_RESUMES);
      setAllResumes(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAllResumes(); }, []);

  const handlePublishTemplate = async () => {
    if (!publishModal) return;
    setPublishing(true);
    try {
      const res = await axiosInstance.post('/api/ai/anonymize-publish', {
        resumeId: publishModal.resumeId,
        creatorName: publishName || 'Anonymous',
      });
      const jobId = res.data.jobId;
      await new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
          try {
            const statusRes = await axiosInstance.get(`/api/ai/status/${jobId}`);
            if (statusRes.data.status === 'completed') { clearInterval(interval); resolve(); }
            else if (statusRes.data.status === 'failed') { clearInterval(interval); reject(new Error('Publish Failed')); }
          } catch (e) { clearInterval(interval); reject(e); }
        }, 3000);
      });
      toast.success('🎉 Template published to Community Gallery!');
      setPublishModal(null);
      setPublishName('');
    } catch (error) {
      toast.error('Failed to publish. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  if (isLoading) return <DashboardLayout><DashboardSkeleton /></DashboardLayout>;

  const totalResumes = allresumes.length;
  const scoredResumes = allresumes.filter(r => r.atsScore > 0);
  const avgAtsScore = scoredResumes.length > 0
    ? Math.round(scoredResumes.reduce((sum, r) => sum + r.atsScore, 0) / scoredResumes.length)
    : 0;

  return (
    <DashboardLayout>

      {/* ── Hero Stats Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          marginBottom: 28,
          padding: '28px 32px',
          borderRadius: 24,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.10)',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between',
          gap: 20, overflow: 'hidden', position: 'relative',
        }}
      >
        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #7c3aed, #4f46e5, #db2777)' }} />
        {/* Ambient glow orb */}
        <div style={{ position: 'absolute', top: '-50%', right: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Title */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 800, color: '#fff', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Career Hub
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.40)', fontSize: 13, margin: 0, maxWidth: 360 }}>
            Manage resumes, run ATS scans, and publish to the Community Gallery.
          </p>
        </div>

        {/* Stat chips */}
        <div style={{ display: 'flex', gap: 12, position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
          {[
            { icon: <FiFileText size={18} color="#818cf8" />, value: totalResumes, label: 'Resumes', color: '#818cf8', glow: 'rgba(99,102,241,0.20)' },
            {
              icon: <FiActivity size={18} color={avgAtsScore >= 75 ? '#4ade80' : '#fbbf24'} />,
              value: `${avgAtsScore}%`, label: 'Avg Score',
              color: avgAtsScore >= 75 ? '#4ade80' : '#fbbf24',
              glow: avgAtsScore >= 75 ? 'rgba(74,222,128,0.15)' : 'rgba(251,191,36,0.15)',
            },
          ].map(({ icon, value, label, color, glow }) => (
            <div key={label} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: 16, padding: '14px 20px', minWidth: 100,
              backdropFilter: 'blur(10px)',
              boxShadow: `0 0 20px ${glow}`,
            }}>
              {icon}
              <span style={{ fontSize: 22, fontWeight: 800, color: color, marginTop: 4 }}>{value}</span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginTop: 2 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1, minWidth: 180 }}>
          <button
            onClick={() => navigate('/ats-check')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '12px 20px', borderRadius: 14, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#fff', fontWeight: 700, fontSize: 13,
              boxShadow: '0 4px 20px rgba(79,70,229,0.35)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(79,70,229,0.50)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,70,229,0.35)'; }}
          >
            <FiTarget size={15} /> Global ATS Scan
          </button>
          <button
            onClick={() => navigate('/community')}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '12px 20px', borderRadius: 14, cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.80)', fontWeight: 700, fontSize: 13,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
          >
            <FiUsers size={15} /> Community Gallery
          </button>
        </div>
      </motion.div>

      {/* ── Resume Grid ── */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-12"
      >
        {/* Create Card */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          onClick={() => setOpenCreateModal(true)}
          style={{
            minHeight: 300, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 14,
            background: 'rgba(124,58,237,0.04)',
            border: '2px dashed rgba(124,58,237,0.25)',
            borderRadius: 20, cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative', overflow: 'hidden',
          }}
          whileHover={{
            borderColor: 'rgba(124,58,237,0.55)',
            background: 'rgba(124,58,237,0.08)',
            boxShadow: '0 0 40px rgba(124,58,237,0.12)',
            y: -4,
          }}
        >
          {/* Subtle inner glow */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 120, height: 120, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.10) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{
            width: 56, height: 56,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.30)',
            borderRadius: 16,
            boxShadow: '0 0 20px rgba(124,58,237,0.20)',
            transition: 'all 0.3s',
          }}>
            <LuCirclePlus size={24} color="#a855f7" />
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.80)', margin: '0 0 4px 0' }}>
              Create New Resume
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.30)', margin: 0 }}>
              Start from scratch
            </p>
          </div>
        </motion.div>

        {/* Resume Cards */}
        {allresumes?.map((resume, index) => (
          <motion.div
            key={resume._id || `resume-${index}`}
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          >
            <ResumeSummaryCard
              imgUrl={resume.thumbnailLink || null}
              title={resume.title}
              lastUpdated={resume.updatedAt ? moment(resume.updatedAt).format('Do MMM YYYY, h:mm a') : ''}
              atsScore={resume.atsScore}
              onAtsCheck={() => navigate(`/ats-check?resumeId=${resume._id}`)}
              onSelect={() => navigate(`/resume/${resume._id}`)}
              onPublish={() => setPublishModal({ resumeId: resume._id, title: resume.title })}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ── Create Modal ── */}
      <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} hideHeader>
        <CreateResumeForm />
      </Modal>

      {/* ── Publish Modal ── */}
      <AnimatePresence>
        {publishModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setPublishModal(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(4,4,14,0.80)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative', zIndex: 1,
                background: 'rgba(13,13,32,0.95)',
                backdropFilter: 'blur(30px) saturate(200%)',
                WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 24,
                padding: '32px',
                maxWidth: 440, width: '100%',
                boxShadow: '0 0 0 1px rgba(124,58,237,0.15), 0 40px 100px rgba(0,0,0,0.6)',
              }}
            >
              <button
                onClick={() => setPublishModal(null)}
                style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', color: 'rgba(255,255,255,0.50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <FiX size={14} />
              </button>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(219,39,119,0.2))', border: '1px solid rgba(124,58,237,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiZap size={16} color="#a855f7" />
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: 0 }}>Publish Template</h2>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                  AI will anonymize <span style={{ color: '#a855f7', fontWeight: 700 }}>"{publishModal.title}"</span> — removing ALL personal data — before making it public.
                </p>
              </div>

              {/* Privacy notice */}
              <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.20)', borderRadius: 14, padding: '12px 14px', marginBottom: 20, fontSize: 12, color: 'rgba(251,191,36,0.85)', lineHeight: 1.6 }}>
                🔒 <strong>Privacy First:</strong> Gemini AI will replace your name, email, company, and all personal details with fictional dummy data.
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
                  Display name (optional)
                </label>
                <input
                  type="text" value={publishName}
                  onChange={e => setPublishName(e.target.value)}
                  placeholder="Anonymous"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 14,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)',
                    color: '#fff', fontSize: 14, outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(124,58,237,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setPublishModal(null)}
                  style={{ flex: 1, padding: '12px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.60)', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublishTemplate}
                  disabled={publishing}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 14,
                    background: publishing ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg, #7c3aed, #db2777)',
                    color: '#fff', fontWeight: 700, fontSize: 13, cursor: publishing ? 'not-allowed' : 'pointer',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(124,58,237,0.30)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: 'all 0.2s',
                  }}
                >
                  {publishing ? (
                    <>
                      <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                      AI Processing…
                    </>
                  ) : '🚀 Publish Template'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}

export default Dashboard;