import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ message: 'Logged out' });
  res.cookies.set({
    name: 'token',
    value: '',
    path: '/',
    httpOnly: true,
    maxAge: 0,
  });
  return res;
}
