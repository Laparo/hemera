# Research: Booking and Payment

## Decisions

### Core Data Model

- **Course Model**: Admin-managed, read-only for booking purposes
  - Properties: id, title, description, price (cents), currency
- **Booking Model**: User booking with payment tracking
  - Properties: id, userId, courseId, payment_status, stripe_payment_intent_id, amount, timestamps
  - Unique constraint: (userId, courseId) to prevent duplicate bookings

### Payment Integration

- **Stripe Checkout**: No custom payment forms, redirect to Stripe for PCI compliance
- **Webhook Handling**: checkout.session.completed event for payment confirmation
- **Environment Strategy**: Test mode for development, Production mode for deployment
- **Retry Behavior**: Manual retry only (user-initiated), no automatic retries

### Technical Architecture

- **Authentication**: Clerk middleware for protected route access
- **Payment Flow**: Course selection → Stripe session creation → Checkout → Webhook confirmation
- **Error Handling**: Clear user feedback with manual retry options for payment failures

## Rationale

### Stripe Integration Choice

- **Vercel Template**: Leverages proven integration patterns
- **PCI Compliance**: Stripe handles all card data, reduces security burden
- **Webhook Reliability**: More reliable than redirect-only confirmation
- **Test/Prod Separation**: Clear environment boundaries reduce risk

### Manual Retry Strategy

- **Safety**: Prevents accidental double-charges from automatic retries
- **User Control**: Users decide when to retry failed payments
- **Simplicity**: Easier to implement and debug than complex retry logic
- **Stripe Handles**: Stripe already handles transient failures internally

## Alternatives Considered

### Payment Processing Options

- **Custom Payment Forms**: Rejected - PCI compliance complexity
- **PayPal Integration**: Rejected - Stripe has better Vercel integration
- **Multiple Payment Providers**: Rejected - unnecessary complexity for MVP

### Retry Mechanisms

- **Automatic Retries**: Rejected - risk of double-charging
- **Exponential Backoff**: Rejected - inappropriate for payment failures
- **Time-based Windows**: Rejected - adds complexity without clear benefit

### Data Architecture

- **Single Payment Table**: Rejected - booking and payment are conceptually linked
- **External Course API**: Rejected - admin interface provides sufficient control
- **Client-side Payment Status**: Rejected - security and reliability concerns
