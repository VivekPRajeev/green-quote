import { NextRequest, NextResponse } from 'next/server';
import { Prisma, PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const token = req.cookies.get('token')?.value ?? '';
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  const userId =
    typeof decoded === 'object' && 'id' in decoded ? decoded.id : null;
  const isAdmin =
    typeof decoded === 'object' && 'isAdmin' in decoded
      ? decoded.isAdmin
      : null;

  if (!id) {
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
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    if (!isAdmin && quote.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { userId: _omit, ...quoteWithoutUserId } = quote;
    return NextResponse.json({ data: quoteWithoutUserId, status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
