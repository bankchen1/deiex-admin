#!/usr/bin/env node
/**
 * Route Index Generator
 * 
 * Generates reports/ui-route-index.json by scanning src/router/modules/*.ts
 */

const fs = require('fs');
const path = require('path');

// Function to parse a router module file
function parseRouterFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const routes = [];
  
  // This is a simplified approach - in a real implementation, you might want to use AST parsing
  // For now, we'll use regex to extract the relevant information
  
  // Find route definitions - looking for RouteRecordRaw arrays
  // This finds the routes in the format: export const [name]Routes: RouteRecordRaw[] = [...]
  const routeRegex = /export const (\w+Routes):\s*RouteRecordRaw\s*\[\s*\]\s*=\s*\[(.*?)\];/gs;
  let match;
  
  while ((match = routeRegex.exec(content)) !== null) {
    const moduleName = match[1].replace('Routes', '').toLowerCase();
    const routeContent = match[2];
    
    // Find individual route objects within the array
    // This is complex due to nested objects - using a simplified approach
    // A full implementation would need proper AST parsing
    const routeObjects = extractRouteObjects(routeContent);
    
    routeObjects.forEach(routeObj => {
      const routeEntry = {
        module: moduleName,
        routeName: routeObj.name || 'unknown',
        path: routeObj.path || 'unknown',
        vueFile: extractVueFile(routeObj.component) || null,
        meta: routeObj.meta || {}
      };
      
      routes.push(routeEntry);
    });
  }
  
  return routes;
}

// Simple function to extract route objects - simplified implementation
function extractRouteObjects(content) {
  // This is a very basic implementation that looks for route object patterns
  // A production implementation would use proper AST parsing
  const routes = [];
  
  // Find all route objects - this is simplified and may not catch all cases
  try {
    // Replace component import functions with placeholders to simplify parsing
    let simplifiedContent = content.replace(/component:\s*\(\)\s*=>\s*import\([^)]+\)/g, 'component: PLACEHOLDER');
    simplifiedContent = simplifiedContent.replace(/component:\s*[^,}]+(?=\s*[,}])/g, 'component: PLACEHOLDER');
    
    // Attempt to identify route objects - this is a very simplified approach
    const routeMatches = simplifiedContent.match(/\{[^}]*name\s*:\s*['"][^'"]+['"][^}]*\}/g);
    
    if (routeMatches) {
      routeMatches.forEach(routeStr => {
        const routeObj = {};
        
        // Extract name
        const nameMatch = routeStr.match(/name\s*:\s*['"]([^'"]+)['"]/);
        if (nameMatch) routeObj.name = nameMatch[1];
        
        // Extract path
        const pathMatch = routeStr.match(/path\s*:\s*['"]([^'"]+)['"]/);
        if (pathMatch) routeObj.path = pathMatch[1];
        
        // Extract meta if present
        const metaMatch = routeStr.match(/meta\s*:\s*([^,}]+)/);
        if (metaMatch) routeObj.meta = {}; // Simplified
        
        routes.push(routeObj);
      });
    }
  } catch (e) {
    console.log(`Warning: Could not parse route objects in ${content.substring(0, 100)}...`);
  }
  
  return routes;
}

// Function to extract Vue file path from component import
function extractVueFile(componentStr) {
  if (!componentStr) return null;
  
  // Look for dynamic import syntax
  const importMatch = componentStr.match(/import\(\s*['"]([^'"]+\.(vue|ts|js))['"]\s*\)/);
  if (importMatch) {
    return importMatch[1].replace(/^\.\.\//, 'src/'); // Convert relative to absolute from src
  }
  
  return null;
}

// Main function
function main() {
  console.log('Generating route index...');
  
  const routerModulesDir = path.join(process.cwd(), 'src/router/modules');
  if (!fs.existsSync(routerModulesDir)) {
    console.log(`Router modules directory does not exist: ${routerModulesDir}`);
    process.exit(1);
  }
  
  const routeFiles = fs.readdirSync(routerModulesDir);
  const allRoutes = {};
  
  routeFiles.forEach(file => {
    if (path.extname(file) === '.ts') {
      const filePath = path.join(routerModulesDir, file);
      console.log(`Processing ${file}...`);
      
      try {
        const routes = parseRouterFile(filePath);
        const moduleName = path.basename(file, '.ts');
        
        allRoutes[moduleName] = routes;
      } catch (err) {
        console.log(`Error processing ${file}: ${err.message}`);
      }
    }
  });
  
  // Write the route index to reports directory
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const outputPath = path.join(reportsDir, 'ui-route-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(allRoutes, null, 2));
  
  console.log(`Route index generated at ${outputPath}`);
  console.log(`Found routes in ${Object.keys(allRoutes).length} modules`);
  
  // Count total routes
  let totalRoutes = 0;
  Object.values(allRoutes).forEach(routes => {
    totalRoutes += routes.length;
  });
  
  console.log(`Total routes found: ${totalRoutes}`);
}

// Run the generator
main();