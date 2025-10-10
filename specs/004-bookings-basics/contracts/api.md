# API Contracts: Booking and Payment

## Stripe Checkout API

### POST /api/stripe/checkout

Creates a Stripe Checkout session for course booking.

**Request:**

```typescript
interface CreateCheckoutRequest {
  courseId: string;
}
```

**Response (Success):**

```typescript
interface CreateCheckoutResponse {
  sessionId: string;
  url: string; // Stripe Checkout URL
}
```

**Response (Error):**

```typescript
interface ApiError {
  error: string;
  code: 'UNAUTHORIZED' | 'COURSE_NOT_FOUND' | 'ALREADY_BOOKED' | 'STRIPE_ERROR';
  message: string;
}
```

**Example:**

```bash
curl -X POST /api/stripe/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <clerk_token>" \
  -d '{"courseId": "course_123"}'
```

## Stripe Webhook API

### POST /api/stripe/webhook

Handles Stripe webhook events for payment processing.

**Request:**

```typescript
interface StripeWebhookEvent {
  id: string;
  object: 'event';
  type: 'checkout.session.completed';
  data: {
    object: {
      id: string;
      payment_intent: string;
      client_reference_id: string; // booking ID
      payment_status: 'paid' | 'unpaid';
      amount_total: number;
      currency: string;
    };
  };
}
```

**Response:**

```typescript
interface WebhookResponse {
  received: boolean;
}
```

## Booking API

### GET /api/bookings

Get current user's bookings.

**Request:** No body required, user identified by Clerk token.

**Response:**

```typescript
interface GetBookingsResponse {
  bookings: BookingWithCourse[];
}

interface BookingWithCourse {
  id: string;
  userId: string;
  courseId: string;
  paymentStatus: PaymentStatus;
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  course: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    currency: string;
    date: string | null;
  };
}

type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
```

### GET /api/bookings/[id]

Get specific booking details.

**Parameters:**

- `id`: Booking ID

**Response:**

```typescript
interface GetBookingResponse {
  booking: BookingWithCourse;
}
```

**Error Response:**

```typescript
interface ApiError {
  error: string;
  code: 'UNAUTHORIZED' | 'NOT_FOUND' | 'FORBIDDEN';
  message: string;
}
```

## Course API

### GET /api/courses

Get available courses for booking.

**Request:** No parameters required.

**Response:**

```typescript
interface GetCoursesResponse {
  courses: Course[];
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  capacity: number | null;
  date: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### GET /api/courses/[id]

Get specific course details.

**Parameters:**

- `id`: Course ID

**Response:**

```typescript
interface GetCourseResponse {
  course: Course;
}
```

## Error Handling

### Standard Error Response

```typescript
interface ApiError {
  error: string;
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

### Error Codes

| Code               | Description                     | HTTP Status |
| ------------------ | ------------------------------- | ----------- |
| `UNAUTHORIZED`     | User not authenticated          | 401         |
| `FORBIDDEN`        | User lacks permission           | 403         |
| `NOT_FOUND`        | Resource not found              | 404         |
| `ALREADY_BOOKED`   | User already booked this course | 409         |
| `COURSE_NOT_FOUND` | Course does not exist           | 404         |
| `STRIPE_ERROR`     | Stripe API error                | 500         |
| `VALIDATION_ERROR` | Invalid request data            | 400         |
| `INTERNAL_ERROR`   | Server error                    | 500         |

## Authentication

All API endpoints (except webhooks) require Clerk authentication:

**Header:**

```http
Authorization: Bearer <clerk_session_token>
```

**Middleware Validation:**

- Extract user ID from Clerk token
- Validate token signature
- Ensure user has access to requested resources

## Rate Limiting

### Payment Endpoints

- `/api/stripe/checkout`: 10 requests per minute per user
- `/api/stripe/webhook`: No rate limiting (Stripe managed)

### Data Endpoints

- `/api/bookings/*`: 60 requests per minute per user
- `/api/courses/*`: 100 requests per minute per user

## Webhook Security

### Stripe Webhook Validation

```typescript
import { headers } from 'next/headers';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Process event...
  } catch (error) {
    return new Response('Webhook signature verification failed', {
      status: 400,
    });
  }
}
```

## Data Validation

### Request Validation

```typescript
import { z } from 'zod';

const CreateCheckoutSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
});

// Usage
const validatedData = CreateCheckoutSchema.parse(requestBody);
```

### Response Validation

All responses must match TypeScript interfaces and include proper error handling for malformed data.

## Testing Contracts

### API Testing Examples

```typescript
// Successful checkout creation
describe('POST /api/stripe/checkout', () => {
  it('creates checkout session for valid course', async () => {
    const response = await request(app)
      .post('/api/stripe/checkout')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ courseId: 'course_123' })
      .expect(200);

    expect(response.body).toMatchObject({
      sessionId: expect.stringMatching(/^cs_/),
      url: expect.stringContaining('checkout.stripe.com'),
    });
  });
});

// Error handling
describe('Error cases', () => {
  it('returns 409 for duplicate booking', async () => {
    const response = await request(app)
      .post('/api/stripe/checkout')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ courseId: 'already_booked_course' })
      .expect(409);

    expect(response.body.code).toBe('ALREADY_BOOKED');
  });
});
```

### Webhook Testing

```typescript
describe('Stripe Webhook', () => {
  it('updates booking status on successful payment', async () => {
    const webhookPayload = {
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_123',
          payment_intent: 'pi_test_456',
          client_reference_id: 'booking_789',
          payment_status: 'paid',
        },
      },
    };

    const response = await request(app)
      .post('/api/stripe/webhook')
      .set('stripe-signature', validSignature)
      .send(webhookPayload)
      .expect(200);

    // Verify booking status updated
    const booking = await getBookingById('booking_789');
    expect(booking.paymentStatus).toBe('PAID');
  });
});
```
