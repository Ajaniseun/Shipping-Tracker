import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow next internals, static files, and auth endpoints
  if (pathname.startsWith('/_next') || pathname.startsWith('/api/auth') || pathname.startsWith('/static') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const isManagerRoute = pathname === '/manager' || pathname.startsWith('/manager/');
  const isManagerLogin = pathname === '/manager/login' || pathname.startsWith('/manager/login');
  const isShipmentsApiWrite = pathname.startsWith('/api/shipments') && request.method !== 'GET';

  if (!isManagerRoute && !isShipmentsApiWrite) {
    return NextResponse.next();
  }

  // Allow the manager login page to be visited without a session to avoid redirect loops
  if (isManagerLogin) return NextResponse.next();

  const session = request.cookies.get('manager_session') ?? null;
  if (!session) {
    const loginUrl = new URL('/manager/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/manager/:path*', '/api/shipments/:path*'],
};
