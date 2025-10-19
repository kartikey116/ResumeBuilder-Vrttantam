import React from 'react';
import TemplateOne from './TemplateOne';
import TemplateTwo from './TemplateTwo';
import TemplateThree from './TemplateThree';
import TemplateFour from './TemplateFour';
import TemplateFive from './TemplateFive';
import TemplateSix from './TemplateSix'; 
import TemplateSeven from './TemplateSeven';
import TemplateEight from './TemplateEight';

function RenderResume({ templateId, resumeData, containerWidth, colorPalette }) {
    const renderTemplate = () => {
        const fontFamily = resumeData?.template?.fontFamily || 'Arial, sans-serif';
        
        switch (templateId) {
            case '01':
                return <TemplateOne resumeData={resumeData} containerWidth={containerWidth} colorPalette={colorPalette} fontFamily={fontFamily} />;
            case '02':
                return <TemplateTwo resumeData={resumeData} containerWidth={containerWidth} colorPalette={colorPalette} fontFamily={fontFamily} />;
            case '03':
                return <TemplateThree resumeData={resumeData} containerWidth={containerWidth} colorPalette={colorPalette} fontFamily={fontFamily} />;
            case '04':
                return <TemplateFour resumeData={resumeData} containerWidth={containerWidth} colorPalette={colorPalette} fontFamily={fontFamily} />;
            case '05':
                return <TemplateFive resumeData={resumeData} containerWidth={containerWidth} colorPalette={colorPalette} fontFamily={fontFamily} />;
            case '06': 
                return <TemplateSix resumeData={resumeData} containerWidth={containerWidth} colorPalette={colorPalette} fontFamily={fontFamily} />;
            case '07': 
                return <TemplateSeven resumeData={resumeData} containerWidth={containerWidth} colorPalette={colorPalette} fontFamily={fontFamily} />;
            case '08':
                return <TemplateEight resumeData={resumeData} containerWidth={containerWidth} colorPalette={colorPalette} fontFamily={fontFamily} />    
            default:
                return <TemplateOne resumeData={resumeData} containerWidth={containerWidth} colorPalette={colorPalette} fontFamily={fontFamily} />;
        }
    };

    return (
        <div className="w-full h-full overflow-auto custom-scrollbar">
            {renderTemplate()}
        </div>
    );
}

export default RenderResume;