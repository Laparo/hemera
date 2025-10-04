#!/usr/bin/env node

/**
 * Prettier Tests Runner
 *
 * Ein einfacher Test-Runner für Prettier-Funktionalität
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class PrettierTestRunner {
  constructor() {
    this.projectRoot = process.cwd();
    this.testsPassed = 0;
    this.testsFailed = 0;
    this.results = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix =
      {
        info: '📝',
        success: '✅',
        error: '❌',
        warning: '⚠️',
      }[type] || '📝';

    console.log(`${prefix} [${timestamp.substr(11, 8)}] ${message}`);
  }

  assert(condition, message) {
    if (condition) {
      this.testsPassed++;
      this.log(`PASS: ${message}`, 'success');
      this.results.push({ test: message, status: 'PASS' });
    } else {
      this.testsFailed++;
      this.log(`FAIL: ${message}`, 'error');
      this.results.push({ test: message, status: 'FAIL' });
    }
  }

  testConfigurationExists() {
    this.log('Testing Prettier configuration files...');

    const prettierConfigPath = join(this.projectRoot, '.prettierrc.json');
    this.assert(
      existsSync(prettierConfigPath),
      'Prettier configuration file exists'
    );

    if (existsSync(prettierConfigPath)) {
      try {
        const config = JSON.parse(readFileSync(prettierConfigPath, 'utf8'));
        this.assert(
          typeof config === 'object',
          'Prettier configuration is valid JSON'
        );
        this.assert(config.semi === true, 'Semi configuration is correct');
        this.assert(
          config.singleQuote === true,
          'Single quote configuration is correct'
        );
        this.assert(config.printWidth === 80, 'Print width is set to 80');
      } catch (error) {
        this.assert(false, 'Prettier configuration is valid JSON');
      }
    }

    const prettierIgnorePath = join(this.projectRoot, '.prettierignore');
    this.assert(existsSync(prettierIgnorePath), 'Prettier ignore file exists');
  }

  testFormattingCapability() {
    this.log('Testing Prettier formatting capability...');

    const testFile = join(this.projectRoot, 'temp-prettier-test.ts');
    const badlyFormattedCode = `const   test    =    {
name:"John Doe",age:    30,
      hobbies: [
        "reading","coding",
            "swimming"   
      ]
}

function    greet(  name:string  ):string {
     return \`Hello,    \${name}!\`;
}

export{test,greet};
`;

    try {
      writeFileSync(testFile, badlyFormattedCode);

      // Test Prettier formatting
      execSync(`npx prettier --write ${testFile}`, {
        cwd: this.projectRoot,
        stdio: 'pipe',
      });

      const formattedCode = readFileSync(testFile, 'utf8');

      this.assert(
        formattedCode.includes("name: 'John Doe',"),
        'Object properties are correctly formatted'
      );
      this.assert(
        formattedCode.includes('export { test, greet };'),
        'Export statements are correctly formatted'
      );
      this.assert(
        formattedCode.includes('function greet(name: string): string {'),
        'Function signatures are correctly formatted'
      );
    } catch (error) {
      this.assert(false, `Prettier formatting failed: ${error.message}`);
    } finally {
      if (existsSync(testFile)) {
        unlinkSync(testFile);
      }
    }
  }

  testPackageJsonIntegration() {
    this.log('Testing package.json integration...');

    const packageJsonPath = join(this.projectRoot, 'package.json');
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

      this.assert(
        packageJson.scripts && packageJson.scripts.format,
        'Format script exists in package.json'
      );
      this.assert(
        packageJson.scripts && packageJson.scripts['format:check'],
        'Format check script exists in package.json'
      );
      this.assert(
        packageJson.devDependencies && packageJson.devDependencies.prettier,
        'Prettier is listed as dev dependency'
      );

      if (packageJson['lint-staged']) {
        const hasJsTs = packageJson['lint-staged']['*.{ts,tsx,js,jsx}'];
        this.assert(
          hasJsTs && hasJsTs.includes('prettier --write'),
          'lint-staged includes prettier for JS/TS files'
        );
      }
    }
  }

  testVSCodeIntegration() {
    this.log('Testing VSCode integration...');

    const vscodeSettingsPath = join(
      this.projectRoot,
      '.vscode',
      'settings.json'
    );
    if (existsSync(vscodeSettingsPath)) {
      try {
        const settings = JSON.parse(readFileSync(vscodeSettingsPath, 'utf8'));
        this.assert(
          settings['editor.defaultFormatter'] === 'esbenp.prettier-vscode',
          'VSCode default formatter is set to Prettier'
        );
        this.assert(
          settings['editor.formatOnSave'] === true,
          'Format on save is enabled'
        );
      } catch (error) {
        this.assert(false, 'VSCode settings.json is valid JSON');
      }
    }

    const vscodeExtensionsPath = join(
      this.projectRoot,
      '.vscode',
      'extensions.json'
    );
    if (existsSync(vscodeExtensionsPath)) {
      try {
        const extensions = JSON.parse(
          readFileSync(vscodeExtensionsPath, 'utf8')
        );
        this.assert(
          extensions.recommendations &&
            extensions.recommendations.includes('esbenp.prettier-vscode'),
          'Prettier extension is recommended'
        );
      } catch (error) {
        this.assert(false, 'VSCode extensions.json is valid JSON');
      }
    }
  }

  testGitHubActionsIntegration() {
    this.log('Testing GitHub Actions integration...');

    const workflowPath = join(
      this.projectRoot,
      '.github',
      'workflows',
      'code-formatting.yml'
    );
    if (existsSync(workflowPath)) {
      const workflowContent = readFileSync(workflowPath, 'utf8');
      this.assert(
        workflowContent.includes('prettier'),
        'GitHub Actions workflow mentions prettier'
      );
      this.assert(
        workflowContent.includes('format:check'),
        'GitHub Actions workflow uses format:check script'
      );
    }
  }

  testFormatCheck() {
    this.log('Testing format check functionality...');

    try {
      execSync('npm run format:check', {
        cwd: this.projectRoot,
        stdio: 'pipe',
      });
      this.assert(true, 'All project files are properly formatted');
    } catch (error) {
      this.assert(false, 'Some project files need formatting');
    }
  }

  runAllTests() {
    this.log('Starting Prettier tests...', 'info');
    this.log('', 'info');

    this.testConfigurationExists();
    this.testFormattingCapability();
    this.testPackageJsonIntegration();
    this.testVSCodeIntegration();
    this.testGitHubActionsIntegration();
    this.testFormatCheck();

    this.log('', 'info');
    this.log('='.repeat(50), 'info');
    this.log(
      `Test Results: ${this.testsPassed} passed, ${this.testsFailed} failed`,
      'info'
    );

    if (this.testsFailed === 0) {
      this.log('All Prettier tests passed! 🎉', 'success');
    } else {
      this.log('Some tests failed. Check the output above.', 'error');
    }

    return this.testsFailed === 0;
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.testsPassed + this.testsFailed,
      passed: this.testsPassed,
      failed: this.testsFailed,
      results: this.results,
    };

    const reportPath = join(this.projectRoot, 'prettier-test-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log(`Test report generated: ${reportPath}`, 'info');
  }
}

// Führe Tests aus wenn direkt aufgerufen
const scriptPath = process.argv[1];
const currentFile = fileURLToPath(import.meta.url);

if (scriptPath === currentFile) {
  const runner = new PrettierTestRunner();
  const success = runner.runAllTests();
  runner.generateReport();
  process.exit(success ? 0 : 1);
}

export default PrettierTestRunner;
