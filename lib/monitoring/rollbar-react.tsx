/**
 * Enhanced Client-Side Rollbar Configuration using @rollbar/react
 * Provides comprehensive error monitoring for React components and browser errors
 */

'use client';

import {
  ErrorBoundary as RollbarErrorBoundary,
  Provider as RollbarProvider,
} from '@rollbar/react';
import React from 'react';
import Rollbar from 'rollbar';

// Environment-specific configuration
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Client-side Rollbar configuration (simplified)
export const clientRollbarConfig: Rollbar.Configuration = {
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_ACCESS_TOKEN,
  environment: process.env.NODE_ENV || 'development',

  // Capture uncaught exceptions and unhandled rejections
  captureUncaught: isProduction,
  captureUnhandledRejections: isProduction,

  // Code version for release tracking
  codeVersion:
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
    process.env.npm_package_version,

  // Transform function to add custom data
  transform: (payload: any) => {
    // Add deployment info
    if (typeof window !== 'undefined') {
      payload.client = {
        ...payload.client,
        url: window.location.href,
        user_agent: navigator.userAgent,
        timestamp: Date.now(),
      };
    }

    // Add custom metadata
    payload.custom = {
      ...payload.custom,
      buildId: process.env.NEXT_PUBLIC_BUILD_ID,
      deployment: process.env.NEXT_PUBLIC_VERCEL_URL,
      runtime: 'nextjs-client',
    };
  },

  // Rate limiting
  maxItems: 100, // Max items per minute for client
  itemsPerMinute: 30,

  // Ignore certain errors common in browsers
  ignoredMessages: [
    'Script error.',
    'Network request failed',
    'Load failed',
    'Non-Error promise rejection captured',
    'ResizeObserver loop limit exceeded',
    'ChunkLoadError', // Webpack chunk loading errors
    'Loading chunk', // More webpack errors
  ],

  // Enable only in production or when explicitly enabled
  enabled: isProduction || process.env.NEXT_PUBLIC_ROLLBAR_ENABLED === 'true',

  // Verbose logging in development
  verbose: isDevelopment,
  reportLevel: isDevelopment ? 'debug' : 'warning',
};

// Initialize client Rollbar instance
let clientRollbar: Rollbar | null = null;

if (typeof window !== 'undefined') {
  clientRollbar = new Rollbar(clientRollbarConfig);
}

/**
 * Enhanced client error reporting with context
 */
export interface ClientErrorContext {
  userId?: string;
  userEmail?: string;
  component?: string;
  route?: string;
  userAgent?: string;
  url?: string;
  timestamp?: Date;
  additionalData?: Record<string, any>;
}

/**
 * Report client-side error to Rollbar with enhanced context
 */
export function reportClientError(
  error: Error | string,
  context?: ClientErrorContext,
  severity: 'critical' | 'error' | 'warning' | 'info' | 'debug' = 'error'
): void {
  if (!clientRollbar || !clientRollbarConfig.enabled) {
    console.error('Client Rollbar Error (disabled):', error, context);
    return;
  }

  try {
    const rollbarContext = {
      person: context?.userId
        ? {
            id: context.userId,
            email: context.userEmail,
          }
        : undefined,

      custom: {
        component: context?.component,
        route: context?.route,
        timestamp: context?.timestamp?.toISOString(),
        url:
          context?.url ||
          (typeof window !== 'undefined' ? window.location.href : ''),
        userAgent:
          context?.userAgent ||
          (typeof window !== 'undefined' ? navigator.userAgent : ''),
        ...context?.additionalData,
      },
    };

    // Report based on severity
    switch (severity) {
      case 'critical':
        clientRollbar.critical(error, rollbarContext);
        break;
      case 'error':
        clientRollbar.error(error, rollbarContext);
        break;
      case 'warning':
        clientRollbar.warning(error, rollbarContext);
        break;
      case 'info':
        clientRollbar.info(error, rollbarContext);
        break;
      case 'debug':
        clientRollbar.debug(error, rollbarContext);
        break;
      default:
        clientRollbar.error(error, rollbarContext);
    }
  } catch (rollbarError) {
    console.error('Failed to report client error to Rollbar:', rollbarError);
    console.error('Original error:', error);
  }
}

/**
 * Report React component errors
 */
export function reportComponentError(
  error: Error,
  componentName: string,
  context?: ClientErrorContext
): void {
  reportClientError(
    error,
    {
      ...context,
      component: componentName,
      additionalData: {
        reactError: true,
        componentName,
        ...context?.additionalData,
      },
    },
    'error'
  );
}

/**
 * Report user interactions for analytics
 */
export function recordClientUserAction(
  action: string,
  userId?: string,
  metadata?: Record<string, any>
): void {
  if (!clientRollbar || !clientRollbarConfig.enabled) return;

  try {
    clientRollbar.info(`Client User Action: ${action}`, {
      person: userId ? { id: userId } : undefined,
      custom: {
        action,
        userAction: true,
        clientSide: true,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
        ...metadata,
      },
    });
  } catch (error) {
    console.error('Failed to record client user action:', error);
  }
}

/**
 * Rollbar Provider Component for Next.js App
 * Wrap your app with this component to enable Rollbar error tracking
 */
interface RollbarProviderWrapperProps {
  children: React.ReactNode;
  config?: Rollbar.Configuration;
}

export function RollbarProviderWrapper({
  children,
  config,
}: RollbarProviderWrapperProps) {
  const rollbarInstance = React.useMemo(() => {
    if (typeof window === 'undefined') return null;
    return new Rollbar(config || clientRollbarConfig);
  }, [config]);

  if (!rollbarInstance || !clientRollbarConfig.enabled) {
    return <>{children}</>;
  }

  return (
    <RollbarProvider instance={rollbarInstance}>{children}</RollbarProvider>
  );
}

/**
 * Enhanced Error Boundary with Rollbar Integration (Simplified)
 */
interface RollbarErrorBoundaryWrapperProps {
  children: React.ReactNode;
  fallbackUI?: React.ComponentType<{
    error: Error | null;
    resetError: () => void;
  }>;
  context?: Record<string, any>;
}

export function RollbarErrorBoundaryWrapper({
  children,
  fallbackUI: FallbackComponent,
  context = {},
}: RollbarErrorBoundaryWrapperProps) {
  const defaultFallback = ({
    error,
    resetError,
  }: {
    error: Error | null;
    resetError: () => void;
  }) => (
    <div
      style={{
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        margin: '10px',
      }}
    >
      <h2>Etwas ist schiefgelaufen</h2>
      <p>
        Ein unerwarteter Fehler ist aufgetreten:{' '}
        {error?.message || 'Unbekannter Fehler'}
      </p>
      <button onClick={resetError}>Versuchen Sie es erneut</button>
    </div>
  );

  return (
    <RollbarErrorBoundary fallbackUI={FallbackComponent || defaultFallback}>
      {children}
    </RollbarErrorBoundary>
  );
}

/**
 * Simple hook to report errors to Rollbar
 */
export function useRollbarError() {
  return React.useCallback((error: Error, context?: ClientErrorContext) => {
    reportClientError(error, context);
  }, []);
}

// Export client rollbar instance for direct use if needed
export { clientRollbar };

// Environment validation
if (
  typeof window !== 'undefined' &&
  isProduction &&
  !process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_ACCESS_TOKEN
) {
  console.warn(
    '⚠️  NEXT_PUBLIC_ROLLBAR_CLIENT_ACCESS_TOKEN not set in production environment'
  );
}
