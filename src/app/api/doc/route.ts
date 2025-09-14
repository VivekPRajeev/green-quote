import { NextRequest, NextResponse } from 'next/server';
import { openApiSpec } from '@/lib/openapi';

export async function GET(req: NextRequest) {
  return NextResponse.json(openApiSpec);
}
