import React from 'react';
import Input from '../Inputs/Input.jsx';
import { LuPlus, LuTrash2 } from 'react-icons/lu';
import RatingInput from '../resume-sections/RatingInput';

function AdditionalInfoForm({ languages = [], interests = [], updateArrayItem, addArrayItem, removeArrayItem, onNext }) {
  console.log("AdditionalInfoForm languages:", languages); // Debug
  console.log("AdditionalInfoForm interests:", interests); // Debug

  const handleAddLanguage = () => {
    addArrayItem('languages', {
      name: "",
      progress: 0,
    });
  };

  const handleAddInterest = () => {
    addArrayItem('interests', '');
  };

  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-slate-100 mb-1 select-none">Additional Information</h2>
      <p className="text-xs text-slate-400 mb-4 select-none">Add your languages and personal interests.</p>

      <div className="mt-4 flex flex-col gap-6">
        {/* Languages Section */}
        <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[#0c0c1e]/60 backdrop-blur-md shadow-xl flex flex-col gap-4 transition hover:border-[rgba(255,255,255,0.08)]">
          <h3 className="text-sm font-bold text-slate-300 select-none">Languages</h3>
          {languages.map((lang, index) => (
            <div key={index} className="pb-4 border-b border-[rgba(255,255,255,0.03)] last:border-0 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-400">Language {index + 1}</span>
                {languages.length > 1 && (
                  <button
                    className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-xs select-none"
                    onClick={() => removeArrayItem('languages', index)}
                  >
                    <LuTrash2 size={14} />
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  value={lang?.name ?? ""}
                  onChange={(val) => updateArrayItem('languages', index, 'name', val)}
                  label="Language Name"
                  type="text"
                  placeholder="Enter language name (e.g., Spanish)"
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300 select-none">Proficiency</label>
                  <RatingInput
                    value={lang?.progress || 0}
                    onChange={({ value }) => updateArrayItem('languages', index, 'progress', value)}
                    total={5}
                    activeColor="#0ea5e9"
                    inactiveColor="#1e293b"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            className="flex items-center justify-center gap-2 p-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/20 hover:border-purple-500/40 rounded-xl transition text-xs font-bold w-full select-none mt-2"
            onClick={handleAddLanguage}
          >
            <LuPlus size={16} />
            Add Language
          </button>
        </div>

        {/* Interests Section */}
        <div className="p-4 rounded-xl border border-[rgba(255,255,255,0.04)] bg-[#0c0c1e]/60 backdrop-blur-md shadow-xl flex flex-col gap-4 transition hover:border-[rgba(255,255,255,0.08)]">
          <h3 className="text-sm font-bold text-slate-300 select-none">Interests</h3>
          {interests.map((interest, index) => (
            <div key={index} className="pb-4 border-b border-[rgba(255,255,255,0.03)] last:border-0 last:pb-0">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-400">Interest {index + 1}</span>
                {interests.length > 1 && (
                  <button
                    className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-xs select-none"
                    onClick={() => removeArrayItem('interests', index)}
                  >
                    <LuTrash2 size={14} />
                    Remove
                  </button>
                )}
              </div>
              <Input
                value={interest ?? ""}
                onChange={(val) => updateArrayItem('interests', index, null, val)}
                label="Interest"
                type="text"
                placeholder="Enter interest (e.g., Hiking)"
              />
            </div>
          ))}
          <button
            className="flex items-center justify-center gap-2 p-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/20 hover:border-purple-500/40 rounded-xl transition text-xs font-bold w-full select-none mt-2"
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
