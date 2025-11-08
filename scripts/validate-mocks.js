#!/usr/bin/env node
/**
 * Mock Validation Checker
 * 
 * Validates that all mock examples match their contract definitions
 */

const fs = require('fs');
const path = require('path');

// Function to validate mock files against their expected structure
function validateMockFile(moduleName, mockFilePath) {
  try {
    const mockData = JSON.parse(fs.readFileSync(mockFilePath, 'utf8'));
    const errors = [];
    
    // Basic validation for each module's mock file structure
    switch (moduleName.toLowerCase()) {
      case 'users':
        errors.push(...validateUsersMock(mockData));
        break;
      case 'assets':
        errors.push(...validateAssetsMock(mockData));
        break;
      case 'kyc':
        errors.push(...validateKycMock(mockData));
        break;
      case 'risk':
        errors.push(...validateRiskMock(mockData));
        break;
      default:
        // Try to validate using general object structure rules
        if (typeof mockData !== 'object' || mockData === null) {
          errors.push(`Invalid JSON structure in ${mockFilePath}`);
        }
        break;
    }
    
    return errors;
  } catch (err) {
    return [`Error parsing mock file ${mockFilePath}: ${err.message}`];
  }
}

// Validation functions for each module
function validateUsersMock(mockData) {
  const errors = [];
  
  // Validate user list structure
  if (mockData.userList && Array.isArray(mockData.userList?.data)) {
    mockData.userList.data.forEach((user, index) => {
      if (typeof user.id !== 'string') {
        errors.push(`User at index ${index} missing/invalid id in userList`);
      }
      if (typeof user.nickname !== 'string') {
        errors.push(`User at index ${index} missing/invalid nickname in userList`);
      }
    });
  }
  
  // Validate user detail structure
  if (mockData.userDetail?.user) {
    const user = mockData.userDetail.user;
    if (typeof user.id !== 'string') {
      errors.push(`User detail has invalid/missing id`);
    }
    if (typeof user.nickname !== 'string') {
      errors.push(`User detail has invalid/missing nickname`);
    }
  }
  
  // Validate statistics structure
  if (mockData.userStats) {
    const requiredStats = ['total', 'active', 'disabled', 'suspended', 'todayRegistrations', 'kycPending'];
    requiredStats.forEach(stat => {
      if (!(stat in mockData.userStats)) {
        errors.push(`User stats missing required field: ${stat}`);
      }
    });
  }
  
  return errors;
}

function validateAssetsMock(mockData) {
  const errors = [];
  
  // Validate deposit list structure
  if (Array.isArray(mockData.depositList)) {
    mockData.depositList.forEach((deposit, index) => {
      if (typeof deposit.id !== 'string') {
        errors.push(`Deposit at index ${index} missing/invalid id`);
      }
      if (typeof deposit.status !== 'string') {
        errors.push(`Deposit at index ${index} missing/invalid status`);
      }
    });
  }
  
  // Validate withdrawal list structure
  if (Array.isArray(mockData.withdrawalList)) {
    mockData.withdrawalList.forEach((withdrawal, index) => {
      if (typeof withdrawal.id !== 'string') {
        errors.push(`Withdrawal at index ${index} missing/invalid id`);
      }
      if (typeof withdrawal.status !== 'string') {
        errors.push(`Withdrawal at index ${index} missing/invalid status`);
      }
    });
  }
  
  return errors;
}

function validateKycMock(mockData) {
  const errors = [];
  
  // Validate application list structure
  if (Array.isArray(mockData.applicationList)) {
    mockData.applicationList.forEach((app, index) => {
      if (typeof app.id !== 'string') {
        errors.push(`KYC application at index ${index} missing/invalid id`);
      }
      if (typeof app.status !== 'string') {
        errors.push(`KYC application at index ${index} missing/invalid status`);
      }
    });
  }
  
  // Validate application detail structure
  if (mockData.applicationDetail?.application) {
    const app = mockData.applicationDetail.application;
    if (typeof app.id !== 'string') {
      errors.push(`KYC application detail has invalid/missing id`);
    }
    if (!Array.isArray(app.documents)) {
      errors.push(`KYC application detail missing/invalid documents array`);
    }
  }
  
  return errors;
}

function validateRiskMock(mockData) {
  const errors = [];
  
  // Validate risk rule list structure
  if (Array.isArray(mockData.riskRuleList?.data)) {
    mockData.riskRuleList.data.forEach((rule, index) => {
      if (typeof rule.id !== 'string') {
        errors.push(`Risk rule at index ${index} missing/invalid id`);
      }
      if (typeof rule.name !== 'string') {
        errors.push(`Risk rule at index ${index} missing/invalid name`);
      }
    });
  }
  
  // Validate risk limit list structure
  if (Array.isArray(mockData.riskLimitList?.data)) {
    mockData.riskLimitList.data.forEach((limit, index) => {
      if (typeof limit.id !== 'string') {
        errors.push(`Risk limit at index ${index} missing/invalid id`);
      }
      if (typeof limit.name !== 'string') {
        errors.push(`Risk limit at index ${index} missing/invalid name`);
      }
    });
  }
  
  // Validate blacklist entry list structure
  if (Array.isArray(mockData.blacklistEntryList?.data)) {
    mockData.blacklistEntryList.data.forEach((entry, index) => {
      if (typeof entry.id !== 'string') {
        errors.push(`Blacklist entry at index ${index} missing/invalid id`);
      }
      if (typeof entry.type !== 'string') {
        errors.push(`Blacklist entry at index ${index} missing/invalid type`);
      }
    });
  }
  
  return errors;
}

// Main function
function main() {
  console.log('Validating mock examples against contract definitions...\n');
  
  const mockDir = path.join(process.cwd(), 'src/mock/examples');
  let totalErrors = 0;
  let totalFiles = 0;
  
  if (!fs.existsSync(mockDir)) {
    console.log(`Mock examples directory does not exist: ${mockDir}`);
    process.exit(0);
  }
  
  const mockFiles = fs.readdirSync(mockDir);
  
  mockFiles.forEach(file => {
    if (path.extname(file) === '.json') {
      const moduleName = path.basename(file, '.json');
      const filePath = path.join(mockDir, file);
      
      console.log(`Validating ${moduleName} mock file...`);
      totalFiles++;
      
      const errors = validateMockFile(moduleName, filePath);
      
      if (errors.length > 0) {
        console.log(`❌ ${moduleName} mock validation failed with ${errors.length} error(s):`);
        errors.forEach(error => console.log(`  - ${error}`));
        totalErrors += errors.length;
      } else {
        console.log(`✅ ${moduleName} mock validation passed!`);
      }
    }
  });
  
  if (totalErrors === 0) {
    console.log(`\n✅ All ${totalFiles} mock files are valid! Contract compliance verified.`);
    process.exit(0);
  } else {
    console.log(`\n❌ Found ${totalErrors} validation errors in ${totalFiles} mock files.`);
    process.exit(1);
  }
}

// Run the validator
main();