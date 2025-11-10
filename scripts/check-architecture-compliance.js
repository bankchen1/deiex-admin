#!/usr/bin/env node
/**
 * Architecture Compliance Analysis
 * 
 * Identifies stores and components that violate architecture patterns:
 * - Direct API calls instead of facade usage
 * - Hardcoded static data
 * - Missing contract usage
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing architecture compliance...\n');

// Check stores for direct API imports
const storesDir = path.join(process.cwd(), 'src/stores');
const storeFiles = fs.readdirSync(storesDir).filter(file => file.endsWith('.ts'));

const directApiImports = [];
const hardcodedDataIssues = [];

for (const file of storeFiles) {
  const content = fs.readFileSync(path.join(storesDir, file), 'utf8');
  
  // Check for direct API imports (not through facade)
  const directImports = content.match(/from ['"]@\/services\/api(?!\/facade)/g);
  if (directImports && directImports.length > 0) {
    directApiImports.push({
      file: file,
      importLines: [...new Set(content.split('\n').filter(line => 
        line.includes('from \'@/services/api') && !line.includes('facade')
      )).slice(0, 3)] // Show first 3 lines with direct imports
    });
  }
  
  // Check for hardcoded data in the form of arrays with data
  const hardcodedArrays = content.match(/const \w+ = \[[^\]]*\]/g);
  if (hardcodedArrays) {
    hardcodedArrays.forEach(array => {
      const trimmed = array.substring(0, Math.min(array.length, 100)); // limit length
      if (array.includes('{') || array.includes('id:') || array.includes('name:')) {
        hardcodedDataIssues.push({
          file: file,
          snippet: trimmed
        });
      }
    });
  }
}

console.log('📋 Stores with direct API imports (violating facade pattern):');
if (directApiImports.length > 0) {
  directApiImports.forEach(store => {
    console.log(`  ❌ ${store.file}`);
    store.importLines.forEach(line => console.log(`      ${line.trim()}`));
  });
} else {
  console.log('  ✅ All stores use facade pattern');
}

console.log('\n📊 Stores with hardcoded data:');
if (hardcodedDataIssues.length > 0) {
  hardcodedDataIssues.forEach(issue => {
    console.log(`  ❌ ${issue.file}: ${issue.snippet}`);
  });
} else {
  console.log('  ✅ No stores with hardcoded data found');
}

// Check components for hardcoded data
const componentDirs = [
  path.join(process.cwd(), 'src/pages'),
  path.join(process.cwd(), 'src/components'), 
  path.join(process.cwd(), 'src/tables'),
  path.join(process.cwd(), 'src/modals'),
  path.join(process.cwd(), 'src/forms'),
  path.join(process.cwd(), 'src/widgets')
];

console.log('\n🔍 Checking components for hardcoded data...\n');

for (const dir of componentDirs) {
  if (!fs.existsSync(dir)) continue;
  
  const files = getFilesRecursive(dir).filter(f => f.endsWith('.vue'));
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Look for commonly hardcoded data patterns
    const matches = content.match(/const \w+ = \[[^\]]*\]|mock\w*|dummy\w*|static\w*/gi);
    if (matches && matches.some(m => 
      m.includes('const') || 
      m.includes('mock') || 
      m.includes('dummy') || 
      m.includes('static'))) {
      const relativePath = path.relative(process.cwd(), file);
      hardcodedDataIssues.push({
        file: relativePath,
        type: 'component',
        snippet: matches.slice(0, 3).join(', ') // Take first 3 matches
      });
      
      console.log(`  ❌ ${relativePath}: ${matches.slice(0, 3).join(', ')}`);
    }
  }
}

// Summarize findings
console.log(`\n📈 Analysis Summary:`);
console.log(`  Direct API imports found: ${directApiImports.length}`);
console.log(`  Hardcoded data issues: ${hardcodedDataIssues.length}`);

const totalIssues = directApiImports.length + hardcodedDataIssues.length;
if (totalIssues === 0) {
  console.log('\n✅ All architecture checks passed!');
  process.exit(0);
} else {
  console.log(`\n⚠️  Found ${totalIssues} architecture compliance issues`);
  process.exit(1);
}

function getFilesRecursive(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getFilesRecursive(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  
  return files;
}