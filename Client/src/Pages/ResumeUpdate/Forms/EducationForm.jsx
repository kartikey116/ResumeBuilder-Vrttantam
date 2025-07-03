
import React from 'react';
import Input from '../../../COmponent/Inputs/Input.jsx';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

function EducationForm({ education, updateArrayItem, addArrayItem, removeArrayItem, onNext }) {
  console.log("EducationForm education:", education); // Debug

  const handleAddEducation = () => {
    addArrayItem('education', {
      degree: "",
      institution: "",
      startDate:"",
      endDate: "",
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
                onChange={(val) => updateArrayItem('education', index, 'degree', val)}
                label="Degree"
                type="text"
                placeholder="Enter your degree (e.g., B.S. Computer Science)"
              />
              <Input
                value={edu.institution ?? ""}
                onChange={(val) => updateArrayItem('education', index, 'institution', val)}
                label="Institution"
                type="text"
                placeholder="Enter institution name"
              />
              <Input
                value={edu.startDate ?? ""}
                onChange={(val) => updateArrayItem('education', index, 'startDate', val)}
                label="Start Date"
                type="month"
                placeholder="Enter start date (e.g., MM/YYYY)"
              />
              <Input
                value={edu.endDate ?? ""}
                onChange={(val) => updateArrayItem('education', index, 'endDate', val)}
                label="End Date"
                type="month"
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