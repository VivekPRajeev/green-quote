import { NextRequest, NextResponse } from 'next/server';
import { Prisma, PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { logError, logRequest, logResponse } from '@/utils/logger';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  logRequest({ method: req.method, url: req.url! });
  const id = params.id;
  const token = req.cookies.get('token')?.value ?? '';
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  const userId =
    typeof decoded === 'object' && 'id' in decoded ? decoded.id : null;
  const isAdmin =
    typeof decoded === 'object' && 'isAdmin' in decoded
      ? decoded.isAdmin
      : null;

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
      } as Prisma.QuoteSelect,
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
    return NextResponse.json({ data: quoteWithoutUserId, status: 200 });
  } catch (error) {
    logError({ error: error, url: req.url! });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
