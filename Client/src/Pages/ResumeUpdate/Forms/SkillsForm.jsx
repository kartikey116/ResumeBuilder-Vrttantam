
import React from 'react';
import Input from '../../../Component/Inputs/Input.jsx';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

function SkillsForm({ skills, updateArrayItem, addArrayItem, removeArrayItem, onNext }) {
  console.log("SkillsForm skills:", skills); // Debug

  const handleAddSkill = () => {
    addArrayItem('skills', {
      name: undefined,
      progress: 0,
    });
  };

  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
      <div className="mt-4">
        {skills.map((skill, index) => (
          <div key={index} className="mb-6 border-b border-slate-100 pb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">Skill {index + 1}</h3>
              {skills.length > 1 && (
                <button
                  className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
                  onClick={() => removeArrayItem('skills', index)}
                >
                  <LuTrash2 size={16} />
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                value={skill.name ?? ""}
                onChange={({ target }) => updateArrayItem('skills', index, 'name', target.value)}
                label="Skill Name"
                type="text"
                placeholder="Enter skill name (e.g., JavaScript)"
              />
              <div>
                <label className="text-xs font-medium text-slate-600">Proficiency (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={skill.progress ?? 0}
                  onChange={({ target }) => updateArrayItem('skills', index, 'progress', parseInt(target.value) || 0)}
                  className="form-input"
                  placeholder="Enter proficiency (0-100)"
                />
              </div>
            </div>
          </div>
        ))}
        <button
          className="btn-small-light flex items-center gap-2"
          onClick={handleAddSkill}
        >
          <LuPlus size={16} />
          Add Skill
        </button>
      </div>
    </div>
  );
}

export default SkillsForm;
