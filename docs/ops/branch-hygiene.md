# Branch-Hygiene: Alte Branches aufräumen

Letzte Aktualisierung: 2025-10-18

Kurze Notiz zum sicheren Entfernen veralteter Branches nach erfolgreichen Merges und Deployments.

## Wann

- Nach Merge eines PRs in `main` und erfolgreichem Production-Deploy.
- Wenn keine offenen PRs mehr auf dem Branch existieren.

## Warum

- Übersichtlichkeit im Repository
- Reduziert Risiko von Abzweigungen auf veraltete Stände

## Schritte

1. Live-Monitoring des Deploy-Workflows (konstitutionell verpflichtend)
   - Über GitHub Actions VS Code Extension den Run öffnen, Logs bis Abschluss verfolgen und Status
     prüfen.
2. Lokale Branches entfernen
   - Sicherstellen, dass nur `main` benötigt wird.
3. Remote-Branches entfernen
   - Alle nicht benötigten Branches auf `origin` löschen, außer `main`.
4. Verifikation
   - Prüfen, dass lokal nur `main` existiert und remote nur `origin/main` (plus `origin/HEAD`).

## Beispielbefehle (optional)

```sh
# Lokal auflisten
git branch --list

# Lokale Branches löschen (Beispiel)
git branch -d <branch>
# Erzwingen, falls nötig
git branch -D <branch>

# Remote-Branches auflisten
git branch --remotes

# Remote-Branches löschen (Beispiel)
git push origin --delete <branch>
```

## Vorsicht

- Keine geschützten Branches löschen (z. B. `main`).
- Nicht löschen, wenn noch offene PRs auf den Branch zeigen.
- Im Zweifel zuerst mit dem Team klären.

## Dokumentation

- Im PR oder im Run-Protokoll kurz notieren, welche Branches entfernt wurden.
