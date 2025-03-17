/**
 * Directory Structure Check
 * Verifies that all required files and directories exist
 */
const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '../');

const requiredFiles = [
  'app.js',
  'server.js',
  'controllers/aiController.js',
  'routes/aiRoutes.js',
  'services/llmService.js',
  'utils/logger.js',
  'utils/errors.js'
];

const requiredDirs = [
  'config',
  'controllers',
  'db',
  'middleware',
  'models',
  'routes',
  'services',
  'utils'
];

console.log('Checking project directory structure...');

// Check directories
let allDirsExist = true;
for (const dir of requiredDirs) {
  const dirPath = path.join(BASE_DIR, dir);
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    console.log(`✅ Directory exists: ${dir}`);
  } else {
    console.log(`❌ Missing directory: ${dir}`);
    allDirsExist = false;
  }
}

// Check files
let allFilesExist = true;
for (const file of requiredFiles) {
  const filePath = path.join(BASE_DIR, file);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    console.log(`✅ File exists: ${file}`);
  } else {
    console.log(`❌ Missing file: ${file}`);
    allFilesExist = false;
  }
}

// Print result
if (allDirsExist && allFilesExist) {
  console.log('\n✅ All required files and directories exist');
} else {
  console.log('\n❌ Some required files or directories are missing');
}
