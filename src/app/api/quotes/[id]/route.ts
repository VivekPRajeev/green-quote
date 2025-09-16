import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

import { logError, logRequest, logResponse } from '@/utils/logger';

export async function GET(req: NextRequest, { params }: { params: any }) {
  logRequest({ method: req.method, url: req.url! });
  const id = params.id;
  const userHeader = req.headers.get('x-user');
  if (!userHeader) {
    logResponse({ status: 401, url: req.url! });
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userPayload = JSON.parse(userHeader);
  const userId = userPayload.id;
  const isAdmin = userPayload.isAdmin;

  if (!id) {
    logResponse({ status: 400, url: req.url! });
    return NextResponse.json({ error: 'Missing Quote ID' }, { status: 400 });
  }

  try {
    const quote = await prisma.quote.findUnique({
      where: { id: id },
      select: {
        id: true,
        monthlyConsumptionKwh: true,
        systemSizeKw: true,
        downPayment: true,
        principalAmount: true,
        riskBand: true,
        systemPrice: true,
        offers: true,
        fullName: true,
        email: true,
        address: true,
        userId: true,
        user: { select: { email: true, fullName: true } },
        createdAt: true,
      },
    });

    if (!quote) {
      logResponse({ status: 404, url: req.url! });
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    if (!isAdmin && quote.userId !== userId) {
      logResponse({ status: 403, url: req.url! });
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { userId: _omit, ...quoteWithoutUserId } = quote;
    logResponse({ status: 200, url: req.url! });
    return NextResponse.json({ data: quoteWithoutUserId }, { status: 200 });
  } catch (error) {
    logError({ error: error, url: req.url! });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
