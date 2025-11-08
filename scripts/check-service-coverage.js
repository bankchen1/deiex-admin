#!/usr/bin/env node
/**
 * Service Coverage Checker
 * 
 * Validates that all pages have corresponding facade functions to handle their data needs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to get all pages from UI directories
function getAllPages() {
  const uiDirectories = [
    'src/pages',
    'src/components',
    'src/forms',
    'src/tables',
    'src/modals',
    'src/widgets',
    'src/shared',
    'src/layouts'
  ];
  
  const fileExtensions = ['.vue', '.js', '.ts'];
  const pages = [];
  
  uiDirectories.forEach(dir => {
    const fullDir = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullDir)) {
      return;
    }
    
    // Get all files recursively
    function walkDir(currentPath) {
      const items = fs.readdirSync(currentPath);
      items.forEach(item => {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          walkDir(fullPath);
        } else if (fileExtensions.includes(path.extname(fullPath))) {
          const relPath = path.relative(process.cwd(), fullPath);
          pages.push(relPath);
        }
      });
    }
    
    walkDir(fullDir);
  });
  
  return pages;
}

// Function to extract data-related method calls from a file
function extractDataCalls(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const dataCalls = [];
  
  // Pattern to match common data fetching patterns
  const patterns = [
    /use[A-Z]\w+Store/g,      // Store usage patterns like useUsersStore
    /\.fetch[A-Z]\w+/g,        // Fetch methods like fetchUsers
    /\.get[A-Z]\w+/g,          // Get methods like getUserById
    /\.list[A-Z]\w+/g,         // List methods like listUsers
    /\.create[A-Z]\w+/g,        // Create methods like createUser
    /\.update[A-Z]\w+/g,        // Update methods like updateUser
    /\.delete[A-Z]\w+/g,        // Delete methods like deleteUser
    /\.approve[A-Z]\w+/g,       // Action methods like approveApplication
    /\.reject[A-Z]\w+/g,        // Action methods like rejectApplication
  ];
  
  patterns.forEach(pattern => {
    const matches = content.match(pattern) || [];
    matches.forEach(match => {
      if (!dataCalls.includes(match)) {
        dataCalls.push(match);
      }
    });
  });
  
  return dataCalls;
}

// Function to get available facade functions from each module
function getFacadeFunctions() {
  const facadeDir = path.join(process.cwd(), 'src/services/api/facade');
  const facades = {};
  
  if (!fs.existsSync(facadeDir)) {
    return facades;
  }
  
  const facadeFiles = fs.readdirSync(facadeDir);
  facadeFiles.forEach(file => {
    if (path.extname(file) === '.ts' || path.extname(file) === '.js') {
      const moduleName = path.basename(file, path.extname(file));
      try {
        // Read the file and extract export functions
        const content = fs.readFileSync(path.join(facadeDir, file), 'utf8');
        const functionMatches = content.match(/export\s+(async\s+)?function\s+(\w+)/g) || [];
        const functions = functionMatches.map(f => {
          const nameMatch = f.match(/function\s+(\w+)/);
          return nameMatch ? nameMatch[1] : null;
        }).filter(Boolean);
        
        // Also check for export const patterns
        const constMatches = content.match(/export\s+const\s+(\w+)\s*=/g) || [];
        const consts = constMatches.map(c => {
          const nameMatch = c.match(/export\s+const\s+(\w+)\s*=/);
          return nameMatch ? nameMatch[1] : null;
        }).filter(Boolean);
        
        facades[moduleName] = [...functions, ...consts];
      } catch (err) {
        console.log(`Error reading facade file ${file}: ${err.message}`);
      }
    }
  });
  
  return facades;
}

// Function to check if a data call has corresponding facade function
function hasFacadeCoverage(dataCall, facades) {
  // Simple matching - check if any facade function name contains the data call
  for (const module in facades) {
    if (facades[module].some(fn => fn.includes(dataCall.replace(/^\.?/, '')))) {
      return true;
    }
  }
  return false;
}

// Main function
function main() {
  console.log('Checking service coverage for all pages...\n');
  
  const pages = getAllPages();
  const facades = getFacadeFunctions();
  
  console.log(`Found ${pages.length} UI files to check.`);
  console.log(`Found facade functions in ${Object.keys(facades).length} modules:`, Object.keys(facades));
  console.log('');
  
  let uncoveredPages = [];
  let totalDataCalls = 0;
  let coveredDataCalls = 0;
  
  pages.forEach(pagePath => {
    const dataCalls = extractDataCalls(pagePath);
    
    if (dataCalls.length > 0) {
      let pageCovered = true;
      console.log(`Checking ${pagePath}...`);
      
      dataCalls.forEach(call => {
        totalDataCalls++;
        const callName = call.replace(/^\.?/, ''); // Remove leading dot if present
        const hasCoverage = hasFacadeCoverage(callName, facades);
        
        if (hasCoverage) {
          coveredDataCalls++;
          console.log(`  ✅ ${call} -> Covered`);
        } else {
          pageCovered = false;
          console.log(`  ❌ ${call} -> Not covered by facade`);
        }
      });
      
      if (!pageCovered) {
        uncoveredPages.push({
          page: pagePath,
          dataCalls: dataCalls
        });
      }
      console.log('');
    }
  });
  
  // Summary
  const coveragePercentage = totalDataCalls > 0 ? (coveredDataCalls / totalDataCalls * 100).toFixed(2) : 100;
  
  console.log(`\n=== COVERAGE SUMMARY ===`);
  console.log(`Total data calls analyzed: ${totalDataCalls}`);
  console.log(`Covered data calls: ${coveredDataCalls}`);
  console.log(`Uncovered data calls: ${totalDataCalls - coveredDataCalls}`);
  console.log(`Coverage rate: ${coveragePercentage}%`);
  
  if (uncoveredPages.length > 0) {
    console.log(`\nPages with uncovered data calls (${uncoveredPages.length}):`);
    uncoveredPages.forEach(page => {
      console.log(`  - ${page.page}`);
      page.dataCalls.forEach(call => console.log(`    ❌ ${call}`));
    });
    
    console.log(`\n❌ Service coverage is NOT complete. ${coveragePercentage}% coverage achieved.`);
    process.exit(1);
  } else {
    console.log(`\n✅ All data calls in UI files are covered by facade functions!`);
    console.log(`✅ Service coverage verification complete.`);
    process.exit(0);
  }
}

// Run the checker
main();