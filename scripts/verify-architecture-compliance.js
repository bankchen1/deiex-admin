#!/usr/bin/env node
/**
 * Architecture Compliance Verification Script
 * 
 * Checks all stores to ensure they're using the facade pattern correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Checking architecture compliance across all stores...\n');

// Get all store files
const storesDir = path.join(__dirname, '..', 'src', 'stores');
const storeFiles = fs.readdirSync(storesDir).filter(file => file.endsWith('.ts'));

let totalIssues = 0;
const issues = [];

for (const file of storeFiles) {
  const filePath = path.join(storesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for direct API imports that should go through facade
  const directApiImports = content.match(/import.*from.*['"]@\/services\/api(?!\/facade)/g);
  if (directApiImports) {
    issues.push({
      file: path.relative(process.cwd(), filePath),
      type: 'direct_api_import',
      message: `Direct API import found (should use facade): ${directApiImports.join(', ')}`,
      lines: directApiImports
    });
    totalIssues += directApiImports.length;
  }
  
  // Check for hardcoded data patterns
  const hardcodedData = content.match(/const.*=\s*\[|mock.*=.*\[|static.*=.*\{/gi);
  if (hardcodedData) {
    issues.push({
      file: path.relative(process.cwd(), filePath),
      type: 'hardcoded_data',
      message: `Hardcoded data found: ${hardcodedData.join(', ')}`,
      lines: hardcodedData
    });
    totalIssues += hardcodedData.length;
  }
  
  // Check for non-contract imports
  const nonContractImports = content.match(/from.*['"]@\/types\/models/g);
  if (nonContractImports) {
    issues.push({
      file: path.relative(process.cwd(), filePath),
      type: 'wrong_type_import',
      message: `Using models instead of contracts: ${nonContractImports.join(', ')}`,
      lines: nonContractImports
    });
    totalIssues += nonContractImports.length;
  }
  
  console.log(`✅ ${file} checked`);
}

console.log(`\n📊 Summary:`);
console.log(`   Total stores checked: ${storeFiles.length}`);

if (issues.length > 0) {
  console.log(`   ❌ Issues found: ${totalIssues}`);
  console.log('\n📋 Issues detail:');
  issues.forEach((issue, index) => {
    console.log(`   ${index+1}. ${issue.file} - ${issue.type}: ${issue.message}`);
  });
} else {
  console.log('   ✅ All stores comply with architecture!');
}

// Also check for any remaining SDK imports
console.log('\n🔍 Checking for remaining SDK/direct HTTP imports...');
const httpImports = [];
const searchDirs = [path.join(process.cwd(), 'src/pages'), path.join(process.cwd(), 'src/components'), path.join(process.cwd(), 'src/modals')];

searchDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = getFilesRecursive(dir);
    files.forEach(filePath => {
      if (path.extname(filePath) === '.vue' || path.extname(filePath) === '.ts') {
        const content = fs.readFileSync(filePath, 'utf8');
        const matches = content.match(/import.*axios|import.*fetch|import.*sdk|from.*axios|from.*sdk/gi);
        if (matches) {
          httpImports.push({
            file: path.relative(process.cwd(), filePath),
            matches: matches
          });
        }
      }
    });
  }
});

if (httpImports.length > 0) {
  console.log(`   ❌ Potential direct API imports found in ${httpImports.length} files:`);
  httpImports.forEach(imp => {
    console.log(`      - ${imp.file}: ${imp.matches.join(', ')}`);
  });
} else {
  console.log('   ✅ No direct API imports found outside facade');
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

// Update process reference to work with ES modules
const hasIssues = issues.length > 0;
if (hasIssues) {
  console.log(`\n🚨 Architecture compliance issues detected: ${issues.length} issues found`);
} else {
  console.log('\n✅ All architecture compliance checks passed!');
}
process.exit(hasIssues ? 1 : 0);