import React, { useEffect, useRef, useState } from 'react';
import {
  DUMMY_RESUME_DATA,
  resumeTemplates,
  themeColorPalette,
} from '../../utils/data';
import { LuCircleCheckBig } from 'react-icons/lu';
import Tabs from '../../COmponent/Tabs';
import TemplateCard from '../../COmponent/Cards/TemplateCard';
import RenderResume from '../../COmponent/ResumeTemplates/RenderResume';
import FontSelector from './FontSelector';

const TAB_DATA = [
  { label: 'Templates' },
  { label: 'Color Palettes' },
  { label: 'Fonts' },
];

function ThemeSelector({ selectedTheme, setSelectedTheme, resumeData, onClose }) {
  const resumeRef = useRef(null);
  const [baseWidth, setBaseWidth] = useState(800);
  const [tabValue, setTabValue] = useState('Templates');

  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    return (
      resumeTemplates.find((t) => t.id === selectedTheme?.theme) ||
      resumeTemplates[0]
    );
  });

  const [selectedColorPalette, setSelectedColorPalette] = useState(() => {
    const palettes =
      themeColorPalette[selectedTemplate.colorPaletteCode] || [];
    const initialIndex = palettes.findIndex(
      (p) => JSON.stringify(p) === JSON.stringify(selectedTheme?.colorPalette)
    );
    return {
      palette: selectedTheme?.colorPalette || palettes[0],
      index: initialIndex !== -1 ? initialIndex : 0,
    };
  });

  const [selectedFont, setSelectedFont] = useState(
    selectedTheme?.fontFamily || 'Arial, sans-serif'
  );
  
  const [customColor, setCustomColor] = useState('#4F46E5');

  const availablePalettes =
    themeColorPalette[selectedTemplate.colorPaletteCode] || [];

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    const newPalettes = themeColorPalette[template.colorPaletteCode] || [];
    setSelectedColorPalette({ palette: newPalettes[0], index: 0 });
  };

  const lightenColor = (hex, percent) => {
    hex = hex.replace(/^\s*#|\s*$/g, '');
    if (hex.length === 3) {
      hex = hex.replace(/(.)/g, '$1$1');
    }
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const newR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
    const newG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
    const newB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

    return `#${newR.toString(16).padStart(2, '0')}${newG
      .toString(16)
      .padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    const customPalette = [
      '#FFFFFF',
      lightenColor(newColor, 80),
      lightenColor(newColor, 40),
      newColor,
      '#111827',
    ];
    setSelectedColorPalette({ palette: customPalette, index: -1 });
  };

  const handleThemeSelection = () => {
    setSelectedTheme({
      theme: selectedTemplate.id,
      colorPalette: selectedColorPalette.palette,
      fontFamily: selectedFont,
    });
    onClose();
  };

  const updateBaseWidth = () => {
    if (resumeRef.current) {
      setBaseWidth(resumeRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    updateBaseWidth();
    window.addEventListener('resize', updateBaseWidth);

    return () => {
      window.removeEventListener('resize', updateBaseWidth);
    };
  }, []);

  return (
    <div className="container mx-auto px-2 md:px-0">
      <div className="flex items-center justify-between mb-5 mt-2">
        <Tabs tabs={TAB_DATA} activeTab={tabValue} setActiveTab={setTabValue} />
        <button className="btn-small-light" onClick={handleThemeSelection}>
          <LuCircleCheckBig className="text-[16px] " />
          Done
        </button>
      </div>

      <div className="grid grid-cols-12 gaps-5">
        <div className="col-span-12 md:col-span-5 bg-white">
          <div className="grid grid-cols-2 gap-5 max-h-[80vh] overflow-scroll custom-scrollbar md:pr-5">
            {tabValue === 'Templates' &&
              resumeTemplates.map((template) => (
                <TemplateCard
                  key={`templates_${template.id}`}
                  thumbnailImg={template.thumbnailImg}
                  isSelected={selectedTemplate?.id === template.id}
                  onSelect={() => handleTemplateSelect(template)}
                />
              ))}

            {tabValue === 'Color Palettes' && (
              <>
                {availablePalettes.map((palette, index) => (
                  <ColorPalette
                    key={`palette_${index}`}
                    colors={palette}
                    isSelected={selectedColorPalette?.index === index}
                    onSelect={() =>
                      setSelectedColorPalette({ palette: palette, index })
                    }
                  />
                ))}
                <div className="h-28 bg-gray-50 flex flex-col gap-2 p-2 rounded-lg border-2 border-dashed items-center justify-center">
                  <label htmlFor="customColor" className="text-sm font-medium">
                    Custom Accent
                  </label>
                  <input
                    id="customColor"
                    type="color"
                    value={customColor}
                    onChange={handleColorChange}
                    className="w-16 h-16 rounded-full cursor-pointer border-none"
                  />
                </div>
              </>
            )}

            {tabValue === 'Fonts' && (
              <FontSelector
                selectedFont={selectedFont}
                onSelectFont={setSelectedFont}
              />
            )}
          </div>
        </div>
        <div
          className="col-span-12 md:col-span-7 bg-white -mt-3"
          ref={resumeRef}
        >
          <div style={{ fontFamily: selectedFont }}>
            <RenderResume
              templateId={selectedTemplate?.id || ''}
              resumeData={resumeData || DUMMY_RESUME_DATA}
              containerWidth={baseWidth}
              colorPalette={selectedColorPalette?.palette || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThemeSelector;

const ColorPalette = ({ colors, isSelected, onSelect }) => {
  return (
    <div
      className={`h-28 bg-gray-50 flex rounded-lg overflow-hidden border-2 cursor-pointer ${
        isSelected ? 'border-purple-500' : 'border-transparent'
      }`}
      onClick={onSelect}
    >
      {colors.map((color, index) => (
        <div
          key={`color_${index}`}
          className="flex-1 h-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};
