import React, { useState, useRef, useEffect, useCallback } from "react";
import html2canvas from "html2canvas";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import axiosInstance from "../../utils/axiosinstance.js";
import { API_PATHS } from "../../utils/apiPaths.js";
import { dataURLtoFile } from "../../utils/helper.js";
import toast from "react-hot-toast";

// Layout & UI
import DashboardLayout from "../../components/layouts/DashboardLayout.jsx";
import Modal from "../../components/ui/Modal.jsx";
import AccordionSection from "../../components/ui/AccordionSection.jsx";
import ThemeSelector from "./ThemeSelector.jsx";
import RenderResume from "../../components/resume-templates/RenderResume.jsx";

// Form sections (unchanged props API)
import ProfileInfoForm from "../../components/forms/ProfileInfoForm.jsx";
import ContactInfoForm from "../../components/forms/ContactInfoForm.jsx";
import WorkExperienceForm from "../../components/forms/WorkExperienceForm.jsx";
import EducationForm from "../../components/forms/EducationForm.jsx";
import SkillsForm from "../../components/forms/SkillsForm.jsx";
import ProjectsForm from "../../components/forms/ProjectsForm.jsx";
import CertificationsForm from "../../components/forms/CertificationsForm.jsx";
import AdditionalInfoForm from "../../components/forms/AdditionalInfoForm.jsx";

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
} from "react-icons/lu";
import { FaCode, FaEllipsisH } from "react-icons/fa";

/* ─── default empty state ─── */
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
  template: { theme: "09", colorPalette: [], fontFamily: "Inter, sans-serif" },
  contactInfo: { email: "", phone: "", location: "", linkedin: "", github: "", website: "" },
  workExperience: [{ company: "", role: "", startDate: "", endDate: "", description: "", isCurrentlyWorking: false }],
  education: [{ degree: "", institution: "", startDate: "", endDate: "" }],
  skills: [{ name: "", progress: 80 }],
  projects: [{ title: "", description: "", github: "", liveDemo: "" }],
  certifications: [{ title: "", issuer: "", year: "" }],
  languages: [{ name: "", progress: 80 }],
  interests: [""],
};




/* ════════════════════════════════════════════════════════════════ */
function EditResume() {
  const { resumeId } = useParams();
  const navigate = useNavigate();

  // refs
  const resumeRef = useRef(null);
  const resumeDownloadRef = useRef(null);
  const panelRef = useRef(null);

  // state
  const [resumeData, setResumeData] = useState(DEFAULT_RESUME);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.65);
  const [openSections, setOpenSections] = useState({ profile: true });
  const [showTheme, setShowTheme] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  /* ── fetch ── */
  useEffect(() => {
    if (!resumeId) { setIsFetching(false); return; }
    axiosInstance
      .get(API_PATHS.RESUMES.GET_RESUME_BY_ID(resumeId))
      .then(({ data }) => {
        if (data?.profileInfo) {
          setResumeData(prev => ({
            ...prev,
            ...data,
            template: data.template || prev.template,
          }));
        }
      })
      .catch(err => console.error("Fetch resume error:", err))
      .finally(() => setIsFetching(false));
  }, [resumeId]);

  /* ── accordion toggle ── */
  const toggleSection = (key) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  /* ── data helpers ── */
  const updateSection = useCallback((section, key, value) => {
    setResumeData(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  }, []);

  const updateArrayItem = useCallback((section, index, key, value) => {
    setResumeData(prev => {
      const arr = [...prev[section]];
      arr[index] = key === null ? value : { ...arr[index], [key]: value };
      return { ...prev, [section]: arr };
    });
  }, []);

  const addArrayItem = useCallback((section, newItem) => {
    setResumeData(prev => ({ ...prev, [section]: [...prev[section], newItem] }));
  }, []);

  const removeArrayItem = useCallback((section, index) => {
    setResumeData(prev => {
      const arr = [...prev[section]];
      arr.splice(index, 1);
      return { ...prev, [section]: arr };
    });
  }, []);

  const moveArrayItem = useCallback((section, index, direction) => {
    setResumeData(prev => {
      const arr = [...prev[section]];
      if (direction === 'up' && index > 0) {
        [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      } else if (direction === 'down' && index < arr.length - 1) {
        [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
      }
      return { ...prev, [section]: arr };
    });
  }, []);

  /* ── save logic (unchanged from original) ── */
  const updateResumeDetails = async (thumbnailLink, profilePreviewUrl) => {
    const clean = {
      title: String(resumeData.title || ""),
      thumbnailLink: String(thumbnailLink || ""),
      template: {
        theme: resumeData.template?.theme || "09",
        colorPalette: Array.isArray(resumeData.template?.colorPalette) ? resumeData.template.colorPalette : [],
        fontFamily: resumeData.template?.fontFamily || "",
      },
      profileInfo: {
        fullName: String(resumeData.profileInfo?.fullName || ""),
        designation: String(resumeData.profileInfo?.designation || ""),
        summary: String(resumeData.profileInfo?.summary || ""),
        profilePreviewUrl: String(profilePreviewUrl || ""),
      },
      contactInfo: {
        email: String(resumeData.contactInfo?.email || ""),
        phone: String(resumeData.contactInfo?.phone || ""),
        location: String(resumeData.contactInfo?.location || ""),
        linkedin: String(resumeData.contactInfo?.linkedin || ""),
        github: String(resumeData.contactInfo?.github || ""),
        website: String(resumeData.contactInfo?.website || ""),
      },
      workExperience: (resumeData.workExperience || []).map(e => ({
        company: String(e.company || ""),
        role: String(e.role || ""),
        startDate: String(e.startDate || ""),
        endDate: String(e.endDate || ""),
        description: String(e.description || ""),
        isCurrentlyWorking: Boolean(e.isCurrentlyWorking),
      })),
      education: (resumeData.education || []).map(e => ({
        degree: String(e.degree || ""),
        institution: String(e.institution || ""),
        startDate: String(e.startDate || ""),
        endDate: String(e.endDate || ""),
      })),
      skills: (resumeData.skills || []).map(s => ({ category: String(s.category || ""), name: String(s.name || ""), progress: Number(s.progress || 0) })),
      projects: (resumeData.projects || []).map(p => ({
        title: String(p.title || ""),
        description: String(p.description || ""),
        github: String(p.github || ""),
        liveDemo: String(p.liveDemo || ""),
      })),
      certifications: (resumeData.certifications || []).map(c => ({
        title: String(c.title || ""),
        issuer: String(c.issuer || ""),
        year: String(c.year || ""),
      })),
      languages: (resumeData.languages || []).map(l => ({ name: String(l.name || ""), progress: Number(l.progress || 0) })),
      interests: (resumeData.interests || []).map(i => String(i || "")),
    };
    await axiosInstance.put(API_PATHS.RESUMES.UPDATE_RESUME(resumeId), clean);
  };

  const fixColors = (el) => {
    const all = el.querySelectorAll("*");
    [el, ...all].forEach(node => {
      const cs = window.getComputedStyle(node);
      ["backgroundColor", "color", "borderColor"].forEach(prop => {
        const v = cs[prop];
        if (v?.includes("oklch") || v?.includes("lab")) {
          node.style[prop] = prop === "backgroundColor" ? "#ffffff" : prop === "color" ? "#000000" : "#cccccc";
        } else if (v && v !== "rgba(0,0,0,0)" && v !== "transparent") {
          node.style[prop] = v;
        }
      });
    });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      if (!resumeRef.current) throw new Error("Preview not ready");
      fixColors(resumeRef.current);
      await new Promise(r => setTimeout(r, 100));
      const canvas = await html2canvas(resumeRef.current, {
        backgroundColor: "#ffffff", useCORS: true, allowTaint: false,
        scale: 2, logging: false,
        onclone: (doc) => fixColors(doc.body),
      });
      const imgDataUrl = canvas.toDataURL("image/png", 0.95);
      const thumbFile = dataURLtoFile(imgDataUrl, `resume-${resumeId}.png`);
      const profileFile = resumeData?.profileInfo?.profileImg || null;

      const form = new FormData();
      if (profileFile) form.append("profileImage", profileFile);
      if (thumbFile) form.append("thumbnail", thumbFile);

      const { data: uploaded } = await axiosInstance.put(
        API_PATHS.RESUMES.UPLOAD_RESUME_IMAGES(resumeId), form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      await updateResumeDetails(uploaded.thumbnailLink, uploaded.profilePreviewUrl);
      toast.success("Resume saved successfully! 🎉");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error saving. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this resume permanently?")) return;
    try {
      setIsLoading(true);
      await axiosInstance.delete(API_PATHS.RESUMES.DELETE_RESUME(resumeId));
      toast.success("Resume deleted.");
      navigate("/dashboard");
    } catch {
      toast.error("Delete failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const reactToPrint = useReactToPrint({ contentRef: resumeDownloadRef });

  /* ── badge counts ── */
  const badge = {
    experience: resumeData.workExperience?.filter(e => e.company)?.length || 0,
    education: resumeData.education?.filter(e => e.degree)?.length || 0,
    skills: resumeData.skills?.filter(s => s.name)?.length || 0,
    projects: resumeData.projects?.filter(p => p.title)?.length || 0,
    certifications: resumeData.certifications?.filter(c => c.title)?.length || 0,
  };

  /* ═══════════════════ RENDER ═══════════════════ */
  return (
    <DashboardLayout>
      {/* Escape DashboardLayout's container mx-auto pt-4 pb-4 */}
      <div className="-mx-4 md:-mx-8 lg:-mx-16 -mt-4 -mb-4">
        {/* ── TOP BAR ── */}
        <div className="sticky top-16 z-30 flex items-center justify-between gap-3 bg-white/90 backdrop-blur border-b border-purple-100 px-4 py-2.5 shadow-sm">
          {/* Left: Back + title */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-700 shrink-0 transition-colors"
            >
              <LuArrowLeft size={15} /> Back
            </button>
            <div className="w-px h-5 bg-slate-200" />
            <input
              value={resumeData.title}
              onChange={e => setResumeData(p => ({ ...p, title: e.target.value }))}
              className="text-sm font-semibold text-slate-800 bg-transparent border-none outline-none min-w-0 w-48 truncate focus:bg-purple-50/60 focus:px-2 rounded transition-all"
              placeholder="Resume title"
            />
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowTheme(true)}
              className="btn-small-light gap-1.5 hidden sm:flex"
            >
              <LuPalette size={14} /> Theme
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="btn-small-light gap-1.5 hidden sm:flex"
            >
              <LuDownload size={14} /> Preview
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="btn-small-light !text-red-500 hover:!bg-red-50 gap-1.5 hidden md:flex"
            >
              <LuTrash2 size={14} /> Delete
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="btn-small gap-1.5"
            >
              <LuSave size={14} />
              {isLoading ? "Saving…" : "Save & Exit"}
            </button>
          </div>
        </div>

        {/* ── MAIN BODY: [LEFT PANEL] [LIVE PREVIEW] ── */}
        <div className="flex overflow-hidden" style={{ height: 'calc(100vh - 106px)' }}>

          {/* ═══ LEFT PANEL ═══ */}
          <div
            ref={panelRef}
            className="w-[380px] shrink-0 overflow-y-auto custom-scrollbar bg-[#f9f8fc] border-r border-purple-100 p-3"
          >
            {/* Mobile-only quick actions (theme + preview on small screens) */}
            <div className="flex gap-2 mb-3 sm:hidden">
              <button className="btn-small-light flex-1 justify-center gap-1.5" onClick={() => setShowTheme(true)}>
                <LuPalette size={13} /> Theme
              </button>
              <button className="btn-small-light flex-1 justify-center gap-1.5" onClick={() => setShowPreview(true)}>
                <LuDownload size={13} /> Preview
              </button>
            </div>

            {/* ATS tip banner */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 rounded-xl px-3 py-2.5 mb-3 flex items-start gap-2">
              <span className="text-lg">⚡</span>
              <div>
                <p className="text-xs font-semibold text-purple-800">ATS Tip</p>
                <p className="text-[10.5px] text-purple-600 leading-relaxed">
                  Use the <strong>Harvard Clean</strong> template for the highest ATS compatibility. Quantify achievements with numbers!
                </p>
              </div>
            </div>

            {isFetching ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3">
                <div className="w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                <p className="text-sm text-slate-400">Loading your resume…</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {/* Profile Info */}
                <AccordionSection
                  title="Profile Info"
                  icon={<LuUser size={15} />}
                  isOpen={openSections.profile}
                  onToggle={() => toggleSection("profile")}
                >
                  <ProfileInfoForm
                    profileData={resumeData.profileInfo}
                    updateSection={(key, val) => updateSection("profileInfo", key, val)}
                  />
                </AccordionSection>

                {/* Contact */}
                <AccordionSection
                  title="Contact"
                  icon={<LuPhone size={15} />}
                  isOpen={openSections.contact}
                  onToggle={() => toggleSection("contact")}
                >
                  <ContactInfoForm
                    contactInfo={resumeData.contactInfo}
                    updateSection={(key, val) => updateSection("contactInfo", key, val)}
                  />
                </AccordionSection>

                {/* Experience */}
                <AccordionSection
                  title="Experience"
                  icon={<LuBriefcase size={15} />}
                  isOpen={openSections.experience}
                  onToggle={() => toggleSection("experience")}
                  badge={badge.experience > 0 ? `${badge.experience}` : undefined}
                >
                  <WorkExperienceForm
                    workExperience={resumeData.workExperience}
                    updateArrayItem={updateArrayItem}
                    addArrayItem={addArrayItem}
                    removeArrayItem={removeArrayItem}
                    moveArrayItem={moveArrayItem}
                  />
                </AccordionSection>

                {/* Education */}
                <AccordionSection
                  title="Education"
                  icon={<LuGraduationCap size={15} />}
                  isOpen={openSections.education}
                  onToggle={() => toggleSection("education")}
                  badge={badge.education > 0 ? `${badge.education}` : undefined}
                >
                  <EducationForm
                    education={resumeData.education}
                    updateArrayItem={updateArrayItem}
                    addArrayItem={addArrayItem}
                    removeArrayItem={removeArrayItem}
                    moveArrayItem={moveArrayItem}
                  />
                </AccordionSection>

                {/* Skills */}
                <AccordionSection
                  title="Skills"
                  icon={<FaCode size={15} />}
                  isOpen={openSections.skills}
                  onToggle={() => toggleSection("skills")}
                  badge={badge.skills > 0 ? `${badge.skills}` : undefined}
                >
                  <SkillsForm
                    skills={resumeData.skills}
                    updateArrayItem={updateArrayItem}
                    addArrayItem={addArrayItem}
                    removeArrayItem={removeArrayItem}
                    moveArrayItem={moveArrayItem}
                  />
                </AccordionSection>

                {/* Projects */}
                <AccordionSection
                  title="Projects"
                  icon={<LuFolderOpen size={15} />}
                  isOpen={openSections.projects}
                  onToggle={() => toggleSection("projects")}
                  badge={badge.projects > 0 ? `${badge.projects}` : undefined}
                >
                  <ProjectsForm
                    projects={resumeData.projects}
                    updateArrayItem={updateArrayItem}
                    addArrayItem={addArrayItem}
                    removeArrayItem={removeArrayItem}
                    moveArrayItem={moveArrayItem}
                  />
                </AccordionSection>

                {/* Certifications */}
                <AccordionSection
                  title="Certifications"
                  icon={<LuAward size={15} />}
                  isOpen={openSections.certifications}
                  onToggle={() => toggleSection("certifications")}
                  badge={badge.certifications > 0 ? `${badge.certifications}` : undefined}
                >
                  <CertificationsForm
                    certifications={resumeData.certifications}
                    updateArrayItem={updateArrayItem}
                    addArrayItem={addArrayItem}
                    removeArrayItem={removeArrayItem}
                    moveArrayItem={moveArrayItem}
                  />
                </AccordionSection>

                {/* Languages & Interests */}
                <AccordionSection
                  title="Languages & Interests"
                  icon={<FaEllipsisH size={15} />}
                  isOpen={openSections.additional}
                  onToggle={() => toggleSection("additional")}
                >
                  <AdditionalInfoForm
                    languages={resumeData.languages}
                    interests={resumeData.interests}
                    updateArrayItem={updateArrayItem}
                    addArrayItem={addArrayItem}
                    removeArrayItem={removeArrayItem}
                    moveArrayItem={moveArrayItem}
                  />
                </AccordionSection>
              </div>
            )}

            {/* Bottom save button for convenience */}
            <div className="mt-4 pb-6">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="btn-small w-full justify-center gap-2"
              >
                <LuSave size={14} />
                {isLoading ? "Saving…" : "Save Resume"}
              </button>
            </div>
          </div>

          {/* ═══ LIVE PREVIEW PANEL ═══ */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#e8e8f0]">
            {/* Preview toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur border-b border-slate-200 shrink-0">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Live Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewScale(s => Math.max(0.3, +(s - 0.1).toFixed(1)))}
                  className="btn-small-light !px-2 !py-1"
                  title="Zoom out"
                >
                  <LuZoomOut size={13} />
                </button>
                <span className="text-xs font-mono text-slate-500 w-12 text-center">
                  {Math.round(previewScale * 100)}%
                </span>
                <button
                  onClick={() => setPreviewScale(s => Math.min(1.2, +(s + 0.1).toFixed(1)))}
                  className="btn-small-light !px-2 !py-1"
                  title="Zoom in"
                >
                  <LuZoomIn size={13} />
                </button>
                <button
                  className="btn-small gap-1.5 !py-1"
                  onClick={() => setShowPreview(true)}
                >
                  <LuDownload size={13} /> Download
                </button>
              </div>
            </div>

            {/* A4 canvas area */}
            <div className="flex-1 overflow-auto custom-scrollbar flex justify-center py-6 px-4">
              <div
                ref={resumeRef}
                style={{
                  width: "794px",             /* A4 at 96dpi */
                  transformOrigin: "top center",
                  transform: `scale(${previewScale})`,
                  marginBottom: `${(previewScale - 1) * 1122}px`,  /* compensate height */
                  boxShadow: "0 4px 40px rgba(0,0,0,0.18)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                {isFetching ? (
                  <div className="flex items-center justify-center h-96 bg-white">
                    <div className="w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                  </div>
                ) : (
                  <RenderResume
                    templateId={resumeData.template?.theme || "09"}
                    resumeData={resumeData}
                    colorPalette={resumeData.template?.colorPalette || []}
                    containerWidth={794}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── THEME SELECTOR MODAL ── */}
        <Modal
          isOpen={showTheme}
          onClose={() => setShowTheme(false)}
          title="Choose Theme & Style"
        >
          <div className="w-[90vw] h-[80vh]">
            <ThemeSelector
              selectedTheme={resumeData.template}
              setSelectedTheme={val => setResumeData(prev => ({ ...prev, template: val || prev.template }))}
              resumeData={resumeData}
              onClose={() => setShowTheme(false)}
            />
          </div>
        </Modal>

        {/* ── PREVIEW / DOWNLOAD MODAL ── */}
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title={resumeData.title}
          showActionBtn
          actionBtnText="Download PDF"
          onActionClick={() => reactToPrint()}
        >
          <div className="w-[90vw] md:w-[794px] h-[80vh] overflow-y-auto custom-scrollbar bg-slate-100">
            <div ref={resumeDownloadRef}>
              <RenderResume
                templateId={resumeData.template?.theme || "09"}
                resumeData={resumeData}
                colorPalette={resumeData.template?.colorPalette || []}
              />
            </div>
          </div>
        </Modal>
      </div>{/* end escape wrapper */}
    </DashboardLayout>
  );
}

export default EditResume;
