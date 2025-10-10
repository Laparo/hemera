# Feature Specification: Booking and Payment

## Clarifications

### Session 2025-10-07

- Q: Die Spezifikation enthält zwei verschiedene Sets von funktionalen Anforderungen - eines mit 8
  Anforderungen (inklusive Stripe) und eines mit 4 Anforderungen (minimal). Welche Version soll als
  autoritativ gelten? → A: Vollständige 8 FR-Anforderungen mit Stripe-Integration
- Q: Die Course-Entität wird als "read-only" beschrieben, aber es ist unklar woher die Course-Daten
  kommen. Wie sollen die Course-Daten für die Buchung bereitgestellt werden? → C: Admin-Interface
  (außerhalb dieses Features)
- Q: Bei Stripe-Integration ist die Umgebungskonfiguration kritisch. Welche Stripe-Umgebung soll
  initial für Development und Testing verwendet werden? → A: Stripe Test Mode für Development +
  Production Mode für Deployment
- Q: Für das Retry-Verhalten bei fehlgeschlagenen Zahlungen fehlen spezifische Details. Wie soll das
  Retry-System für fehlgeschlagene Zahlungen implementiert werden? → B: Nur manueller Retry durch
  User-Aktion
- Q: Die Webhook-Konfiguration ist kritisch für die Payment-Bestätigung. Welche Webhook-Events sind
  minimal erforderlich für das Booking-System? → checkout.session.completed

## Requirements (mandatory)

### Functional Requirements

- FR-001: System MUST allow an authenticated user to create a booking for a target course with
  payment processing.
- FR-002: System MUST integrate with Stripe for secure payment processing following Vercel's Stripe
  integration guidelines.
- FR-003: System MUST redirect users to Stripe Checkout for payment processing and handle
  success/failure callbacks.
- FR-004: System MUST show an authenticated user a list of their own bookings with payment status.
- FR-005: System MUST prevent unauthenticated users from accessing booking pages or actions.
- FR-006: System SHOULD prevent duplicate identical bookings for the same user and course.
- FR-007: System MUST handle Stripe webhooks to update booking status based on payment events.
- FR-008: System MUST provide clear payment confirmation and failure feedback to users.

### Non-Functional Requirements

- NFR-001: Booking actions are available only in the non-public area; public SEO is unaffected.
- NFR-002: Clear, accessible feedback for success and error states throughout the payment flow.
- NFR-003: Payment processing MUST be PCI compliant via Stripe (no card data stored locally).
- NFR-004: Payment flow MUST be secure and follow Stripe's security best practices.
- NFR-005: System MUST handle payment processing failures gracefully with manual retry options for
  users.

### Stripe Integration Requirements

- SIR-001: Use Vercel's Stripe integration template as implementation foundation.
- SIR-002: Implement Stripe Checkout for payment processing (not custom forms).
- SIR-003: Configure Stripe webhooks for payment event handling (minimum:
  checkout.session.completed).
- SIR-004: Use Stripe Test Mode for development and Production Mode for live deployment.
- SIR-005: Implement proper error handling for Stripe API failures.
- SIR-006: Store minimal payment metadata (Stripe payment intent ID, status) in database.

### Key Entities

- **Booking**: Represents a user's registration/booking for a course with payment information.
  - Properties: user_id, course_id, payment_status, stripe_payment_intent_id, created_at, updated_at
- **Course**: Course data managed via admin interface (outside this feature scope). Read-only for
  booking purposes.
  - Properties: id, title, description, price, currency
- **User**: Authenticated user who performs the booking and payment.
- **Payment**: Stripe payment session and status tracking.
  - Properties: stripe_session_id, stripe_payment_intent_id, amount, currency, status

### Technical Architecture

#### Payment Flow

1. User selects course and clicks "Book & Pay"
2. System creates Stripe Checkout session with course details
3. User redirected to Stripe Checkout
4. User completes payment on Stripe
5. Stripe redirects back to success/cancel URL
6. Stripe webhook confirms payment and updates booking status
7. User sees confirmation page with booking details

#### API Endpoints

- `POST /api/bookings/create` - Create booking and Stripe session
- `POST /api/stripe/webhooks` - Handle Stripe payment events
- `GET /api/bookings/user` - Get user's bookings
- `GET /api/bookings/[id]` - Get specific booking details

#### Database Schema Extensions

````sql
-- Extend existing bookings table
ALTER TABLE bookings ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE bookings ADD COLUMN stripe_payment_intent_id VARCHAR(255);
ALTER TABLE bookings ADD COLUMN amount INTEGER; -- cents
ALTER TABLE bookings ADD COLUMN currency VARCHAR(3) DEFAULT 'USD';

-- Add courses table if not exists
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- cents
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```e Payment

**Feature Branch**: `004-bookings-basics`
**Created**: 2025-10-01
**Updated**: 2025-10-07 - Added Stripe payment integration
**Status**: Draft
**Input**: Define minimal booking capability for authenticated users (create and view own bookings) with Stripe payment processing

## User Scenarios & Testing (mandatory)

### Primary User Story

As an authenticated user, I can book and pay for a course using Stripe, and the system will handle the complete payment flow.

### Acceptance Scenarios

1. Given I am signed in, when I submit a valid booking with payment, then Stripe processes the payment and the system records the booking upon successful payment.
2. Given I am signed in, when I open my bookings, then I see an up-to-date list of my bookings with payment status.
3. Given I am signed out, when I access booking pages or actions, then I am redirected to sign in.
4. Given I select a course to book, when I proceed to payment, then I am redirected to Stripe Checkout for secure payment processing.
5. Given my payment is successful, when I return from Stripe, then my booking is confirmed and I receive a confirmation.
6. Given my payment fails, when I return from Stripe, then I see clear error feedback and can retry the payment.

### Edge Cases

- Duplicate booking attempts → show clear feedback without double creation or charging.
- Invalid course reference → booking is rejected with a friendly error before payment.
- Payment session timeout → user can restart the payment process.
- Payment successful but webhook fails → system recovers and marks booking as paid.
- Transient failures (network/db) → show retriable feedback with manual retry option.
- User cancels payment → return to course page with cancellation message.

## Requirements (mandatory)

### Functional Requirements

- FR-001: System MUST allow an authenticated user to create a booking for a target course with
  payment processing.
- FR-002: System MUST integrate with Stripe for secure payment processing following Vercel's Stripe
  integration guidelines.
- FR-003: System MUST redirect users to Stripe Checkout for payment processing and handle
  success/failure callbacks.
- FR-004: System MUST show an authenticated user a list of their own bookings with payment status.
- FR-005: System MUST prevent unauthenticated users from accessing booking pages or actions.
- FR-006: System SHOULD prevent duplicate identical bookings for the same user and course.
- FR-007: System MUST handle Stripe webhooks to update booking status based on payment events.
- FR-008: System MUST provide clear payment confirmation and failure feedback to users.

### Non-Functional Requirements

- NFR-001: Booking actions are available only in the non-public area; public SEO is unaffected.
- NFR-002: Clear, accessible feedback for success and error states throughout the payment flow.
- NFR-003: Payment processing MUST be PCI compliant via Stripe (no card data stored locally).
- NFR-004: Payment flow MUST be secure and follow Stripe's security best practices.
- NFR-005: System MUST handle payment processing failures gracefully with retry options.

### Key Entities

- Booking: Represents a user’s registration/booking for a course.
- Course: Publicly discoverable course (read-only in this scope).
- User: Authenticated user who performs the booking.

---

## Review & Acceptance Checklist

- [ ] No prohibited implementation details
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria measurable (creation works; list up-to-date; unauth blocked)
- [ ] Scope clearly bounded (minimal bookings only)

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [ ] Ambiguities marked (if any)
- [ ] User scenarios validated
- [ ] Requirements finalized
- [ ] Entities identified
- [ ] Review checklist passed
````
