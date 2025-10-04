import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Minimal seed: none required for MVP; ensure DB connectivity works
  await prisma.$queryRaw`SELECT 1`;

  // Seed sample courses for SEO pages
  const courses = await prisma.course.createMany({
    data: [
      {
        title: 'JavaScript Fundamentals',
        description: 'Learn the core concepts of JavaScript programming from scratch. Perfect for beginners who want to master modern web development.',
        slug: 'javascript-fundamentals',
        level: 'BEGINNER',
        duration: '4 weeks',
        price: 99.00,
        status: 'PUBLISHED',
        isPublic: true,
      },
      {
        title: 'Advanced React Patterns',
        description: 'Master advanced React patterns and best practices. Learn hooks, context, state management, and performance optimization techniques.',
        slug: 'advanced-react-patterns',
        level: 'ADVANCED',
        duration: '6 weeks',
        price: 199.00,
        status: 'PUBLISHED',
        isPublic: true,
      },
      {
        title: 'TypeScript for Web Developers',
        description: 'Build type-safe web applications with TypeScript. Learn interfaces, generics, and advanced typing patterns for better code quality.',
        slug: 'typescript-for-web-developers',
        level: 'INTERMEDIATE',
        duration: '5 weeks',
        price: 149.00,
        status: 'PUBLISHED',
        isPublic: true,
      },
      {
        title: 'Full-Stack Development Bootcamp',
        description: 'Complete full-stack development course covering frontend, backend, and database technologies. Build real-world projects.',
        slug: 'fullstack-development-bootcamp',
        level: 'INTERMEDIATE',
        duration: '12 weeks',
        price: 499.00,
        status: 'PUBLISHED',
        isPublic: true,
      },
      {
        title: 'Coming Soon: Vue.js Mastery',
        description: 'Comprehensive Vue.js course covering composition API, Pinia state management, and modern Vue development practices.',
        slug: 'vuejs-mastery',
        level: 'INTERMEDIATE',
        duration: '8 weeks',
        status: 'DRAFT',
        isPublic: false,
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Seeded ${courses.count} courses`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
