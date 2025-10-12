# Deployment Monitoring Setup für Hemera

## Übersicht

Das Deployment-Monitoring-System von Hemera bietet umfassende Überwachung von Service-Health,
Performance-Metriken und automatische Alerts für kritische Deployment-Probleme.

## Features

### 1. Health Monitoring

- **Database Connectivity**: PostgreSQL-Verbindung und Query-Performance
- **Authentication Service**: Clerk-Integration und API-Verfügbarkeit
- **Payment Processing**: Stripe-Service-Status und Konfiguration
- **Error Tracking**: Rollbar-Integration und Monitoring-Status
- **Analytics System**: Request-Analytics und Performance-Tracking

### 2. Real-time Dashboard

- Live-Status aller kritischen Services
- Response-Time-Metriken für jeden Service
- Automatische Aktualisierung alle 30 Sekunden
- Detaillierte Service-Informationen mit Drill-down

### 3. Automated Alerts

- **Critical Alerts**: Service-Ausfälle, Database-Verbindungsfehler
- **Warning Alerts**: Performance-Degradation, hohe Response-Times
- **Custom Rules**: Konfigurierbare Alert-Bedingungen und Schwellenwerte

## API Endpoints

### Health Check Endpoint

```
GET /api/health/deployment
```

**Response Format:**

```json
{
  "timestamp": "2025-10-12T10:30:00.000Z",
  "requestId": "abc123def456",
  "deployment": {
    "version": "1.0.0",
    "deploymentId": "dpl_123456789",
    "timestamp": "2025-10-12T10:00:00.000Z",
    "region": "fra1",
    "status": "healthy",
    "checks": [...]
  },
  "services": {
    "database": {
      "name": "database",
      "status": "pass",
      "responseTime": 45,
      "details": { "provider": "postgresql", "connection": "verified" },
      "lastChecked": "2025-10-12T10:30:00.000Z"
    },
    "authentication": {
      "name": "authentication",
      "status": "pass",
      "responseTime": 12,
      "details": { "provider": "clerk", "configured": true },
      "lastChecked": "2025-10-12T10:30:00.000Z"
    }
  },
  "summary": {
    "overallStatus": "healthy",
    "totalChecks": 5,
    "passedChecks": 5,
    "failedChecks": 0,
    "warningChecks": 0
  }
}
```

### Force Health Check

```
POST /api/health/deployment
Content-Type: application/json

{
  "action": "force_check"
}
```

### Start Continuous Monitoring

```
POST /api/health/deployment
Content-Type: application/json

{
  "action": "start_monitoring",
  "intervalMinutes": 5
}
```

## Status Codes

| Status      | HTTP Code | Description                   |
| ----------- | --------- | ----------------------------- |
| `healthy`   | 200       | Alle Services funktionsfähig  |
| `degraded`  | 206       | Einige Services mit Warnungen |
| `unhealthy` | 503       | Kritische Service-Ausfälle    |

## Dashboard Access

Das Deployment-Monitoring-Dashboard ist verfügbar unter:

```
/admin/monitoring/deployment
```

### Dashboard Features:

- **Real-time Status**: Aktueller Status aller Services
- **Historical Data**: Trends und Performance-Verlauf
- **Service Details**: Detaillierte Informationen zu jedem Service
- **Manual Controls**: Force Health Checks und Refresh-Funktionen

## Alert System

### Standard Alert Rules

1. **Database Connection Failure**
   - Trigger: `database_health == 0`
   - Severity: Critical
   - Notification: Rollbar Critical Alert

2. **Authentication Service Down**
   - Trigger: `auth_health == 0`
   - Severity: Critical
   - Notification: Rollbar Critical Alert

3. **Payment Service Degraded**
   - Trigger: `stripe_health == 0`
   - Severity: Warning
   - Notification: Rollbar Warning

4. **High Response Time**
   - Trigger: `avg_response_time > 2000ms`
   - Severity: Warning
   - Time Window: 5 minutes

5. **Error Rate Spike**
   - Trigger: `error_rate > 5%`
   - Severity: Critical
   - Time Window: 5 minutes

### Custom Alert Configuration

Alerts können über das `DeploymentAlertSystem` konfiguriert werden:

```typescript
import { deploymentAlerts } from '@/lib/monitoring/deployment-alerts';

// Neue Alert-Regel hinzufügen
deploymentAlerts.setAlertRule({
  id: 'custom_alert',
  name: 'Custom Performance Alert',
  condition: {
    metric: 'avg_response_time',
    operator: 'gt',
    threshold: 1500,
    timeWindow: 300,
  },
  severity: 'warning',
  channels: [{ type: 'rollbar', config: { level: 'warning' } }],
  enabled: true,
});
```

## Integration mit Rollbar

Das System integriert sich nahtlos mit Rollbar für:

- **Error Tracking**: Automatische Fehlererfassung bei Service-Ausfällen
- **Performance Monitoring**: Request-basierte Performance-Metriken
- **Alert Notifications**: Kritische Deployment-Alerts
- **Custom Dashboards**: Rollbar-Dashboard-Integration

### Rollbar Configuration

Environment Variables:

```env
ROLLBAR_SERVER_ACCESS_TOKEN=your_server_token
NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN=your_client_token
NODE_ENV=production
```

## Performance Optimierung

### Health Check Optimierung

- Asynchrone Service-Checks
- Timeout-Management (5 Sekunden pro Service)
- Connection Pooling für Database-Checks
- Caching für Configuration-Validierung

### Monitoring Overhead

- Health Checks: ~100-200ms Gesamt-Latenz
- Memory Usage: <5MB für Monitoring-Daten
- Network Impact: Minimal durch lokale Checks

## Troubleshooting

### Common Issues

1. **Database Health Check Fails**
   - Prüfen: DATABASE_URL Environment Variable
   - Prüfen: Network Connectivity zu PostgreSQL
   - Prüfen: Prisma Client Configuration

2. **Authentication Health Check Fails**
   - Prüfen: CLERK_SECRET_KEY Environment Variable
   - Prüfen: Clerk Dashboard Configuration

3. **Payment Service Health Check Fails**
   - Prüfen: STRIPE_SECRET_KEY Environment Variable
   - Prüfen: Stripe Account Status

### Debug Mode

Für detailliertes Debugging:

```typescript
// In deployment-monitor.ts
console.log('Health Check Results:', serviceStatus);
console.log('Deployment Info:', this.deploymentInfo);
```

## Deployment Checklist

### Pre-Deployment

- [ ] Alle Environment Variables konfiguriert
- [ ] Rollbar-Token validiert
- [ ] Database-Migration erfolgreich
- [ ] Health Check lokal getestet

### Post-Deployment

- [ ] Health Dashboard erreichbar
- [ ] Alle Services zeigen "pass" Status
- [ ] Alerts korrekt konfiguriert
- [ ] Rollbar erhält Health-Daten

### Continuous Monitoring

- [ ] Automatische Health Checks aktiviert
- [ ] Alert-Schwellenwerte validiert
- [ ] Dashboard-Zugriff für Team konfiguriert
- [ ] Rollbar-Dashboard eingerichtet

## Next Steps

1. **Extended Metrics**: CPU, Memory, Disk Usage Monitoring
2. **External Dependencies**: Third-party API Health Checks
3. **Predictive Alerts**: ML-basierte Anomaly Detection
4. **Integration Testing**: Automated E2E Health Validation
