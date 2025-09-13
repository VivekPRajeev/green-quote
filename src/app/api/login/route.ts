import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logError, logRequest, logResponse } from '@/utils/logger';

const prisma = new PrismaClient();

interface JWTPayload {
  id: string;
  name: string;
  isAdmin: boolean;
}
export async function POST(req: NextRequest) {
  try {
    logRequest({ method: req.method, url: req.url! });
    const { email, password } = await req.json();

    if (!email || !password) {
      logResponse({ status: 400, url: req.url! });
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logResponse({ status: 401, url: req.url! });
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      logResponse({ status: 401, url: req.url! });
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const payload: JWTPayload = {
      id: user.id,
      name: user.fullName,
      isAdmin: user.isAdmin,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET! as string, {
      expiresIn: '1h',
    });

    const response = NextResponse.json({
      message: 'Login successful',
      isAdmin: user.isAdmin,
    });
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600, // 1 hour
    });

    logResponse({ status: 200, url: req.url! });
    return response;
  } catch (err) {
    logError({ error: err, url: req.url! });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
