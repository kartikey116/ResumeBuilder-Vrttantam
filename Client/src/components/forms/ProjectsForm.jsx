import React, { useState } from 'react';
import Input from '../Inputs/Input.jsx';
import { LuPlus, LuTrash2, LuLoader } from 'react-icons/lu';
import { FaMagic } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import toast from 'react-hot-toast';

function ProjectsForm({ projects, updateArrayItem, addArrayItem, removeArrayItem, moveArrayItem }) {
  const [enhancing, setEnhancing] = useState({});

  const handleAIEnhance = async (index) => {
    const proj = projects[index];
    const bulletPoint = proj?.description?.trim();
    if (!bulletPoint) {
      toast.error('Please write a description first.');
      return;
    }
    setEnhancing(prev => ({ ...prev, [index]: true }));
    try {
      const response = await axiosInstance.post(API_PATHS.AI.ENHANCE_BULLET, {
        bulletPoint,
        roleTarget: `${proj.title || 'Project'} developer`,
      });
      if (response.data?.enhanced) {
        const cleaned = response.data.enhanced.replace(/^\s*\n+/, '').trim();
        updateArrayItem('projects', index, 'description', cleaned);
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
        {projects.map((project, index) => (
          <div key={index} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 transition-all hover:border-[rgba(255,255,255,0.1)]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wide">
                Project {index + 1}
              </h3>
              <div className="flex gap-2 items-center">
                {projects.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-white transition-colors px-1 disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={() => moveArrayItem('projects', index, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-white transition-colors px-1 disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={() => moveArrayItem('projects', index, 'down')}
                      disabled={index === projects.length - 1}
                    >
                      ↓
                    </button>
                  </>
                )}
                {projects.length > 1 && (
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 text-xs transition-colors ml-2"
                    onClick={() => removeArrayItem('projects', index)}
                  >
                    <LuTrash2 size={13} />
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Input
                label="Project Title"
                placeholder="AI Resume Builder"
                type="text"
                value={project.title || ""}
                onChange={(val) => updateArrayItem("projects", index, "title", val)}
              />

              {/* Description + AI enhance */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[13px] text-white/70 font-medium ml-1">Description</label>
                  <button
                    type="button"
                    onClick={() => handleAIEnhance(index)}
                    disabled={enhancing[index]}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-300 bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.3)] hover:bg-[rgba(124,58,237,0.25)] hover:border-[rgba(124,58,237,0.5)] px-2.5 py-1 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enhancing[index]
                      ? <LuLoader size={11} className="animate-spin" />
                      : <FaMagic size={11} />
                    }
                    {enhancing[index] ? 'Enhancing...' : 'AI Enhance ✨'}
                  </button>
                </div>
                <textarea
                  placeholder={"• Built with React and Node.js...\n• Reduced API response time by 30%...\n• Deployed on AWS with 99.9% uptime..."}
                  className="from-input min-h-[90px] resize-y custom-scrollbar"
                  rows={3}
                  value={project.description || ""}
                  onChange={({ target }) => updateArrayItem("projects", index, "description", target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="GitHub Link"
                  placeholder="https://github.com/..."
                  type="url"
                  value={project.github || ""}
                  onChange={(val) => updateArrayItem("projects", index, "github", val)}
                />
                <Input
                  label="Live Demo"
                  placeholder="https://..."
                  type="url"
                  value={project.liveDemo || ""}
                  onChange={(val) => updateArrayItem("projects", index, "liveDemo", val)}
                />
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn-small-light flex items-center gap-2 text-xs w-fit"
          onClick={() => addArrayItem("projects", {
            title: "",
            description: "",
            github: "",
            liveDemo: "",
          })}
        >
          <LuPlus size={14} />
          Add Project
        </button>
      </div>
    </div>
  );
}

export default ProjectsForm;