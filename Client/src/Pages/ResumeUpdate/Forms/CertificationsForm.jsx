import React from 'react';
import Input from '../../../Component/Inputs/Input.jsx';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

function CertificationsForm({ certifications, updateArrayItem, addArrayItem, removeArrayItem, onNext }) {
  console.log("CertificationsForm certifications:", certifications); // Debug

  const handleAddCertification = () => {
    addArrayItem('certifications', {
      title: undefined,
      issuer: undefined,
      year: undefined,
    });
  };

  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">Certifications</h2>
      <div className="mt-4">
        {certifications.map((cert, index) => (
          <div key={index} className="mb-6 border-b border-slate-100 pb-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">Certification {index + 1}</h3>
              {certifications.length > 1 && (
                <button
                  className="text-red-500 hover:text-red-600 flex items-center gap-1 text-sm"
                  onClick={() => removeArrayItem('certifications', index)}
                >
                  <LuTrash2 size={16} />
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Certification Title"
                value={cert.title || ""}
                onChange={({ target }) => updateArrayItem('certifications', index, 'title', target.value)}
                type="text"
                placeholder="AWS Certified Developer"
              />
              <Input
                value={cert.issuer ?? ""}
                onChange={({ target }) => updateArrayItem('certifications', index, 'issuer', target.value)}
                label="Issuer"
                type="text"
                placeholder="Enter issuing organization (e.g., Amazon Web Services)"
              />
              <Input
                value={cert.year ?? ""}
                onChange={({ target }) => updateArrayItem('certifications', index, 'year', target.value)}
                label="Year"
                type="text"
                placeholder="Enter year obtained (e.g., 2023)"
              />
            </div>
          </div>
        ))}
        <button
          className="btn-small-light flex items-center gap-2"
          onClick={handleAddCertification}
        >
          <LuPlus size={16} />
          Add Certification
        </button>
      </div>
    </div>
  );
}

export default CertificationsForm;