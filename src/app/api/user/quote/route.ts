import { NextRequest, NextResponse } from 'next/server';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

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
        user: { select: { email: true, fullName: true } },
        createdAt: true,
      } as Prisma.QuoteSelect,
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    return NextResponse.json(quote);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
