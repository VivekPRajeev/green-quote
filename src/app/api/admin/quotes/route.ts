import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value ?? '';
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId =
      typeof decoded === 'object' && 'id' in decoded ? decoded.id : null;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });
    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const band = searchParams.get('band');
    //const limit = parseInt(searchParams.get('limit') || '10', 10);
    // const page = parseInt(searchParams.get('page') || '1', 10);
    const where: any = {};
    if (email) {
      where.user = { email: { contains: email, mode: 'insensitive' } };
    }
    if (name) {
      where.user = {
        ...where.user,
        fullName: { contains: name, mode: 'insensitive' },
      };
    }
    if (band) {
      where.riskBand = band;
    }
    const quotes = await prisma.quote.findMany({
      where,
      select: {
        id: true,
        systemPrice: true,
        riskBand: true,
        systemSizeKw: true,
        createdAt: true,
        user: {
          select: { email: true, fullName: true },
        },
      },
    });

    return NextResponse.json({ data: quotes }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
