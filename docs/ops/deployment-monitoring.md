# Live Monitoring of Deploy Workflows (MANDATORY)

Gemäß Constitution MANDATORY: Alle Deploy-Workflows (Preview und Production) MÜSSEN aktiv über die
offizielle GitHub Actions VS Code Extension überwacht werden.

## Akzeptanz-Checkliste je Deploy

- Workflow-Run in VS Code öffnen (GitHub Actions Extension)
- Logs bis zum Abschluss verfolgen (kein Hintergrundmodus)
- Finalen Status verifizieren (success) und Artefakte prüfen (z. B. Playwright-Report)
- Preview-/Production-URL erfassen (falls zutreffend) für Validierung und Audit
- Bei Fehlern: Rollback gemäß Workflow-Instruktion einleiten und Incident-Notiz erstellen

## Nachweis

- Screenshot oder kurze Notiz im PR mit Link zum Workflow-Run und Ergebniszusammenfassung

## Hinweise

- Die Überwachung ist Teil der Deployment-Akzeptanz. Fehlende Überwachung stellt eine
  Prozessverletzung dar.
- Verlinke diesen Leitfaden im PR-Template oder im Release-Playbook, um die Sichtbarkeit
  sicherzustellen.
