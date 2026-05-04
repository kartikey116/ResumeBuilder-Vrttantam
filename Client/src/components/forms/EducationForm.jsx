import React from 'react';
import Input from '../Inputs/Input.jsx';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

function EducationForm({ education = [], updateArrayItem, addArrayItem, removeArrayItem, moveArrayItem }) {
  console.log("EducationForm education:", education); // Debug

  const handleAddEducation = () => {
    addArrayItem('education', {
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      grade: "",
      isCurrentlyStudying: false,
    });
  };

  const handleCurrentlyStudyingChange = (index, isChecked) => {
    updateArrayItem('education', index, {
      isCurrentlyStudying: isChecked,
      endDate: isChecked ? 'Present' : ''
    });
  };

  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-slate-100 mb-1 select-none">Education</h2>
      <p className="text-xs text-slate-400 mb-4 select-none">Add your academic background and details.</p>

      <div className="mt-4 flex flex-col gap-4">
        {education.map((edu, index) => (
          <div 
            key={index} 
            className="p-4 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[#0c0c1e]/60 backdrop-blur-md shadow-xl flex flex-col gap-3 transition hover:border-[rgba(255,255,255,0.08)]"
          >
            <div className="flex justify-between items-center select-none">
              <span className="text-xs font-bold text-slate-400 font-mono tracking-wider">Education {index + 1}</span>
              <div className="flex items-center gap-2">
                {education.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-slate-200 transition px-1 text-sm font-bold"
                      onClick={() => moveArrayItem && moveArrayItem('education', index, 'up')}
                      disabled={index === 0}
                      title="Move Up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-slate-200 transition px-1 text-sm font-bold"
                      onClick={() => moveArrayItem && moveArrayItem('education', index, 'down')}
                      disabled={index === education.length - 1}
                      title="Move Down"
                    >
                      ↓
                    </button>
                  </>
                )}
                {education.length > 0 && (
                  <button
                    type="button"
                    className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-xs"
                    onClick={() => removeArrayItem && removeArrayItem('education', index)}
                    title="Delete Education"
                  >
                    <LuTrash2 size={15} />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={edu?.degree ?? ""}
                onChange={(val) => updateArrayItem('education', index, 'degree', val)}
                label="Degree"
                type="text"
                placeholder="e.g., B.S. Computer Science"
              />
              <Input
                value={edu?.institution ?? ""}
                onChange={(val) => updateArrayItem('education', index, 'institution', val)}
                label="Institution"
                type="text"
                placeholder="Enter institution name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={edu?.startDate ?? ""}
                onChange={(val) => updateArrayItem('education', index, 'startDate', val)}
                label="Start Date"
                type="month"
              />
              <Input
                value={edu?.endDate ?? ""}
                onChange={(val) => updateArrayItem('education', index, 'endDate', val)}
                label="End Date"
                type="month"
                disabled={edu?.isCurrentlyStudying}
              />
            </div>

            <div className="flex items-center gap-2 -mt-1 select-none">
              <input
                type="checkbox"
                id={`currentlyStudying-${index}`}
                checked={edu?.isCurrentlyStudying || false}
                onChange={(e) => handleCurrentlyStudyingChange(index, e.target.checked)}
                className="accent-purple-600 rounded"
              />
              <label htmlFor={`currentlyStudying-${index}`} className="text-xs font-medium text-slate-300 cursor-pointer">
                Currently studying here
              </label>
            </div>

            <div>
              <Input
                value={edu?.grade ?? ""}
                onChange={(val) => updateArrayItem('education', index, 'grade', val)}
                label="Grade / CGPA"
                type="text"
                placeholder="e.g., 3.8/4.0 or 8.5/10"
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          className="flex items-center justify-center gap-2 p-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/20 hover:border-purple-500/40 rounded-xl transition text-xs font-bold w-full select-none mt-2"
          onClick={handleAddEducation}
        >
          <LuPlus size={16} />
          Add Education
        </button>
      </div>
    </div>
  );
}

export default EducationForm;