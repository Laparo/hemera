export const runtime = 'nodejs';

export default function ProtectedProbePage() {
  // Minimal page used by performance tests to probe protected route TTFB.
  // In real app this would be guarded; in E2E we only need a valid route.
  return null;
}
