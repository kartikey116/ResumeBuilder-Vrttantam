import React from 'react';
import ProfilePhotoSelector from '../../../COmponent/Inputs/ProfilePhotoSelector.jsx'; // Corrected path
import Input from '../../../COmponent/Inputs/Input.jsx';

function ProfileInfoForm({ profileData, updateSection}) {
  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">
        Personal Information
      </h2>

      <div className="mt-4">
        <ProfilePhotoSelector
          image={profileData?.profileImg || profileData?.profilePreviewUrl}
          setImage={(value) => updateSection("profileImg", value)}
          preview={profileData?.profilePreviewUrl}
          setPreview={(value) => updateSection("profilePreviewUrl", value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            value={profileData?.fullName || ""}
            onChange={(val) => updateSection("fullName", val)}
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
          />
          <Input
            value={profileData?.designation || ""}
            onChange={(val) => updateSection("designation", val)}
            label="Designation"
            type="text"
            placeholder="Enter your designation"
          />

          <div className="col-span-2 mt-3">
            <label className="text-xs font-medium text-slate-600">
              Summary
            </label>
            <textarea
              placeholder="Short Introduction" // Fixed typo
              className="from-input"
              rows={4}
              value={profileData?.summary || ""}
              onChange={({ target }) => updateSection("summary", target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfoForm; // Fixed export