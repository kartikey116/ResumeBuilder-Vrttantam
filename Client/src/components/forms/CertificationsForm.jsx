import React from 'react';
import Input from '../Inputs/Input.jsx';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

function CertificationsForm({ certifications, updateArrayItem, addArrayItem, removeArrayItem, moveArrayItem, onNext }) {
  console.log("CertificationsForm certifications:", certifications); // Debug

  const handleAddCertification = () => {
    addArrayItem('certifications', {
      title: "",
      issuer:"",
      year: "",
    });
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <div key={index} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 transition-all hover:border-[rgba(255,255,255,0.1)]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wide">
                Certification {index + 1}
              </h3>
              <div className="flex gap-2 items-center">
                {certifications.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-white transition-colors px-1 disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={() => moveArrayItem('certifications', index, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      className="text-slate-400 hover:text-white transition-colors px-1 disabled:opacity-30 disabled:cursor-not-allowed"
                      onClick={() => moveArrayItem('certifications', index, 'down')}
                      disabled={index === certifications.length - 1}
                    >
                      ↓
                    </button>
                  </>
                )}
                {certifications.length > 1 && (
                  <button
                    className="text-red-400 hover:text-red-300 flex items-center gap-1 text-xs transition-colors ml-2"
                    onClick={() => removeArrayItem('certifications', index)}
                  >
                    <LuTrash2 size={13} />
                    Remove
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <Input
                  label="Certification Title"
                  value={cert.title || ""}
                  onChange={(val) => updateArrayItem('certifications', index, 'title', val)}
                  type="text"
                  placeholder="AWS Certified Developer"
                />
              </div>
              <Input
                value={cert.issuer ?? ""}
                onChange={(val) => updateArrayItem('certifications', index, 'issuer', val)}
                label="Issuer"
                type="text"
                placeholder="Issuing organization"
              />
              <Input
                value={cert.year ?? ""}
                onChange={(val) => updateArrayItem('certifications', index, 'year', val)}
                label="Year"
                type="text"
                placeholder="Year obtained (e.g., 2023)"
              />
            </div>
          </div>
        ))}
        <button
          className="btn-small-light flex items-center gap-2 w-fit"
          onClick={handleAddCertification}
        >
          <LuPlus size={14} />
          Add Certification
        </button>
      </div>
    </div>
  );
}

export default CertificationsForm;