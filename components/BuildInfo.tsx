import * as React from 'react';
import { getBuildInfo } from '@/lib/buildInfo';

// This component renders a tiny build/version indicator.
// It's intentionally minimal and hidden from assistive tech by default.
export default function BuildInfo() {
  // We compute on render; values are static for a given build
  const info = getBuildInfo();
  const label = [
    `v${info.version}`,
    info.shortSha ? `(${info.shortSha})` : undefined,
    info.environment ? `· ${info.environment}` : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  const tooltip = [
    info.buildTime ? `Build: ${info.buildTime}` : undefined,
    info.commitSha ? `Commit: ${info.commitSha}` : undefined,
  ]
    .filter(Boolean)
    .join(' | ');

  return (
    <div
      aria-hidden
      title={tooltip || 'Build-Informationen'}
      style={{
        position: 'fixed',
        right: 8,
        bottom: 6,
        opacity: 0.6,
        fontSize: 11,
        padding: '2px 6px',
        borderRadius: 4,
        background: 'rgba(0,0,0,0.04)',
      }}
    >
      {label}
    </div>
  );
}
