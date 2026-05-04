import React from 'react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

function SkillsForm({ skills = [], updateArrayItem, addArrayItem, removeArrayItem, moveArrayItem }) {
  console.log("SkillsForm skills:", skills);

  const handleAddSkill = () => {
    addArrayItem('skills', {
      category: "",
      name: "",
    });
  };

  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-slate-100 mb-1 select-none">Skills</h2>
      <p className="text-xs text-slate-400 mb-4 select-none">Add your skills grouped by category. Comma separate individual skills.</p>
      
      <div className="flex flex-col gap-4">
        {skills.map((skill, index) => {
          const pills = (skill?.name || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);

          return (
            <div 
              key={index} 
              className="p-4 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[#0c0c1e]/60 backdrop-blur-md shadow-xl flex flex-col gap-3 transition hover:border-[rgba(255,255,255,0.08)]"
            >
              <div className="flex justify-between items-center select-none">
                <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">Group {index + 1}</span>
                <div className="flex items-center gap-2">
                  {skills.length > 1 && (
                    <>
                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-200 transition px-1 text-sm font-bold"
                        onClick={() => moveArrayItem && moveArrayItem('skills', index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-200 transition px-1 text-sm font-bold"
                        onClick={() => moveArrayItem && moveArrayItem('skills', index, 'down')}
                        disabled={index === skills.length - 1}
                        title="Move Down"
                      >
                        ↓
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-xs"
                    onClick={() => removeArrayItem && removeArrayItem('skills', index)}
                    title="Delete Group"
                  >
                    <LuTrash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Category Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 select-none">
                  Category Title
                </label>
                <input
                  type="text"
                  value={skill?.category || ""}
                  onChange={(e) => updateArrayItem && updateArrayItem('skills', index, 'category', e.target.value)}
                  placeholder="e.g., Programming Languages"
                  className="bg-[#070713] border border-[rgba(255,255,255,0.06)] rounded-xl text-xs p-2.5 w-full text-slate-100 outline-none focus:border-purple-500/40 select-text transition"
                />
              </div>

              {/* Skills Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-300 select-none">
                  Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={skill?.name || ""}
                  onChange={(e) => updateArrayItem && updateArrayItem('skills', index, 'name', e.target.value)}
                  placeholder="e.g., JavaScript, TypeScript, Python"
                  className="bg-[#070713] border border-[rgba(255,255,255,0.06)] rounded-xl text-xs p-2.5 w-full text-slate-100 outline-none focus:border-purple-500/40 select-text transition"
                />
              </div>

              {/* Live Pill Preview to match the premium screenshot exactly */}
              {pills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1 border-t border-[rgba(255,255,255,0.03)] pt-2.5">
                  {pills.map((p, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-300 shadow-sm transition hover:scale-105 select-none"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        <button
          type="button"
          className="flex items-center justify-center gap-2 p-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/20 hover:border-purple-500/40 rounded-xl transition text-xs font-bold w-full select-none"
          onClick={handleAddSkill}
        >
          <LuPlus size={16} />
          Add Skill Group
        </button>
      </div>
    </div>
  );
}

export default SkillsForm;
