import React from 'react';
import Input from '../../../Component/Inputs/Input.jsx';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

function WorkExperienceForm({ workExperience, updateArrayItem, addArrayItem, removeArrayItem, onNext }) {
  console.log("WorkExperienceForm workExperience:", workExperience); // Debug

  const handleAddExperience = () => {
    addArrayItem('workExperience', {
      company: undefined,
      role: undefined,
      startDate: undefined,
      endDate: undefined,
      description: undefined,
    });
  };

  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
      <div className="mt-4">
        {workExperience.map((exp, index) => (
          <div key={index} className="mb-6 border-b border-slate-100 pb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">Experience {index + 1}</h3>
              {workExperience.length > 1 && (
                <button
                  className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
                  onClick={() => removeArrayItem('workExperience', index)}
                >
                  <LuTrash2 size={16} />
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                value={exp.company ?? ""}
                onChange={({ target }) => updateArrayItem('workExperience', index, 'company', target.value)}
                label="Company"
                type="text"
                placeholder="Enter company name"
              />
              <Input
                value={exp.role ?? ""}
                onChange={({ target }) => updateArrayItem('workExperience', index, 'role', target.value)}
                label="Role"
                type="text"
                placeholder="Enter your role or title"
              />
              <Input
                value={exp.startDate ?? ""}
                onChange={({ target }) => updateArrayItem('workExperience', index, 'startDate', target.value)}
                label="Start Date"
                type="text"
                placeholder="Enter start date (e.g., MM/YYYY)"
              />
              <Input
                value={exp.endDate ?? ""}
                onChange={({ target }) => updateArrayItem('workExperience', index, 'endDate', target.value)}
                label="End Date"
                type="text"
                placeholder="Enter end date (e.g., MM/YYYY or Present)"
              />
              <div className="col-span-2">
                <label className="text-xs font-medium text-slate-600">Description</label>
                <textarea
                  placeholder="Describe your responsibilities and achievements"
                  className="form-input"
                  rows={4}
                  value={exp.description ?? ""}
                  onChange={({ target }) => updateArrayItem('workExperience', index, 'description', target.value)}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          className="btn-small-light flex items-center gap-2"
          onClick={handleAddExperience}
        >
          <LuPlus size={16} />
          Add Experience
        </button>
      </div>
    </div>
  );
}

export default WorkExperienceForm;