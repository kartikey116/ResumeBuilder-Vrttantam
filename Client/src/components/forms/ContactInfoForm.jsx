import React from 'react';
import Input from '../Inputs/Input.jsx';

function ContactInfoForm({ contactInfo, updateSection, onNext }) {
  return (
    <div className="p-4 flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          value={contactInfo?.email ?? ""}
          onChange={(val) => updateSection("email", val)}
          label="Email"
          type="email"
          placeholder="Enter your email"
        />
        <Input
          value={contactInfo?.phone ?? ""}
          onChange={(val) => updateSection("phone", val)}
          label="Phone Number"
          type="tel"
          placeholder="Enter your phone number"
        />
        <Input
          value={contactInfo?.location ?? ""}
          onChange={(val) => updateSection("location", val)}
          label="Address"
          type="text"
          placeholder="City, Country"
        />
        <Input
          value={contactInfo?.linkedin ?? ""}
          onChange={(val) => updateSection("linkedin", val)}
          label="LinkedIn"
          type="url"
          placeholder="LinkedIn URL"
        />
        <Input
          value={contactInfo?.github ?? ""}
          onChange={(val) => updateSection("github", val)}
          label="GitHub"
          type="url"
          placeholder="GitHub URL"
        />
        <Input
          value={contactInfo?.website ?? ""}
          onChange={(val) => updateSection("website", val)}
          label="Portfolio/Website"
          type="url"
          placeholder="Portfolio URL"
        />
      </div>
    </div>
  );
}

export default ContactInfoForm;