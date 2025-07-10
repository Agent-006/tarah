import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define route categories
const PUBLIC_ROUTES = [
  '/', '/products', '/products/[slug]', '/categories', '/categories/[slug]',
  '/search', '/sign-in', '/sign-up', '/forgot-password',
  '/reset-password', '/verify-email', '/admin/sign-in'
];

const ADMIN_PROTECTED_ROUTES = [
  '/admin/dashboard', '/admin/products', '/admin/products/[id]', '/admin/orders',
  '/admin/orders/[id]', '/admin/customers', '/admin/customers/[id]',
  '/admin/categories', '/admin/promotions', '/admin/reports', '/admin/settings'
];

const CUSTOMER_PROTECTED_ROUTES = [
  '/cart', '/wishlist', '/checkout', '/profile', '/orders',
  '/order[id]', '/settings', '/payment-methods', '/addresses'
];

const SHARED_AUTH_ROUTES = [
  '/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/verify-email'
];

const ADMIN_SIGN_IN_ROUTE = '/admin/sign-in';
const CUSTOMER_SIGN_IN_ROUTE = '/sign-in';
const HOME_ROUTE = '/';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // ✅ Critical: Allow unauthenticated access to /admin/sign-in
  if (pathname === ADMIN_SIGN_IN_ROUTE) {
    console.log("✅ Allowing unauthenticated access to /admin/sign-in");
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === 'production',
  });

  console.log('Incoming path:', pathname);
  console.log('Token exists?', !!token);
  console.log('Token role:', JSON.stringify(token?.role));
  const callback = request.nextUrl.searchParams.get("callbackUrl");
  console.log('Callback URL:', callback);

  // Skip middleware for static files and API routes
  if (shouldSkipMiddleware(pathname)) {
    return NextResponse.next();
  }

  // Public routes
  if (isPublicRoute(pathname)) {
    return handlePublicRouteAccess(request, token, pathname);
  }

  // Admin routes
  if (isAdminRoute(pathname)) {
    return handleAdminRouteAccess(request, token, pathname);
  }

  // Customer protected routes
  if (isCustomerProtectedRoute(pathname)) {
    return handleCustomerRouteAccess(request, token);
  }

  return NextResponse.next();
}

// Helpers
function shouldSkipMiddleware(pathname: string): boolean {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico)$/.test(pathname)
  );
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route =>
    pathname === route ||
    pathname.startsWith(route.replace(/\[.*?\]/, '')) ||
    pathname === '/'
  );
}


function isAdminRoute(pathname: string): boolean {
  // Protect all /admin routes except /admin/sign-in and /admin/api
  return (
    pathname.startsWith('/admin') &&
    pathname !== ADMIN_SIGN_IN_ROUTE &&
    !pathname.startsWith('/admin/api')
  );
}


function isCustomerProtectedRoute(pathname: string): boolean {
  // Protect all customer routes and their subpaths
  return CUSTOMER_PROTECTED_ROUTES.some(route => {
    const base = route.replace(/\[.*?\]/, '');
    return pathname === base || pathname.startsWith(base + '/') || pathname === route;
  });
}

// Route Handlers
function handlePublicRouteAccess(request: NextRequest, token: any, pathname: string): NextResponse {
  if (token && SHARED_AUTH_ROUTES.includes(pathname)) {
    const redirectPath = token.role === 'ADMIN' ? ADMIN_PROTECTED_ROUTES[0] : HOME_ROUTE;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }
  return NextResponse.next();
}

function handleAdminRouteAccess(request: NextRequest, token: any, pathname: string): NextResponse {
  if (!token || token.role !== 'ADMIN') {
    // Only allow admins
    const signInUrl = new URL(ADMIN_SIGN_IN_ROUTE, request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
}

function handleCustomerRouteAccess(request: NextRequest, token: any): NextResponse {
  if (!token || token.role !== 'CUSTOMER') {
    // Only allow customers
    return NextResponse.redirect(new URL(CUSTOMER_SIGN_IN_ROUTE, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ]
};
