import { ZodError, ZodSchema } from 'zod';
import { NextResponse } from 'next/server';

export function zodBadRequest(err: ZodError) {
  const issues = err.issues.map((e) => ({
    path: e.path.join('.'),
    message: e.message,
  }));
  return NextResponse.json(
    { error: 'Validation Failed', issues },
    { status: 400 }
  );
}

export async function parseJsonBody(req: Request) {
  try {
    // NextRequest also supports req.json()
    return await req.json();
  } catch {
    return null;
  }
}

/**
 * Generic safe validator helper for schemas that returns:
 * { ok: true, data } or { ok: false, res: NextResponse }
 */
export function validateWith<T>(
  schema: ZodSchema<T>,
  value: unknown,
  url = ''
): { ok: true; data: T } | { ok: false; res: NextResponse } {
  const parsed = schema.safeParse(value);
  if (parsed.success) return { ok: true, data: parsed.data };
  return { ok: false, res: zodBadRequest(parsed.error) };
}
