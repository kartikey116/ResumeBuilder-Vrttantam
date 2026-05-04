import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import html2canvas from "html2canvas";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import axiosInstance from "../../utils/axiosinstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { dataURLtoFile } from "../../utils/helper.js";
import toast from "react-hot-toast";

import { resumeTemplates, themeColorPalette } from "../../utils/data.js";
import Modal from "../../components/ui/Modal.jsx";
import AccordionSection from "../../components/ui/AccordionSection.jsx";
import RenderResume from "../../components/resume-templates/RenderResume.jsx";

// Form sections
import ProfileInfoForm from "../../components/forms/ProfileInfoForm.jsx";
import ContactInfoForm from "../../components/forms/ContactInfoForm.jsx";
import WorkExperienceForm from "../../components/forms/WorkExperienceForm.jsx";
import EducationForm from "../../components/forms/EducationForm.jsx";
import SkillsForm from "../../components/forms/SkillsForm.jsx";
import ProjectsForm from "../../components/forms/ProjectsForm.jsx";
import CertificationsForm from "../../components/forms/CertificationsForm.jsx";
import AdditionalInfoForm from "../../components/forms/AdditionalInfoForm.jsx";
import CustomSectionsForm from "../../components/forms/CustomSectionsForm.jsx";

// Icons
import {
  LuArrowLeft,
  LuDownload,
  LuPalette,
  LuSave,
  LuTrash2,
  LuUser,
  LuPhone,
  LuBriefcase,
  LuGraduationCap,
  LuFolderOpen,
  LuAward,
  LuZoomIn,
  LuZoomOut,
  LuPencil,
  LuGauge,
  LuEye,
  LuSparkles,
  LuPlus,
} from "react-icons/lu";
import { FaCode, FaEllipsisH, FaUndo, FaRedo } from "react-icons/fa";

/* ── default empty state with customization tokens ── */
const DEFAULT_RESUME = {
  title: "Untitled Resume",
  thumbnailLink: "",
  profileInfo: {
    profileImg: null,
    profilePreviewUrl: "",
    fullName: "",
    designation: "",
    summary: "",
  },
  template: {
    theme: "09",
    colorPalette: [],
    fontFamily: "Inter, sans-serif",
    layout: {
      spacingPreset: "Balanced",
      fontSize: 10,
      sectionGap: 10,
      itemSpacing: 7,
      padding: 20,
      sidePaddingLeft: 20,
      sidePaddingRight: 20,
      sidePaddingTop: 20,
      sidePaddingBottom: 20,
      sectionHeaderFont: "Inter",
      sectionHeaderSize: 10,
      sectionHeaderLineHeight: 1.2,
      sectionHeaderColor: "#111111",
      headingFont: "Inter",
      headingSize: 22,
      headingLineHeight: 1.2,
      headingColor: "#111111",
      subHeadingFont: "Inter",
      subHeadingSize: 10,
      subHeadingLineHeight: 1.2,
      subHeadingColor: "#222222",
      descriptionFont: "Inter",
      descriptionSize: 9.5,
      descriptionLineHeight: 1.5,
      descriptionColor: "#333333",
    }
  },
  contactInfo: { email: "", phone: "", location: "", linkedin: "", github: "", website: "" },
  workExperience: [{ company: "", role: "", startDate: "", endDate: "", description: "", isCurrentlyWorking: false }],
  education: [{ degree: "", institution: "", startDate: "", endDate: "", grade: "", isCurrentlyStudying: false }],
  skills: [{ category: "", name: "" }],
  projects: [{ title: "", description: "", github: "", liveDemo: "" }],
  certifications: [{ title: "", issuer: "", year: "" }],
  languages: [{ name: "", progress: 80 }],
  interests: [""],
  customSections: [],
};

function EditResume() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  // Refs
  const resumeRef = useRef(null);
  const resumeChildRef = useRef(null);
  const resumeDownloadRef = useRef(null);

  // States
  const [activeTab, setActiveTab] = useState("content"); // content | customize | ats
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.65);
  const [openSections, setOpenSections] = useState({ profile: true, chooseTemplate: true });
  const [showPreview, setShowPreview] = useState(false);
  const [mode, setMode] = useState("editor"); // editor | preview
  const [totalPages, setTotalPages] = useState(1);

  // Undo / Redo history stack
  const [historyState, setHistoryState] = useState({
    history: [DEFAULT_RESUME],
    index: 0
  });

  const { history, index: historyIndex } = historyState;
  const resumeData = useMemo(() => history[historyIndex] || DEFAULT_RESUME, [history, historyIndex]);

  // Layout presets
  const layoutPresets = useMemo(() => ({
    Compact: { fontSize: 9.5, sectionGap: 6, itemSpacing: 4, padding: 12 },
    Balanced: { fontSize: 10, sectionGap: 10, itemSpacing: 7, padding: 20 },
    Spacious: { fontSize: 10.5, sectionGap: 14, itemSpacing: 10, padding: 28 },
  }), []);

  /* ── data helpers ── */
  const updateResumeData = useCallback((updater) => {
    setHistoryState(prevState => {
      const { history, index } = prevState;
      const current = history[index] || DEFAULT_RESUME;
      const next = typeof updater === 'function' ? updater(current) : updater;
      const nextHistory = history.slice(0, index + 1);
      return {
        history: [...nextHistory, next],
        index: index + 1
      };
    });
  }, []);

  const handleUndo = useCallback(() => {
    setHistoryState(prevState => {
      if (prevState.index > 0) {
        return { ...prevState, index: prevState.index - 1 };
      }
      return prevState;
    });
  }, []);

  const handleRedo = useCallback(() => {
    setHistoryState(prevState => {
      if (prevState.index < prevState.history.length - 1) {
        return { ...prevState, index: prevState.index + 1 };
      }
      return prevState;
    });
  }, []);

  // Fetch initial data
  useEffect(() => {
    if (!resumeId) { setIsFetching(false); return; }
    axiosInstance
      .get(API_PATHS.RESUMES.GET_RESUME_BY_ID(resumeId))
      .then(({ data }) => {
        if (data?.profileInfo) {
          const merged = {
            ...DEFAULT_RESUME,
            ...data,
            profileInfo: {
              ...DEFAULT_RESUME.profileInfo,
              ...(data.profileInfo || {})
            },
            contactInfo: {
              ...DEFAULT_RESUME.contactInfo,
              ...(data.contactInfo || {})
            },
            workExperience: Array.isArray(data.workExperience) ? data.workExperience : (DEFAULT_RESUME.workExperience || []),
            education: Array.isArray(data.education) ? data.education : (DEFAULT_RESUME.education || []),
            skills: Array.isArray(data.skills) ? data.skills : (DEFAULT_RESUME.skills || []),
            projects: Array.isArray(data.projects) ? data.projects : (DEFAULT_RESUME.projects || []),
            certifications: Array.isArray(data.certifications) ? data.certifications : (DEFAULT_RESUME.certifications || []),
            languages: Array.isArray(data.languages) ? data.languages : (DEFAULT_RESUME.languages || []),
            interests: Array.isArray(data.interests) ? data.interests : (DEFAULT_RESUME.interests || []),
            customSections: Array.isArray(data.customSections) ? data.customSections : (DEFAULT_RESUME.customSections || []),
            template: {
              ...DEFAULT_RESUME.template,
              ...(data.template || {}),
              layout: {
                ...DEFAULT_RESUME.template.layout,
                ...(data.template?.layout || {}),
              }
            }
          };
          setHistoryState({ history: [merged], index: 0 });
        }
      })
      .catch(err => console.error("Fetch resume error:", err))
      .finally(() => setIsFetching(false));
  }, [resumeId]);

  // Page tracking after resume data updates
  useEffect(() => {
    if (!resumeChildRef.current) return;
    const observer = new ResizeObserver(() => {
      if (resumeChildRef.current) {
        const height = resumeChildRef.current.offsetHeight;
        const pages = Math.max(1, Math.ceil(height / 1122));
        setTotalPages(pages);
      }
    });
    observer.observe(resumeChildRef.current);
    return () => observer.disconnect();
  }, [resumeData]);


  /* ── accordion toggle ── */
  const toggleSection = (key) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  /* ── data setters ── */
  const updateSection = useCallback((section, key, value) => {
    updateResumeData(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value }
    }));
  }, [updateResumeData]);

  const handleArrayChange = useCallback((section, index, keyOrObj, value) => {
    updateResumeData(prev => {
      const arr = [...(prev[section] || [])];
      if (typeof keyOrObj === 'object' && keyOrObj !== null) {
        arr[index] = { ...(typeof arr[index] === 'object' ? arr[index] : {}), ...keyOrObj };
      } else if (keyOrObj === null || keyOrObj === undefined) {
        arr[index] = value;
      } else {
        arr[index] = { ...(typeof arr[index] === 'object' ? arr[index] : {}), [keyOrObj]: value };
      }
      return { ...prev, [section]: arr };
    });
  }, [updateResumeData]);

  const addArrayItem = useCallback((section, defaultItem) => {
    updateResumeData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), defaultItem]
    }));
  }, [updateResumeData]);

  const removeArrayItem = useCallback((section, index) => {
    updateResumeData(prev => {
      const arr = prev[section].filter((_, idx) => idx !== index);
      return { ...prev, [section]: arr };
    });
  }, [updateResumeData]);

  const moveArrayItem = useCallback((section, index, direction) => {
    updateResumeData(prev => {
      const arr = [...(prev[section] || [])];
      if (direction === 'up' && index > 0) {
        const temp = arr[index];
        arr[index] = arr[index - 1];
        arr[index - 1] = temp;
      } else if (direction === 'down' && index < arr.length - 1) {
        const temp = arr[index];
        arr[index] = arr[index + 1];
        arr[index + 1] = temp;
      }
      return { ...prev, [section]: arr };
    });
  }, [updateResumeData]);

  const updateInterests = useCallback((value) => {
    updateResumeData(prev => ({ ...prev, interests: value.split(',').map(s => s.trim()) }));
  }, [updateResumeData]);

  const updateCustomSection = useCallback((index, key, value) => {
    updateResumeData(prev => {
      const arr = [...(prev.customSections || [])];
      arr[index] = { ...(arr[index] || {}), [key]: value };
      return { ...prev, customSections: arr };
    });
  }, [updateResumeData]);

  const addCustomSection = useCallback(() => {
    updateResumeData(prev => ({
      ...prev,
      customSections: [
        ...(prev.customSections || []),
        { title: "Custom Section", items: [{ heading: "", subHeading: "", startDate: "", endDate: "", description: "" }] }
      ]
    }));
  }, [updateResumeData]);

  const removeCustomSection = useCallback((index) => {
    updateResumeData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).filter((_, idx) => idx !== index)
    }));
  }, [updateResumeData]);

  const updateCustomSectionItem = useCallback((sectionIndex, itemIndex, key, value) => {
    updateResumeData(prev => {
      const arr = [...(prev.customSections || [])];
      const items = [...(arr[sectionIndex]?.items || [])];
      items[itemIndex] = { ...(items[itemIndex] || {}), [key]: value };
      arr[sectionIndex] = { ...arr[sectionIndex], items };
      return { ...prev, customSections: arr };
    });
  }, [updateResumeData]);

  const addCustomSectionItem = useCallback((sectionIndex) => {
    updateResumeData(prev => {
      const arr = [...(prev.customSections || [])];
      const items = [...(arr[sectionIndex]?.items || []), { heading: "", subHeading: "", startDate: "", endDate: "", description: "" }];
      arr[sectionIndex] = { ...arr[sectionIndex], items };
      return { ...prev, customSections: arr };
    });
  }, [updateResumeData]);

  const removeCustomSectionItem = useCallback((sectionIndex, itemIndex) => {
    updateResumeData(prev => {
      const arr = [...(prev.customSections || [])];
      const items = (arr[sectionIndex]?.items || []).filter((_, idx) => idx !== itemIndex);
      arr[sectionIndex] = { ...arr[sectionIndex], items };
      return { ...prev, customSections: arr };
    });
  }, [updateResumeData]);

  /* ── layout customization setters ── */
  const updateLayoutToken = useCallback((key, value) => {
    updateResumeData(prev => {
      const currentLayout = prev.template?.layout || DEFAULT_RESUME.template.layout;
      return {
        ...prev,
        template: {
          ...prev.template,
          layout: { ...currentLayout, [key]: value }
        }
      };
    });
  }, [updateResumeData]);

  const applyPreset = useCallback((preset) => {
    const values = layoutPresets[preset];
    if (values) {
      updateResumeData(prev => {
        const currentLayout = prev.template?.layout || DEFAULT_RESUME.template.layout;
        return {
          ...prev,
          template: {
            ...prev.template,
            layout: { ...currentLayout, spacingPreset: preset, ...values }
          }
        };
      });
    }
  }, [layoutPresets, updateResumeData]);

  const handleFitToSinglePage = useCallback(() => {
    updateResumeData(prev => {
      const currentLayout = prev.template?.layout || DEFAULT_RESUME.template.layout;
      const compactValues = layoutPresets["Compact"] || {};
      return {
        ...prev,
        template: {
          ...prev.template,
          layout: {
            ...currentLayout,
            ...compactValues,
            fontSize: 9.3,
            sectionGap: 6,
            itemSpacing: 4,
            padding: 10,
            sidePaddingLeft: 12,
            sidePaddingRight: 12,
            sidePaddingTop: 12,
            sidePaddingBottom: 12,
          }
        }
      };
    });
    toast.success("Optimized for single page!");
  }, [layoutPresets, updateResumeData]);

  /* ── actions ── */
  const handleSave = useCallback(() => {
    setIsLoading(true);
    axiosInstance
      .put(API_PATHS.RESUMES.UPDATE_RESUME(resumeId), resumeData)
      .then(() => toast.success("Changes saved successfully!"))
      .catch(err => toast.error("Error saving resume changes."))
      .finally(() => setIsLoading(false));
  }, [resumeId, resumeData]);

  const handleSaveAndExit = useCallback(() => {
    setIsLoading(true);
    axiosInstance
      .put(API_PATHS.RESUMES.UPDATE_RESUME(resumeId), resumeData)
      .then(() => {
        toast.success("Saved successfully. Returning to dashboard...");
        navigate("/dashboard");
      })
      .catch(err => toast.error("Error saving resume."))
      .finally(() => setIsLoading(false));
  }, [resumeId, resumeData, navigate]);

  const handleDelete = useCallback(() => {
    if (!window.confirm("Are you sure you want to delete this resume forever?")) return;
    setIsLoading(true);
    axiosInstance
      .delete(API_PATHS.RESUMES.DELETE_RESUME(resumeId))
      .then(() => {
        toast.success("Resume deleted.");
        navigate("/dashboard");
      })
      .catch(err => toast.error("Error deleting resume."))
      .finally(() => setIsLoading(false));
  }, [resumeId, navigate]);

  const reactToPrint = useReactToPrint({ contentRef: resumeDownloadRef });

  const badgeCount = useMemo(() => ({
    experience: resumeData.workExperience?.filter(e => e.company)?.length || 0,
    education: resumeData.education?.filter(e => e.degree)?.length || 0,
    skills: resumeData.skills?.filter(s => s.name)?.length || 0,
    projects: resumeData.projects?.filter(p => p.title)?.length || 0,
    certifications: resumeData.certifications?.filter(c => c.title)?.length || 0,
  }), [resumeData]);

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#070713] text-white">
        <LuSparkles className="animate-spin text-purple-500 mb-2" size={32} />
        <span className="text-sm font-semibold tracking-wide text-slate-400">
          Loading your resume editor...
        </span>
      </div>
    );
  }

  const currentLayout = resumeData.template?.layout || DEFAULT_RESUME.template.layout;

  return (
    <div className="flex w-screen h-screen bg-[#06060c] text-slate-200 overflow-hidden select-none font-sans antialiased text-[13px]">

      {/* ═══ FAR LEFT: FIXED SIDEBAR (ONLY IN EDITOR MODE) ═══ */}
      {mode === "editor" && (
        <div className="w-[72px] h-screen bg-[rgba(10,10,25,0.7)] backdrop-blur-2xl border-r border-[rgba(255,255,255,0.04)] flex flex-col items-center justify-between py-5 shrink-0 select-none z-40">
          <div className="flex flex-col items-center gap-5 w-full">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex flex-col items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white transition group shrink-0"
              title="Go to dashboard"
            >
              <div className="w-11 h-11 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] group-hover:bg-purple-600 group-hover:border-purple-500 rounded-xl flex items-center justify-center transition">
                <LuArrowLeft size={17} />
              </div>
              Back
            </button>

            <div className="w-full h-px bg-[rgba(255,255,255,0.05)] px-4" />

            {/* Main tabs */}
            <button
              onClick={() => setActiveTab("content")}
              className={`flex flex-col items-center gap-1.5 w-full py-1 text-[11px] font-medium transition ${activeTab === "content" ? "text-purple-400" : "text-slate-400 hover:text-white"}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition ${activeTab === "content"
                ? "bg-[rgba(124,58,237,0.18)] border-purple-500/40 text-purple-400 shadow-[0_0_15px_rgba(124,58,237,0.25)]"
                : "bg-transparent border-transparent text-slate-400 hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.06)]"
                }`}>
                <LuPencil size={19} />
              </div>
              Edit Content
            </button>

            <button
              onClick={() => setActiveTab("customize")}
              className={`flex flex-col items-center gap-1.5 w-full py-1 text-[11px] font-medium transition ${activeTab === "customize" ? "text-purple-400" : "text-slate-400 hover:text-white"}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition ${activeTab === "customize"
                ? "bg-[rgba(124,58,237,0.18)] border-purple-500/40 text-purple-400 shadow-[0_0_15px_rgba(124,58,237,0.25)]"
                : "bg-transparent border-transparent text-slate-400 hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.06)]"
                }`}>
                <LuPalette size={19} />
              </div>
              Customize
            </button>

            {/* ATS Tab */}
            <button
              onClick={() => setActiveTab("ats")}
              className={`flex flex-col items-center gap-1.5 w-full py-1 text-[11px] font-medium transition ${activeTab === "ats" ? "text-purple-400" : "text-slate-400 hover:text-white"}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition ${activeTab === "ats"
                ? "bg-[rgba(124,58,237,0.18)] border-purple-500/40 text-purple-400 shadow-[0_0_15px_rgba(124,58,237,0.25)]"
                : "bg-transparent border-transparent text-slate-400 hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.06)]"
                }`}>
                <LuGauge size={19} />
              </div>
              ATS Score
            </button>
          </div>
        </div>
      )}

      {/* ═══ MIDDLE CONTENT PANEL: FORMS & CUSTOMIZATION (ONLY IN EDITOR MODE) ═══ */}
      {mode === "editor" && (
        <div className="w-[390px] h-screen bg-[rgba(7,7,19,0.4)] backdrop-blur border-r border-[rgba(255,255,255,0.04)] flex flex-col z-30 select-text overflow-hidden">
          {/* Header */}
          <div className="px-5 pt-5 pb-3 border-b border-[rgba(255,255,255,0.03)] flex items-center justify-between select-none">
            <h2 className="text-sm font-bold text-slate-100 tracking-wide select-none">
              {activeTab === "content" ? "Edit Content" : activeTab === "customize" ? "Customize Template" : "ATS Check"}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="text-[11px] font-bold bg-purple-600/90 hover:bg-purple-500 hover:shadow-[0_0_12px_rgba(124,58,237,0.3)] text-white px-3 py-1.5 rounded-xl transition flex items-center gap-1 select-none shadow shrink-0"
              >
                <LuSave size={12} />
                Save
              </button>
              <button
                onClick={handleSaveAndExit}
                disabled={isLoading}
                className="text-[11px] font-bold bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.05)] text-slate-300 px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 select-none shrink-0"
              >
                Save & Exit
              </button>
            </div>
          </div>

          {/* Tab content area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 select-text flex flex-col gap-3">
            {activeTab === "content" && (
              <div className="flex flex-col gap-3">
                {/* 1. PERSONAL INFORMATION */}
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden hover:border-[rgba(255,255,255,0.09)] transition">
                  <AccordionSection
                    title="Personal Information"
                    icon={<LuUser size={15} />}
                    isOpen={openSections.profile}
                    onToggle={() => toggleSection("profile")}
                  >
                    <ProfileInfoForm
                      profileData={resumeData.profileInfo || {}}
                      updateSection={(k, v) => updateSection("profileInfo", k, v)}
                    />
                  </AccordionSection>
                </div>

                {/* 2. CONTACT & SOCIAL LINKS */}
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden hover:border-[rgba(255,255,255,0.09)] transition">
                  <AccordionSection
                    title="Contact & Social Links"
                    icon={<LuPhone size={14} />}
                    isOpen={openSections.contact}
                    onToggle={() => toggleSection("contact")}
                  >
                    <ContactInfoForm
                      contactInfo={resumeData.contactInfo || {}}
                      updateSection={(k, v) => updateSection("contactInfo", k, v)}
                    />
                  </AccordionSection>
                </div>

                {/* 3. WORK EXPERIENCE */}
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden hover:border-[rgba(255,255,255,0.09)] transition">
                  <AccordionSection
                    title={`Work Experience${badgeCount.experience > 0 ? ` [${badgeCount.experience}]` : ""}`}
                    icon={<LuBriefcase size={15} />}
                    isOpen={openSections.work}
                    onToggle={() => toggleSection("work")}
                  >
                    <WorkExperienceForm
                      workExperience={resumeData.workExperience || []}
                      updateArrayItem={handleArrayChange}
                      addArrayItem={addArrayItem}
                      removeArrayItem={removeArrayItem}
                      moveArrayItem={moveArrayItem}
                    />
                  </AccordionSection>
                </div>

                {/* 4. EDUCATION & STUDIES */}
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden hover:border-[rgba(255,255,255,0.09)] transition">
                  <AccordionSection
                    title={`Education & Studies${badgeCount.education > 0 ? ` [${badgeCount.education}]` : ""}`}
                    icon={<LuGraduationCap size={15} />}
                    isOpen={openSections.education}
                    onToggle={() => toggleSection("education")}
                  >
                    <EducationForm
                      education={resumeData.education || []}
                      updateArrayItem={handleArrayChange}
                      addArrayItem={addArrayItem}
                      removeArrayItem={removeArrayItem}
                      moveArrayItem={moveArrayItem}
                    />
                  </AccordionSection>
                </div>

                {/* 5. PROFESSIONAL SKILLS */}
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden hover:border-[rgba(255,255,255,0.09)] transition">
                  <AccordionSection
                    title={`Professional Skills${badgeCount.skills > 0 ? ` [${badgeCount.skills}]` : ""}`}
                    icon={<FaCode size={14} />}
                    isOpen={openSections.skills}
                    onToggle={() => toggleSection("skills")}
                  >
                    <SkillsForm
                      skills={resumeData.skills || []}
                      updateArrayItem={handleArrayChange}
                      addArrayItem={addArrayItem}
                      removeArrayItem={removeArrayItem}
                      moveArrayItem={moveArrayItem}
                    />
                  </AccordionSection>
                </div>

                {/* 6. PORTFOLIO & PROJECTS */}
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden hover:border-[rgba(255,255,255,0.09)] transition">
                  <AccordionSection
                    title={`Portfolio & Projects${badgeCount.projects > 0 ? ` [${badgeCount.projects}]` : ""}`}
                    icon={<LuFolderOpen size={14} />}
                    isOpen={openSections.projects}
                    onToggle={() => toggleSection("projects")}
                  >
                    <ProjectsForm
                      projects={resumeData.projects || []}
                      updateArrayItem={handleArrayChange}
                      addArrayItem={addArrayItem}
                      removeArrayItem={removeArrayItem}
                      moveArrayItem={moveArrayItem}
                    />
                  </AccordionSection>
                </div>

                {/* 7. CERTIFICATIONS & ACHIEVEMENTS */}
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden hover:border-[rgba(255,255,255,0.09)] transition">
                  <AccordionSection
                    title={`Certifications${badgeCount.certifications > 0 ? ` [${badgeCount.certifications}]` : ""}`}
                    icon={<LuAward size={15} />}
                    isOpen={openSections.certifications}
                    onToggle={() => toggleSection("certifications")}
                  >
                    <CertificationsForm
                      certifications={resumeData.certifications || []}
                      updateArrayItem={handleArrayChange}
                      addArrayItem={addArrayItem}
                      removeArrayItem={removeArrayItem}
                      moveArrayItem={moveArrayItem}
                    />
                  </AccordionSection>
                </div>

                {/* 8. LANGUAGES, INTERESTS & EXTRA */}
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden hover:border-[rgba(255,255,255,0.09)] transition">
                  <AccordionSection
                    title="Additional Section"
                    icon={<FaEllipsisH size={13} />}
                    isOpen={openSections.extra}
                    onToggle={() => toggleSection("extra")}
                  >
                    <AdditionalInfoForm
                      languages={resumeData.languages || []}
                      interests={resumeData.interests || []}
                      updateArrayItem={handleArrayChange}
                      addArrayItem={addArrayItem}
                      removeArrayItem={removeArrayItem}
                    />
                  </AccordionSection>
                </div>

                {/* 9. CUSTOM SECTIONS */}
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl overflow-hidden hover:border-[rgba(255,255,255,0.09)] transition">
                  <AccordionSection
                    title={`Custom Sections${(resumeData.customSections?.length || 0) > 0 ? ` [${resumeData.customSections.length}]` : ""}`}
                    icon={<LuPlus size={14} />}
                    isOpen={openSections.custom}
                    onToggle={() => toggleSection("custom")}
                  >
                    <CustomSectionsForm
                      customSections={resumeData.customSections || []}
                      updateCustomSection={updateCustomSection}
                      addCustomSection={addCustomSection}
                      removeCustomSection={removeCustomSection}
                      updateCustomSectionItem={updateCustomSectionItem}
                      addCustomSectionItem={addCustomSectionItem}
                      removeCustomSectionItem={removeCustomSectionItem}
                    />
                  </AccordionSection>
                </div>
              </div>
            )}

            {activeTab === "customize" && (
              <div className="flex flex-col gap-3">
                {/* TEMPLATE PICKER GRID */}
                <AccordionSection
                  title="Choose a Template"
                  icon={<LuPalette size={15} />}
                  isOpen={openSections.chooseTemplate}
                  onToggle={() => toggleSection("chooseTemplate")}
                >
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {resumeTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => updateResumeData(prev => ({
                          ...prev,
                          template: { ...prev.template, theme: template.id }
                        }))}
                        className={`cursor-pointer rounded-xl border-2 transition overflow-hidden bg-[#070713]/80 ${resumeData.template?.theme === template.id
                          ? "border-purple-500 shadow-[0_0_15px_rgba(124,58,237,0.2)] scale-[1.02]"
                          : "border-transparent hover:border-[rgba(255,255,255,0.08)] hover:bg-[#0c0c1e]"
                          }`}
                      >
                        <div className="aspect-[4/5] bg-slate-900 overflow-hidden relative">
                          {template.thumbnail ? (
                            <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-2 text-center gap-1.5">
                              <span className="text-[11px] font-bold text-slate-100">{template.name}</span>
                              <span className="text-[8px] text-slate-500 tracking-wide font-mono px-1 py-0.5 rounded border border-slate-800 bg-slate-950/40">
                                Harvard Form
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-2 border-t border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] select-none">
                          <p className="text-[11px] font-bold text-slate-200 truncate leading-snug">
                            {template.name}
                          </p>
                          <p className="text-[9px] text-purple-400 font-medium">Standard A4</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionSection>

                {/* PRE-BUILT LAYOUT PRESETS */}
                <AccordionSection
                  title="Pre-built Layouts"
                  icon={<LuPencil size={14} />}
                  isOpen={openSections.layoutPresets}
                  onToggle={() => toggleSection("layoutPresets")}
                >
                  <div className="flex flex-col gap-3 mt-1">
                    <div className="flex items-center gap-1 bg-[rgba(255,255,255,0.02)] p-1 rounded-xl border border-[rgba(255,255,255,0.04)]">
                      {Object.keys(layoutPresets).map((preset) => (
                        <button
                          key={preset}
                          onClick={() => applyPreset(preset)}
                          className={`flex-1 py-1.5 text-[10px] font-medium border rounded-lg transition select-none ${currentLayout.spacingPreset === preset
                            ? "bg-[rgba(124,58,237,0.15)] border-purple-500 text-purple-300"
                            : "bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)] text-slate-400 hover:bg-[rgba(255,255,255,0.04)] hover:text-slate-200"
                            }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                        <span className="block text-[9px] text-slate-400 font-mono">Font Size</span>
                        <span className="block text-sm font-bold text-slate-100">{currentLayout.fontSize}pt</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                        <span className="block text-[9px] text-slate-400 font-mono">Section Gap</span>
                        <span className="block text-sm font-bold text-slate-100">{currentLayout.sectionGap}px</span>
                      </div>
                    </div>
                  </div>
                </AccordionSection>

                {/* PADDING & SPACING */}
                <AccordionSection
                  title="Padding & Spacing"
                  icon={<LuZoomOut size={14} />}
                  isOpen={openSections.padding}
                  onToggle={() => toggleSection("padding")}
                >
                  <div className="flex flex-col gap-3 mt-1">
                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1 select-none">
                        <span>Section Gap</span>
                        <span className="font-semibold text-slate-200">{currentLayout.sectionGap}px</span>
                      </div>
                      <input
                        type="range" min="4" max="22" step="1"
                        value={currentLayout.sectionGap}
                        onChange={e => updateLayoutToken("sectionGap", +e.target.value)}
                        className="w-full accent-purple-500 h-1 bg-slate-800 rounded-lg outline-none cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-1 select-none">
                        <span>Line / Item Spacing</span>
                        <span className="font-semibold text-slate-200">{currentLayout.itemSpacing}px</span>
                      </div>
                      <input
                        type="range" min="2" max="16" step="1"
                        value={currentLayout.itemSpacing}
                        onChange={e => updateLayoutToken("itemSpacing", +e.target.value)}
                        className="w-full accent-purple-500 h-1 bg-slate-800 rounded-lg outline-none cursor-pointer"
                      />
                    </div>

                    <div className="pt-2 border-t border-[rgba(255,255,255,0.04)] mt-1">
                      <p className="text-[10px] text-slate-400 font-bold mb-2 select-none">Page Margins (Padding)</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] font-semibold text-slate-500 block select-none">Left/Right Margin</label>
                          <input
                            type="number" min="8" max="52"
                            value={currentLayout.sidePaddingLeft || 20}
                            onChange={e => {
                              const val = +e.target.value;
                              updateLayoutToken("sidePaddingLeft", val);
                              updateLayoutToken("sidePaddingRight", val);
                            }}
                            className="bg-slate-900 border border-[rgba(255,255,255,0.06)] rounded-lg text-xs p-1.5 w-full text-slate-100 outline-none focus:border-purple-500/40 select-text"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-semibold text-slate-500 block select-none">Top/Bottom Margin</label>
                          <input
                            type="number" min="8" max="52"
                            value={currentLayout.sidePaddingTop || 20}
                            onChange={e => {
                              const val = +e.target.value;
                              updateLayoutToken("sidePaddingTop", val);
                              updateLayoutToken("sidePaddingBottom", val);
                            }}
                            className="bg-slate-900 border border-[rgba(255,255,255,0.06)] rounded-lg text-xs p-1.5 w-full text-slate-100 outline-none focus:border-purple-500/40 select-text"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionSection>

                {/* TEXT SIZE & STYLES */}
                <AccordionSection
                  title="Text Size & Styles"
                  icon={<LuPencil size={15} />}
                  isOpen={openSections.textSize}
                  onToggle={() => toggleSection("textSize")}
                >
                  <div className="flex flex-col gap-3 mt-1">
                    {[
                      { label: "Main Heading (Your Name)", sizeKey: "headingSize", fontKey: "headingFont", colorKey: "headingColor", defaultSize: 22 },
                      { label: "Section Headings", sizeKey: "sectionHeaderSize", fontKey: "sectionHeaderFont", colorKey: "sectionHeaderColor", defaultSize: 10.5 },
                      { label: "Item Headings", sizeKey: "subHeadingSize", fontKey: "subHeadingFont", colorKey: "subHeadingColor", defaultSize: 10 },
                      { label: "Body / Descriptions Text", sizeKey: "fontSize", fontKey: "descriptionFont", colorKey: "descriptionColor", defaultSize: 10 },
                    ].map((grp) => (
                      <div key={grp.label} className="p-2.5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                        <p className="text-[10px] font-bold text-slate-300 mb-2 select-none">{grp.label}</p>
                        <div className="flex flex-col gap-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-medium text-slate-400 w-16 select-none">Font Size</span>
                            <input
                              type="range" min={grp.sizeKey === 'headingSize' ? 14 : 7} max={grp.sizeKey === 'headingSize' ? 36 : 16} step="0.5"
                              value={currentLayout[grp.sizeKey] || grp.defaultSize}
                              onChange={e => updateLayoutToken(grp.sizeKey, +e.target.value)}
                              className="flex-1 accent-purple-500 h-1 bg-slate-800 rounded-lg outline-none cursor-pointer"
                            />
                            <span className="text-xs font-bold text-slate-200 select-none w-8 text-right">{currentLayout[grp.sizeKey] || grp.defaultSize}pt</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-medium text-slate-400 w-16 select-none">Font Family</span>
                            <select
                              value={currentLayout[grp.fontKey] || "Inter"}
                              onChange={e => updateLayoutToken(grp.fontKey, e.target.value)}
                              className="flex-1 text-[11px] bg-slate-900 border border-[rgba(255,255,255,0.05)] rounded-lg text-slate-300 px-2 py-1 outline-none select-none transition focus:border-purple-500/30"
                            >
                              <option value="Inter">Inter (Sans)</option>
                              <option value="Roboto">Roboto (Sans)</option>
                              <option value="Poppins">Poppins (Sans)</option>
                              <option value="Arial, sans-serif">Arial (Sans)</option>
                              <option value="Calibri, sans-serif">Calibri (Sans)</option>
                              <option value="sans-serif">Sans Serif (System)</option>
                              <option value="Merriweather">Merriweather (Serif)</option>
                              <option value="Lora">Lora (Serif)</option>
                              <option value="Cambria, serif">Cambria (Serif)</option>
                              <option value="Garamond, serif">Garamond (Serif)</option>
                              <option value="Tinos, serif">Tinos (Serif)</option>
                              <option value="Cinzel, serif">Cinzel (Serif)</option>
                              <option value="serif">Serif (System)</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-medium text-slate-400 w-16 select-none">Text Color</span>
                            <input
                              type="color"
                              value={currentLayout[grp.colorKey] || "#111111"}
                              onChange={e => updateLayoutToken(grp.colorKey, e.target.value)}
                              className="w-7 h-5 rounded cursor-pointer bg-transparent outline-none border-0 select-none"
                            />
                            <input
                              type="text"
                              value={currentLayout[grp.colorKey] || "#111111"}
                              onChange={e => updateLayoutToken(grp.colorKey, e.target.value)}
                              className="flex-1 text-[10px] bg-slate-900 border border-[rgba(255,255,255,0.06)] rounded p-1 text-slate-300 font-mono outline-none focus:border-purple-500/40 select-text"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionSection>
              </div>
            )}

            {activeTab === "ats" && (
              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 hover:bg-purple-500/10 transition select-none">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-purple-300">ATS Scorer</span>
                    <span className="text-xl font-black font-mono text-purple-400">88%</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400 mb-2">
                    Our scanner analyzed the text readability, spacing presets, and line heights. Everything is highly readable by automated applicant tracking pipelines.
                  </p>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="bg-purple-500 w-[88%] h-full rounded-full" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ RIGHT PANEL: FULL SCREEN PREVIEW ═══ */}
      <div className="flex-1 h-screen flex flex-col select-none relative overflow-hidden bg-[#0a0a14]">

        {/* Dynamic header toolbar */}
        <div className="h-14 px-5 bg-[rgba(10,10,25,0.4)] backdrop-blur border-b border-[rgba(255,255,255,0.03)] flex items-center justify-between z-30 shrink-0 select-none">
          <div className="flex items-center gap-3">
            {/* Back Arrow Button to restore sidebars if in preview mode */}
            {mode === "preview" && (
              <button
                onClick={() => setMode("editor")}
                className="flex items-center gap-1.5 text-[11px] font-semibold bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.06)] text-slate-300 px-2.5 py-1.5 rounded-xl transition select-none"
              >
                <LuArrowLeft size={14} /> Back to Editor
              </button>
            )}

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-semibold tracking-wide text-slate-500 uppercase select-none">
                Resume /
              </span>
              <input
                value={resumeData.title}
                onChange={e => updateResumeData(p => ({ ...p, title: e.target.value }))}
                className="text-xs font-semibold text-white bg-transparent border border-transparent focus:border-purple-500/30 px-1 py-0.5 rounded outline-none w-44 truncate select-text transition-all placeholder-slate-600"
                placeholder="Name your resume"
              />
            </div>

            {/* Editor Mode vs Preview Mode Toggle */}
            <div className="flex items-center p-1 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-xl shrink-0 ml-1">
              <button
                onClick={() => setMode("editor")}
                className={`flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition select-none ${mode === "editor"
                  ? "bg-purple-600/90 text-white shadow font-bold"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                <LuPencil size={12} />
                Editor Mode
              </button>
              <button
                onClick={() => setMode("preview")}
                className={`flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition select-none ${mode === "preview"
                  ? "bg-purple-600/90 text-white shadow font-bold"
                  : "text-slate-400 hover:text-white"
                  }`}
              >
                <LuEye size={12} />
                Preview Mode
              </button>
            </div>
          </div>

          {/* Controls: undo, redo, fit page, zoom, download */}
          <div className="flex items-center gap-2 shrink-0 select-none">


            {/* Fit to Single Page Button */}
            <button
              onClick={handleFitToSinglePage}
              className="flex items-center gap-1 text-[11px] font-semibold border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] text-slate-200 px-2.5 py-1.5 rounded-xl transition select-none shrink-0"
              title="Resize fonts and padding to perfectly squeeze content into a single page"
            >
              <LuPencil size={12} />
              Fit to Single Page
            </button>

            {/* Undo, Redo with full hover text */}
            <div className="flex items-center bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-xl p-1 gap-0.5 shrink-0">
              <div className="relative group">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex === 0}
                  className="text-slate-300 hover:bg-[rgba(255,255,255,0.04)] border border-transparent rounded-lg p-2 disabled:opacity-30 disabled:cursor-not-allowed select-none transition"
                >
                  <FaUndo size={11} />
                </button>
                <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-medium px-2 py-1 rounded shadow-lg border border-slate-700 pointer-events-none opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                  Undo
                </div>
              </div>
              <div className="relative group">
                <button
                  onClick={handleRedo}
                  disabled={historyIndex === history.length - 1}
                  className="text-slate-300 hover:bg-[rgba(255,255,255,0.04)] border border-transparent rounded-lg p-2 disabled:opacity-30 disabled:cursor-not-allowed select-none transition"
                >
                  <FaRedo size={11} />
                </button>
                <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-medium px-2 py-1 rounded shadow-lg border border-slate-700 pointer-events-none opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                  Redo
                </div>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-xl p-1 gap-1 shrink-0">
              <button
                onClick={() => setPreviewScale(s => Math.max(0.3, +(s - 0.1).toFixed(1)))}
                className="btn-small-light !px-2.5 !py-1.5"
                title="Zoom out"
              >
                <LuZoomOut size={13} />
              </button>
              <span className="text-[10px] font-mono text-slate-400 w-11 text-center select-none tracking-tight">
                {Math.round(previewScale * 100)}%
              </span>
              <button
                onClick={() => setPreviewScale(s => Math.min(1.2, +(s + 0.1).toFixed(1)))}
                className="btn-small-light !px-2.5 !py-1.5"
                title="Zoom in"
              >
                <LuZoomIn size={13} />
              </button>
            </div>

            {/* Download Button */}
            <button
              className="bg-gradient-to-tr from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(124,58,237,0.25)] select-none shrink-0"
              onClick={() => setShowPreview(true)}
            >
              <LuDownload size={13} />
              Download PDF
            </button>

            {/* Delete menu */}
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="btn-small-light text-red-400 hover:bg-red-500/10 hover:text-red-300 !p-2.5 border-[rgba(255,255,255,0.04)]"
              title="Delete this resume permanently"
            >
              <LuTrash2 size={13} />
            </button>
          </div>
        </div>

        {/* ── MAIN A4 CANVAS AREA ── */}
        <div className="flex-1 overflow-auto custom-scrollbar flex flex-col items-center py-10 px-4 bg-gray-100 select-text">
          <div
            style={{
              transformOrigin: "top center",
              transform: `scale(${previewScale})`,
              width: "794px",
              // Adjust margin to prevent layout collapse when scaled
              marginBottom: `${(previewScale - 1) * 1122}px`,
            }}
          >
            <div className="flex flex-col gap-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white relative shadow-2xl print:shadow-none print:m-0"
                  style={{
                    width: "794px", // Standard A4 at 96 DPI
                    height: "1122px",
                    padding: "40px 50px", // Standard Document Margins
                    boxSizing: "border-box",
                    overflow: "hidden",
                    borderRadius: "2px",
                  }}
                >
                  {/* Page Number Indicator (Optional) */}
                  <div className="absolute bottom-4 right-6 text-gray-300 text-xs select-none">
                    Page {i + 1} of {totalPages}
                  </div>

                  <div
                    className="h-full w-full"
                    style={{
                      // Instead of translating, we ensure the RenderResume 
                      // logic handles content distribution or clipping
                      transform: `translateY(-${i * 1042}px)`, // 1122 - padding
                    }}
                    ref={i === 0 ? resumeRef : null}
                  >
                    <div ref={i === 0 ? resumeChildRef : null}>
                      <RenderResume
                        templateId={resumeData.template?.theme || "09"}
                        resumeData={resumeData}
                        colorPalette={resumeData.template?.colorPalette || []}
                        containerWidth={694} // Adjusted for 50px L/R padding
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Page Count Overlay in Bottom-Right Corner */}
        <div className="absolute bottom-6 right-6 z-40 flex items-center bg-[#070713]/90 border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-200 select-none shadow-[0_4px_16px_rgba(0,0,0,0.4)] backdrop-blur transition-all pointer-events-none select-none">
          Page {totalPages > 1 ? `1 of ${totalPages}` : "1 of 1"}
        </div>
      </div>

      {/* ── PREVIEW & DOWNLOAD OVERLAY MODAL ── */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={resumeData.title || "Print Preview"}
        showActionBtn
        actionBtnText="Download / Print"
        onActionClick={() => reactToPrint()}
      >
        <div className="w-[90vw] md:w-[794px] h-[80vh] overflow-y-auto custom-scrollbar bg-[#f8fafc] text-black">
          <div ref={resumeDownloadRef}>
            <RenderResume
              templateId={resumeData.template?.theme || "09"}
              resumeData={resumeData}
              colorPalette={resumeData.template?.colorPalette || []}
            />
          </div>
        </div>
      </Modal>

    </div>
  );
}

export default EditResume;
