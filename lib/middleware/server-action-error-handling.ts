/**
 * Server Action Middleware for Enhanced Error Handling with Rollbar Integration
 * Provides server action-specific error handling and result management
 */

import { withErrorHandling } from '@/lib/errors/http';
import { getRequestContext } from '@/lib/utils/request-context';
import { mapPrismaError } from '@/lib/errors/prisma-mapping';
import {
  reportError,
  createErrorContext,
  recordUserAction,
} from '../monitoring/rollbar';
import { BaseError } from '../errors/base';

export interface ServerActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  requestId?: string;
}

export interface ServerActionContext {
  requestId: string;
  userId?: string;
}

/**
 * Enhanced server action wrapper with comprehensive error handling
 */
export function withServerActionErrorHandling<T = any>(
  action: (context: ServerActionContext) => Promise<T>
) {
  return async (
    formData?: FormData,
    userId?: string
  ): Promise<ServerActionResult<T>> => {
    const requestContext = getRequestContext();

    try {
      const actionContext: ServerActionContext = {
        requestId: requestContext.id,
        userId,
      };

      const result = await action(actionContext);

      return {
        success: true,
        data: result,
        requestId: requestContext.id,
      };
    } catch (error) {
      // Try to map Prisma errors to domain errors first
      const mappedError = mapPrismaError(error);

      // Report to Rollbar if not a BaseError (unexpected error)
      if (!(mappedError instanceof BaseError)) {
        const errorContext = createErrorContext(
          undefined,
          userId,
          requestContext.id
        );
        errorContext.additionalData = {
          action: action.name || 'unknown-server-action',
          serverAction: true,
        };
        reportError(mappedError, errorContext, 'error');
      }

      // Log error for analytics (replaced by Rollbar)
      // ErrorAnalytics.logError(mappedError, {
      //   userId,
      //   action: action.name || 'unknown-server-action',
      //   requestId: requestContext.id,
      // });

      return {
        success: false,
        error: {
          code:
            mappedError instanceof BaseError
              ? mappedError.errorCode
              : 'INTERNAL_ERROR',
          message: mappedError.message,
          details:
            mappedError instanceof BaseError ? mappedError.context : undefined,
        },
        requestId: requestContext.id,
      };
    }
  };
}

/**
 * Server action middleware for protected actions requiring authentication
 */
export function withAuthenticatedServerAction<T = any>(
  action: (context: ServerActionContext & { userId: string }) => Promise<T>
) {
  return withServerActionErrorHandling(async context => {
    if (!context.userId) {
      throw new Error('Authentication required for this action');
    }

    return action({ ...context, userId: context.userId });
  });
}

/**
 * Server action middleware for admin-only actions
 */
export function withAdminServerAction<T = any>(
  action: (
    context: ServerActionContext & { userId: string; isAdmin: boolean }
  ) => Promise<T>
) {
  return withAuthenticatedServerAction(async context => {
    // Check if user has admin privileges
    const isAdmin = await checkUserAdminStatus(context.userId);

    if (!isAdmin) {
      throw new Error('Admin privileges required for this action');
    }

    return action({ ...context, isAdmin: true });
  });
}

/**
 * Server action middleware with form data validation
 */
export function withFormValidation<TValidated = any>(
  schema: any, // In production, this would be a Zod schema
  action: (
    context: ServerActionContext,
    validatedData: TValidated
  ) => Promise<any>
) {
  return withServerActionErrorHandling(async context => {
    // Extract form data - this would be passed differently in real implementation
    const formData = {} as any; // Placeholder

    try {
      const validatedData = schema.parse(formData);
      return action(context, validatedData);
    } catch (error) {
      throw new Error(`Form validation failed: ${error}`);
    }
  });
}

/**
 * Server action middleware for optimistic updates
 */
export function withOptimisticUpdate<T = any>(
  action: (context: ServerActionContext) => Promise<T>,
  optimisticValue?: T
) {
  return async (
    formData?: FormData,
    userId?: string
  ): Promise<ServerActionResult<T> & { optimisticValue?: T }> => {
    const requestContext = getRequestContext();

    try {
      const actionContext: ServerActionContext = {
        requestId: requestContext.id,
        userId,
      };

      const result = await action(actionContext);

      return {
        success: true,
        data: result,
        requestId: requestContext.id,
        optimisticValue,
      };
    } catch (error) {
      const mappedError = mapPrismaError(error);

      // Report to Rollbar if not a BaseError (unexpected error)
      if (!(mappedError instanceof BaseError)) {
        const errorContext = createErrorContext(
          undefined,
          userId,
          requestContext.id
        );
        errorContext.additionalData = {
          action: action.name || 'unknown-optimistic-action',
          serverAction: true,
          optimistic: true,
        };
        reportError(mappedError, errorContext, 'error');
      }

      // Log error for analytics (replaced by Rollbar)
      // ErrorAnalytics.logError(mappedError, {
      //   userId,
      //   action: action.name || 'unknown-optimistic-action',
      //   requestId: requestContext.id,
      //   optimistic: true,
      // });

      return {
        success: false,
        error: {
          code:
            mappedError instanceof BaseError
              ? mappedError.errorCode
              : 'INTERNAL_ERROR',
          message: mappedError.message,
          details:
            mappedError instanceof BaseError ? mappedError.context : undefined,
        },
        requestId: requestContext.id,
        optimisticValue,
      };
    }
  };
}

/**
 * Server action middleware with retry logic
 */
export function withRetry<T = any>(
  action: (context: ServerActionContext) => Promise<T>,
  maxRetries: number = 3,
  retryDelay: number = 1000
) {
  return withServerActionErrorHandling(async context => {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await action(context);
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          throw lastError;
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      }
    }

    throw lastError!;
  });
}

/**
 * Server action middleware for background processing
 */
export function withBackgroundProcessing<T = any>(
  action: (context: ServerActionContext) => Promise<T>,
  onProgress?: (progress: { step: string; percentage: number }) => void
) {
  return withServerActionErrorHandling(async context => {
    // In a real implementation, this would use a job queue like Bull or Agenda
    onProgress?.({ step: 'Starting background process', percentage: 0 });

    try {
      const result = await action(context);
      onProgress?.({ step: 'Process completed', percentage: 100 });
      return result;
    } catch (error) {
      onProgress?.({ step: 'Process failed', percentage: 0 });
      throw error;
    }
  });
}

/**
 * Server action middleware for transaction handling
 */
export function withTransaction<T = any>(
  action: (context: ServerActionContext & { tx: any }) => Promise<T>
) {
  return withServerActionErrorHandling(async context => {
    // In a real implementation, this would use Prisma transactions
    const tx = {} as any; // Placeholder for transaction context

    try {
      const result = await action({ ...context, tx });
      // Commit transaction
      return result;
    } catch (error) {
      // Rollback transaction
      throw error;
    }
  });
}

/**
 * Utility function to create form action handlers
 */
export function createFormAction<T = any>(
  action: (formData: FormData, context: ServerActionContext) => Promise<T>
) {
  return withServerActionErrorHandling(async context => {
    // This would receive FormData from the form submission
    const formData = new FormData(); // Placeholder
    return action(formData, context);
  });
}

/**
 * Utility function to handle file upload actions
 */
export function createFileUploadAction<T = any>(
  action: (files: File[], context: ServerActionContext) => Promise<T>
) {
  return withServerActionErrorHandling(async context => {
    // This would extract files from FormData
    const files: File[] = []; // Placeholder
    return action(files, context);
  });
}

// Helper functions (would be implemented based on your auth system)
async function checkUserAdminStatus(userId: string): Promise<boolean> {
  // Implementation depends on your user management system
  // This is a placeholder
  return userId === 'admin-user-id';
}
