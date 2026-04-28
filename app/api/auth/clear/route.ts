import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const store = await cookies();
  store.delete('auth_token');
  return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'));
}
