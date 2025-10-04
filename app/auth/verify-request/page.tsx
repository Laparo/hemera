import Link from 'next/link';

export default function VerifyRequestPage() {
  return (
    <main style={{ maxWidth: 600, margin: '4rem auto', padding: '0 1rem' }}>
      <h1>Bestätige deine E-Mail</h1>
      <p>
        Wir haben dir einen Magic‑Link geschickt. Öffne die E‑Mail und folge dem
        Link, um dich anzumelden. Der Link ist nur kurze Zeit gültig.
      </p>
      <p>
        Nichts erhalten? Prüfe deinen Spam‑Ordner oder fordere einen neuen Link
        an.
      </p>
      <p>
        <Link href='/api/auth/signin'>Zur Anmeldung</Link>
      </p>
    </main>
  );
}
