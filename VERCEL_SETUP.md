# Vercel Deployment Konfiguration 🚀

## Schritt 1: Vercel Account Setup

1. **Vercel Account erstellen/anmelden:**
   - Gehen Sie zu [vercel.com](https://vercel.com)
   - Melden Sie sich mit Ihrem GitHub Account an

## Schritt 2: Vercel Token generieren

1. **Vercel Token erstellen:**
   - Gehen Sie zu [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Klicken Sie auf "Create Token"
   - Name: `hemera-deployment`
   - Scope: `Full Account`
   - Klicken Sie "Create"
   - **WICHTIG:** Kopieren Sie das Token sofort - es wird nur einmal angezeigt!

## Schritt 3: Vercel Projekt verknüpfen

1. **Neues Projekt erstellen:**

   ```bash
   cd /Users/Zauberflocke/Documents/My\ Dev\ Projects/hemera
   npx vercel
   ```

2. **Fragen beantworten:**
   - "Set up and deploy"? → `Y`
   - "Which scope"? → Wählen Sie Ihren Account
   - "Link to existing project"? → `N` (neues Projekt)
   - "Project name"? → `hemera` (oder gewünschter Name)
   - "In which directory"? → `./` (Enter drücken)
   - "Want to override settings"? → `N`

3. **Projekt-IDs extrahieren:**

   ```bash
   cat .vercel/project.json
   ```

## Schritt 4: GitHub Secrets konfigurieren

1. **GitHub Repository Secrets:**
   - Gehen Sie zu: `https://github.com/Laparo/hemera/settings/secrets/actions`
   - Klicken Sie "New repository secret"
2. **Folgende Secrets hinzufügen:**

   **VERCEL_TOKEN:**
   - Name: `VERCEL_TOKEN`
   - Value: Das Token aus Schritt 2

   **VERCEL_ORG_ID:**
   - Name: `VERCEL_ORG_ID`
   - Value: `orgId` aus `.vercel/project.json`

   **VERCEL_PROJECT_ID:**
   - Name: `VERCEL_PROJECT_ID`
   - Value: `projectId` aus `.vercel/project.json`

## Schritt 5: Deployment testen

1. **Erneutes Deployment auslösen:**

   ```bash
   git commit --allow-empty -m "test: trigger deployment with configured secrets"
   git push origin main
   ```

2. **Status überprüfen:**
   - GitHub Actions: `https://github.com/Laparo/hemera/actions`
   - Vercel Dashboard: `https://vercel.com/dashboard`

## Troubleshooting

### Token-Fehler: "invalid token value"

- Stellen Sie sicher, dass das Token korrekt kopiert wurde
- Keine zusätzlichen Zeichen oder Leerzeichen
- Token nicht abgelaufen

### Projekt nicht gefunden

- Überprüfen Sie `VERCEL_ORG_ID` und `VERCEL_PROJECT_ID`
- Stellen Sie sicher, dass das Vercel Projekt existiert

### Deployment-Berechtigungen

- Vercel Token muss "Full Account" Berechtigung haben
- GitHub Repository muss öffentlich oder mit korrekten Berechtigungen konfiguriert sein

## Erfolg! 🎉

Nach erfolgreicher Konfiguration wird Ihre App verfügbar sein unter:

- Production: `https://hemera-[hash].vercel.app`
- Custom Domain: Falls konfiguriert

Die URL wird in den GitHub Actions Logs angezeigt.
