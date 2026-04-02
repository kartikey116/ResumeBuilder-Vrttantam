import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import DashboardLayout from '../../COmponent/layouts/DashboardLayout.jsx';
import { LuCirclePlus } from 'react-icons/lu';
import { FiActivity, FiFileText, FiTarget } from 'react-icons/fi';
import { motion } from 'framer-motion';
import moment from 'moment';
import Modal from '../../COmponent/Modal.jsx';
import ResumeSummaryCard from '../../COmponent/Cards/ResumeSummaryCard.jsx';
import CreateResumeForm from '../Home/CreateResumeForm.jsx';

function Dashboard() {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allresumes, setAllResumes] = useState([]);

  const fetchAllResumes = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.RESUMES.GET_USER_RESUMES);
      setAllResumes(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAllResumes();
  }, []);

  // Stats calculation
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
            <p className="text-slate-400 text-sm max-w-sm">Manage your resumes and instantly simulate an enterprise ATS scan on any PDF.</p>
         </div>
         
         <div className="flex gap-4 md:gap-6 relative z-10">
            <div className="flex flex-col items-center bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md min-w-[100px]">
               <FiFileText className="text-blue-400 mb-1 w-6 h-6"/>
               <span className="text-2xl font-bold">{totalResumes}</span>
               <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Resumes</span>
            </div>
            <div className="flex flex-col items-center bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-md min-w-[100px]">
               <FiActivity className={avgAtsScore > 75 ? "text-green-400 mb-1 w-6 h-6" : "text-amber-400 mb-1 w-6 h-6"}/>
               <span className="text-2xl font-bold">{avgAtsScore}%</span>
               <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Avg Score</span>
            </div>
         </div>

         <div className="relative z-10 w-full md:w-auto mt-4 md:mt-0">
             <button 
                onClick={() => navigate('/ats-check')}
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-8 py-4 rounded-2xl font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2 transform hover:scale-105"
             >
                <FiTarget className="w-5 h-5"/>
                Global ATS Scan
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
        
        {allresumes?.map((resume,index) => (
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
             />
          </motion.div>
        ))}
      </motion.div>

      <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} hideHeader>
         <div className=''><CreateResumeForm/></div>
      </Modal>

    </DashboardLayout>
  )
}

export default Dashboard;