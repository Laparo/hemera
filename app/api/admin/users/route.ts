import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    return NextResponse.json({
      users,
      total: users.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
