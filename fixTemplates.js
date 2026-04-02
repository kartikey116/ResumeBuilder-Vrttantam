const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'Client', 'src', 'COmponent', 'ResumeTemplates');

fs.readdirSync(templatesDir).forEach(file => {
  if (file.endsWith('.jsx')) {
    const filePath = path.join(templatesDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // For TemplateOne, TemplateTwo, TemplateThree, TemplateSix, TemplateSeven
    // Example: <div className="mt-4"> <Title text="Work Experience" /> {resumeData.workExperience.map...} </div>
    // We want to wrap the returned map and the title
    
    // Find the block rendering Work Experience.
    // It's usually like:
    // <div className='mt-4'>  <Title text='Work Experience' color={themeColors[1]} />  {resumeData.workExperience.map((data,index) => ( <WorkExperience ... /> ))} </div>
    // OR <section> <h3 style={...}>Work Experience</h3> {workExperience.map...} </section>
    
    // Instead of complex AST parsing, let's just do a string replacement.
    // Replace: <Title text='Work Experience'
    // With: {resumeData.workExperience?.length > 0 && resumeData.workExperience[0]?.company?.trim() !== "" && ( <Title text='Work Experience'
    // But wait, the Title is inside a div that we also want to hide? The div has `mt-4`. If it renders an empty div it's not a big deal, just extra spacing.
    // Wait, the template has `<div className="mt-4"><Title text="Work Experience".../>{resumeData.workExperience.map(...)}</div>`
    // We can just replace `<Title text='Work Experience'` with `{resumeData?.workExperience?.length > 0 && resumeData?.workExperience[0]?.role?.trim() !== "" && <Title text='Work Experience'` (or similar).
    // And for the map: `{resumeData?.workExperience?.length > 0 && resumeData?.workExperience[0]?.role?.trim() !== "" && resumeData.workExperience.map...}`
    
    // Even easier: Just use regex to find the Work Experience container and wrap its contents.
    
    console.log(`Processing ${file}...`);
    // TemplateOne, Two, Three, Six, Seven
    if (content.includes('resumeData.workExperience.map')) {
       content = content.replace(
           /(<div[^>]*>\s*<Title[^>]*text=[\"\']Work Experience[\"\'][^>]*\/>\s*\{resumeData\.workExperience\.map\([\s\S]*?\)\s*\}\s*<\/div>)/g,
           '{resumeData.workExperience && resumeData.workExperience.length > 0 && resumeData.workExperience[0]?.company?.trim() !== "" && ( $1 )}'
       );
    }
    
    // TemplateFour, Five, Eight
    if (content.includes('workExperience.map')) {
       content = content.replace(
           /(<section[^>]*>\s*<h[23][^>]*>(?:Work )?Experience<\/h[23]>\s*\{workExperience\.map\([\s\S]*?\)\s*\}\s*<\/section>)/g,
           '{workExperience && workExperience.length > 0 && workExperience[0]?.company?.trim() !== "" && ( $1 )}'
       );
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
});
