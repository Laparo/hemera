# 🧪 Hemera E2E Test Suite

## 📋 Test-Übersicht

Diese Test-Suite enthält die wichtigsten End-to-End Tests für das Hemera Projekt.

### 🔧 Konfiguration

- `global-setup.ts` - Globale Test-Konfiguration
- `auth-helper.ts` - Authentifizierungs-Hilfsfunktionen

### 🏗️ Core Funktionalität Tests

- `health.spec.ts` - API Health Check
- `providers.spec.ts` - Auth Provider Tests
- `minimal-test.spec.ts` - Basis-Funktionalität Test

### 🔐 Authentifizierung & Sicherheit

- `final-e2e-test.spec.ts` - Vollständiger Auth-Flow Test
- `auth-protected-area.spec.ts` - Geschützte Bereiche
- `middleware-protection.spec.ts` - Middleware-Schutz

### 🎨 UI & Navigation Tests

- `protected-layout.spec.ts` - Layout-Tests
- `role-based-navigation.spec.ts` - Rollenbasierte Navigation
- `user-dashboard.spec.ts` - User Dashboard

### 📚 Feature Tests

- `courses.spec.ts` - Kurs-Funktionalität
- `complete-payment-flow.spec.ts` - Zahlungsflow
- `payment-failure-handling.spec.ts` - Fehlerbehandlung
- `social-login-integration.spec.ts` - Social Login

### 🚀 Performance & Qualität

- `performance.spec.ts` - Performance Tests
- `lighthouse.spec.ts` - Lighthouse-Audits
- `seo.spec.ts` - SEO Tests
- `prettier.spec.ts` - Formatting Tests

## 🏃‍♂️ Tests ausführen

```bash
# Alle Tests
npm run test:e2e

# Einzelne Tests
npx playwright test tests/e2e/final-e2e-test.spec.ts
npx playwright test tests/e2e/health.spec.ts

# Tests mit UI
npx playwright test --ui

# Debug Modus
npx playwright test --debug
```

## ✅ Test-Status

Zuletzt getestet: 12. Oktober 2025

### ✅ Funktional

- ✅ `final-e2e-test.spec.ts` - Authentifizierung funktioniert
- ✅ `minimal-test.spec.ts` - Basis-Tests bestanden
- ✅ `health.spec.ts` - API Health Check erfolgreich

### 🔄 In Entwicklung

- 🔄 Payment Flow Tests
- 🔄 Course Management Tests
- 🔄 Social Login Integration

### ⏳ Ausstehend

- ⏳ Performance Optimization Tests
- ⏳ SEO Compliance Tests
- ⏳ Accessibility Tests

## 📝 Test-Konventionen

1. **Dateinamen:** `feature-name.spec.ts`
2. **Test-Namen:** Deutsch, beschreibend
3. **Screenshots:** Bei Fehlern automatisch
4. **Timeouts:** 30s für Auth, 10s für reguläre Tests
5. **Browser:** Chromium (Standard), erweitert um Firefox/Safari bei Bedarf
