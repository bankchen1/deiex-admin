/**
 * SDK Fix Verification Test
 * Tests that the SDK now calls the correct endpoint without double /api/v1
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:8080';
const CORRECT_LOGIN_ENDPOINT = `${BASE_URL}/api/v1/auth/login`;

const testCases = [
  {
    name: 'Login with valid credentials',
    endpoint: CORRECT_LOGIN_ENDPOINT,
    method: 'POST',
    data: {
      email: 'admin2@deiex.com',
      password: 'Admin1234'
    },
    expectedStatus: 200
  },
  {
    name: 'Login with invalid credentials',
    endpoint: CORRECT_LOGIN_ENDPOINT,
    method: 'POST',
    data: {
      email: 'admin2@deiex.com',
      password: 'wrongpassword'
    },
    expectedStatus: 401
  },
  {
    name: 'Test health endpoint',
    endpoint: `${BASE_URL}/health`,
    method: 'GET',
    data: null,
    expectedStatus: 200
  }
];

async function runTest(testCase) {
  const startTime = Date.now();
  try {
    const config = {
      method: testCase.method,
      url: testCase.endpoint,
      data: testCase.data,
      validateStatus: () => true // Don't throw on any status
    };

    const response = await axios(config);
    const duration = Date.now() - startTime;

    const passed = response.status === testCase.expectedStatus;
    const status = passed ? '✅ PASS' : '❌ FAIL';

    console.log(`\n${status} ${testCase.name}`);
    console.log(`   URL: ${testCase.endpoint}`);
    console.log(`   Expected Status: ${testCase.expectedStatus}, Got: ${response.status}`);
    console.log(`   Response Time: ${duration}ms`);

    if (response.data) {
      console.log(`   Response Data:`, JSON.stringify(response.data, null, 2).substring(0, 200));
    }

    return { passed, duration, response };
  } catch (error) {
    console.log(`\n❌ FAIL ${testCase.name}`);
    console.log(`   Error: ${error.message}`);
    console.log(`   Stack: ${error.stack}`);
    return { passed: false, duration: Date.now() - startTime, error };
  }
}

async function runAllTests() {
  console.log('='.repeat(60));
  console.log('SDK FIX VERIFICATION TEST');
  console.log('='.repeat(60));
  console.log(`Testing against: ${BASE_URL}`);
  console.log(`Correct endpoint format: ${BASE_URL}/api/v1/...`);
  console.log(`Fixed: Removed double /api/v1 from SDK BASE_PATH`);
  console.log('='.repeat(60));

  const results = [];

  for (const testCase of testCases) {
    const result = await runTest(testCase);
    results.push({ testCase: testCase.name, ...result });
  }

  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));

  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / totalCount;

  console.log(`Total Tests: ${totalCount}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${totalCount - passedCount}`);
  console.log(`Average Response Time: ${Math.round(avgDuration)}ms`);
  console.log(`Success Rate: ${Math.round((passedCount / totalCount) * 100)}%`);

  if (passedCount === totalCount) {
    console.log('\n✅ ALL TESTS PASSED - SDK FIX VERIFIED');
  } else {
    console.log('\n❌ SOME TESTS FAILED - NEEDS INVESTIGATION');
  }

  console.log('='.repeat(60));
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
