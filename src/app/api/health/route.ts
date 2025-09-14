import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logError, logRequest } from '@/utils/logger';

export async function GET() {
  try {
    logRequest({ method: 'GET', url: '/api/health' });
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: 'ok',
      db: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    logError({ error: err, url: '/api/health' });
    return NextResponse.json(
      { status: 'error', db: 'disconnected', error: String(err) },
      { status: 500 }
    );
  }
}
