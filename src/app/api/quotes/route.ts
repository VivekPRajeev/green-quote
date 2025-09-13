import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { logError, logRequest, logResponse } from '@/utils/logger';
import { log } from 'console';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    logRequest({ method: req.method, url: req.url! });
    const token = req.cookies.get('token')?.value;
    if (!token) {
      logResponse({ status: 401, url: req.url! });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId =
      typeof decoded === 'object' && 'id' in decoded ? decoded.id : null;
    if (!userId) {
      logResponse({ status: 401, url: req.url! });
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, fullName: true },
    });
    const quotes = await prisma.quote.findMany({
      where: { userId: userId },
      select: {
        id: true,
        systemPrice: true,
        riskBand: true,
        systemSizeKw: true,
        createdAt: true,
      },
    });

    if (!user) {
      logResponse({ status: 404, url: req.url! });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    logResponse({ status: 200, url: req.url! });
    return NextResponse.json({ user, quotes }, { status: 200 });
  } catch (error) {
    logError({ error: error, url: req.url! });
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}
