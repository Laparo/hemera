import { PrismaClient } from '@prisma/client';

function withSchemaParam(url: string, schema?: string): string {
	if (!schema) return url;
	const hasQuery = url.includes('?');
	const sep = hasQuery ? '&' : '?';
	const ensureSSL = url.includes('sslmode=') ? '' : `${sep}sslmode=require`;
	const sep2 = url.includes('?') || ensureSSL ? '&' : '?';
	return `${url}${ensureSSL}${sep2}schema=${encodeURIComponent(schema)}`;
}

// Resolve schema in the following order:
// 1) Explicit env overrides: PREVIEW_SCHEMA or PR_SCHEMA
// 2) Vercel Preview auto-detection: hemera_pr_<VERCEL_GIT_PULL_REQUEST_ID>
const runtimeSchemaFromEnv = process.env.PREVIEW_SCHEMA || process.env.PR_SCHEMA;
const vercelEnv = process.env.VERCEL_ENV;
const vercelPrId = process.env.VERCEL_GIT_PULL_REQUEST_ID;
const inferredSchema = !runtimeSchemaFromEnv && vercelEnv === 'preview' && vercelPrId
	? `hemera_pr_${vercelPrId}`
	: undefined;
const runtimeSchema = runtimeSchemaFromEnv || inferredSchema;

const runtimeDbUrl = process.env.DATABASE_URL ? withSchemaParam(process.env.DATABASE_URL, runtimeSchema) : undefined;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient(runtimeDbUrl ? { datasources: { db: { url: runtimeDbUrl } } } : undefined);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
