# Admin API Documentation

This document describes the non-public admin API endpoints that are configured to allow external
applications to read and write data.

## Overview

The admin API endpoints are secured with:

- **Authentication**: Clerk-based user authentication
- **Authorization**: Admin role verification
- **CORS**: Cross-Origin Resource Sharing enabled for external apps
- **Standardized Responses**: Consistent JSON format with error codes and request IDs

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: Your deployed application URL

## Authentication

All admin endpoints require:

1. A valid Clerk authentication session
2. User with `admin` role in their `publicMetadata`

### Authentication Methods

**Option 1: Session Cookie (Browser)**

- Sign in to the application
- Session cookie is automatically sent with requests

**Option 2: Authorization Header (External Apps)**

```http
Authorization: Bearer <clerk-session-token>
```

## CORS Configuration

All admin endpoints support CORS with:

- **Allowed Origins**: `*` (all origins)
- **Allowed Methods**: Vary by endpoint (GET, POST, OPTIONS)
- **Allowed Headers**: `Content-Type`, `Authorization`

Preflight requests (OPTIONS) are supported on all endpoints.

## Endpoints

### 1. Users Management

**Endpoint**: `GET /api/admin/users`

**Description**: Retrieve all users with their booking statistics.

**CORS**: ✅ Enabled

**Response**:

```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "clerkId": "user_...",
        "email": "user@example.com",
        "name": "John Doe",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "_count": {
          "bookings": 5
        }
      }
    ],
    "total": 10
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "version": "1.0"
  }
}
```

**Error Responses**:

- `401 UNAUTHORIZED`: Not authenticated
- `403 FORBIDDEN`: Not an admin user
- `500 INTERNAL_ERROR`: Server error

### 2. Courses Management

**Endpoint**: `GET /api/admin/courses`

**Description**: Retrieve all courses with their booking statistics.

**CORS**: ✅ Enabled

**Response**:

```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": 1,
        "title": "Introduction to React",
        "description": "Learn React basics",
        "price": 99.99,
        "duration": 8,
        "createdAt": "2025-01-01T00:00:00.000Z",
        "_count": {
          "bookings": 25
        }
      }
    ],
    "total": 5
  },
  "meta": {
    "requestId": "req_def456",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "version": "1.0"
  }
}
```

**Error Responses**:

- `401 UNAUTHORIZED`: Not authenticated
- `403 FORBIDDEN`: Not an admin user
- `500 INTERNAL_ERROR`: Server error

### 3. Analytics

**Endpoint**: `GET /api/admin/analytics`

**Description**: Retrieve analytics data and performance metrics.

**CORS**: ✅ Enabled

**Query Parameters**:

- `timeframe` (optional): Time period for data (default: `24h`)
- `type` (optional): Report type - `summary`, `usage`, `anomalies`, `trace` (default: `summary`)
- `requestId` (required for `trace` type): Specific request ID to trace

**Response**:

```json
{
  "success": true,
  "data": {
    "report": {
      "requests": {
        "total": 1234,
        "successful": 1200,
        "failed": 34
      },
      "performance": {
        "avgResponseTime": 145,
        "p95ResponseTime": 320,
        "p99ResponseTime": 450
      }
    },
    "metadata": {
      "timeframe": "24h",
      "reportType": "summary",
      "generatedAt": "2025-01-15T10:30:00.000Z",
      "requestId": "req_ghi789"
    }
  },
  "meta": {
    "requestId": "req_ghi789",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "version": "1.0"
  }
}
```

**Error Responses**:

- `400 INVALID_INPUT`: Invalid parameters
- `401 UNAUTHORIZED`: Not authenticated
- `403 FORBIDDEN`: Not an admin user
- `500 INTERNAL_ERROR`: Server error

### 4. Error Analytics

**Endpoint**: `GET /api/admin/errors`

**Description**: Retrieve error metrics and logs.

**CORS**: ✅ Enabled

**Query Parameters**:

- `action` (optional): Action type - `metrics` or `logs` (default: `metrics`)
- `timeRange` (optional): Time range - `hour`, `day`, `week` (default: `day`)
- `page` (optional): Page number for logs (default: `1`)
- `limit` (optional): Items per page for logs (default: `50`)

**Response (metrics)**:

```json
{
  "totalErrors": 42,
  "errorRate": 0.034,
  "topErrors": [
    {
      "type": "ValidationError",
      "count": 15,
      "lastOccurred": "2025-01-15T10:25:00.000Z"
    }
  ]
}
```

**Response (logs)**:

```json
{
  "errors": [
    {
      "id": "err_123",
      "type": "ValidationError",
      "message": "Invalid email format",
      "timestamp": "2025-01-15T10:25:00.000Z",
      "resolved": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 42
  }
}
```

**Endpoint**: `POST /api/admin/errors`

**Description**: Manage error logs (resolve or clear).

**CORS**: ✅ Enabled

**Query Parameters**:

- `action` (required): Action type - `resolve` or `clear`

**Request Body (for `resolve` action)**:

```json
{
  "errorId": "err_123"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Error marked as resolved"
}
```

**Error Responses**:

- `400 INVALID_INPUT`: Invalid action or missing parameters
- `401 UNAUTHORIZED`: Not authenticated
- `403 FORBIDDEN`: Not an admin user (or `clear` action in production)
- `500 INTERNAL_ERROR`: Server error

## Error Response Format

All endpoints return errors in a standardized format:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Unauthorized access"
  },
  "meta": {
    "requestId": "req_xyz890",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "version": "1.0"
  }
}
```

### Error Codes

- `UNAUTHORIZED`: Authentication required or failed
- `FORBIDDEN`: Insufficient permissions (admin role required)
- `INVALID_INPUT`: Invalid request parameters
- `INTERNAL_ERROR`: Server-side error
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Request validation failed

## Example: Using the API from External App

### Using cURL

```bash
# Get all users
curl -X GET "https://your-app.vercel.app/api/admin/users" \
  -H "Authorization: Bearer <your-clerk-token>" \
  -H "Content-Type: application/json"

# Get analytics summary
curl -X GET "https://your-app.vercel.app/api/admin/analytics?type=summary&timeframe=24h" \
  -H "Authorization: Bearer <your-clerk-token>" \
  -H "Content-Type: application/json"

# Resolve an error
curl -X POST "https://your-app.vercel.app/api/admin/errors?action=resolve" \
  -H "Authorization: Bearer <your-clerk-token>" \
  -H "Content-Type: application/json" \
  -d '{"errorId": "err_123"}'
```

### Using JavaScript/TypeScript

```typescript
// Configure your API client
const API_BASE_URL = 'https://your-app.vercel.app';
const CLERK_TOKEN = '<your-clerk-token>';

// Fetch users
async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${CLERK_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API Error: ${error.error.message}`);
  }

  const data = await response.json();
  return data.data.users;
}

// Fetch analytics
async function getAnalytics(timeframe = '24h', type = 'summary') {
  const params = new URLSearchParams({ timeframe, type });
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics?${params}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${CLERK_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API Error: ${error.error.message}`);
  }

  const data = await response.json();
  return data.data.report;
}
```

## Security Considerations

1. **Authentication Required**: All endpoints require valid Clerk authentication
2. **Admin Role Required**: All endpoints require admin role in user metadata
3. **CORS Enabled**: Endpoints are accessible from external origins
4. **Request Tracking**: All requests include a unique request ID for tracing
5. **Error Monitoring**: All errors are logged to Rollbar (constitutional requirement)

## Rate Limiting

Currently, no rate limiting is implemented on these endpoints. Consider implementing rate limiting
for production use to prevent abuse.

## Support

For issues or questions:

1. Check the error response for the `requestId`
2. Review application logs using the `requestId`
3. Check Rollbar for error details
4. Contact the development team

## Constitution Compliance

This API implementation follows the project constitution requirements:

- ✅ Authentication & Security (Section IV)
- ✅ Error Monitoring with Rollbar (Section VI)
- ✅ Test-First Development (11 E2E tests)
- ✅ Code Quality & Formatting (Prettier, ESLint)
- ✅ Standardized API responses with error handling
