import React from 'react';
import ProfilePhotoSelector from '../Inputs/ProfilePhotoSelector.jsx';
import Input from '../Inputs/Input.jsx';

function ProfileInfoForm({ profileData, updateSection}) {
  return (
    <div className="p-4 flex flex-col">
      <ProfilePhotoSelector
        image={profileData?.profileImg || profileData?.profilePreviewUrl}
        setImage={(value) => updateSection("profileImg", value)}
        preview={profileData?.profilePreviewUrl}
        setPreview={(value) => updateSection("profilePreviewUrl", value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="col-span-1 md:col-span-2 mt-1">
          <label className="text-[13px] text-white/70 font-medium ml-1">
            Summary
          </label>
          <textarea
            placeholder="Short Introduction"
            className="from-input min-h-[100px] resize-y custom-scrollbar"
            rows={4}
            value={profileData?.summary || ""}
            onChange={({ target }) => updateSection("summary", target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default ProfileInfoForm;