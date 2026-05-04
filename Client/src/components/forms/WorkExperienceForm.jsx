import React, { useState } from 'react';
import Input from '../Inputs/Input.jsx';
import { LuPlus, LuTrash2, LuLoader } from 'react-icons/lu';
import { FaMagic } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import toast from 'react-hot-toast';

function WorkExperienceForm({ workExperience, updateArrayItem, addArrayItem, removeArrayItem, moveArrayItem }) {

  const [enhancing, setEnhancing] = useState({}); // { [index]: true/false }

  const handleAddExperience = () => {
    addArrayItem('workExperience', {
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrentlyWorking: false,
    });
  };

  const handleCurrentlyWorkingChange = (index, isChecked) => {
    updateArrayItem('workExperience', index, {
      isCurrentlyWorking: isChecked,
      endDate: isChecked ? 'Present' : ''
    });
  };

  const handleAIEnhance = async (index) => {
    const exp = workExperience[index];
    const bulletPoint = exp?.description?.trim();
    if (!bulletPoint) {
      toast.error('Please write a description first.');
      return;
    }
    setEnhancing(prev => ({ ...prev, [index]: true }));
    try {
      const response = await axiosInstance.post(API_PATHS.AI.ENHANCE_BULLET, {
        bulletPoint,
        roleTarget: exp.role || 'Professional',
      });
      if (response.data?.enhanced) {
        // Strip leading newlines / whitespace
        const cleaned = response.data.enhanced.replace(/^\s*\n+/, '').trim();
        updateArrayItem('workExperience', index, 'description', cleaned);
        toast.success('✨ Description enhanced!');
      }
    } catch (err) {
      console.error('AI enhance error:', err);
      toast.error('AI enhance failed. Please try again.');
    } finally {
      setEnhancing(prev => ({ ...prev, [index]: false }));
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="space-y-4">
        {workExperience.map((exp, index) => (
          <div key={index} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 transition-all hover:border-[rgba(255,255,255,0.1)]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wide">
                Experience {index + 1}
              </h3>
              <div className="flex gap-2 items-center">
                {workExperience.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-white transition-colors px-1 disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={() => moveArrayItem('workExperience', index, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-white transition-colors px-1 disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={() => moveArrayItem('workExperience', index, 'down')}
                      disabled={index === workExperience.length - 1}
                    >
                      ↓
                    </button>
                  </>
                )}
                {workExperience.length > 0 && (
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 text-xs transition-colors ml-2"
                    onClick={() => removeArrayItem('workExperience', index)}
                  >
                    <LuTrash2 size={13} />
                    Remove
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  value={exp?.company ?? ""}
                  onChange={(val) => updateArrayItem('workExperience', index, 'company', val)}
                  label="Company"
                  type="text"
                  placeholder="Acme Corp"
                />
                <Input
                  value={exp?.role ?? ""}
                  onChange={(val) => updateArrayItem('workExperience', index, 'role', val)}
                  label="Role / Title"
                  type="text"
                  placeholder="Software Engineer"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  value={exp?.startDate ?? ""}
                  onChange={(val) => updateArrayItem('workExperience', index, 'startDate', val)}
                  label="Start Date"
                  type="month"
                />
                <Input
                  value={exp?.endDate ?? ""}
                  onChange={(val) => updateArrayItem('workExperience', index, 'endDate', val)}
                  label="End Date"
                  type="month"
                  disabled={exp.isCurrentlyWorking}
                />
              </div>
              <div className="flex items-center gap-2 -mt-1 ml-1 mb-2">
                <input
                  type="checkbox"
                  id={`currentlyWorking-${index}`}
                  checked={exp.isCurrentlyWorking || false}
                  onChange={(e) => handleCurrentlyWorkingChange(index, e.target.checked)}
                  className="accent-purple-600 w-3.5 h-3.5"
                />
                <label htmlFor={`currentlyWorking-${index}`} className="text-xs text-slate-300 cursor-pointer">
                  Currently working here
                </label>
              </div>

              {/* Description with AI enhance */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[13px] text-white/70 font-medium ml-1">
                    Description & Achievements
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAIEnhance(index)}
                    disabled={enhancing[index]}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-300 bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.3)] hover:bg-[rgba(124,58,237,0.25)] hover:border-[rgba(124,58,237,0.5)] px-2.5 py-1 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    title="AI-enhance this description"
                  >
                    {enhancing[index]
                      ? <LuLoader size={11} className="animate-spin" />
                      : <FaMagic size={11} />
                    }
                    {enhancing[index] ? 'Enhancing...' : 'AI Enhance ✨'}
                  </button>
                </div>
                <textarea
                  placeholder={"• Led a team of 5 engineers...\n• Reduced load time by 40%...\n• Built CI/CD pipeline using GitHub Actions..."}
                  className="from-input min-h-[100px] resize-y custom-scrollbar"
                  rows={4}
                  value={exp?.description ?? ""}
                  onChange={(e) => updateArrayItem('workExperience', index, 'description', e.target.value)}
                />
                <p className="text-[10px] text-slate-500 mt-1.5 ml-1">
                  💡 Tip: Write one bullet per line. Use numbers & outcomes for higher ATS scores.
                </p>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn-small-light flex items-center gap-2 text-xs w-fit"
          onClick={handleAddExperience}
        >
          <LuPlus size={14} />
          Add Experience
        </button>
      </div>
    </div>
  );
}

export default WorkExperienceForm;