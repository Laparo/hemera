/**
 * Example Server Actions using new error handling middleware
 * Demonstrates comprehensive error handling patterns for Server Actions
 */

'use server';

import {
  withServerActionErrorHandling,
  withAuthenticatedServerAction,
  withFormValidation,
  withOptimisticUpdate,
  withRetry,
  withTransaction,
  createFormAction,
  ServerActionContext,
  ServerActionResult,
} from '@/lib/middleware/server-action-error-handling';
import { createBooking } from '@/lib/api/bookings';
import { BookingAlreadyExistsError } from '@/lib/errors/domain';

// Example 1: Basic server action with error handling
export const createCourseAction = withServerActionErrorHandling(
  async (context: ServerActionContext) => {
    // Simulate course creation
    const course = {
      id: 'course-1',
      title: 'New Course',
      description: 'Course description',
      createdAt: new Date(),
    };

    return course;
  }
);

// Example 2: Authenticated server action
export const updateProfileAction = withAuthenticatedServerAction(
  async context => {
    const { userId } = context;

    // Update user profile
    // Implementation would go here

    return {
      userId,
      message: 'Profile updated successfully',
    };
  }
);

// Example 3: Form validation server action
const bookingSchema = {
  parse: (data: any) => {
    if (!data.courseId || !data.userId || !data.date) {
      throw new Error('Course ID, User ID, and date are required');
    }
    return data;
  },
};

export const createBookingAction = withFormValidation(
  bookingSchema,
  async (context: ServerActionContext, validatedData: any) => {
    const booking = await createBooking({
      courseId: validatedData.courseId,
      userId: validatedData.userId,
      paymentStatus: 'PENDING',
    });

    return booking;
  }
);

// Example 4: Optimistic update server action
export const toggleBookmarkAction = withOptimisticUpdate(
  async (context: ServerActionContext) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Toggle bookmark logic
    const isBookmarked = Math.random() > 0.5;

    return { isBookmarked };
  },
  { isBookmarked: true } // Optimistic value
);

// Example 5: Server action with retry logic
export const syncExternalDataAction = withRetry(
  async (context: ServerActionContext) => {
    // Simulate external API call that might fail
    if (Math.random() > 0.7) {
      throw new Error('External API temporarily unavailable');
    }

    return { synced: true, timestamp: new Date() };
  },
  3, // Max retries
  1000 // Retry delay in ms
);

// Example 6: Transaction-based server action
export const transferCreditsAction = withTransaction(async context => {
  const { tx, userId } = context;

  // Simulate credit transfer within transaction
  // Implementation would use actual Prisma transaction

  return {
    fromUser: userId,
    toUser: 'target-user-id',
    amount: 100,
    transactionId: context.requestId,
  };
});

// Example 7: File upload action
export const uploadCourseImageAction = createFormAction(
  async (formData: FormData, context: ServerActionContext) => {
    const file = formData.get('image') as File;

    if (!file) {
      throw new Error('No image file provided');
    }

    // Simulate file upload
    const uploadResult = {
      filename: file.name,
      size: file.size,
      type: file.type,
      url: `https://cdn.example.com/${context.requestId}/${file.name}`,
    };

    return uploadResult;
  }
);

// Example 8: Complex server action with error boundaries
export const enrollInCourseAction = withAuthenticatedServerAction(
  async context => {
    const { userId, requestId } = context;

    try {
      // Check if user is already enrolled
      const existingEnrollment = await checkExistingEnrollment(
        userId,
        'course-id'
      );

      if (existingEnrollment) {
        throw new BookingAlreadyExistsError(userId, 'course-id');
      }

      // Create enrollment
      const enrollment = await createEnrollment(userId, 'course-id');

      // Send welcome email (fire and forget)
      sendWelcomeEmail(userId, 'course-id').catch(error => {
        console.error('Failed to send welcome email:', error);
      });

      return enrollment;
    } catch (error) {
      // Additional error context
      throw error;
    }
  }
);

// Helper functions (placeholders)
async function checkExistingEnrollment(userId: string, courseId: string) {
  return null; // Placeholder
}

async function createEnrollment(userId: string, courseId: string) {
  return {
    id: 'enrollment-id',
    userId,
    courseId,
    enrolledAt: new Date(),
  };
}

async function sendWelcomeEmail(userId: string, courseId: string) {
  // Email sending logic
  return true;
}
