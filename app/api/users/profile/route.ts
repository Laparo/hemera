import {
  getUserProfile,
  updateUser,
  type UpdateUserData,
} from '@/lib/api/users';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getUserProfile(userId);

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Error in GET /api/users/profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const updateData: UpdateUserData = {};

    if (body.name !== undefined) {
      if (typeof body.name !== 'string' && body.name !== null) {
        return NextResponse.json(
          { error: 'Name must be a string or null' },
          { status: 400 }
        );
      }
      updateData.name = body.name;
    }

    if (body.email !== undefined) {
      if (typeof body.email !== 'string' || !body.email.trim()) {
        return NextResponse.json(
          { error: 'Email must be a non-empty string' },
          { status: 400 }
        );
      }
      updateData.email = body.email.trim();
    }

    if (body.image !== undefined) {
      if (typeof body.image !== 'string' && body.image !== null) {
        return NextResponse.json(
          { error: 'Image must be a string URL or null' },
          { status: 400 }
        );
      }
      updateData.image = body.image;
    }

    const updatedUser = await updateUser(userId, updateData);

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error in PUT /api/users/profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
