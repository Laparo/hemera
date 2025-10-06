/**
 * Auth Providers API route
 * Returns available authentication providers for the application
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Define the available auth providers as expected by the contract
    const providers = ['google', 'github', 'microsoft', 'apple', 'credentials'];

    return NextResponse.json({
      providers,
      count: providers.length,
    });
  } catch (error) {
    console.error('Error fetching auth providers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch auth providers' },
      { status: 500 }
    );
  }
}
