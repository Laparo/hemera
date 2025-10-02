"use client";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

function ErrorContent() {
  const params = useSearchParams();
  const error = params.get("error");
  let message = "Ein unbekannter Fehler ist aufgetreten.";
  switch (error) {
    case "Verification":
    case "VerificationError":
      message = "Der Magic-Link ist ungültig oder abgelaufen. Bitte fordere einen neuen Link an.";
      break;
    case "OAuthAccountNotLinked":
      message = "Dieses E-Mail-Konto ist bereits mit einem anderen Anbieter verknüpft. Bitte melde dich mit dem verknüpften Anbieter an.";
      break;
    case "AccessDenied":
      message = "Zugriff verweigert. Bitte überprüfe deine Berechtigungen.";
      break;
    default:
      if (error) {
        message = `Fehler: ${error}`;
      }
  }

  return (
    <>
      <h1>Anmeldung fehlgeschlagen</h1>
      <p>{message}</p>
      <p>
        <Link href="/api/auth/signin">Zurück zur Anmeldung</Link>
      </p>
    </>
  );
}

export default function AuthErrorPage() {
  return (
    <main style={{ maxWidth: 600, margin: "4rem auto", padding: "0 1rem" }}>
      <Suspense fallback={<p>Lade…</p>}>
        <ErrorContent />
      </Suspense>
    </main>
  );
}
