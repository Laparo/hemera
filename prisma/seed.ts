import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data in development
  if (process.env.NODE_ENV === 'development') {
    await prisma.booking.deleteMany();
    await prisma.course.deleteMany();
  }

  const seedCourses = [
    {
      title: 'Grundlagen der Persönlichkeitsentwicklung',
      description:
        'Entdecken Sie die Basics der persönlichen Entwicklung. Ein perfekter Einstieg für alle, die ihr Leben positiv verändern möchten.',
      slug: 'grundlagen-persoenlichkeitsentwicklung',
      price: 100,
      currency: 'EUR',
      capacity: 20,
      date: new Date('2025-11-15T10:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Selbstvertrauen in 30 Minuten',
      description:
        'Ein kompakter Kurs, der Ihnen schnelle und effektive Techniken zur Stärkung Ihres Selbstvertrauens vermittelt.',
      slug: 'selbstvertrauen-30-minuten',
      price: 100,
      currency: 'EUR',
      capacity: 25,
      date: new Date('2025-11-20T14:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Stressabbau für Anfänger',
      description:
        'Lernen Sie einfache Methoden zum Stressabbau, die Sie sofort in Ihren Alltag integrieren können.',
      slug: 'stressabbau-anfaenger',
      price: 100,
      currency: 'EUR',
      capacity: 30,
      date: new Date('2025-11-25T16:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Zielsetzung leicht gemacht',
      description:
        'Erfahren Sie, wie Sie klare, erreichbare Ziele setzen und diese Schritt für Schritt umsetzen.',
      slug: 'zielsetzung-leicht-gemacht',
      price: 100,
      currency: 'EUR',
      capacity: 20,
      date: new Date('2025-12-01T09:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Kommunikation im Alltag',
      description:
        'Verbessern Sie Ihre tägliche Kommunikation mit Familie, Freunden und Kollegen durch einfache Techniken.',
      slug: 'kommunikation-alltag',
      price: 100,
      currency: 'EUR',
      capacity: 18,
      date: new Date('2025-12-05T11:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Achtsamkeit für Einsteiger',
      description:
        'Eine sanfte Einführung in die Welt der Achtsamkeit und Meditation für mehr Gelassenheit im Leben.',
      slug: 'achtsamkeit-einsteiger',
      price: 100,
      currency: 'EUR',
      capacity: 25,
      date: new Date('2025-12-08T18:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Motivation finden und halten',
      description:
        'Entdecken Sie Ihre persönlichen Motivationsquellen und lernen Sie, diese dauerhaft zu nutzen.',
      slug: 'motivation-finden-halten',
      price: 100,
      currency: 'EUR',
      capacity: 22,
      date: new Date('2025-12-12T15:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Positive Gewohnheiten entwickeln',
      description:
        'Schaffen Sie positive Routinen, die Ihr Leben nachhaltig verbessern werden.',
      slug: 'positive-gewohnheiten-entwickeln',
      price: 100,
      currency: 'EUR',
      capacity: 20,
      date: new Date('2025-12-15T13:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Kreativität im Beruf',
      description:
        'Erwecken Sie Ihre Kreativität und bringen Sie frische Ideen in Ihren Arbeitsalltag.',
      slug: 'kreativitaet-beruf',
      price: 100,
      currency: 'EUR',
      capacity: 15,
      date: new Date('2025-12-18T10:30:00Z'),
      isPublished: true,
    },
    {
      title: 'Work-Life-Balance Basics',
      description:
        'Finden Sie die richtige Balance zwischen Arbeit und Freizeit für ein erfülltes Leben.',
      slug: 'work-life-balance-basics',
      price: 100,
      currency: 'EUR',
      capacity: 24,
      date: new Date('2025-12-22T14:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Emotionale Intelligenz trainieren',
      description:
        'Stärken Sie Ihr Einfühlungsvermögen und verbessern Sie Ihre Beziehungen im beruflichen und privaten Umfeld.',
      slug: 'emotionale-intelligenz-trainieren',
      price: 100,
      currency: 'EUR',
      capacity: 20,
      date: new Date('2026-01-05T10:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Zeitmanagement für Vielbeschäftigte',
      description:
        'Lernen Sie, wie Sie Prioritäten setzen und Ihren Tagesablauf effizient strukturieren.',
      slug: 'zeitmanagement-vielbeschaeftigte',
      price: 100,
      currency: 'EUR',
      capacity: 28,
      date: new Date('2026-01-09T08:30:00Z'),
      isPublished: true,
    },
    {
      title: 'Professionell Netzwerken',
      description:
        'Entwickeln Sie Strategien, um wertvolle Kontakte aufzubauen und langfristig zu pflegen.',
      slug: 'professionell-netzwerken',
      price: 100,
      currency: 'EUR',
      capacity: 18,
      date: new Date('2026-01-12T17:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Resilienz im Arbeitsalltag',
      description:
        'Erfahren Sie, wie Sie mit Rückschlägen umgehen und gestärkt aus Herausforderungen hervorgehen.',
      slug: 'resilienz-arbeitsalltag',
      price: 100,
      currency: 'EUR',
      capacity: 26,
      date: new Date('2026-01-16T15:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Selbstfürsorge im digitalen Zeitalter',
      description:
        'Praktische Tipps, um trotz digitaler Dauerpräsenz für sich selbst zu sorgen.',
      slug: 'selbstfuersorge-digitales-zeitalter',
      price: 100,
      currency: 'EUR',
      capacity: 22,
      date: new Date('2026-01-20T19:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Leadership Basics für Einsteiger:innen',
      description:
        'Fundamentales Wissen für alle, die erste Führungserfahrungen sammeln möchten.',
      slug: 'leadership-basics-einsteiger',
      price: 100,
      currency: 'EUR',
      capacity: 25,
      date: new Date('2026-01-24T09:30:00Z'),
      isPublished: true,
    },
    {
      title: 'Kreatives Problemlösen',
      description:
        'Aktivieren Sie Ihre kreative Seite, um Herausforderungen mit neuen Perspektiven zu meistern.',
      slug: 'kreatives-problemloesen',
      price: 100,
      currency: 'EUR',
      capacity: 21,
      date: new Date('2026-01-27T13:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Konfliktmanagement im Team',
      description:
        'Erlernen Sie Methoden, um Konflikte frühzeitig zu erkennen und konstruktiv zu lösen.',
      slug: 'konfliktmanagement-team',
      price: 100,
      currency: 'EUR',
      capacity: 23,
      date: new Date('2026-01-30T11:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Gesund arbeiten im Homeoffice',
      description:
        'Optimieren Sie Ihren Arbeitsalltag zu Hause – von Ergonomie bis Routine.',
      slug: 'gesund-arbeiten-homeoffice',
      price: 100,
      currency: 'EUR',
      capacity: 27,
      date: new Date('2026-02-03T08:00:00Z'),
      isPublished: true,
    },
    {
      title: 'Gelassen präsentieren',
      description:
        'Gewinnen Sie Sicherheit vor Publikum und präsentieren Sie souverän.',
      slug: 'gelassen-praesentieren',
      price: 100,
      currency: 'EUR',
      capacity: 19,
      date: new Date('2026-02-06T16:30:00Z'),
      isPublished: true,
    },
  ];

  const courses = await Promise.all(
    seedCourses.map(course =>
      prisma.course.upsert({
        where: { slug: course.slug },
        update: {
          title: course.title,
          description: course.description,
          price: course.price,
          currency: course.currency,
          capacity: course.capacity,
          date: course.date,
          isPublished: course.isPublished,
        },
        create: course,
      })
    )
  );

  console.log(`Seeded ${courses.length} courses (each priced at €1.00):`);
  courses.forEach(course => {
    console.log(
      `- ${course.title}: €${(course.price / 100).toFixed(2)} (${course.slug})`
    );
  });

  // Minimal DB connectivity check
  await prisma.$queryRaw`SELECT 1`;
  console.log('Database connectivity verified');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
