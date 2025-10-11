/**
 * Centralized Error Module
 * Export all error types and utilities from a single entry point
 */

// Base error classes
export {
  BaseError,
  BusinessError,
  InfrastructureError,
  ValidationError,
  AuthError,
} from './base';

// Domain-specific errors
export {
  CourseNotFoundError,
  CourseNotPublishedError,
  CourseSlugAlreadyExistsError,
  BookingNotFoundError,
  BookingAlreadyExistsError,
  InvalidBookingStatusError,
  UserNotFoundError,
  UserEmailAlreadyExistsError,
  PaymentProcessingError,
  StripeConfigurationError,
  UnauthorizedError,
  SessionExpiredError,
  DatabaseConnectionError,
  DatabaseConstraintError,
  DatabaseValidationError,
  FieldValidationError,
  UserValidationError,
} from './domain';

// HTTP utilities
export {
  toHttpError,
  logError,
  withErrorHandling,
  type ApiErrorResponse,
} from './http';
