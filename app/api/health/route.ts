import { createApiLogger } from '@/lib/utils/api-logger';
import { createSuccessResponse } from '@/lib/utils/api-response';
import {
  createRequestContext,
  getOrCreateRequestId,
} from '@/lib/utils/request-id';
import { getBuildInfo } from '@/lib/buildInfo';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestId = getOrCreateRequestId(request);
  const context = createRequestContext(requestId, 'GET', '/api/health');
  const logger = createApiLogger(context);

  const info = getBuildInfo();
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: info.environment,
    version: info.version,
    commitSha: info.commitSha,
    shortSha: info.shortSha,
    buildTime: info.buildTime,
  } as const;

  logger.info('Health check completed', healthData);
  logger.trackRequestCompletion(200);

  return createSuccessResponse(healthData, requestId);
}
