# Data Model: Course

## Prisma-Modell (Beispiel)

```prisma
model Course {
  id          String   @id @default(uuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Hinweise

- `id`: Primärschlüssel, UUID
- `name`: Kursname
- `description`: Beschreibung (optional)
- `createdAt`, `updatedAt`: Timestamps
