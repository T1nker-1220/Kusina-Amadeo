import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/csrf';

export async function GET(request: NextRequest) {
  try {
    const token = await generateToken();
    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    return NextResponse.json(
      { error: 'Failed to generate CSRF token' },
      { status: 500 }
    );
  }
}
