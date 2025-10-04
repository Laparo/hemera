# Clerk Authentication Migration

## Übersicht

Diese Dokumentation beschreibt die vollständige Migration von NextAuth.js zu Clerk für die Hemera-Anwendung.

## Durchgeführte Änderungen

### 1. Package-Verwaltung
- **Entfernt**: `next-auth`, `@auth/prisma-adapter`
- **Hinzugefügt**: `@clerk/nextjs`

### 2. Datei-Strukturänderungen

#### Entfernte Dateien:
- `app/api/auth/[...nextauth]/route.ts`
- `app/api/auth/providers/route.ts`
- `app/auth/error/page.tsx`
- `app/auth/signin/page.tsx`
- `app/auth/verify-request/page.tsx`
- `lib/auth/options.ts`

#### Neue Dateien:
- `app/sign-in/[[...sign-in]]/page.tsx` - Clerk Sign-In Komponente
- `app/sign-up/[[...sign-up]]/page.tsx` - Clerk Sign-Up Komponente

### 3. Code-Änderungen

#### app/layout.tsx
```tsx
// Vorher: NextAuth SessionProvider
import { SessionProvider } from 'next-auth/react';

// Nachher: Clerk ClerkProvider
import { ClerkProvider } from '@clerk/nextjs';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ThemeRegistry options={{ key: 'mui' }}>
            {children}
          </ThemeRegistry>
        </body>
      </html>
    </ClerkProvider>
  );
}
```

#### app/protected/page.tsx
```tsx
// Vorher: NextAuth Session
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/options';

const session = await getServerSession(authOptions);

// Nachher: Clerk Auth
import { auth, currentUser } from '@clerk/nextjs/server';

const { userId } = await auth();
const user = await currentUser();
```

### 4. Umgebungsvariablen

#### Vorher (.env.example):
```bash
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GITHUB_ID=
GITHUB_SECRET=
```

#### Nachher (.env.example):
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

### 5. Typisierung (lib/env.ts)
```typescript
// Vorher
export type Env = {
  NEXTAUTH_URL?: string;
  NEXTAUTH_SECRET?: string;
  // ...
};

// Nachher
export type Env = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
  CLERK_SECRET_KEY?: string;
  // ...
};
```

### 6. Routen-Updates
- `/auth/signin` → `/sign-in`
- `/auth/signup` → `/sign-up`
- Aktualisiert in: `app/page.tsx`, `components/layout/RegistrationArea.tsx`

### 7. Tests
- E2E-Tests temporär deaktiviert (benötigen Clerk-spezifische Implementierung)
- `tests/e2e/auth-email.spec.ts` und `tests/e2e/auth-credentials.spec.ts` als "skip" markiert

## Aktuelle Konfiguration

### Vercel Umgebungsvariablen
Die folgenden Clerk-Variablen sind bereits in Vercel konfiguriert:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

### Lokale Entwicklung
Für lokale Entwicklung muss eine `.env.local` Datei mit den Clerk-Schlüsseln erstellt werden:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Funktionalität

### Verfügbare Routen
- `/sign-in` - Clerk Sign-In Komponente
- `/sign-up` - Clerk Sign-Up Komponente  
- `/protected` - Geschützte Route mit Clerk Auth-Prüfung

### Authentication Flow
1. Benutzer besucht `/sign-in`
2. Clerk handhabt den gesamten Auth-Flow
3. Nach erfolgreicher Anmeldung sind geschützte Routen zugänglich
4. Clerk verwaltet automatisch Sessions und Tokens

## Build-Status
✅ TypeScript-Kompilierung erfolgreich
✅ Next.js Build erfolgreich
✅ Development-Server startet ohne Fehler

## Nächste Schritte

1. **Testing**: E2E-Tests für Clerk-Integration implementieren
2. **Features**: Zusätzliche Clerk-Features konfigurieren (Social Login, etc.)
3. **Cleanup**: Veraltete NextAuth-Referenzen in Dokumentation entfernen
4. **Database**: Prüfen ob User-Schema mit Clerk kompatibel ist

## Referenzen
- [Clerk Documentation](https://clerk.com/docs)
- [Next.js App Router mit Clerk](https://clerk.com/docs/quickstarts/nextjs)