# API Contracts

This directory contains the OpenAPI specification for the Public SEO Pages feature.

## Files

- `openapi.yaml` - Complete API specification for course data and SEO endpoints

## Contract Testing

The API contracts defined here serve as the source of truth for:

1. **Frontend Integration**: TypeScript types are generated from these schemas
2. **Backend Implementation**: Route handlers must conform to these contracts
3. **Testing**: Contract tests validate request/response formats
4. **Documentation**: Auto-generated API documentation

## Validation Rules

### Course Data
- All public courses must include required fields (id, title, description, slug, level, duration)
- Slug must be URL-safe (lowercase letters, numbers, hyphens only)
- Description length optimized for SEO (50-500 characters)
- Level must be one of: Beginner, Intermediate, Advanced

### Response Format
- Consistent error handling with structured error responses
- Pagination metadata for list endpoints
- Proper HTTP status codes

### SEO Requirements
- All responses include data necessary for meta tag generation
- Course descriptions suitable for meta descriptions
- Image URLs validated for Open Graph tags

## Usage

```bash
# Validate API specification
npx swagger-codegen validate -i openapi.yaml

# Generate TypeScript types
npx openapi-typescript openapi.yaml --output types.ts
```

## Testing Strategy

Contract tests will verify:
- Response schemas match specification
- Required fields are present
- Data types are correct
- Validation rules are enforced
- Error responses follow standard format