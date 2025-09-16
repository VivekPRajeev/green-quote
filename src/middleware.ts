import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

import { logError } from './utils/logger';

function handleUnauthorized(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/api')) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return NextResponse.redirect(new URL('/login', req.url));
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return handleUnauthorized(req);
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    if (req.nextUrl.pathname.startsWith('/admin') && !payload.isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', req.url)); // redirect non-admin users
    }
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user', JSON.stringify(payload));
    return NextResponse.next({
      request: { headers: requestHeaders },
    }); // authorized
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
    '/api/quotes/:path*',
    '/api/admin/:path*',
    '/api/user/:path*',
  ],
};
