import { NextResponse } from 'next/server';

// In-memory storage (shared with save-pin route)
// In a real application, this would be a database
let pins: any[] = [];

export async function GET() {
  try {
    // For now, return empty array since we're using in-memory storage
    // In production, you'd fetch from a database
    return NextResponse.json(pins);
  } catch (error) {
    console.error('Error getting pins:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
