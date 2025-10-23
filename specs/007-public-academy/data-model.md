# Data Model – Public Academy (007)

Spec: /Users/Zauberflocke/Documents/GitHub/hemera/specs/007-public-academy/spec.md Schema:
/Users/Zauberflocke/Documents/GitHub/hemera/prisma/schema.prisma

## Entities

### Course

- id: string (cuid)
- title: string
- description: string | null
- slug: string (unique)
- price: int (minor units)
- currency: string (default USD; public: EUR)
- capacity: int | null
- date: DateTime | null
- isPublished: boolean
- createdAt: DateTime
- updatedAt: DateTime
- relations: bookings: Booking[]

Derived (API):

- availableSpots: number | null
- totalBookings: number

### Booking

- id: string (cuid)
- userId: string (ref User)
- courseId: string (ref Course)
- paymentStatus: PaymentStatus (default PENDING)
- stripePaymentIntentId: string | null
- stripeSessionId: string | null
- amount: int (minor units)
- currency: string (default USD)
- createdAt: DateTime
- updatedAt: DateTime

Unique: (userId, courseId)

### PaymentStatus (enum)

- PENDING | PAID | FAILED | CANCELLED | REFUNDED | CONFIRMED

## Availability Logic

```text
availableSpots = capacity == null ? null : max(0, capacity - count(bookings where status in [PAID, PENDING]))
```

## Validation Rules

- Course.isPublished must be true for public listing
- price >= 0; currency uppercase ISO 4217
- Booking unique per user/course

## Notes

- Public UI uses DE/EUR formatting for price (gross)
- Single date per course for MVP; variants/dates may extend model later
