import React from 'react';
import Input from '../../../COmponent/Inputs/Input.jsx';

function ContactInfoForm({ contactInfo, updateSection, onNext }) {
  console.log("ContactInfoForm contactInfo:", contactInfo); 

  return (
    <div className="px-5 pt-5">
      <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            value={contactInfo?.email ?? ""}
            onChange={(val) => updateSection("email", val)}
            label="Email"
            type="email"
            placeholder="Enter your email (e.g., example@domain.com)"
          />
          <Input
            value={contactInfo?.phone ?? ""}
            onChange={(val) => updateSection("phone", val)}
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number (e.g., +1234567890)"
          />
          <Input
            value={contactInfo?.location ?? ""}
            onChange={(val) => updateSection("location", val)}
            label="Address"
            type="text"
            placeholder="Enter your address (e.g., City, Country)"
          />
          <Input
            value={contactInfo?.linkedin ?? ""}
            onChange={(val) => updateSection("linkedin", val)}
            label="LinkedIn"
            type="url"
            placeholder="Enter your LinkedIn profile URL"
          />
          <Input
            value={contactInfo?.github ?? ""}
            onChange={(val) => updateSection("github", val)}
            label="GitHub"
            type="url"
            placeholder="Enter your GitHub profile URL"
          />
          <Input
            value={contactInfo?.website ?? ""}
            onChange={(val) => updateSection("website", val)}
            label="Portfolio/Website"
            type="url"
            placeholder="Enter your portfolio or website URL"
          />
        </div>
      </div>
    </div>
  );
}

export default ContactInfoForm;