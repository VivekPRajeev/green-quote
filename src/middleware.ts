import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { logError } from './utils/logger';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    // Check if user is admin
    if (req.nextUrl.pathname.startsWith('/admin') && !payload.isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', req.url)); // redirect non-admin users
    }

    return NextResponse.next(); // authorized
  } catch (err) {
    logError({ error: err, url: req.url });
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/user/:path*',
    '/quotes',
    '/quotes/:path*',
  ],
};
