
// src/app/api/login/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '@/lib/constants';
import type { UserRole } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    let role: UserRole | null = null;
    let success = false;
    let authorName: string | null = null;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      success = true;
      role = 'Admin';
      authorName = 'Admin';
    } else if (username === 'Ajay' && password === 'terabytes*12') {
      success = true;
      role = 'Admin'; // Ajay logs in with Admin role
      authorName = 'Ajay';
    }
    // Add other roles/credentials checks here if needed in the future

    if (success && role && authorName) {
      return NextResponse.json({ success: true, role: role, authorName: authorName });
    } else {
      return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json({ success: false, message: 'An internal server error occurred' }, { status: 500 });
  }
}

