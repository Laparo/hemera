import { createApiLogger } from '@/lib/utils/api-logger';
import { createSuccessResponse } from '@/lib/utils/api-response';
import {
  createRequestContext,
  getOrCreateRequestId,
} from '@/lib/utils/request-id';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);
  const context = createRequestContext(requestId, 'GET', '/api/health');
  const logger = createApiLogger(context);

  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
  };

  logger.info('Health check completed', healthData);
  logger.trackRequestCompletion(200);

  return createSuccessResponse(healthData, requestId);
}
