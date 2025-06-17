import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// This middleware checks if the user is authenticated and redirects them accordingly.
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  const url = request.nextUrl;

  // If the user is authenticated, redirect them to the home page
  if (
    token && (
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/forgot-password') ||
    url.pathname.startsWith('/reset-password') ||
    url.pathname.startsWith('/verify-email'))
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If the user is not authenticated, redirect them to the sign-in page
  if (
    !token && (
      url.pathname.startsWith('/cart') ||
      url.pathname.startsWith('/wishlist') ||
      url.pathname.startsWith('/checkout') ||
      url.pathname.startsWith('/account') ||
      url.pathname.startsWith('/admin') ||
      url.pathname.startsWith('/orders') ||
      url.pathname.startsWith('/products') ||
      url.pathname.startsWith('/settings') ||
      url.pathname.startsWith('/profile')
    )
  ) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - auth routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|auth).*)',
  ]
};