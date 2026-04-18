import React from 'react';
import { LuChevronDown } from 'react-icons/lu';

/**
 * AccordionSection — a collapsible panel for the new side-panel editor.
 * Props:
 *   title       — section label
 *   icon        — lucide icon element
 *   isOpen      — controlled open state
 *   onToggle    — callback to flip open state
 *   children    — panel body content
 *   badge       — optional count/badge string shown in header
 */
function AccordionSection({ title, icon, isOpen, onToggle, children, badge }) {
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden mb-2 bg-white shadow-sm">
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-purple-50/60 transition-colors duration-150"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-purple-600 text-base">{icon}</span>
          <span className="text-sm font-semibold text-slate-700">{title}</span>
          {badge && (
            <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <LuChevronDown
          className={`text-slate-400 text-base transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Animated body */}
      <div
        style={{
          maxHeight: isOpen ? '2000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div className="px-4 pb-4 pt-1 border-t border-slate-50">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AccordionSection;
