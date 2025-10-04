import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth/options';

export async function GET() {
  const ids = authOptions.providers
    .map(p => (typeof p === 'function' ? undefined : p.id))
    .filter(Boolean);
  return NextResponse.json({ providers: ids });
}
