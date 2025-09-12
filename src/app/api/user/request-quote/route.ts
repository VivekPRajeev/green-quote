import { NextRequest, NextResponse } from 'next/server';
import { Prisma, PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { calculateMonthlyPaymentPlans, MonthlyPaymentPlan } from '@/utils/calc';
import { APR_BY_BAND } from '@/constants/quote';

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId =
      typeof decoded === 'object' && 'id' in decoded ? decoded.id : null;
    const body = await req.json();

    const monthlyConsumptionKwh = Number(body.monthlyConsumptionKwh);
    const systemSizeKw = Number(body.systemSizeKw);
    const downPayment = Number(body.downPayment) || 0;

    if (
      isNaN(monthlyConsumptionKwh) ||
      isNaN(systemSizeKw) ||
      isNaN(downPayment)
    ) {
      return NextResponse.json(
        { error: 'Invalid fields provided' },
        { status: 400 }
      );
    }
    const systemPrice = systemSizeKw * 1200;

    const principalAmount = systemPrice - downPayment;
    if (principalAmount <= 0) {
      return NextResponse.json(
        { error: 'Down payment must be less than system price' },
        { status: 400 }
      );
    }
    const riskBand =
      monthlyConsumptionKwh >= 400 && systemSizeKw <= 6
        ? 'A'
        : monthlyConsumptionKwh >= 250
          ? 'B'
          : 'C';
    const quotes: MonthlyPaymentPlan[] = calculateMonthlyPaymentPlans(
      principalAmount,
      APR_BY_BAND[riskBand]
    );
    const createdQuote = await prisma.quote.create({
      data: {
        monthlyConsumptionKwh,
        systemSizeKw,
        downPayment,
        principalAmount,
        riskBand,
        systemPrice,
        offers: quotes as unknown as Prisma.JsonArray,
        user: { connect: { id: userId } },
        fullName: body.name,
        email: body.email,
        address: body.address,
      },
    });
    return NextResponse.json({
      message: 'Quote Generated Successfully',
      data: {
        ...body,
        monthlyConsumptionKwh,
        systemSizeKw,
        downPayment,
        userId,
        riskBand,
        systemPrice,
        quotes,
        quoteId: createdQuote.id,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
