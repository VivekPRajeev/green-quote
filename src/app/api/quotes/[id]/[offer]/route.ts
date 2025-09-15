import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { prisma } from '@/lib/prisma'; // your DB
import { Prisma } from '@prisma/client';
import { logError, logResponse } from '@/utils/logger';
import { calculatePayments, formatDate } from '@/utils/calc';
import { AmortizationEntry } from '@/types/quotes';
import { APR_BY_BAND } from '@/constants/quote';
import { validateWith } from '@/lib/validation';
import { createQuoteSchema, quotePrintParamsSchema } from '@/schema/quote';

export async function GET(req: NextRequest, { params }: { params: any }) {
  try {
    const { id, offer } = params;
    const userHeader = req.headers.get('x-user');
    if (!userHeader) {
      logResponse({ status: 401, url: req.url! });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userPayload = JSON.parse(userHeader);
    const userId = userPayload.id;
    const isAdmin = userPayload.isAdmin;

    const validation = validateWith(quotePrintParamsSchema, { id, offer });

    if (!validation.ok) {
      logResponse({ status: 400, url: req.url! });
      return validation.res;
    }

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

    const offers = quote.offers as {
      apr: number;
      termYears: number;
      principalUsed: number;
      monthlyPayment: number;
    }[];

    const selectedOffer = offers.find((element) => element.termYears == offer);
    if (!selectedOffer) {
      logResponse({ status: 404, url: req.url! });
      return NextResponse.json(
        { data: 'Could not find the offer' },
        { status: 404 }
      );
    }
    const payments: AmortizationEntry[] = calculatePayments(
      selectedOffer?.termYears,
      selectedOffer?.apr,
      selectedOffer?.principalUsed,
      selectedOffer?.monthlyPayment
    );
    // Prepare HTML for PDF
    const html = `
    <html>
      <head>
        <meta charset="utf-8">
        <title>Quote ${id}</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="p-6 font-sans">
        <div class="flex justify-between items-center mb-6">
                <div>
                  <h1 class="text-2xl font-bold text-gray-800">
                    Quote for ${quote?.fullName}
                  </h1>
        
                  <div class="mt-2">
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">Email:</span>
                      ${quote.email ?? 'N/A'}
                    </p>
                    <p class="text-sm text-gray-600">
                      <span class="font-medium">Address:</span>
                      ${quote.address ?? 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
        
              <div class="grid grid-cols-2 gap-4 mb-8">
                <div class="bg-gray-50 p-4 rounded">
                  <span class="block text-xs text-gray-500 mb-1">
                    Monthly Consumption
                  </span>
                  <span class="text-lg font-semibold text-gray-800">
                    ${quote.monthlyConsumptionKwh ?? 'N/A'} KWh
                  </span>
                </div>
        
                <div class="bg-gray-50 p-4 rounded">
                  <span class="block text-xs text-gray-500 mb-1">System Size</span>
                  <span class="text-lg font-semibold text-gray-800">
                    ${quote.systemSizeKw ?? 'N/A'} KW
                  </span>
                </div>
                <div class="bg-gray-50 p-4 rounded">
                  <span class="block text-xs text-gray-500 mb-1">System Price</span>
                  <span class="text-lg font-semibold text-gray-800">
                    ${quote.systemPrice ?? 'N/A'} EUR
                  </span>
                </div>
                <div class="bg-gray-50 p-4 rounded">
                  <span class="block text-xs text-gray-500 mb-1">Down payment</span>
        
                  <span class="text-lg font-semibold text-gray-800">
                    ${quote.downPayment ?? 'N/A'} EUR
                  </span>
                </div>
                <div class="bg-gray-50 p-4 rounded">
                  <span class="block text-xs text-gray-500 mb-1">
                    Principal Amount
                  </span>
                  <span class="text-lg font-semibold text-gray-800">
                    ${quote.principalAmount ?? 'N/A'} EUR
                  </span>
                </div>
                <div class="bg-gray-50 p-4 rounded">
                  <span class="block text-xs text-gray-500 mb-1">APR</span>
                  <span class="text-lg font-semibold text-gray-800">
                   ${APR_BY_BAND[quote.riskBand as keyof typeof APR_BY_BAND] ?? 0} %
                  </span>
                </div>
              </div>

            <div class="overflow-x-auto">
                <h3 class="text-2xl font-bold text-gray-800 mb-4">
                    Amortization Schedule for ${offer} Years
                </h3>
                <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
                    <thead class="bg-gray-100">
                    <tr>
                        <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        #
                        </th>
                        <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        Date
                        </th>
                        <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">
                        Payment
                        </th>
                        <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">
                        Interest
                        </th>
                        <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">
                        Principal
                        </th>
                        <th class="px-4 py-2 text-right text-sm font-medium text-gray-700">
                        Balance
                        </th>
                    </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                    ${payments
                      .map(
                        (row) => `
                        <tr >
                        <td class="px-4 py-2 text-sm text-gray-600">
                            ${row.paymentNumber}
                        </td>
                        <td class="px-4 py-2 text-sm text-gray-600">
                            ${new Intl.DateTimeFormat('en-DE', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            }).format(row.paymentDate)}
                        </td>
                        <td class="px-4 py-2 text-sm text-gray-600 text-right">
                            ${row.payment.toFixed(2)} EUR
                        </td>
                        <td class="px-4 py-2 text-sm text-gray-600 text-right">
                            ${row.interest.toFixed(2)} EUR
                        </td>
                        <td class="px-4 py-2 text-sm text-gray-600 text-right">
                            ${row.principal.toFixed(2)} EUR
                        </td>
                        <td class="px-4 py-2 text-sm text-gray-600 text-right">
                            ${row.remainingBalance.toFixed(2)} EUR
                        </td>
                        </tr>
                    `
                      )
                      .join('')}
                    </tbody>
                </table>
            </div>
        
             
      </body>
    </html>
  `;

    // Launch Puppeteer and generate PDF
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfUint8Array: Uint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 20, bottom: 20, left: 20, right: 20 },
    });

    await browser.close();
    const pdfBuffer = Buffer.from(pdfUint8Array);
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=quote-${id}.pdf`,
      },
    });
  } catch (error) {
    logError({ error: error, url: req.url! });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
