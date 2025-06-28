import React from 'react';
import Input from '../../../Component/Inputs/Input.jsx';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import RatingInput from '../../../Component/ResumeSections/RatingInput';

function AdditionalInfoForm({ languages, interests, updateArrayItem, addArrayItem, removeArrayItem, onNext }) {
  console.log("AdditionalInfoForm languages:", languages); // Debug
  console.log("AdditionalInfoForm interests:", interests); // Debug

  const handleAddLanguage = () => {
    addArrayItem('languages', {
      name: undefined,
      progress: 0,
    });
  };

  const handleAddInterest = () => {
    addArrayItem('interests', '');
  };

  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">Additional Information</h2>
      <div className="mt-4">
        {/* Languages Section */}
        <div className="mb-8">
          <h3 className="text-md font-medium text-gray-800 mb-3">Languages</h3>
          {languages.map((lang, index) => (
            <div key={index} className="mb-6 border-b border-slate-100 pb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-700">Language {index + 1}</h4>
                {languages.length > 1 && (
                  <button
                    className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
                    onClick={() => removeArrayItem('languages', index)}
                  >
                    <LuTrash2 size={16} />
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  value={lang.name ?? ""}
                  onChange={({ target }) => updateArrayItem('languages', index, 'name', target.value)}
                  label="Language Name"
                  type="text"
                  placeholder="Enter language name (e.g., Spanish)"
                />
                <div>
                  <label className="text-xs font-medium text-slate-600">Proficiency</label>
                  <RatingInput
                    value={lang.progress || 0}
                    onChange={({ value }) => updateArrayItem('languages', index, 'progress', value)}
                    total={5}
                    activeColor="#0ea5e9"
                    inactiveColor="#e0f2fe"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            className="btn-small-light flex items-center gap-2"
            onClick={handleAddLanguage}
          >
            <LuPlus size={16} />
            Add Language
          </button>
        </div>

        {/* Interests Section */}
        <div>
          <h3 className="text-md font-medium text-gray-800 mb-3">Interests</h3>
          {interests.map((interest, index) => (
            <div key={index} className="mb-6 border-b border-slate-100 pb-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-700">Interest {index + 1}</h4>
                {interests.length > 1 && (
                  <button
                    className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
                    onClick={() => removeArrayItem('interests', index)}
                  >
                    <LuTrash2 size={16} />
                    Remove
                  </button>
                )}
              </div>
              <Input
                value={interest ?? ""}
                onChange={({ target }) => updateArrayItem('interests', index, null, target.value)}
                label="Interest"
                type="text"
                placeholder="Enter interest (e.g., Hiking)"
              />
            </div>
          ))}
          <button
            className="btn-small-light flex items-center gap-2"
            onClick={handleAddInterest}
          >
            <LuPlus size={16} />
            Add Interest
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdditionalInfoForm;
