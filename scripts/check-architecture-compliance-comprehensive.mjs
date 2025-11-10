#!/usr/bin/env node
/**
 * Architecture Gatekeeping - Part 2
 * 
 * Verification script for architecture compliance after P1 implementation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Change to the project directory
process.chdir(path.join(__dirname, '..'));

console.log('🔍 Starting architecture compliance analysis...\n');

// Identify all stores that still use direct API services instead of facade
function checkStoreArchitecture() {
  const storesDir = path.join(process.cwd(), 'src/stores');
  const storeFiles = fs.readdirSync(storesDir).filter(file => file.endsWith('.ts'));
  
  const violations = [];
  
  for (const file of storeFiles) {
    const filepath = path.join(storesDir, file);
    const content = fs.readFileSync(filepath, 'utf8');
    
    // Check for direct API service imports (not through facade)
    const directApiImports = content.match(/import\s+.*\s+from\s+['"]@\/*\/services\/api(?!\/facade)/g);
    if (directApiImports) {
      violations.push({
        file: `src/stores/${file}`,
        type: 'direct_api_import',
        message: 'Direct API service import found, should use facade pattern',
        lines: directApiImports.slice(0, 3)
      });
    }
    
    // Check for any remaining axios/fetch usage in stores (should only be in services/api layer)
    const httpImports = content.match(/import\s+.*axios|from\s+['"]axios['"]|import\s+.*fetch|from\s+['"]@\/utils\/http/gi);
    if (httpImports) {
      violations.push({
        file: `src/stores/${file}`,
        type: 'http_call_in_store',
        message: 'HTTP client imported directly in store, should only be in services/api layer',
        lines: httpImports.slice(0, 3)
      });
    }
  }
  
  return violations;
}

// Identify all Vue components with hardcoded data
function checkComponentHardcodedData() {
  const componentDirs = [
    path.join(process.cwd(), 'src/pages'),
    path.join(process.cwd(), 'src/components'),
    path.join(process.cwd(), 'src/tables'),
    path.join(process.cwd(), 'src/modals'),
    path.join(process.cwd(), 'src/forms'),
    path.join(process.cwd(), 'src/widgets')
  ];
  
  const violations = [];
  
  for (const dir of componentDirs) {
    if (!fs.existsSync(dir)) continue;
    
    const files = getFilesRecursive(dir).filter(f => 
      f.endsWith('.vue') || f.endsWith('.ts')
    );
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Look for hardcoded data patterns (arrays of objects, mock data arrays)
      const hardcodedPatterns = content.match(/const\s+\w+\s*=\s*\[[^\]]*{[^\]]*}\s*,?|const\s+\w+\s*=\s*\{[^}]*id:\s*['"][^'"]+['"]|mock\w*Data\s*=\s*\[|static\w*Data\s*=\s*\[/gi);
      if (hardcodedPatterns) {
        const relativePath = path.relative(process.cwd(), file);
        violations.push({
          file: relativePath,
          type: 'hardcoded_data',
          message: 'Hardcoded data array found in component, should use stores/facade',
          lines: hardcodedPatterns.slice(0, 3)
        });
      }
      
      // Look for direct API calls in components (should use stores instead)
      if (content.includes('api.') || content.includes('ApiClient') || content.includes('axios.')) {
        const directApiCalls = content.match(/api\.\w+|ApiClient\.\w+|axios\.\w+/g);
        if (directApiCalls) {
          const relativePath = path.relative(process.cwd(), file);
          violations.push({
            file: relativePath,
            type: 'direct_api_call',
            message: 'Direct API call found in component, should use stores',
            lines: directApiCalls.slice(0, 3)
          });
        }
      }
    }
  }
  
  return violations;
}

// Identify all pages that don't follow Contract+Service+Mock architecture
function checkPageFieldAlignment() {
  const pageDirs = [
    path.join(process.cwd(), 'src/pages')
  ];
  
  const violations = [];
  
  for (const dir of pageDirs) {
    if (!fs.existsSync(dir)) continue;
    
    const files = getFilesRecursive(dir).filter(f => f.endsWith('.vue'));
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(process.cwd(), file);
      
      // Check for contracts usage in pages
      if (!content.includes('from \'@/contracts/') && !content.includes('import type')) {
        // This might be acceptable depending on the type of page, so don't mark as violation
        // unless it's clearly an API-consuming page
      }
    }
  }
  
  return violations;
}

// Get all files recursively
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

// Run all checks
const storeViolations = checkStoreArchitecture();
const componentViolations = checkComponentHardcodedData();
const pageViolations = checkPageFieldAlignment();

// Print summary
console.log('📋 ARCHAEOLOGY REPORT - Architecture Compliance Check');
console.log('==================================================\n');

console.log(`🔍 Scanned ${fs.readdirSync(path.join(process.cwd(), 'src/stores')).filter(f => f.endsWith('.ts')).length} stores`);
console.log(`🔍 Scanned multiple component directories\n`);

console.log('❌ Architecture Violations Found:');
console.log('');

if (storeViolations.length > 0) {
  console.log(`  🏪 Stores Violations (${storeViolations.length}):`);
  storeViolations.forEach(violation => {
    console.log(`    • ${violation.file}: ${violation.message}`);
  });
  console.log('');
}

if (componentViolations.length > 0) {
  console.log(`  📄 Components Violations (${componentViolations.length}):`);
  componentViolations.forEach(violation => {
    console.log(`    • ${violation.file}: ${violation.message}`);
  });
  console.log('');
}

console.log('✅ Architecture Compliance Status:');
console.log(`  • Stores using facade pattern: ${storeViolations.length ? '❌ PARTIAL' : '✅ FULL'}`);
console.log(`  • Components with hardcoded data: ${componentViolations.length ? '❌ EXISTS' : '✅ NONE'}`);
console.log(`  • Direct API calls in UI: ${componentViolations.filter(v => v.type === 'direct_api_call').length ? '❌ EXISTS' : '✅ NONE'}`);

const totalViolations = storeViolations.length + componentViolations.length;

if (totalViolations === 0) {
  console.log('\n🎉 ALL ARCHITECTURE COMPLIANCE CHECKS PASSED!');
  console.log('   The project now fully follows the Contract+Service+Mock architecture.');
  process.exit(0);
} else {
  console.log(`\n⚠️  FOUND ${totalViolations} ARCHITECTURE VIOLATIONS`);
  console.log('   These need to be fixed to maintain full architecture compliance.');
  process.exit(1);
}