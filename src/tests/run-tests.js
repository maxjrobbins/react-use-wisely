/**
 * Custom test runner script to execute all hook tests
 * Run this with: node src/tests/run-tests.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Directory containing hook tests
const testsDir = path.join(__dirname, 'hooks');

// Get all test files
const testFiles = fs.readdirSync(testsDir)
	.filter(file => file.endsWith('.test.js'));

// Sort files alphabetically
testFiles.sort();

console.log(`Found ${testFiles.length} test files:\n`);
testFiles.forEach(file => console.log(`  - ${file}`));
console.log('\n');

// Counter for test results
let passed = 0;
let failed = 0;
const failedTests = [];

// Run each test file individually
testFiles.forEach(file => {
	const testPath = path.join(testsDir, file);
	console.log(`\n---------------------------------------------`);
	console.log(`Running tests for: ${file}`);
	console.log(`---------------------------------------------`);

	try {
		// Execute Jest for this specific test file
		execSync(`npx jest ${testPath} --colors`, { stdio: 'inherit' });
		console.log(`✅ ${file} passed`);
		passed++;
	} catch (error) {
		console.log(`❌ ${file} failed`);
		failedTests.push(file);
		failed++;
	}
});

// Print summary
console.log('\n\n=============================================');
console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
console.log('=============================================');

if (failed > 0) {
	console.log('\nFailed tests:');
	failedTests.forEach(file => console.log(`  - ${file}`));
	process.exit(1);
} else {
	console.log('\nAll tests passed successfully! 🎉');
	process.exit(0);
}
