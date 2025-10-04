import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth/options';

export const runtime = 'nodejs'; // Ensure Node runtime for Prisma/NextAuth

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
