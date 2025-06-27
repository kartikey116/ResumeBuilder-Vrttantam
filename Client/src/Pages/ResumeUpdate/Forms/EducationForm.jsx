
import React from 'react';
import Input from '../../../Component/Inputs/Input.jsx';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

function EducationForm({ education, updateArrayItem, addArrayItem, removeArrayItem, onNext }) {
  console.log("EducationForm education:", education); // Debug

  const handleAddEducation = () => {
    addArrayItem('education', {
      degree: undefined,
      institution: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">Education</h2>
      <div className="mt-4">
        {education.map((edu, index) => (
          <div key={index} className="mb-6 border-b border-slate-100 pb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">Education {index + 1}</h3>
              {education.length > 1 && (
                <button
                  className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
                  onClick={() => removeArrayItem('education', index)}
                >
                  <LuTrash2 size={16} />
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                value={edu.degree ?? ""}
                onChange={({ target }) => updateArrayItem('education', index, 'degree', target.value)}
                label="Degree"
                type="text"
                placeholder="Enter your degree (e.g., B.S. Computer Science)"
              />
              <Input
                value={edu.institution ?? ""}
                onChange={({ target }) => updateArrayItem('education', index, 'institution', target.value)}
                label="Institution"
                type="text"
                placeholder="Enter institution name"
              />
              <Input
                value={edu.startDate ?? ""}
                onChange={({ target }) => updateArrayItem('education', index, 'startDate', target.value)}
                label="Start Date"
                type="text"
                placeholder="Enter start date (e.g., MM/YYYY)"
              />
              <Input
                value={edu.endDate ?? ""}
                onChange={({ target }) => updateArrayItem('education', index, 'endDate', target.value)}
                label="End Date"
                type="text"
                placeholder="Enter end date (e.g., MM/YYYY or Present)"
              />
            </div>
          </div>
        ))}
        <button
          className="btn-small-light flex items-center gap-2"
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