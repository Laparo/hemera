import {
  deleteUser,
  getUserProfile,
  getUserStats,
  updateUser,
  type UpdateUserData,
} from '@/lib/api/users';
import { checkUserAdminStatus } from '@/lib/auth/helpers';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await checkUserAdminStatus(currentUserId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }

    const { id: userId } = await params;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeStats = searchParams.get('includeStats') === 'true';

    const [profile, stats] = await Promise.all([
      getUserProfile(userId),
      includeStats ? getUserStats(userId) : null,
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...profile,
        ...(stats && { stats }),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/users/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await checkUserAdminStatus(currentUserId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }

    const { id: userId } = await params;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
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
    console.error('Error in PUT /api/users/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await checkUserAdminStatus(currentUserId);
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin privileges required' },
        { status: 403 }
      );
    }

    const { id: userId } = await params;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (userId === currentUserId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    await deleteUser(userId);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/users/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
