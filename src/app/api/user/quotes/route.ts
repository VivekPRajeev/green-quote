import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId =
      typeof decoded === 'object' && 'id' in decoded ? decoded.id : null;
    if (!userId) {
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
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user, quotes }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
