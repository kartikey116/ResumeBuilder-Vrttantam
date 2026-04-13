import React from 'react'

const TemplateCard = ({ thumbnailImg, isSelected, onSelect, label, badge }) => {
  return (
    <div
      className={`relative flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-200
        border-2 hover:shadow-md hover:-translate-y-0.5
        ${isSelected ? "border-purple-500 shadow-purple-200 shadow-md" : "border-gray-200 hover:border-purple-300"}`}
      onClick={onSelect}
    >
      {/* Selected checkmark */}
      {isSelected && (
        <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      {/* Badge (ATS score / style tag) */}
      {badge && (
        <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur text-[9px] font-bold text-purple-700 px-1.5 py-0.5 rounded-full border border-purple-200 shadow-sm">
          {badge}
        </div>
      )}

      {/* Thumbnail */}
      <div className="bg-gray-50 min-h-[160px] flex items-center justify-center">
        {thumbnailImg ? (
          <img src={thumbnailImg} alt={label || "Template"} className="w-full object-top object-cover" />
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center">
            <span className="text-3xl">📄</span>
          </div>
        )}
      </div>

      {/* Label */}
      {label && (
        <div className="bg-white px-2 py-1.5 border-t border-gray-100">
          <p className="text-[10px] font-semibold text-slate-600 text-center truncate">{label}</p>
        </div>
      )}
    </div>
  );
};

export default TemplateCard;
