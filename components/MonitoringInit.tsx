'use client';

import * as React from 'react';
import {
  initWebVitals,
  type WebVitalMetric,
} from '@/lib/monitoring/web-vitals';

function sendMetric(metric: WebVitalMetric, path?: string) {
  try {
    const payload = JSON.stringify({
      ...metric,
      path:
        path ||
        (typeof window !== 'undefined' ? window.location.pathname : undefined),
      ts: Date.now(),
    });

    const url = '/api/monitoring/vitals';
    if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
      navigator.sendBeacon(url, payload);
    } else if (typeof fetch !== 'undefined') {
      fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        keepalive: true,
        body: payload,
      }).catch(() => {});
    }
  } catch {
    // swallow
  }
}

export default function MonitoringInit() {
  React.useEffect(() => {
    const path =
      typeof window !== 'undefined' ? window.location.pathname : undefined;
    // Fire-and-forget initialization gated inside initWebVitals
    initWebVitals(metric => sendMetric(metric, path), { path }).catch(() => {});
  }, []);

  return null;
}
