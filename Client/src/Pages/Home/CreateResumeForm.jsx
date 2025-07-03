import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../COmponent/Inputs/Input.jsx';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';

function CreateResumeForm() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  //Handle create resume
  const handleCreateResume = async (e) => {
    e.preventDefault();
    if (!title) {
      setError('Please enter a title for the resume.');
      return;
    }

    setError("");

    //create resume API Call
    try {
      const response = await axiosInstance.post(API_PATHS.RESUMES.CREATE, {
        title,
      });
      console.log("response hai bhaiya",response.data);

      if(response.data?._id){
        navigate(`/resume/${response.data?._id}`);
      }
    } catch (error) {
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      } else {
        setError('An error occurred while creating the resume. Please try again later.');
      } 
    }
  }

  return (
    <div className='w-[90vw] md:w-[70vh] p-7 flex flex-col justify-center'>
       <h3 className='text-lg font-semibold text-black'>Create New Resume</h3>
       <p className='text-xs text-slate-700 mt-[5px] mb-3'> Give your resume a title to get started.Your can edit all details later.</p>
       <form onSubmit={handleCreateResume}>
         <Input
         value={title}
         onChange={(val) => setTitle(val)}
         label='Resume Title'
         placeholder="Eg:Mike's Resume"
         type="text"
         />
         {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

         <button type='submit' className='btn-primary'>Create Resume</button>
       </form>
    </div>
  )
}

export default CreateResumeForm