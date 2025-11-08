#!/usr/bin/env node
/**
 * Forbidden Imports Scanner
 * 
 * Scans UI files for forbidden patterns that violate architecture:
 * - Direct axios/fetch calls
 * - Direct SDK imports
 * - Hardcoded data arrays/objects in UI components
 */

const fs = require('fs');
const path = require('path');

// Define forbidden patterns
const FORBIDDEN_PATTERNS = [
  // Direct HTTP clients
  { pattern: /axios\(/g, message: 'Direct axios call detected', category: 'http' },
  { pattern: /fetch\(/g, message: 'Direct fetch call detected', category: 'http' },
  { pattern: /XMLHttpRequest/g, message: 'Direct XMLHttpRequest call detected', category: 'http' },
  { pattern: /new\s+Request\(/g, message: 'Direct Request call detected', category: 'http' },
  { pattern: /new\s+XMLHttpRequest\(/g, message: 'Direct XMLHttpRequest call detected', category: 'http' },
  
  // SDK imports
  { pattern: /from ['"]\.\.\/\.\.\/sdk/g, message: 'Direct SDK import detected', category: 'sdk' },
  { pattern: /import\s+.*\s+from\s+['"]\.\.\/\.\.\/sdk/g, message: 'Direct SDK import detected', category: 'sdk' },
  { pattern: /import\s+.*\s+from\s+['"]@\/sdk/g, message: 'Direct SDK import detected', category: 'sdk' },
  { pattern: /from ['"]@\/sdk/g, message: 'Direct SDK import detected', category: 'sdk' },
  
  // Hardcoded data arrays/objects in UI
  { pattern: /const\s+\w+\s*=\s*\[/g, message: 'Potential hardcoded array detected', category: 'hardcoded' },
  { pattern: /const\s+\w+\s*=\s*\{/g, message: 'Potential hardcoded object detected', category: 'hardcoded' },
  { pattern: /=\s*\[(\s*['"][^'"]+['"],?\s*){3,}/g, message: 'Hardcoded array with multiple values detected', category: 'hardcoded' }, // Arrays with 3+ hardcoded values
];

// UI component directories to scan
const UI_DIRECTORIES = [
  'src/pages',
  'src/components',
  'src/forms',
  'src/tables',
  'src/modals',
  'src/widgets',
  'src/shared',
  'src/layouts'
];

// File extensions to scan
const FILE_EXTENSIONS = ['.js', '.ts', '.vue'];

// Function to check if a file should be scanned
function shouldScanFile(filePath) {
  const ext = path.extname(filePath);
  return FILE_EXTENSIONS.includes(ext);
}

// Function to scan a file for forbidden patterns
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];
  
  FORBIDDEN_PATTERNS.forEach(patternObj => {
    const matches = content.match(patternObj.pattern);
    if (matches) {
      matches.forEach(match => {
        violations.push({
          file: filePath,
          pattern: patternObj.message,
          match: match,
          category: patternObj.category
        });
      });
    }
  });
  
  return violations;
}

// Function to scan a directory recursively
function scanDirectory(dirPath) {
  let allViolations = [];
  
  const items = fs.readdirSync(dirPath);
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      allViolations = allViolations.concat(scanDirectory(fullPath));
    } else if (shouldScanFile(fullPath)) {
      const violations = scanFile(fullPath);
      if (violations.length > 0) {
        allViolations = allViolations.concat(violations);
      }
    }
  });
  
  return allViolations;
}

// Main function
function main() {
  console.log('Scanning for forbidden patterns in UI files...\n');
  
  let totalViolations = [];
  
  UI_DIRECTORIES.forEach(dir => {
    const fullDir = path.join(process.cwd(), dir);
    if (fs.existsSync(fullDir)) {
      console.log(`Scanning ${dir}...`);
      const violations = scanDirectory(fullDir);
      totalViolations = totalViolations.concat(violations);
    } else {
      console.log(`Directory ${dir} does not exist, skipping...`);
    }
  });
  
  // Group violations by category
  const groupedViolations = totalViolations.reduce((acc, violation) => {
    if (!acc[violation.category]) {
      acc[violation.category] = [];
    }
    acc[violation.category].push(violation);
    return acc;
  }, {});
  
  // Report violations
  if (totalViolations.length === 0) {
    console.log('\n✅ No forbidden patterns detected! Architecture compliance verified.');
    process.exit(0);
  } else {
    console.log(`\n❌ Found ${totalViolations.length} violations across ${Object.keys(groupedViolations).length} categories:`);
    
    Object.keys(groupedViolations).forEach(category => {
      console.log(`\n${category.toUpperCase()} VIOLATIONS (${groupedViolations[category].length}):`);
      groupedViolations[category].forEach(violation => {
        console.log(`  - ${violation.file}:${violation.match} (${violation.pattern})`);
      });
    });
    
    console.log('\nPlease fix these violations to maintain architecture compliance.');
    process.exit(1);
  }
}

// Run the scanner
main();