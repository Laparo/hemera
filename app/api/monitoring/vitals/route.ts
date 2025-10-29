import { NextRequest, NextResponse } from 'next/server';
import { serverInstance as rollbar } from '@/lib/monitoring/rollbar-official';

// Accept Web Vitals from client. Intended primarily for production.
// Enable in non-prod only if ALLOW_VITALS_IN_DEV=1.

function isAllowedEnv(): boolean {
  if (process.env.NODE_ENV === 'production') return true;
  return process.env.ALLOW_VITALS_IN_DEV === '1';
}

export async function POST(req: NextRequest) {
  if (!isAllowedEnv()) {
    return NextResponse.json(
      { ok: false, reason: 'disabled' },
      { status: 202 }
    );
  }

  try {
    const ua = req.headers.get('user-agent') || undefined;
    const ref = req.headers.get('referer') || undefined;
    const body = await req.json();

    // Minimal validation
    const name = String(body?.name || 'UNKNOWN');
    const value = Number(body?.value ?? NaN);
    const id = typeof body?.id === 'string' ? body.id : undefined;
    const label = typeof body?.label === 'string' ? body.label : undefined;
    const path = typeof body?.path === 'string' ? body.path : undefined;
    const ts = typeof body?.ts === 'number' ? new Date(body.ts) : new Date();

    if (!Number.isFinite(value)) {
      return NextResponse.json(
        { ok: false, reason: 'invalid' },
        { status: 400 }
      );
    }

    // Report as info to Rollbar with a dedicated flag
    rollbar.info('web_vitals', {
      custom: {
        web_vitals: true,
        name,
        value,
        id,
        label,
        path,
        referer: ref,
        userAgent: ua,
        timestamp: ts.toISOString(),
      },
    } as any);

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Do not propagate details to client; just accept to avoid blocking beacons
    try {
      rollbar.warning('web_vitals_ingest_error', { err: String(err) });
    } catch {}
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}
