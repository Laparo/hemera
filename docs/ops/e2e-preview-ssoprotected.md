# Hinweise zu E2E-Tests auf Preview-Deployments

- Vercel-Previews sind in der Regel SSO-geschützt (Clerk).
- Öffentliche Nutzer:innen sehen daher meist nur Fallback- oder Empty-State-Markup.
- E2E-Tests müssen tolerant gegenüber diesen Fallbacks sein und dürfen nicht auf echte Seed-Daten
  bestehen.
- Beispiel: Der Kurse-Test akzeptiert sowohl echte Kurskarten als auch den leeren Zustand oder ein
  Fallback-Markup.
- Siehe `tests/e2e/courses.spec.ts` für die konkrete Logik.

**Tipp:** Wenn du neue E2E-Tests schreibst, prüfe immer, ob sie auch auf einer SSO-geschützten
Preview sinnvoll durchlaufen können.
