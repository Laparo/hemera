# Quickstart Guide: Booking and Payment System

## Development Setup

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- Stripe account (Test mode)
- Clerk account configured
- Vercel CLI (optional, for deployment)

### Environment Configuration

Create `.env.local` with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hemera_dev"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/auth/signin"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/auth/signup"

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Application
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

### Database Setup

1. **Initialize Database:**

   ```bash
   npm install
   npx prisma generate
   npx prisma db push
   ```

2. **Seed Sample Data:**

   ```bash
   npx prisma db seed
   ```

3. **Verify Tables:**

   ```bash
   npx prisma studio
   ```

### Stripe Configuration

1. **Create Webhook Endpoint:**
   - Login to Stripe Dashboard
   - Go to Developers → Webhooks
   - Add endpoint: `http://localhost:3000/api/stripe/webhook`
   - Select events: `checkout.session.completed`
   - Copy webhook secret to `.env.local`

2. **Test Webhook (ngrok):**

   ```bash
   # Install ngrok
   npm install -g ngrok

   # Expose local server
   ngrok http 3000

   # Update Stripe webhook URL to: https://xxx.ngrok.io/api/stripe/webhook
   ```

## Quick Start

### 1. Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

### 2. Create Test User

1. Navigate to `/auth/signin`
2. Sign up with test email
3. Verify account (check email)

### 3. Create Sample Course

Run in Prisma Studio or database:

```sql
INSERT INTO courses (id, title, description, price, currency, capacity)
VALUES (
  'course_test_1',
  'Test Course',
  'A test course for development',
  2500, -- $25.00
  'USD',
  10
);
```

### 4. Test Booking Flow

1. **Access Protected Area:**
   - Navigate to `/protected/courses`
   - Should see test course

2. **Create Booking:**
   - Click "Book Course"
   - Fill booking form
   - Click "Proceed to Payment"

3. **Test Payment:**
   - Redirected to Stripe Checkout
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC

4. **Verify Success:**
   - Should redirect to `/protected/payment/success`
   - Check `/protected/bookings` for confirmed booking

## Development Workflow

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Specific test file
npm run test -- booking-create.spec.ts
```

### Database Operations

```bash
# Reset database
npx prisma migrate reset

# Create migration
npx prisma migrate dev --name add_payment_fields

# Deploy to production
npx prisma migrate deploy
```

### Stripe Testing

#### Test Cards

| Card Number           | Description        |
| --------------------- | ------------------ |
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 0002` | Declined payment   |
| `4000 0000 0000 9995` | Insufficient funds |

#### Webhook Testing

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Common Issues & Solutions

### Issue: Webhook Not Receiving Events

**Solution:**

1. Check webhook URL in Stripe dashboard
2. Verify `STRIPE_WEBHOOK_SECRET` in `.env.local`
3. Ensure server is accessible (use ngrok for local testing)
4. Check webhook signature validation in code

### Issue: Authentication Failures

**Solution:**

1. Verify Clerk keys in `.env.local`
2. Check middleware configuration
3. Ensure user is properly authenticated
4. Verify protected route setup

### Issue: Payment Failures

**Solution:**

1. Check Stripe publishable/secret keys
2. Verify test mode vs live mode
3. Use correct test card numbers
4. Check network requests in browser dev tools

### Issue: Database Connection Errors

**Solution:**

1. Verify `DATABASE_URL` format
2. Ensure PostgreSQL is running
3. Check database permissions
4. Run `npx prisma generate` after schema changes

## API Testing

### Using curl

```bash
# Get courses (public)
curl http://localhost:3000/api/courses

# Create checkout session (requires auth)
curl -X POST http://localhost:3000/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <clerk_token>" \
  -d '{"courseId": "course_test_1"}'

# Get user bookings (requires auth)
curl http://localhost:3000/api/bookings \
  -H "Authorization: Bearer <clerk_token>"
```

### Using Postman

1. Import collection from `specs/004-bookings-basics/contracts/postman.json`
2. Set environment variables:
   - `baseUrl`: `http://localhost:3000`
   - `clerkToken`: Get from browser dev tools
3. Run collection tests

## Deployment

### Vercel Deployment

1. **Connect Repository:**

   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Link project
   vercel link
   ```

2. **Configure Environment Variables:**

   ```bash
   # Set production environment variables
   vercel env add DATABASE_URL
   vercel env add CLERK_SECRET_KEY
   vercel env add STRIPE_SECRET_KEY
   vercel env add STRIPE_WEBHOOK_SECRET
   ```

3. **Deploy:**

   ```bash
   # Deploy to preview
   vercel

   # Deploy to production
   vercel --prod
   ```

### Database Migration

```bash
# Apply migrations to production
npx prisma migrate deploy
```

### Stripe Production Setup

1. Switch to Live mode in Stripe dashboard
2. Update webhook endpoint to production URL
3. Update environment variables with live keys
4. Test with real payment methods

## Monitoring & Debugging

### Logging

```typescript
// Add to API routes for debugging
console.log('Stripe webhook received:', {
  type: event.type,
  id: event.id,
  created: event.created,
});
```

### Error Tracking

```typescript
// Add error tracking service
import * as Sentry from '@sentry/nextjs';

try {
  // Payment processing logic
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

### Performance Monitoring

```bash
# Monitor API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/api/courses
```

## Security Checklist

- [ ] Stripe webhook signature validation implemented
- [ ] Clerk authentication on all protected routes
- [ ] Input validation on all API endpoints
- [ ] SQL injection prevention (Prisma parameterized queries)
- [ ] Rate limiting on payment endpoints
- [ ] HTTPS in production
- [ ] Environment variables properly secured
- [ ] No sensitive data in client-side code

## Next Steps

1. **Implement Additional Features:**
   - Course catalog search and filtering
   - Booking cancellation and refunds
   - Email notifications for bookings
   - Admin interface for course management

2. **Performance Optimization:**
   - Database query optimization
   - Caching for course data
   - Image optimization for course photos
   - Bundle size optimization

3. **Enhanced Testing:**
   - Integration tests for payment flows
   - Load testing for high concurrency
   - Security penetration testing
   - Accessibility testing

4. **Production Readiness:**
   - Error monitoring setup
   - Performance monitoring
   - Backup and disaster recovery
   - Documentation for operations team
