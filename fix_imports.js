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
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });
  return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);

allFiles.forEach(file => {
  if (!file.endsWith('.jsx') && !file.endsWith('.js')) return;
  
  let content = fs.readFileSync(file, 'utf-8');
  let hasChanges = false;
  
  // Specific folder renames
  if (content.includes('COmponent/ResumeSections')) {
      content = content.replace(/COmponent\/ResumeSections/g, 'components/resume-sections');
      hasChanges = true;
  }
  if (content.includes('COmponent/ResumeTemplates')) {
      content = content.replace(/COmponent\/ResumeTemplates/g, 'components/resume-templates');
      hasChanges = true;
  }
  if (content.includes('Pages/ResumeUpdate/Forms')) {
      content = content.replace(/Pages\/ResumeUpdate\/Forms/g, 'components/forms');
      hasChanges = true;
  }
  
  // Replace references to common ui components
  const uis = ['AccordionSection', 'AuthBackground', 'Modal', 'Progress', 'StepProgress', 'Tabs'];
  uis.forEach(ui => {
      if (content.includes(`COmponent/${ui}`)) {
          content = content.replace(new RegExp(`COmponent\/${ui}`, 'g'), `components/ui/${ui}`);
          hasChanges = true;
      }
  });

  // Global basic renames
  if (content.includes('COmponent/')) {
      content = content.replace(/COmponent\//g, 'components/');
      hasChanges = true;
  }
  if (content.includes('Pages/')) {
      content = content.replace(/Pages\//g, 'pages/');
      hasChanges = true;
  }
  if (content.includes('Auth/')) {   
      content = content.replace(/Auth\//g, 'auth/');
      hasChanges = true;
  }
  if (content.includes('Home/')) {   
      content = content.replace(/Home\//g, 'home/');
      hasChanges = true;
  }
  if (content.includes('pages/home/CreateResumeForm')) {
      content = content.replace(/pages\/home\/CreateResumeForm/g, 'components/forms/CreateResumeForm');
      hasChanges = true;
  }

  // App.jsx and LandingPage.jsx Navbar renaming
  if (file.endsWith('LandingPage.jsx') || file.endsWith('App.jsx')) {
      if (content.includes('import Navbar')) {
          content = content.replace(/import Navbar/g, 'import LandingNavbar');
          content = content.replace(/<Navbar \/>/g, '<LandingNavbar />');
          content = content.replace(/components\/LandingNavbar\.jsx/g, 'components/common/LandingNavbar.jsx');
          hasChanges = true;
      }
  }

  // EditResume.jsx specific old logic leftover: we moved forms out!
  // It imports forms. Let's see if there are ../../components/forms/
  
  // Write back if changed
  if (hasChanges) {
      fs.writeFileSync(file, content);
  }
});

console.log("IMPORTS FIXED");
