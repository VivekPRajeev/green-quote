import { NextRequest, NextResponse } from 'next/server';
import { logError, logRequest, logResponse } from '@/utils/logger';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    logRequest({ method: req.method, url: req.url! });
    const userHeader = req.headers.get('x-user');
    if (!userHeader) {
      logResponse({ status: 401, url: req.url! });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userPayload = JSON.parse(userHeader);
    const userId = userPayload.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, fullName: true },
    });
    if (!user) {
      logResponse({ status: 404, url: req.url! });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
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
