import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const password = String(body.password ?? '');
  const expected = process.env.MANAGER_PASSWORD || 'changeme';

  if (password !== expected) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.headers.set('Set-Cookie', 'manager_session=1; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax');
  return res;
}
