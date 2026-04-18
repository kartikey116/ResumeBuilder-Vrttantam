const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'Client', 'src');

function getAllFiles(dirPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);

const toFix = ['WorkExperience', 'ProjectInfo', 'Languagesection', 'EducationInfo'];

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  toFix.forEach(comp => {
    // Look for imports from current dir ./Comp.jsx inside resume-templates
    if (file.includes('resume-templates')) {
      const re = new RegExp(`['"]\\./${comp}(\\.jsx)?['"]`, 'g');
      if (re.test(content)) {
        content = content.replace(re, `"../resume-sections/${comp}.jsx"`);
        changed = true;
      }
    }
    // Also if the file is NOT in resume-templates, but trying to import from resume-templates instead of resume-sections
    const brokenOld = new RegExp(`resume-templates/${comp}`, 'g');
    if (brokenOld.test(content)) {
      content = content.replace(brokenOld, `resume-sections/${comp}`);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(file, content);
  }
});
console.log('Fixed component imports');
