import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { calculateMonthlyPaymentPlans, MonthlyPaymentPlan } from '@/utils/calc';
import { APR_BY_BAND } from '@/constants/quote';
import { logError, logRequest, logResponse } from '@/utils/logger';
import { validateWith } from '@/lib/validation';
import { createQuoteSchema } from '@/schema/quote';

export async function POST(req: NextRequest) {
  try {
    logRequest({ method: req.method, url: req.url! });
    const userHeader = req.headers.get('x-user');
    if (!userHeader) {
      logResponse({ status: 401, url: req.url! });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userPayload = JSON.parse(userHeader);
    const userId = userPayload.id;
    const body = await req.json();
    const validation = validateWith(createQuoteSchema, body);
    if (!validation.ok) {
      logResponse({ status: 400, url: req.url! });
      return validation.res;
    }

    const monthlyConsumptionKwh = validation.data.monthlyConsumptionKwh;
    const systemSizeKw = validation.data.systemSizeKw;
    const downPayment = validation.data.downPayment;

    const systemPrice = systemSizeKw * 1200;
    const principalAmount = systemPrice - downPayment;
    if (principalAmount <= 0) {
      logResponse({ status: 400, url: req.url! });
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
    logResponse({ status: 200, url: req.url! });
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
    logError({ error: err, url: req.url! });
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
