import React from 'react'
import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../COmponent/layouts/DashboardLayout.jsx';
import TitleInput from '../../COmponent/Inputs/TitleInput.jsx';
import { useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import ProfileInfoForm from './Forms/ProfileInfoForm.jsx';
import ContactInfoForm from './Forms/ContactInfoForm.jsx';
import WorkExperienceForm from './Forms/WorkExperienceForm.jsx';
import EducationForm from './Forms/EducationForm.jsx';
import SkillsForm from './Forms/SkillsForm.jsx';
import ProjectsForm from './Forms/ProjectsForm.jsx';
import CertificationsForm from './Forms/CertificationsForm.jsx';
import AdditionalInfoForm from './Forms/AdditionalInfoForm.jsx';
import {
  LuArrowLeft,
  LuCircleAlert,
  LuDownload,
  LuPalette,
  LuSave,
  LuTrash2,
} from "react-icons/lu";

import StepProgress from '../../COmponent/StepProgress.jsx';


import toast from "react-hot-toast";

function EditResume() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  const resumeRef = useRef(null);
  const resumeDownloadRef = useRef(null);

  const [baseWidth, setBaseWidth] = useState(800);

  const [openThemeSelector, setOpenThemeSelector] = useState(false);

  const [openPreviewModal, setOpenPreviewModal] = useState(false);

  const steps = ["profile-info", "contact-info", "work-experience", "education", "skills", "projects", "certifications", "additionalInfo"];
  const [currentPage, setCurrentPage] = useState("profile-info");
  const [resumeData, setResumeData] = useState({
    title: "",
    thumbnailLink: "",
    profileInfo: {
      profileImg: null,
      profilePreviewUrl: "",
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "",
      colorPalette: "",
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [{
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
    }],
    education: [{
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
    }],
    skills: [{
      name: "",
      progress: 0,
    }],
    projects: [{
      title: "",
      description: "",
      github: "",
      liveDemo: "",
    }],
    certifications: [{
      title: "",
      issuer: "",
      year: "",
    }],
    languages: [{
      name: "",
      progress: 0,
    }],
    interests: [""],
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  //Validate Input
  const validateAndNext = (e) => {
    const errors = [];

    switch (currentPage) {
      case 'profile-info':
        const { fullName, designation, summary } = resumeData.profileInfo;
        if (!fullName.trim()) errors.push('Full Name is required');
        if (!designation.trim()) errors.push('Designation is required');
        if (!summary.trim()) errors.push('Summary is required');
        break;
      case 'contact-info':
        const { email, phone } = resumeData.contactInfo;
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) errors.push('Valid Email is required');
        if (!phone.trim()) errors.push('Valid Phone number is required');
        break;
      case 'work-experience':
        resumeData.workExperience.forEach(
          ({ company, role, startDate, endDate }, index) => {
            if (!company.trim()) errors.push(`Company ${index + 1} is required`);
            if (!role.trim()) errors.push(`Role ${index + 1} is required`);
            if (!startDate.trim()) errors.push(`Start Date ${index + 1} is required`);
            if (!endDate.trim()) errors.push(`End Date ${index + 1} is required`);
          }

        );
        break;
      case 'education':
        resumeData.education.forEach(
          ({ degree, institution, startDate, endDate }, index) => {
            if (!degree.trim()) errors.push(`Degree ${index + 1} is required`);
            if (!institution.trim()) errors.push(`Institution ${index + 1} is required`);
            if (!startDate.trim()) errors.push(`Start Date ${index + 1} is required`);
            if (!endDate.trim()) errors.push(`End Date ${index + 1} is required`);
          }
        );
        break;
      case 'skills':
        resumeData.skills.forEach(
          ({ name, progress }, index) => {
            if (!name.trim()) errors.push(`Name ${index + 1} is required`);
            if (progress < 1 || progress > 100) errors.push(`Skill Progress must be between 1 and 100 in skill ${index + 1}`);
          }
        );
        break;
      case 'projects':
        resumeData.projects.forEach(
          ({ title, description }, index) => {
            if (!title.trim()) errors.push(`Title ${index + 1} is required`);
            if (!description.trim()) errors.push(`Description ${index + 1} is required`);

          }
        )
        break;
      case 'certifications':
        resumeData.certifications.forEach(
          ({ title, issuer }, index) => {
            if (!title.trim()) errors.push(`Certification title is required in certification ${index + 1}`);
            if (!issuer.trim()) errors.push(`Issuer is required in certification ${index + 1}`);
          }
        )
        break;
      case "additionalInfo":
        
        if(resumeData.languages.length === 0 ||
          !resumeData.languages[0].name?.trim()
        ) {
          errors.push("At least one language is required");
        }
        if (resumeData.interests.length === 0 || !resumeData.interests[0]?.trim()) {
          errors.push("At least one interest is required");
        }
        break;

       default:
        break; 
    }

    if(errors.length > 0) {
      setErrorMsg(errors.join(", \n"));
      return;
    }

    //Move to next step
    setErrorMsg("");
    goToNextStep();

  };

  //Function to navigate to the next page
  const goToNextStep = () => {
    const currentIndex = steps.indexOf(currentPage);
    if (currentIndex < steps.length - 1) {
      setCurrentPage(steps[currentIndex + 1]);
    }
  };

  //Function to navigate to the previous page
  const goBack = () => {
    const currentIndex = steps.indexOf(currentPage);
    if (currentIndex > 0) {
      setCurrentPage(steps[currentIndex - 1]);
    }
  };

  const renderFrom = () => {
    switch (currentPage) {
      case "profile-info":
        return (

          <ProfileInfoForm
            profileData={resumeData?.profileInfo}
            updateSection={(key, value) => {
              updateSection("profileInfo", key, value);
            }}
            onNext={validateAndNext}
          />
        );
      case "contact-info":
        return (
          <ContactInfoForm
            contactInfo={resumeData?.contactInfo}
            updateSection={(key, value) => {
              updateSection("contactInfo", key, value);
            }}
            onNext={validateAndNext}
          />
        );
      case "work-experience":
        return (
          <WorkExperienceForm
            workExperience={resumeData?.workExperience}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("workExperience", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("workExperience", newItem)}
            removeArrayItem={(index) => removeArrayItem("workExperience", index)}
          />
        );
      case "education":
        return (
          <EducationForm
            education={resumeData?.education}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("education", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("education", newItem)}
            removeArrayItem={(index) => removeArrayItem("education", index)}
          />
        );
      case "skills":
        return (
          <SkillsForm
            skills={resumeData?.skills}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("skills", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("skills", newItem)}
            removeArrayItem={(index) => removeArrayItem("skills", index)}
          />
        );
      case "projects":
        return (
          <ProjectsForm
            projects={resumeData?.projects}
            updateArrayItem={(index, key, value) => {
              updateArrayItem("projects", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("projects", newItem)}
            removeArrayItem={(index) => removeArrayItem("projects", index)}
          />
        );
      case "certifications":
        return (
          <CertificationsForm
            certifications={resumeData?.certifications}
            updateArrayItem={(key, index, value) => {
              updateArrayItem("certifications", index, key, value);
            }}
            addArrayItem={(newItem) => addArrayItem("certifications", newItem)}
            removeArrayItem={(index) => removeArrayItem("certifications", index)}
          />
        );
      case "additionalInfo":
        return (
          <AdditionalInfoForm
            languages={resumeData.languages}
            interests={resumeData.interests}
            updateArrayItem={(section, key, index, value) => {
              updateArrayItem(section, index, key, value);
            }}
            addArrayItem={(section, newItem) => addArrayItem(section, newItem)}
            removeArrayItem={(section, index) => removeArrayItem(section, index)}
          />
        );

      default:
        return null;
    }
  };

  //Update simple nested object(like profileInfo,contactInfo,etc.)
  const updateSection = (section, key, value) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  }

  //Update array item (like workExperience,education,etc.)
  const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];

      if (key === null) {
        updatedArray[index] = value;
      } else {
        updatedArray[index] = {
          ...updatedArray[index],
          [key]: value,
        }
      }

      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  }

  //Add item to array
  const addArrayItem = (section, newItem) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }))
  }

  //Remove item from array
  const removeArrayItem = (section, index) => {
    setResumeData((prev) => {
      const updatedArray = [...prev[section]];
      updatedArray.splice(index, 1);
      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  }

  //fetch resume info by Id
  console.log("Fetching resume with ID:", resumeId);
  console.log("GET URL:", API_PATHS.RESUMES.GET_RESUME_BY_ID(resumeId));

  const fetchResumeDetailsById = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.RESUMES.GET_RESUME_BY_ID(resumeId));
      if (response.data && response.data.profileInfo) {
        const resumeInfo = response.data;
        setResumeData((prevState) => ({
          ...prevState,
          title: resumeInfo?.title || "Untitled",
          template: resumeInfo?.template || prevState?.template,
          profileInfo: resumeInfo?.profileInfo || prevState?.profileInfo,
          contactInfo: resumeInfo?.contactInfo || prevState?.contactInfo,
          workExperience: resumeInfo?.workExperience || prevState?.workExperience,
          education: resumeInfo?.education || prevState?.education,
          skills: resumeInfo?.skills || prevState?.skills,
          projects: resumeInfo?.projects || prevState?.projects,
          certifications: resumeInfo?.certifications || prevState?.certifications,
          languages: resumeInfo?.languages || prevState?.languages,
          interests: resumeInfo?.interests || prevState?.interests,
        }));
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  // Upload thumbnail and resume profile img
  const UploadResumeImages = async () => { };

  const updateResumeDetails = async (thumbnailLink, profilePreviewUrl) => { };

  //Delete resume
  const handleDeleteResume = async () => { };

  // download resume
  const reactToPrintFn = useReactToPrint({ contentRef: resumeDownloadRef });

  //Function to update baaeWidth based on the resume container size
  const updateBaseWidth = () => { };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener('resize', updateBaseWidth);

    if (resumeId) {
      fetchResumeDetailsById();
    }
    return () => {
      window.removeEventListener('resize', updateBaseWidth);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className='container mx-auto'>
        <div className='flex items-center justify-between gap-5 bg-white rounded-lg border border-purple-100 px-4 mb-4'>
          <TitleInput
            title={resumeData.title}
            setTitle={(value) =>
              setResumeData((prevState) => ({
                ...prevState,
                title: value,
              }))
            }
          />

          <div className='flex items-center gap-4'>
            <button className='btn-small-light'
              onClick={() => setOpenThemeSelector(true)}
            >
              <LuPalette className='text-[16px] ' />
              <span className='hidden md:block'>Change Theme</span>
            </button>

            <button className='btn-small-light' onClick={handleDeleteResume}>
              <LuTrash2 className='text-[16px] ' />
              <span className='hidden md:block'>Delete</span>
            </button>

            <button
              className='btn-small-light'
              onClick={() => setOpenPreviewModal(true)}
            >
              <LuDownload className='text-[16px]' />
              <span className=''>Preview & Download</span>
            </button>
          </div>
        </div>


        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div className='bg-white rounded-lg border border-purple-100 overflow-hidden px-4 mb-4'>

            <StepProgress progress={0} />

            {renderFrom()}

            <div className='mx-5'>
              {errorMsg && (
                <div className='flex items-center gap-2 text-[11px] font-medium text-amber-600 bg-amber-200 px-2 py-0.5 my-1 rounded-lg'>
                  <LuCircleAlert className='text-md' /> {errorMsg}
                </div>
              )}
              <div className='flex items-end gap-4 justify-end mt-3 mb-5'>
                <button
                  className='btn-small-light'
                  onClick={goBack}
                  disabled={isLoading}
                >
                  <LuArrowLeft className='text-[16px]' />
                  Back
                </button>
                <button className='btn-small-light' onClick={UploadResumeImages} disabled={isLoading}>
                  <LuSave className='text-[16px]' />
                  {isLoading ? "Saving..." : "Save & Exit"}
                </button>
                <button
                  className='btn-small'
                  onClick={validateAndNext}
                  disabled={isLoading}
                >
                  {currentPage === "additionalInfo" && (
                    <LuDownload className='text-[16px]' />
                  )}
                  {currentPage === "additionalInfo" ? "Preview & Download" : "Next"}
                  {currentPage != "additionalInfo" && (<LuArrowLeft className='text-[16px] rotate-180' />)}
                </button>
              </div>
            </div>
          </div>

          <div className='h-[100vh]' ref={resumeRef}>
            {/* Resume templates */}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EditResume