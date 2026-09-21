import { NextRequest, NextResponse } from 'next/server';

const AUTH_PAGES = ['/login', '/register'];
const PUBLIC_PAGES = ['/', '/tentang-kami'];

function decodeRole(token: string): 'ADMIN' | 'NASABAH' | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('sisa_token')?.value;

  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));
  const isPublicPage = PUBLIC_PAGES.some((p) => pathname === p || pathname.startsWith(p + '/'));

  // Jika belum login dan bukan halaman publik atau halaman auth -> arahkan ke /login
  if (!token && !isAuthPage && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    const role = decodeRole(token);

    // Sudah login tapi buka /login atau /register -> lempar ke dashboard sesuai role
    if (isAuthPage) {
      return NextResponse.redirect(
        new URL(role === 'ADMIN' ? '/admin/dashboard' : '/dashboard', request.url),
      );
    }

    // Nasabah akses admin -> lempar ke dashboard
    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Admin tidak perlu akses halaman Nasabah (kecuali halaman publik seperti '/' dan '/tentang-kami')
    if (!pathname.startsWith('/admin') && role === 'ADMIN' && !isPublicPage) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
