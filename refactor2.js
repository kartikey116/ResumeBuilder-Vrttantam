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

  // Global replacements. Note: using 'pages' directly is tricky in Windows if 'Pages' exists.
  // We'll rename them using an intermediate name internally, or just be aware that Paths and pages are the same file on disk in Windows.
  newFile = newFile.replace(/\\COmponent\\/g, '\\components\\');
  newFile = newFile.replace(/\\Pages\\/g, '\\pages\\');
  newFile = newFile.replace(/\\Auth\\/g, '\\auth\\'); 
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

  // Move root components into components/ui/
  const rootComponentNames = ['AccordionSection.jsx', 'AuthBackground.jsx', 'Modal.jsx', 'Progress.jsx', 'StepProgress.jsx', 'Tabs.jsx'];
  rootComponentNames.forEach(name => {
    if (newFile.includes(`\\components\\${name}`)) {
      newFile = newFile.replace(`\\components\\${name}`, `\\components\\ui\\${name}`);
    }
  });

  pathMap[file] = newFile;
});

// Windows case-insensitivity means file paths that only differs in case are the SAME file on disk!
// So we cannot just copy old to new, then delete old. If we delete old 'Pages', we delete new 'pages'.
// We will move everything to a SAFE temp directory first, then move it back.

const tempSrcDir = path.join(__dirname, 'Client', 'temp_src');
if (fs.existsSync(tempSrcDir)) fs.rmSync(tempSrcDir, { recursive: true, force: true });
fs.mkdirSync(tempSrcDir, { recursive: true });

// 1. Move everything to temp dir with the right structure
const tempPathMap = {};
for (const [oldPath, newPath] of Object.entries(pathMap)) {
  const tempPath = newPath.replace(srcDir, tempSrcDir);
  tempPathMap[oldPath] = tempPath;
  const dir = path.dirname(tempPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.copyFileSync(oldPath, tempPath);
}

// Function to resolve import path (using original paths)
function resolveImportPath(importerPath, importStr) {
  if (!importStr.startsWith('.')) return null;
  let targetAbsPath = path.resolve(path.dirname(importerPath), importStr);
  if (pathMap[targetAbsPath]) return targetAbsPath;
  if (pathMap[targetAbsPath + '.jsx']) return targetAbsPath + '.jsx';
  if (pathMap[targetAbsPath + '.js']) return targetAbsPath + '.js';
  if (pathMap[path.join(targetAbsPath, 'index.jsx')]) return path.join(targetAbsPath, 'index.jsx');
  if (pathMap[path.join(targetAbsPath, 'index.js')]) return path.join(targetAbsPath, 'index.js');
  return null;
}

// Compute relative path
function getNewImportStr(importerNewPath, importedNewPath, oldImportStr) {
  let relative = path.relative(path.dirname(importerNewPath), importedNewPath);
  relative = relative.replace(/\\/g, '/');
  if (!relative.startsWith('.')) relative = './' + relative;
  if (!oldImportStr.endsWith('.jsx') && relative.endsWith('.jsx')) relative = relative.slice(0, -4);
  else if (!oldImportStr.endsWith('.js') && relative.endsWith('.js')) relative = relative.slice(0, -3);
  return relative;
}

// 2. Rewrite imports IN the temp dir
for (const [oldPath, tempPath] of Object.entries(tempPathMap)) {
  if (!tempPath.endsWith('.jsx') && !tempPath.endsWith('.js')) continue;

  let content = fs.readFileSync(tempPath, 'utf-8');
  let hasChanges = false;
  const importRegex = /(from\s+['"])(.+?)(['"])|(import\(['"])(.+?)(['"]\))/g;

  content = content.replace(importRegex, (match, prefix1, path1, suffix1, prefix2, path2, suffix2) => {
    const importStr = path1 || path2;
    const prefix = prefix1 || prefix2;
    const suffix = suffix1 || suffix2;

    const resolvedOldAbs = resolveImportPath(oldPath, importStr);
    
    if (resolvedOldAbs) {
      const newTargetAbs = pathMap[resolvedOldAbs];
      if (newTargetAbs) {
        const newRelative = getNewImportStr(pathMap[oldPath], newTargetAbs, importStr);
        hasChanges = true;
        return `${prefix}${newRelative}${suffix}`;
      }
    }
    
    // For unmapped paths (like index.css)
    if (importStr.startsWith('.')) {
       let assetAbs = path.resolve(path.dirname(oldPath), importStr);
       if (!pathMap[assetAbs] && fs.existsSync(assetAbs)) {
         let newRelative = path.relative(path.dirname(pathMap[oldPath]), assetAbs).replace(/\\/g, '/');
         if (!newRelative.startsWith('.')) newRelative = './' + newRelative;
         hasChanges = true;
         return `${prefix}${newRelative}${suffix}`;
       }
    }
    return match;
  });
  
  if (oldPath.includes('LandingPages.jsx') || oldPath.includes('App.jsx')) content = content.replace(/Navbar/g, 'LandingNavbar');
  if (oldPath.includes('DashboardLayout.jsx') && content.includes('/Navbar.jsx')) {
      content = content.replace(/import Navbar/g, 'import DashboardNavbar');
      content = content.replace(/<Navbar \/>/g, '<DashboardNavbar />');
  }
  
  if (hasChanges) {
    fs.writeFileSync(tempPath, content);
  }
}

// 3. Clear src completely, except App.jsx and main files at root if they weren't moved, but we can just clear it and bring everything from temp back!
// But wait, what about fonts/assets? We copied ALL files in `src` to `temp`. 
// Let's rmSync `src` then rename `temp` to `src`!
fs.rmSync(srcDir, { recursive: true, force: true });
fs.renameSync(tempSrcDir, srcDir);

console.log("SUCCESS");
