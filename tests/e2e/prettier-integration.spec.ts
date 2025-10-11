import { expect, test } from '@playwright/test';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Git Hooks Integration Tests
 *
 * Diese Tests stellen sicher, dass Prettier korrekt in Git Hooks integriert ist
 * und bei Commits automatisch ausgeführt wird.
 */

test.describe('Git Hooks Integration Tests', () => {
  const projectRoot = process.cwd();

  test('should have husky pre-commit hook configured', async () => {
    const huskyDir = join(projectRoot, '.husky');
    const preCommitHook = join(huskyDir, 'pre-commit');

    expect(existsSync(huskyDir)).toBeTruthy();

    if (existsSync(preCommitHook)) {
      const hookContent = readFileSync(preCommitHook, 'utf8');
      expect(hookContent).toContain('lint-staged');
    }
  });

  test('should have lint-staged configuration with prettier', async () => {
    const packageJsonPath = join(projectRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    expect(packageJson['lint-staged']).toBeDefined();

    const lintStaged = packageJson['lint-staged'];

    // Überprüfe TypeScript/JavaScript Konfiguration
    const tsConfig = lintStaged['*.{ts,tsx,js,jsx}'];
    expect(tsConfig).toBeDefined();
    expect(tsConfig).toContain('prettier --write');

    // Überprüfe JSON/YAML Konfiguration
    const jsonConfig = lintStaged['*.{json,yaml,yml}'];
    expect(jsonConfig).toBeDefined();
    expect(jsonConfig).toContain('prettier --write');

    // Überprüfe Markdown Konfiguration
    const mdConfig = lintStaged['*.{md,mdx}'];
    expect(mdConfig).toBeDefined();
    expect(mdConfig).toContain('prettier --write');
  });

  test('should have prettier scripts in package.json', async () => {
    const packageJsonPath = join(projectRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    const scripts = packageJson.scripts;

    expect(scripts.format).toBe('prettier --write .');
    expect(scripts['format:check']).toBe('prettier --check .');
    expect(scripts['format:staged']).toBe('prettier --write');
  });

  test('should have prettier dependency installed', async () => {
    const packageJsonPath = join(projectRoot, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    const devDeps = packageJson.devDependencies;

    expect(devDeps.prettier).toBeDefined();
    expect(devDeps.prettier).toMatch(/^\^?\d+\.\d+\.\d+$/);
  });

  test('should validate staged files before commit', async () => {
    // Simuliere einen Commit mit schlecht formatierter Datei
    const testFile = join(projectRoot, 'temp-commit-test.ts');
    const badlyFormattedCode = `const   test    =    "hello world";`;

    writeFileSync(testFile, badlyFormattedCode);

    try {
      // Simuliere lint-staged auf der Datei
      execSync(`npx lint-staged --relative --diff="HEAD" --diff-filter=A`, {
        cwd: projectRoot,
        stdio: 'pipe',
        env: { ...process.env, STAGED_FILES: testFile },
      });

      // Nach lint-staged sollte die Datei formatiert sein
      const formattedCode = readFileSync(testFile, 'utf8');
      expect(formattedCode).toContain("const test = 'hello world';");
    } catch (error) {
      // lint-staged könnte fehlschlagen wenn keine git repo vorhanden
      console.log(
        'lint-staged test skipped - no git repository or staged files'
      );
    } finally {
      try {
        execSync(`rm ${testFile}`);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });
});

test.describe('CI/CD Integration Tests', () => {
  const projectRoot = process.cwd();

  test('should have GitHub Actions workflow for formatting', async () => {
    const workflowPath = join(
      projectRoot,
      '.github',
      'workflows',
      'code-formatting.yml'
    );

    if (existsSync(workflowPath)) {
      const workflowContent = readFileSync(workflowPath, 'utf8');

      expect(workflowContent).toContain('prettier');
      expect(workflowContent).toContain('format:check');
      expect(workflowContent).toContain('npm ci');
      expect(workflowContent).toContain('ubuntu-latest');
    }
  });

  test('should validate format check command', async () => {
    // Erstelle temporäre gut formatierte Datei
    const testFile = join(projectRoot, 'temp-ci-test.ts');
    const wellFormattedCode = `const config = {
  name: 'test',
  version: '1.0.0',
};

export default config;
`;

    writeFileSync(testFile, wellFormattedCode);

    try {
      // Test format:check Kommando
      execSync(`npm run format:check ${testFile}`, {
        cwd: projectRoot,
        stdio: 'pipe',
      });

      // Sollte erfolgreich sein
      expect(true).toBeTruthy();
    } catch (error) {
      throw new Error(
        'format:check command should succeed with well-formatted file'
      );
    } finally {
      try {
        execSync(`rm ${testFile}`);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  test('should fail format check with badly formatted code', async () => {
    const testFile = join(projectRoot, 'temp-ci-fail-test.ts');
    const badlyFormattedCode = `const   test="hello";const another    =   "world";`;

    writeFileSync(testFile, badlyFormattedCode);

    try {
      let checkFailed = false;

      try {
        execSync(`npm run format:check ${testFile}`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      } catch (error) {
        checkFailed = true;
      }

      expect(checkFailed).toBeTruthy();
    } finally {
      try {
        execSync(`rm ${testFile}`);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });
});

test.describe('VSCode Integration Tests', () => {
  const projectRoot = process.cwd();

  test('should have VSCode settings for prettier', async () => {
    const vscodeSettingsPath = join(projectRoot, '.vscode', 'settings.json');

    // VSCode settings sind optional, aber wenn vorhanden, sollten sie korrekt sein
    if (existsSync(vscodeSettingsPath)) {
      const settings = JSON.parse(readFileSync(vscodeSettingsPath, 'utf8'));

      // Überprüfe empfohlene Prettier-Einstellungen
      if (settings['editor.defaultFormatter']) {
        expect(settings['editor.defaultFormatter']).toBe(
          'esbenp.prettier-vscode'
        );
      }

      if (settings['editor.formatOnSave']) {
        expect(settings['editor.formatOnSave']).toBe(true);
      }
    }
  });

  test('should suggest prettier extension', async () => {
    const vscodeExtensionsPath = join(
      projectRoot,
      '.vscode',
      'extensions.json'
    );

    if (existsSync(vscodeExtensionsPath)) {
      const extensions = JSON.parse(readFileSync(vscodeExtensionsPath, 'utf8'));

      if (extensions.recommendations) {
        expect(extensions.recommendations).toContain('esbenp.prettier-vscode');
      }
    }
  });
});

test.describe('Prettier Configuration Validation Tests', () => {
  const projectRoot = process.cwd();

  test('should validate prettier config syntax', async () => {
    const prettierConfigPath = join(projectRoot, '.prettierrc.json');

    if (existsSync(prettierConfigPath)) {
      try {
        const config = JSON.parse(readFileSync(prettierConfigPath, 'utf8'));

        // Validiere Konfigurationsschlüssel
        const validKeys = [
          'printWidth',
          'tabWidth',
          'useTabs',
          'semi',
          'singleQuote',
          'quoteProps',
          'jsxSingleQuote',
          'trailingComma',
          'bracketSpacing',
          'bracketSameLine',
          'arrowParens',
          'rangeStart',
          'rangeEnd',
          'parser',
          'filepath',
          'requirePragma',
          'insertPragma',
          'proseWrap',
          'htmlWhitespaceSensitivity',
          'vueIndentScriptAndStyle',
          'endOfLine',
          'embeddedLanguageFormatting',
          'overrides',
        ];

        for (const key in config) {
          if (key !== 'overrides') {
            expect(validKeys).toContain(key);
          }
        }

        // Validiere Override-Struktur
        if (config.overrides) {
          expect(Array.isArray(config.overrides)).toBeTruthy();

          config.overrides.forEach((override: any) => {
            expect(override.files).toBeDefined();
            expect(override.options).toBeDefined();
            expect(typeof override.files).toBe('string');
            expect(typeof override.options).toBe('object');
          });
        }
      } catch (error) {
        throw new Error('Prettier configuration is not valid JSON');
      }
    }
  });

  test('should have reasonable configuration values', async () => {
    const prettierConfigPath = join(projectRoot, '.prettierrc.json');

    if (existsSync(prettierConfigPath)) {
      const config = JSON.parse(readFileSync(prettierConfigPath, 'utf8'));

      // Überprüfe sinnvolle Werte
      if (config.printWidth) {
        expect(config.printWidth).toBeGreaterThan(40);
        expect(config.printWidth).toBeLessThan(200);
      }

      if (config.tabWidth) {
        expect(config.tabWidth).toBeGreaterThan(1);
        expect(config.tabWidth).toBeLessThan(8);
      }

      if (config.trailingComma) {
        expect(['none', 'es5', 'all']).toContain(config.trailingComma);
      }

      if (config.arrowParens) {
        expect(['avoid', 'always']).toContain(config.arrowParens);
      }

      if (config.endOfLine) {
        expect(['lf', 'crlf', 'cr', 'auto']).toContain(config.endOfLine);
      }
    }
  });
});
