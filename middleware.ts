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
  '/orders/[id]', '/settings', '/payment-methods', '/addresses'
];

const SHARED_AUTH_ROUTES = [
  '/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/verify-email'
];

const ADMIN_SIGN_IN_ROUTE = '/admin/sign-in';
const CUSTOMER_SIGN_IN_ROUTE = '/sign-in';
const HOME_ROUTE = '/';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  console.log('🚀 MIDDLEWARE TRIGGERED for path:', pathname);
  
  // Skip middleware for static files and API routes first
  if (shouldSkipMiddleware(pathname)) {
    console.log('⏭️ Skipping middleware for:', pathname);
    return NextResponse.next();
  }

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

  // Check if this is an admin protected route
  if (isAdminRoute(pathname)) {
    return handleAdminRouteAccess(request, token, pathname);
  }

  // Check if this is a customer protected route
  if (isCustomerProtectedRoute(pathname)) {
    return handleCustomerRouteAccess(request, token, pathname);
  }

  // Handle public routes (including auth pages)
  if (isPublicRoute(pathname)) {
    return handlePublicRouteAccess(request, token, pathname);
  }

  // Default: allow access for any other routes
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

function handlePublicRouteAccess(request: NextRequest, token: { role?: string } | null, pathname: string): NextResponse {
  if (token && SHARED_AUTH_ROUTES.includes(pathname)) {
    // If admin, always redirect to admin dashboard
    if (token.role === 'ADMIN') {
      return NextResponse.redirect(new URL(ADMIN_PROTECTED_ROUTES[0], request.url));
    }
    // If customer, always redirect to home
    if (token.role === 'CUSTOMER') {
      return NextResponse.redirect(new URL(HOME_ROUTE, request.url));
    }
  }
  return NextResponse.next();
}



function handleAdminRouteAccess(request: NextRequest, token: { role?: string } | null, pathname: string): NextResponse {
  console.log('🔒 Admin route access check:', { pathname, hasToken: !!token, role: token?.role });
  
  // Block unauthenticated users - redirect to admin sign-in
  if (!token) {
    console.log('❌ No token - redirecting to admin sign-in');
    const signInUrl = new URL(ADMIN_SIGN_IN_ROUTE, request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }
  
  // Block customers - redirect to home
  if (token.role === 'CUSTOMER') {
    console.log('❌ Customer trying to access admin route - redirecting to home');
    return NextResponse.redirect(new URL(HOME_ROUTE, request.url));
  }
  
  // Block users with invalid/missing role - redirect to admin sign-in
  if (token.role !== 'ADMIN') {
    console.log('❌ Invalid role for admin route - redirecting to admin sign-in');
    const signInUrl = new URL(ADMIN_SIGN_IN_ROUTE, request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }
  
  // Allow admin access
  console.log('✅ Admin access granted');
  return NextResponse.next();
}


function handleCustomerRouteAccess(request: NextRequest, token: { role?: string } | null, pathname: string): NextResponse {
  console.log('🛒 Customer route access check:', { pathname, hasToken: !!token, role: token?.role });
  
  // Block unauthenticated users - redirect to customer sign-in
  if (!token) {
    console.log('❌ No token - redirecting to customer sign-in');
    return NextResponse.redirect(new URL(CUSTOMER_SIGN_IN_ROUTE, request.url));
  }
  
  // Block admins - redirect to home
  if (token.role === 'ADMIN') {
    console.log('❌ Admin trying to access customer route - redirecting to home');
    return NextResponse.redirect(new URL(HOME_ROUTE, request.url));
  }
  
  // Block users with invalid/missing role - redirect to customer sign-in
  if (token.role !== 'CUSTOMER') {
    console.log('❌ Invalid role for customer route - redirecting to customer sign-in');
    return NextResponse.redirect(new URL(CUSTOMER_SIGN_IN_ROUTE, request.url));
  }
  
  // Allow customer access
  console.log('✅ Customer access granted');
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files, images, and API routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    // Explicitly include admin routes
    '/admin/:path*',
    // Explicitly include customer protected routes
    '/cart',
    '/wishlist', 
    '/checkout',
    '/profile',
    '/orders/:path*',
    '/settings',
    '/payment-methods',
    '/addresses'
  ]
};
