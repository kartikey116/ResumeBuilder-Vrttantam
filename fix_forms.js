// Fix form imports depth
const fs = require('fs');
const path = require('path');

const formsDir = path.join(__dirname, 'Client', 'src', 'components', 'forms');

if (fs.existsSync(formsDir)) {
  const files = fs.readdirSync(formsDir);
  files.forEach(file => {
    if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const filePath = path.join(formsDir, file);
      let content = fs.readFileSync(filePath, 'utf-8');
      let changed = false;

      // Old depth was 3 levels up to src: ../../../
      // New depth is 1 level up to components: ../
      if (content.includes('../../../components/')) {
        content = content.replace(/\.\.\/\.\.\/\.\.\/components\//g, '../');
        changed = true;
      }
      
      // Some might have been ../../../components/ResumeSections/...
      // which is now ../resume-sections/...
      if (content.includes('../../components/')) { // in CreateResumeForm which was in Pages/Home/
          content = content.replace(/\.\.\/\.\.\/components\//g, '../');
          changed = true;
      }

      if (changed) {
        fs.writeFileSync(filePath, content);
      }
    }
  });
}

// Also check ResumeTemplates since they moved from COmponent/ResumeTemplates
// to components/resume-templates. That's the same depth, so their imports shouldn't break depth.

// Let's also do a global sweep just in case:
console.log("Forms fixed");
