import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import DashboardLayout from '../../COmponent/layouts/DashboardLayout.jsx';
import { LuCirclePlus } from 'react-icons/lu';
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
  return (
    <DashboardLayout>
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8 pt-1 pb-6 px-4 md:px-0'>
        <div className='h-[300px] flex flex-col gap-5 items-center justify-center bg-white rounded-lg border border-purple-100 hover:border-purple-200  hover:bg-purple-50/5 p-4 cursor-pointer'
          onClick={() => setOpenCreateModal(true)}>
          <div className='w-12 h-12 flex items-center justify-center bg-purple-200/60 rounded-lg'>
            <LuCirclePlus className='w-6 h-6 text-purple-600' />
          </div>
          <h3 className='font-medium text-gray-800'>Add New Resume</h3>
        </div>
        
        {allresumes?.map((resume,index) => (
          <ResumeSummaryCard
            key={resume._id || `resume-${index}`}
            imgUrl={resume.thumbnailLink || null} 
            title={resume.title}
            lastUpdated={
              resume.updatedAt
                ? moment(resume.updatedAt).format('Do MMM YYYY , h:mm a')
                : ""
            }
            onSelect={() => navigate(`/resume/${resume._id}`)}
          />
        ))}
      </div>

      <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} hideHeader>
         <div className=''><CreateResumeForm/></div>
      </Modal>

    </DashboardLayout>
  )
}

export default Dashboard