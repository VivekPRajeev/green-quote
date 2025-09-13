import { NextRequest, NextResponse } from 'next/server';
import { Prisma, PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value ?? '';
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  const userId =
    typeof decoded === 'object' && 'id' in decoded ? decoded.id : null;
  try {
    const userDetails = await prisma.user.findUnique({
      where: { id: userId || undefined },
      select: {
        id: true,
        email: true,
        fullName: true,
        isAdmin: true,
      } as Prisma.UserSelect,
    });
    if (!userDetails) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ data: userDetails, status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
