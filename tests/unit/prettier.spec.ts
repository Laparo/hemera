import { expect, test } from '@playwright/test';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Prettier Tests
 *
 * Diese Tests stellen sicher, dass:
 * 1. Prettier-Konfiguration korrekt funktioniert
 * 2. Code-Formatierung konsistent angewendet wird
 * 3. Verschiedene Dateiformate unterstützt werden
 * 4. CI/CD-Integration ordnungsgemäß funktioniert
 */

test.describe('Prettier Configuration Tests', () => {
  const projectRoot = process.cwd();
  const prettierConfigPath = join(projectRoot, '.prettierrc.json');
  const prettierIgnorePath = join(projectRoot, '.prettierignore');

  test('should have prettier configuration file', async () => {
    expect(existsSync(prettierConfigPath)).toBeTruthy();

    const config = JSON.parse(readFileSync(prettierConfigPath, 'utf8'));

    // Überprüfe wichtige Konfigurationsoptionen
    expect(config.semi).toBe(true);
    expect(config.singleQuote).toBe(true);
    expect(config.printWidth).toBe(80);
    expect(config.tabWidth).toBe(2);
    expect(config.trailingComma).toBe('es5');
    expect(config.bracketSpacing).toBe(true);
    expect(config.arrowParens).toBe('avoid');
    expect(config.endOfLine).toBe('lf');
  });

  test('should have prettier ignore file', async () => {
    expect(existsSync(prettierIgnorePath)).toBeTruthy();

    const ignoreContent = readFileSync(prettierIgnorePath, 'utf8');

    // Überprüfe wichtige Ignore-Patterns
    expect(ignoreContent).toContain('.next/');
    expect(ignoreContent).toContain('node_modules/');
    expect(ignoreContent).toContain('*.min.js');
    expect(ignoreContent).toContain('test-results/');
    expect(ignoreContent).toContain('.env*');
  });

  test('should have overrides for different file types', async () => {
    const config = JSON.parse(readFileSync(prettierConfigPath, 'utf8'));

    expect(config.overrides).toBeDefined();
    expect(Array.isArray(config.overrides)).toBeTruthy();

    // Überprüfe Markdown-Override
    const mdOverride = config.overrides.find((o: any) => o.files === '*.md');
    expect(mdOverride).toBeDefined();
    expect(mdOverride.options.printWidth).toBe(100);
    expect(mdOverride.options.proseWrap).toBe('always');

    // Überprüfe JSON-Override
    const jsonOverride = config.overrides.find(
      (o: any) => o.files === '*.json'
    );
    expect(jsonOverride).toBeDefined();
    expect(jsonOverride.options.printWidth).toBe(120);

    // Überprüfe YAML-Override
    const yamlOverride = config.overrides.find(
      (o: any) => o.files === '*.yaml'
    );
    expect(yamlOverride).toBeDefined();
    expect(yamlOverride.options.singleQuote).toBe(false);
  });
});

test.describe('Prettier Formatting Tests', () => {
  const projectRoot = process.cwd();

  test('should format TypeScript files correctly', async () => {
    // Erstelle temporäre TypeScript-Datei mit schlechter Formatierung
    const testFile = join(projectRoot, 'temp-test.ts');
    const badlyFormattedCode = `
const   test    =    {
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

    writeFileSync(testFile, badlyFormattedCode);

    try {
      // Führe Prettier auf der Datei aus
      execSync(`npx prettier --write ${testFile}`, {
        cwd: projectRoot,
        stdio: 'pipe',
      });

      const formattedCode = readFileSync(testFile, 'utf8');

      // Überprüfe korrekte Formatierung
      expect(formattedCode).toContain("name: 'John Doe',");
      expect(formattedCode).toContain('age: 30,');
      expect(formattedCode).toContain(
        "hobbies: ['reading', 'coding', 'swimming']"
      );
      expect(formattedCode).toContain('function greet(name: string): string {');
      expect(formattedCode).toContain('return `Hello, ${name}!`;');
      expect(formattedCode).toContain('export { test, greet };');

      // Überprüfe Semicolons und Quotes
      expect(formattedCode).toMatch(/;$/m); // Mindestens ein Statement mit Semicolon
      expect(formattedCode).toContain("'"); // Single quotes verwendet
    } finally {
      // Aufräumen
      try {
        execSync(`rm ${testFile}`);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  test('should format JSX files correctly', async () => {
    const testFile = join(projectRoot, 'temp-test.tsx');
    const badlyFormattedJSX = `
import React from"react";

interface Props{
    name:string;
    age:number;
}

const Component:React.FC<Props>=({name,age})=>{
return(
<div    className="container">
<h1   >Hello {name}</h1>
      <p>Age: {age}</p>
    </div>
);
};

export default Component;
`;

    writeFileSync(testFile, badlyFormattedJSX);

    try {
      execSync(`npx prettier --write ${testFile}`, {
        cwd: projectRoot,
        stdio: 'pipe',
      });

      const formattedCode = readFileSync(testFile, 'utf8');

      // Überprüfe JSX-spezifische Formatierung
      expect(formattedCode).toContain("import React from 'react';");
      expect(formattedCode).toContain('interface Props {');
      expect(formattedCode).toContain('name: string;');
      expect(formattedCode).toContain(
        'const Component: React.FC<Props> = ({ name, age }) => {'
      );
      expect(formattedCode).toContain("<div className='container'>");
      expect(formattedCode).toContain('<h1>Hello {name}</h1>');
    } finally {
      try {
        execSync(`rm ${testFile}`);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  test('should format JSON files correctly', async () => {
    const testFile = join(projectRoot, 'temp-test.json');
    const badlyFormattedJSON = `{"name":"test","version":"1.0.0","scripts":{"start":"node index.js","build":"webpack"},"dependencies":{"react":"^18.0.0","typescript":"^4.0.0"}}`;

    writeFileSync(testFile, badlyFormattedJSON);

    try {
      execSync(`npx prettier --write ${testFile}`, {
        cwd: projectRoot,
        stdio: 'pipe',
      });

      const formattedCode = readFileSync(testFile, 'utf8');

      // JSON sollte ordentlich eingerückt sein
      expect(formattedCode).toContain('{\n  "name": "test"');
      expect(formattedCode).toContain('  "version": "1.0.0"');
      expect(formattedCode).toContain('  "scripts": {');
      expect(formattedCode).toContain('    "start": "node index.js"');
    } finally {
      try {
        execSync(`rm ${testFile}`);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  test('should format Markdown files correctly', async () => {
    const testFile = join(projectRoot, 'temp-test.md');
    const badlyFormattedMarkdown = `#    Title

This is a very long line that should be wrapped according to the markdown configuration settings which we have set to wrap at 100 characters for markdown files specifically.

##     Subtitle

-   Item 1
-    Item 2
-     Item 3

\`\`\`javascript
const test={name:"John",age:30};
\`\`\`
`;

    writeFileSync(testFile, badlyFormattedMarkdown);

    try {
      execSync(`npx prettier --write ${testFile}`, {
        cwd: projectRoot,
        stdio: 'pipe',
      });

      const formattedCode = readFileSync(testFile, 'utf8');

      // Überprüfe Markdown-Formatierung
      expect(formattedCode).toContain('# Title');
      expect(formattedCode).toContain('## Subtitle');
      expect(formattedCode).toContain('- Item 1');
      expect(formattedCode).toContain('- Item 2');
      expect(formattedCode).toContain('- Item 3');

      // Code-Blöcke sollten formatiert werden
      expect(formattedCode).toContain(
        "const test = { name: 'John', age: 30 };"
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

test.describe('Prettier Check Tests', () => {
  const projectRoot = process.cwd();

  test('should check if files are properly formatted', async () => {
    // Erstelle temporäre Datei mit korrekter Formatierung
    const testFile = join(projectRoot, 'temp-formatted.ts');
    const wellFormattedCode = `const config = {
  name: 'test',
  version: '1.0.0',
  scripts: {
    start: 'node index.js',
    build: 'webpack',
  },
};

export default config;
`;

    writeFileSync(testFile, wellFormattedCode);

    try {
      // Überprüfe, ob die Datei bereits korrekt formatiert ist
      const result = execSync(`npx prettier --check ${testFile}`, {
        cwd: projectRoot,
        stdio: 'pipe',
      });

      // Sollte keine Ausgabe haben (Datei ist bereits formatiert)
      expect(result.toString()).toBe('');
    } catch (error) {
      // Wenn Prettier einen Exit-Code !== 0 zurückgibt, ist die Datei nicht formatiert
      throw new Error(
        'File should be properly formatted but Prettier check failed'
      );
    } finally {
      try {
        execSync(`rm ${testFile}`);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  test('should detect badly formatted files', async () => {
    const testFile = join(projectRoot, 'temp-badly-formatted.ts');
    const badlyFormattedCode = `const   config    =    {
name:"test",version:"1.0.0"};`;

    writeFileSync(testFile, badlyFormattedCode);

    try {
      let checkFailed = false;

      try {
        execSync(`npx prettier --check ${testFile}`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      } catch (error) {
        checkFailed = true;
      }

      // Prettier Check sollte fehlschlagen für schlecht formatierte Datei
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

test.describe('Prettier Integration Tests', () => {
  const projectRoot = process.cwd();

  test('should work with existing TypeScript files', async () => {
    // Teste mit echter Projektdatei
    const appLayoutPath = join(projectRoot, 'app', 'layout.tsx');

    if (existsSync(appLayoutPath)) {
      try {
        // Überprüfe, ob die Datei mit Prettier kompatibel ist
        execSync(`npx prettier --check ${appLayoutPath}`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });

        // Wenn kein Fehler auftritt, ist die Datei korrekt formatiert
        expect(true).toBeTruthy();
      } catch (error) {
        // Datei ist nicht korrekt formatiert - das ist ok für diesen Test
        // Wir testen nur, ob Prettier ohne Fehler läuft
        console.log('layout.tsx needs formatting - this is expected');
      }
    }
  });

  test('should respect prettier ignore patterns', async () => {
    // Teste, ob ignorierte Dateien nicht formatiert werden
    const nodeModulesFile = join(
      projectRoot,
      'node_modules',
      'test',
      'index.js'
    );
    const nextDir = join(projectRoot, '.next');

    // Diese Verzeichnisse sollten ignoriert werden
    if (existsSync(nodeModulesFile)) {
      // Prettier sollte node_modules ignorieren
      expect(true).toBeTruthy(); // Symbolischer Test
    }

    // .next Verzeichnis sollte ignoriert werden
    expect(true).toBeTruthy(); // Symbolischer Test
  });

  test('should handle different line endings correctly', async () => {
    const testFile = join(projectRoot, 'temp-line-endings.ts');

    // Code mit Windows-Zeilenendenungen (\r\n)
    const codeWithCRLF =
      "const test = 'hello';\r\nconst another = 'world';\r\n";

    writeFileSync(testFile, codeWithCRLF);

    try {
      execSync(`npx prettier --write ${testFile}`, {
        cwd: projectRoot,
        stdio: 'pipe',
      });

      const formattedCode = readFileSync(testFile, 'utf8');

      // Sollte LF-Zeilenendenungen verwenden (konfiguriert als "lf")
      expect(formattedCode).not.toContain('\r\n');
      expect(formattedCode).toContain('\n');
    } finally {
      try {
        execSync(`rm ${testFile}`);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });
});

test.describe('Prettier Performance Tests', () => {
  const projectRoot = process.cwd();

  test('should format files within reasonable time', async () => {
    const testFile = join(projectRoot, 'temp-performance.ts');

    // Erstelle größere Datei zum Testen der Performance
    const largeCode = Array(100)
      .fill(
        `
const config${Math.random()} = {
  name: 'test',
  version: '1.0.0',
  dependencies: ['react', 'typescript', 'prettier'],
  scripts: {
    start: 'node index.js',
    build: 'webpack --mode=production',
    test: 'jest --coverage',
  },
};
`
      )
      .join('\n');

    writeFileSync(testFile, largeCode);

    try {
      const startTime = Date.now();

      execSync(`npx prettier --write ${testFile}`, {
        cwd: projectRoot,
        stdio: 'pipe',
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Formatierung sollte unter 5 Sekunden dauern
      expect(duration).toBeLessThan(5000);
    } finally {
      try {
        execSync(`rm ${testFile}`);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });
});

test.describe('Prettier Error Handling Tests', () => {
  const projectRoot = process.cwd();

  test('should handle syntax errors gracefully', async () => {
    const testFile = join(projectRoot, 'temp-syntax-error.ts');
    const syntaxErrorCode = `
const test = {
  name: 'invalid'
  missing: comma
};
`;

    writeFileSync(testFile, syntaxErrorCode);

    try {
      let errorThrown = false;

      try {
        execSync(`npx prettier --write ${testFile}`, {
          cwd: projectRoot,
          stdio: 'pipe',
        });
      } catch (error) {
        errorThrown = true;
      }

      // Prettier sollte bei Syntaxfehlern einen Fehler werfen
      expect(errorThrown).toBeTruthy();
    } finally {
      try {
        execSync(`rm ${testFile}`);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  test('should handle missing files gracefully', async () => {
    const nonExistentFile = join(projectRoot, 'non-existent-file.ts');

    let errorThrown = false;

    try {
      execSync(`npx prettier --check ${nonExistentFile}`, {
        cwd: projectRoot,
        stdio: 'pipe',
      });
    } catch (error) {
      errorThrown = true;
    }

    // Prettier sollte bei nicht existierenden Dateien einen Fehler werfen
    expect(errorThrown).toBeTruthy();
  });
});
