import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import DashboardLayout from '../../COmponent/layouts/DashboardLayout.jsx';
import { LuCirclePlus } from 'react-icons/lu';
import { FiActivity, FiFileText, FiTarget, FiUsers, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import Modal from '../../COmponent/Modal.jsx';
import ResumeSummaryCard from '../../COmponent/Cards/ResumeSummaryCard.jsx';
import CreateResumeForm from '../Home/CreateResumeForm.jsx';
import toast from 'react-hot-toast';
import DashboardSkeleton from './DashboardSkeleton.jsx';

function Dashboard() {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allresumes, setAllResumes] = useState([]);
  const [publishModal, setPublishModal] = useState(null); // { resumeId, title }
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
  }

  useEffect(() => {
    fetchAllResumes();
  }, []);

  const handlePublishTemplate = async () => {
    if (!publishModal) return;
    setPublishing(true);
    try {
      await axiosInstance.post('/api/ai/anonymize-publish', {
        resumeId: publishModal.resumeId,
        creatorName: publishName || 'Anonymous',
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  const totalResumes = allresumes.length;
  const scoredResumes = allresumes.filter(r => r.atsScore > 0);
  const avgAtsScore = scoredResumes.length > 0
    ? Math.round(scoredResumes.reduce((sum, r) => sum + r.atsScore, 0) / scoredResumes.length)
    : 0;

  return (
    <DashboardLayout>
      {/* Hero Stats Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-8 rounded-3xl bg-[#1e2330] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative border border-slate-700"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3"></div>

        <div className="relative z-10 space-y-2 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Career Hub</span></h1>
          <p className="text-slate-400 text-sm max-w-sm">Manage your resumes, run ATS scans, and publish templates to the Community Gallery.</p>
        </div>

        <div className="flex gap-4 md:gap-6 relative z-10">
          <div className="flex flex-col items-center bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md min-w-[100px]">
            <FiFileText className="text-blue-400 mb-1 w-6 h-6" />
            <span className="text-2xl font-bold">{totalResumes}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Resumes</span>
          </div>
          <div className="flex flex-col items-center bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md min-w-[100px]">
            <FiActivity className={avgAtsScore > 75 ? "text-green-400 mb-1 w-6 h-6" : "text-amber-400 mb-1 w-6 h-6"} />
            <span className="text-2xl font-bold">{avgAtsScore}%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Avg Score</span>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-auto mt-4 md:mt-0 flex flex-col gap-3">
          <button
            onClick={() => navigate('/ats-check')}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-8 py-3 rounded-2xl font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 transform hover:scale-105"
          >
            <FiTarget className="w-5 h-5" />
            Global ATS Scan
          </button>
          <button
            onClick={() => navigate('/community')}
            className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <FiUsers className="w-5 h-5" />
            Community Gallery
          </button>
        </div>
      </motion.div>

      {/* Grid Section */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-1 pb-10 px-4 md:px-0'
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          className='group min-h-[300px] flex flex-col gap-4 items-center justify-center bg-slate-50/50 backdrop-blur-lg rounded-2xl border-2 border-dashed border-slate-300 hover:border-purple-400 hover:bg-purple-50/30 p-4 cursor-pointer transition-all shadow-sm'
          onClick={() => setOpenCreateModal(true)}
        >
          <div className='w-16 h-16 flex items-center justify-center bg-white border border-slate-100 shadow-sm rounded-2xl transform transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md'>
            <LuCirclePlus className='w-8 h-8 text-purple-600' />
          </div>
          <h3 className='font-bold text-slate-700 tracking-wide'>Create New Resume</h3>
        </motion.div>

        {allresumes?.map((resume, index) => (
          <motion.div key={resume._id || `resume-${index}`} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
            <ResumeSummaryCard
              imgUrl={resume.thumbnailLink || null}
              title={resume.title}
              lastUpdated={
                resume.updatedAt
                  ? moment(resume.updatedAt).format('Do MMM YYYY , h:mm a')
                  : ""
              }
              atsScore={resume.atsScore}
              onAtsCheck={() => navigate(`/ats-check?resumeId=${resume._id}`)}
              onSelect={() => navigate(`/resume/${resume._id}`)}
              onPublish={() => setPublishModal({ resumeId: resume._id, title: resume.title })}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Create Resume Modal */}
      <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} hideHeader>
        <div className=''><CreateResumeForm /></div>
      </Modal>

      {/* Publish Template Modal */}
      <AnimatePresence>
        {publishModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button onClick={() => setPublishModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Publish Template</h2>
              <p className="text-gray-500 text-sm mb-6">
                AI will anonymize <span className="font-semibold text-purple-600">"{publishModal.title}"</span> — removing ALL personal data — before making it public.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
                🔒 <strong>Privacy First:</strong> Gemini AI will replace your name, email, company, and all personal details with fictional dummy data.
              </div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Your display name (optional)</label>
              <input
                type="text"
                value={publishName}
                onChange={(e) => setPublishName(e.target.value)}
                placeholder="Anonymous"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-400 transition-colors mb-6"
              />
              <div className="flex gap-3">
                <button onClick={() => setPublishModal(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={handlePublishTemplate}
                  disabled={publishing}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-bold disabled:opacity-50"
                >
                  {publishing ? '🤖 AI Processing...' : '🚀 Publish Template'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  )
}

export default Dashboard;