# Qodo PR Agent Setup

Dieses Projekt verwendet [Qodo PR Agent](https://qodo-merge-docs.qodo.ai/) als GitHub Action für
automatisierte Code-Reviews, PR-Beschreibungen und Code-Verbesserungsvorschläge.

## Konfiguration

### GitHub Action

Die GitHub Action ist in `.github/workflows/pr-agent.yml` konfiguriert und wird automatisch
ausgelöst bei:

- Neuen Pull Requests
- Wiedereröffneten Pull Requests
- Pull Requests die als "ready for review" markiert werden
- Issue-Kommentaren

### Konfigurationsdatei

Erweiterte Einstellungen befinden sich in `.pr_agent.toml` im Repository-Root und beinhalten:

- TypeScript/Next.js spezifische Review-Anweisungen
- Konfiguration für Code-Vorschläge
- Performance-Optimierungen für größere Repositories

## Erforderliche Secrets

### OPENAI_KEY (Erforderlich)

1. Gehen Sie zu [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Erstellen Sie einen neuen API-Schlüssel
3. Fügen Sie ihn als Repository Secret hinzu:
   - Gehen Sie zu Repository Settings > Secrets and variables > Actions
   - Klicken Sie auf "New repository secret"
   - Name: `OPENAI_KEY`
   - Value: Ihr OpenAI API-Schlüssel

### GITHUB_TOKEN (Automatisch verfügbar)

Dieser Token wird automatisch von GitHub bereitgestellt und erfordert keine Konfiguration.

## Verfügbare Befehle

Nach der Einrichtung können Sie folgende Befehle in PR-Kommentaren verwenden:

- `/review` - Führt eine Code-Review durch
- `/describe` - Generiert eine PR-Beschreibung
- `/improve` - Schlägt Code-Verbesserungen vor
- `/ask <Frage>` - Stellt Fragen zum Code
- `/help` - Zeigt verfügbare Befehle an

## Features

### Automatische Reviews

- TypeScript/Next.js Best Practices
- Sicherheitsvulnerabilitäten
- Performance-Probleme
- Code-Qualität und Wartbarkeit
- Fehlerbehandlung und async/await Patterns

### Code-Vorschläge

- Bis zu 6 Code-Verbesserungsvorschläge pro PR
- Optimierungen für React 18 und Next.js 14
- Prisma ORM Query-Optimierungen
- Material-UI Komponenten-Verbesserungen

### PR-Beschreibungen

- Automatische Generierung basierend auf Code-Änderungen
- Beibehaltung des ursprünglichen Titels
- PR-Typ-Klassifizierung

## Fehlerbehebung

### API-Rate-Limits

Falls Rate-Limits erreicht werden:

- Fallback-Modelle sind konfiguriert (gpt-4o → gpt-3.5-turbo)
- Timeout ist auf 300 Sekunden erhöht

### Debugging

- Verbose Logging ist aktiviert (Level 1)
- Überprüfen Sie die GitHub Actions Logs für Details
- Große PRs werden automatisch gekürzt für bessere Performance

## Weitere Informationen

- [Qodo Merge Dokumentation](https://qodo-merge-docs.qodo.ai/)
- [GitHub Action Konfiguration](https://qodo-merge-docs.qodo.ai/installation/github/)
- [Verfügbare Tools](https://qodo-merge-docs.qodo.ai/tools/)
