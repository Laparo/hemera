import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🧪 Testing Prettier Configuration...\n');

const projectRoot = process.cwd();
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    const result = fn();
    if (result) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    failed++;
  }
}

// Test 1: Prettier config exists
test('Prettier configuration file exists', () => {
  return existsSync(join(projectRoot, '.prettierrc.json'));
});

// Test 2: Prettier ignore exists
test('Prettier ignore file exists', () => {
  return existsSync(join(projectRoot, '.prettierignore'));
});

// Test 3: Package.json scripts
test('Package.json has prettier scripts', () => {
  const packageJson = JSON.parse(
    readFileSync(join(projectRoot, 'package.json'), 'utf8')
  );
  return packageJson.scripts.format && packageJson.scripts['format:check'];
});

// Test 4: Prettier dependency
test('Prettier is installed as dev dependency', () => {
  const packageJson = JSON.parse(
    readFileSync(join(projectRoot, 'package.json'), 'utf8')
  );
  return packageJson.devDependencies.prettier;
});

// Test 5: Format check works
test('Format check command works', () => {
  try {
    execSync('npm run format:check', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
});

// Test 6: VSCode settings
test('VSCode settings configured for Prettier', () => {
  const vscodeSettingsPath = join(projectRoot, '.vscode', 'settings.json');
  if (existsSync(vscodeSettingsPath)) {
    const settings = JSON.parse(readFileSync(vscodeSettingsPath, 'utf8'));
    return settings['editor.defaultFormatter'] === 'esbenp.prettier-vscode';
  }
  return false;
});

// Test 7: GitHub Actions workflow
test('GitHub Actions workflow exists', () => {
  return existsSync(
    join(projectRoot, '.github', 'workflows', 'code-formatting.yml')
  );
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All Prettier tests passed!');
} else {
  console.log('⚠️ Some tests failed.');
}

process.exit(failed === 0 ? 0 : 1);
