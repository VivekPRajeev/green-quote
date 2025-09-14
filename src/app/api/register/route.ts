import { NextRequest, NextResponse } from 'next/server';
import { logError, logRequest, logResponse } from '@/utils/logger';
import { validateEmail } from '@/utils/validators';
import { prisma } from '@/lib/prisma';

const bcrypt = require('bcryptjs');

export async function POST(req: NextRequest) {
  try {
    logRequest({ method: req.method, url: req.url! });
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      logResponse({ status: 400, url: req.url! });
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    if (password.length < 6) {
      logResponse({ status: 400, url: req.url! });
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }
    if (validateEmail(email) === false) {
      logResponse({ status: 400, url: req.url! });
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    if (name.length < 3) {
      logResponse({ status: 400, url: req.url! });
      return NextResponse.json(
        { error: 'Name must be at least 3 characters' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      logResponse({ status: 409, url: req.url! });
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        fullName: name,
        password: hashedPassword,
        isAdmin: false,
      },
    });
    logResponse({ status: 201, url: req.url! });
    return NextResponse.json(
      { user: { id: user.id, email: user.email, name: user.fullName } },
      { status: 201 }
    );
  } catch (error) {
    logError({ error: error, url: req.url! });
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
