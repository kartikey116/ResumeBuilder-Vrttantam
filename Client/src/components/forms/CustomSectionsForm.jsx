import React from 'react';
import { LuPlus, LuTrash2 } from 'react-icons/lu';

function CustomSectionsForm({
  customSections = [],
  updateCustomSection,
  addCustomSection,
  removeCustomSection,
  updateCustomSectionItem,
  addCustomSectionItem,
  removeCustomSectionItem
}) {
  return (
    <div className="pt-3 flex flex-col gap-4">
      {customSections.map((section, sIdx) => (
        <div key={sIdx} className="border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)] rounded-xl p-4 hover:border-[rgba(255,255,255,0.1)] transition select-text">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wide">
              Custom Section {sIdx + 1}
            </h3>
            <button
              type="button"
              className="text-red-400 hover:text-red-300 flex items-center gap-1 text-xs transition-colors"
              onClick={() => removeCustomSection(sIdx)}
            >
              <LuTrash2 size={13} />
              Remove Section
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">Section Title</label>
              <input
                type="text"
                placeholder="e.g. Publications, Volunteering, Awards"
                className="bg-slate-900 border border-[rgba(255,255,255,0.06)] rounded-lg text-xs p-2.5 w-full text-slate-100 outline-none focus:border-purple-500/40 select-text"
                value={section.title || ""}
                onChange={(e) => updateCustomSection(sIdx, "title", e.target.value)}
              />
            </div>

            <div className="mt-2">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-2">Section Items</span>
              <div className="flex flex-col gap-3">
                {(section.items || []).map((item, iIdx) => (
                  <div key={iIdx} className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-xl flex flex-col gap-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-bold">Item {iIdx + 1}</span>
                      {section.items.length > 1 && (
                        <button
                          type="button"
                          className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[10px] transition-colors"
                          onClick={() => removeCustomSectionItem(sIdx, iIdx)}
                        >
                          <LuTrash2 size={11} />
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-slate-400 font-medium block mb-1">Item Heading</label>
                        <input
                          type="text"
                          placeholder="e.g. Contributor"
                          className="bg-slate-900 border border-[rgba(255,255,255,0.06)] rounded-lg text-xs p-2 w-full text-slate-100 outline-none focus:border-purple-500/40 select-text"
                          value={item.heading || ""}
                          onChange={(e) => updateCustomSectionItem(sIdx, iIdx, "heading", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-medium block mb-1">Sub-heading</label>
                        <input
                          type="text"
                          placeholder="e.g. Open Source Project"
                          className="bg-slate-900 border border-[rgba(255,255,255,0.06)] rounded-lg text-xs p-2 w-full text-slate-100 outline-none focus:border-purple-500/40 select-text"
                          value={item.subHeading || ""}
                          onChange={(e) => updateCustomSectionItem(sIdx, iIdx, "subHeading", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-slate-400 font-medium block mb-1">Start Date</label>
                        <input
                          type="text"
                          placeholder="e.g. Jan 2023"
                          className="bg-slate-900 border border-[rgba(255,255,255,0.06)] rounded-lg text-xs p-2 w-full text-slate-100 outline-none focus:border-purple-500/40 select-text"
                          value={item.startDate || ""}
                          onChange={(e) => updateCustomSectionItem(sIdx, iIdx, "startDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-slate-400 font-medium block mb-1">End Date</label>
                        <input
                          type="text"
                          placeholder="e.g. Present"
                          className="bg-slate-900 border border-[rgba(255,255,255,0.06)] rounded-lg text-xs p-2 w-full text-slate-100 outline-none focus:border-purple-500/40 select-text"
                          value={item.endDate || ""}
                          onChange={(e) => updateCustomSectionItem(sIdx, iIdx, "endDate", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] text-slate-400 font-medium block mb-1">Description / Bullet points</label>
                      <textarea
                        placeholder="• Described responsibilities and outcomes..."
                        className="bg-slate-900 border border-[rgba(255,255,255,0.06)] rounded-lg text-xs p-2.5 w-full text-slate-100 outline-none focus:border-purple-500/40 select-text"
                        rows={2}
                        value={item.description || ""}
                        onChange={(e) => updateCustomSectionItem(sIdx, iIdx, "description", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-3 w-full border border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] hover:text-slate-200 text-slate-400 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition select-none"
                onClick={() => addCustomSectionItem(sIdx)}
              >
                <LuPlus size={13} />
                Add Item
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="w-full bg-purple-600/90 hover:bg-purple-500 hover:shadow-[0_0_12px_rgba(124,58,237,0.25)] text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition select-none"
        onClick={addCustomSection}
      >
        <LuPlus size={14} />
        Add New Custom Section
      </button>
    </div>
  );
}

export default CustomSectionsForm;
