import React, { useState } from 'react';
import Input from '../../../COmponent/Inputs/Input.jsx';
import { LuPlus, LuTrash2, LuLoader } from 'react-icons/lu';
import { FaMagic } from 'react-icons/fa';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import toast from 'react-hot-toast';

function ProjectsForm({ projects, updateArrayItem, addArrayItem, removeArrayItem }) {
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
    <div className="pt-3">
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Project {index + 1}
              </h3>
              {projects.length > 1 && (
                <button
                  type="button"
                  className="text-red-400 hover:text-red-600 flex items-center gap-1 text-xs transition-colors"
                  onClick={() => removeArrayItem('projects', index)}
                >
                  <LuTrash2 size={13} />
                  Remove
                </button>
              )}
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
                  <label className="text-xs font-medium text-slate-600">Description</label>
                  <button
                    type="button"
                    onClick={() => handleAIEnhance(index)}
                    disabled={enhancing[index]}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
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
                  className="from-input"
                  rows={3}
                  value={project.description || ""}
                  onChange={({ target }) => updateArrayItem("projects", index, "description", target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
          className="btn-small-light flex items-center gap-2 text-xs"
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