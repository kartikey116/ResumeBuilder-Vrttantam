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

// Build map OldAbsPath -> NewAbsPath
const pathMap = {};

allFiles.forEach(file => {
  let newFile = file;

  // Global replacements
  newFile = newFile.replace(/\\COmponent\\/g, '\\components\\');
  newFile = newFile.replace(/\\Pages\\/g, '\\pages\\');
  newFile = newFile.replace(/\\Auth\\/g, '\\auth\\'); // inside Pages
  newFile = newFile.replace(/\\Home\\/g, '\\home\\');

  // specific moves
  newFile = newFile.replace(/\\components\\ResumeSections\\/g, '\\components\\resume-sections\\');
  newFile = newFile.replace(/\\components\\ResumeTemplates\\/g, '\\components\\resume-templates\\');
  
  // Forms -> components/forms
  if (newFile.includes('\\pages\\ResumeUpdate\\Forms\\')) {
    newFile = newFile.replace(/\\pages\\ResumeUpdate\\Forms\\/, '\\components\\forms\\');
  }
  if (newFile.includes('\\pages\\home\\CreateResumeForm.jsx')) {
    newFile = newFile.replace(/\\pages\\home\\CreateResumeForm.jsx/, '\\components\\forms\\CreateResumeForm.jsx');
  }

  // specific file renames
  if (newFile.includes('\\pages\\Navbar.jsx')) {
    newFile = newFile.replace(/\\pages\\Navbar\.jsx/, '\\components\\common\\LandingNavbar.jsx');
  }
  if (newFile.includes('\\components\\layouts\\Navbar.jsx')) {
    newFile = newFile.replace(/\\components\\layouts\\Navbar\.jsx/, '\\components\\layouts\\DashboardNavbar.jsx');
  }
  if (newFile.includes('\\pages\\Footer.jsx')) {
    newFile = newFile.replace(/\\pages\\Footer\.jsx/, '\\components\\common\\Footer.jsx');
  }
  if (newFile.includes('\\pages\\LandingPages.jsx')) {
    newFile = newFile.replace(/\\pages\\LandingPages\.jsx/, '\\pages\\home\\LandingPage.jsx');
  }
  if (newFile.includes('\\pages\\OAuthSuccess.jsx')) {
    newFile = newFile.replace(/\\pages\\OAuthSuccess\.jsx/, '\\pages\\auth\\OAuthSuccess.jsx');
  }

  // Move root components into components/ui/ except specific ones
  const rootComponentNames = ['AccordionSection.jsx', 'AuthBackground.jsx', 'Modal.jsx', 'Progress.jsx', 'StepProgress.jsx', 'Tabs.jsx'];
  rootComponentNames.forEach(name => {
    if (newFile.includes(`\\components\\${name}`)) {
      newFile = newFile.replace(`\\components\\${name}`, `\\components\\ui\\${name}`);
    }
  });

  pathMap[file] = newFile;
});

// Create directories and move files
for (const [oldPath, newPath] of Object.entries(pathMap)) {
  if (oldPath !== newPath) {
    const dir = path.dirname(newPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync(oldPath, newPath); // copy first
  }
}

// Function to resolve import path to an absolute path
function resolveImportPath(importerPath, importStr) {
  if (!importStr.startsWith('.')) return null; // Node module or alias
  
  let targetAbsPath = path.resolve(path.dirname(importerPath), importStr);
  
  // check for exact match or implied extensions
  if (pathMap[targetAbsPath]) return targetAbsPath;
  if (pathMap[targetAbsPath + '.jsx']) return targetAbsPath + '.jsx';
  if (pathMap[targetAbsPath + '.js']) return targetAbsPath + '.js';
  // Check index.js
  if (pathMap[path.join(targetAbsPath, 'index.jsx')]) return path.join(targetAbsPath, 'index.jsx');
  if (pathMap[path.join(targetAbsPath, 'index.js')]) return path.join(targetAbsPath, 'index.js');
  
  return null; // Could not resolve locally (e.g., assets)
}

// Function to compute new relative import string
function getNewImportStr(importerNewPath, importedNewPath, oldImportStr) {
  let relative = path.relative(path.dirname(importerNewPath), importedNewPath);
  relative = relative.replace(/\\/g, '/');
  if (!relative.startsWith('.')) {
    relative = './' + relative;
  }
  
  // if original import didn't have extension, strip it
  if (!oldImportStr.endsWith('.jsx') && relative.endsWith('.jsx')) {
    relative = relative.slice(0, -4);
  } else if (!oldImportStr.endsWith('.js') && relative.endsWith('.js')) {
    relative = relative.slice(0, -3);
  }
  
  return relative;
}

// Rewrite imports in the newly moved files
let errors = 0;
for (const [oldPath, newPath] of Object.entries(pathMap)) {
  if (!newPath.endsWith('.jsx') && !newPath.endsWith('.js')) continue;

  let content = fs.readFileSync(newPath, 'utf-8');
  let hasChanges = false;

  // Match import declarations and dynamic imports
  const importRegex = /(from\s+['"])(.+?)(['"])|(import\(['"])(.+?)(['"]\))/g;

  content = content.replace(importRegex, (match, prefix1, path1, suffix1, prefix2, path2, suffix2) => {
    const importStr = path1 || path2;
    const prefix = prefix1 || prefix2;
    const suffix = suffix1 || suffix2;

    const resolvedOldAbs = resolveImportPath(oldPath, importStr);
    
    if (resolvedOldAbs) {
      const newTargetAbs = pathMap[resolvedOldAbs];
      if (newTargetAbs) {
        const newRelative = getNewImportStr(newPath, newTargetAbs, importStr);
        hasChanges = true;
        return `${prefix}${newRelative}${suffix}`;
      }
    }
    
    // What if the path points to an asset that didn't move but the importer moved?
    if (importStr.startsWith('.') && oldPath !== newPath) {
       let assetAbs = path.resolve(path.dirname(oldPath), importStr);
       // if it wasn't mapped, it means it's an unmapped file (e.g. image, css)
       if (!pathMap[assetAbs] && fs.existsSync(assetAbs)) {
         let newRelative = path.relative(path.dirname(newPath), assetAbs).replace(/\\/g, '/');
         if (!newRelative.startsWith('.')) newRelative = './' + newRelative;
         hasChanges = true;
         return `${prefix}${newRelative}${suffix}`;
       }
    }

    return match;
  });
  
  // Hardcoded fixes for Navbar references since we renamed the components themselves
  if (oldPath.includes('LandingPages.jsx') || oldPath.includes('App.jsx')) {
      content = content.replace(/Navbar/g, 'LandingNavbar');
  }
  if (oldPath.includes('DashboardLayout.jsx') && content.includes('/Navbar.jsx')) {
      content = content.replace(/import Navbar/g, 'import DashboardNavbar');
      content = content.replace(/<Navbar \/>/g, '<DashboardNavbar />');
  }

  if (hasChanges || oldPath !== newPath) {
    fs.writeFileSync(newPath, content);
  }
}

// Finally delete old files/folders that were moved
for (const oldPath of Object.keys(pathMap).reverse()) { // reverse to delete files before dirs
  if (oldPath !== pathMap[oldPath] && fs.existsSync(oldPath)) {
    fs.unlinkSync(oldPath);
  }
}
// Delete empty old directories
const dirsToRemove = ['COmponent', 'Pages'].map(d => path.join(srcDir, d));
dirsToRemove.forEach(d => {
  if (fs.existsSync(d)) {
    try { fs.rmSync(d, { recursive: true, force: true }); } catch (e) {}
  }
});

console.log("SUCCESS");
