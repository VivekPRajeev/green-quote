import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  console.log('Token from cookies:', token);
  if (!token) {
    console.log('no token found, redirecting to login');

    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    console.log('JWT payload:', payload);
    // Check if user is admin
    if (req.nextUrl.pathname.startsWith('/admin') && !payload.isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', req.url)); // redirect non-admin users
    }

    return NextResponse.next(); // authorized
  } catch (err) {
    console.log('JWT verification failed:', err);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Optionally, specify matcher for routes
export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
