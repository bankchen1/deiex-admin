#!/usr/bin/env node
// Fields Scanner
// Generates reports/field-map.json by scanning all .vue files in src/modules/**/{pages,forms,tables,widgets,drawers}

const fs = require('fs');
const path = require('path');

// UI component directories to scan for fields
const UI_DIRECTORIES = [
  'src/pages',
  'src/forms',
  'src/tables',
  'src/widgets',
  'src/modals'  // This is where drawers would be
];

const FILE_EXTENSIONS = ['.vue', '.js', '.ts'];

// Function to extract fields from a Vue file
function extractFieldsFromVueFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fields = new Set();
  
  // Extract fields from template section (HTML bindings)
  // Look for v-model bindings
  const vModelMatches = content.match(/v-model\s*=\s*["']?\s*\{\{\s*([\w.]+)\s*\}\}|v-model\s*=\s*["']?\s*:\w+\s*=\s*["']?\s*\{\{\s*([\w.]+)\s*\}\}|v-model\s*=\s*\{\{([^}]+)\}\}/g);
  if (vModelMatches) {
    vModelMatches.forEach(match => {
      const fieldMatch = match.match(/v-model\s*=\s*["']?\s*[{:]?\s*[\w.]*\.?(\w+)\s*[}]/i);
      if (fieldMatch && fieldMatch[1]) {
        fields.add(fieldMatch[1]);
      }
    });
  }
  
  // Extract fields from script section (props, data, etc.)
  // Look for prop definitions
  const propsMatches = content.match(/props\s*:\s*\{([^}]*)\}|defineProps<\s*\{([^}]*)\}>/gs);
  if (propsMatches) {
    propsMatches.forEach(propsBlock => {
      // Extract prop names
      const propNames = propsBlock.match(/[\w_$]+\s*[?:]/g);
      if (propNames) {
        propNames.forEach(prop => {
          const cleanProp = prop.replace(/[?:\s]+$/, '').trim();
          if (cleanProp && !['true', 'false', 'null', 'undefined'].includes(cleanProp)) {
            fields.add(cleanProp);
          }
        });
      }
    });
  }
  
  // Look for data properties, computed properties, etc.
  const dataMatches = content.match(/(\w+)\s*[:=]\s*[^,}\]]+\s*[,}]/g);
  if (dataMatches) {
    dataMatches.forEach(dataField => {
      const fieldName = dataField.match(/^\s*(\w+)\s*[:=]/);
      if (fieldName && fieldName[1]) {
        fields.add(fieldName[1]);
      }
    });
  }
  
  // Look for template bindings like {{ field }} or :field="field"
  const templateMatches = content.match(/\{\{\s*([\w.]+)\s*\}\}|"?:?(\w+)\s*=\s*['"][^'"]*"/g);
  if (templateMatches) {
    templateMatches.forEach(binding => {
      const fieldMatch = binding.match(/\{\{\s*([\w.]+)\s*\}\}/) || binding.match(/"?:?(\w+)\s*=/);
      if (fieldMatch && fieldMatch[1]) {
        // Extract just the field name from potential nested properties
        const field = fieldMatch[1].split('.')[0];
        fields.add(field);
      }
    });
  }
  
  // Look for field definitions in composition API setup
  const setupMatches = content.match(/const\s+\w+\s*=\s*(?:ref|reactive|computed)\([^)]*\)/g);
  if (setupMatches) {
    setupMatches.forEach(setupLine => {
      const constMatch = setupLine.match(/const\s+(\w+)\s*=/);
      if (constMatch && constMatch[1]) {
        fields.add(constMatch[1]);
      }
    });
  }
  
  return Array.from(fields);
}

// Function to categorize files by type
function categorizeFile(filePath) {
  if (filePath.includes('/pages/')) return 'pages';
  if (filePath.includes('/forms/')) return 'forms';
  if (filePath.includes('/tables/')) return 'tables';
  if (filePath.includes('/widgets/')) return 'widgets';
  if (filePath.includes('/modals/')) return 'modals';
  return 'other';
}

// Function to scan a directory recursively
function scanDirectory(dirPath) {
  let allFileFields = {};
  
  const items = fs.readdirSync(dirPath);
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      const subDirFields = scanDirectory(fullPath);
      
      // Merge subdirectory results
      for (const [file, fileData] of Object.entries(subDirFields)) {
        if (!allFileFields[file]) {
          allFileFields[file] = fileData;
        } else {
          // Merge fields arrays
          fileData.fields.forEach(field => {
            if (!allFileFields[file].fields.includes(field)) {
              allFileFields[file].fields.push(field);
            }
          });
          // Add file to appropriate category
          if (!allFileFields[file].categories.includes(fileData.categories[0])) {
            allFileFields[file].categories.push(fileData.categories[0]);
          }
        }
      }
    } else if (FILE_EXTENSIONS.includes(path.extname(fullPath))) {
      const fields = extractFieldsFromVueFile(fullPath);
      const category = categorizeFile(fullPath);
      
      if (fields.length > 0) {
        const relativePath = path.relative(process.cwd(), fullPath);
        allFileFields[relativePath] = {
          fields: fields,
          categories: [category]
        };
      }
    }
  });
  
  return allFileFields;
}

// Function to aggregate fields by module
function aggregateFieldsByModule(fileFields) {
  const moduleFields = {};
  
  for (const [filePath, fileData] of Object.entries(fileFields)) {
    // Extract module name from path (the directory after src/pages, src/forms, etc.)
    let moduleName = '';
    const pathParts = filePath.split('/');
    
    if (filePath.includes('/pages/')) {
      const pagesIndex = pathParts.indexOf('pages');
      if (pagesIndex !== -1 && pathParts.length > pagesIndex + 1) {
        moduleName = pathParts[pagesIndex + 1];
      }
    } else if (filePath.includes('/forms/')) {
      const formsIndex = pathParts.indexOf('forms');
      if (formsIndex !== -1 && pathParts.length > formsIndex + 1) {
        moduleName = pathParts[formsIndex + 1];
      }
    } else if (filePath.includes('/tables/')) {
      const tablesIndex = pathParts.indexOf('tables');
      if (tablesIndex !== -1 && pathParts.length > tablesIndex + 1) {
        moduleName = pathParts[tablesIndex + 1];
      }
    } else if (filePath.includes('/widgets/')) {
      const widgetsIndex = pathParts.indexOf('widgets');
      if (widgetsIndex !== -1 && pathParts.length > widgetsIndex + 1) {
        moduleName = pathParts[widgetsIndex + 1];
      }
    } else if (filePath.includes('/modals/')) {
      const modalsIndex = pathParts.indexOf('modals');
      if (modalsIndex !== -1 && pathParts.length > modalsIndex + 1) {
        moduleName = pathParts[modalsIndex + 1];
      }
    }
    
    if (!moduleName) {
      // Fallback: use the parent directory name
      const parentDir = path.dirname(filePath).split('/').pop();
      moduleName = parentDir || 'general';
    }
    
    // Initialize module in the result
    if (!moduleFields[moduleName]) {
      moduleFields[moduleName] = {
        fields: [],
        pages: [],
        forms: [],
        tables: [],
        widgets: [],
        modals: []
      };
    }
    
    // Add fields to the module
    fileData.fields.forEach(field => {
      if (!moduleFields[moduleName].fields.includes(field)) {
        moduleFields[moduleName].fields.push(field);
      }
    });
    
    // Add file to the appropriate category
    fileData.categories.forEach(category => {
      if (!moduleFields[moduleName][category].includes(filePath)) {
        moduleFields[moduleName][category].push(filePath);
      }
    });
  }
  
  return moduleFields;
}

// Main function
function main() {
  console.log('Scanning fields in UI files...\n');
  
  let allFileFields = {};
  
  UI_DIRECTORIES.forEach(dir => {
    const fullDir = path.join(process.cwd(), dir);
    if (fs.existsSync(fullDir)) {
      console.log(`Scanning ${dir}...`);
      const dirFields = scanDirectory(fullDir);
      allFileFields = { ...allFileFields, ...dirFields };
    } else {
      console.log(`Directory ${dir} does not exist, skipping...`);
    }
  });
  
  // Aggregate fields by module
  const moduleFields = aggregateFieldsByModule(allFileFields);
  
  // Write the field map to reports directory
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const outputPath = path.join(reportsDir, 'field-map.json');
  fs.writeFileSync(outputPath, JSON.stringify(moduleFields, null, 2));
  
  console.log(`\nField map generated at ${outputPath}`);
  console.log(`Found fields in ${Object.keys(moduleFields).length} modules`);
  
  // Summary
  Object.keys(moduleFields).forEach(module => {
    const moduleData = moduleFields[module];
    console.log(`- ${module}: ${moduleData.fields.length} fields across ${moduleData.pages.length + moduleData.forms.length + moduleData.tables.length + moduleData.widgets.length + moduleData.modals.length} files`);
  });
}

// Run the scanner
main();