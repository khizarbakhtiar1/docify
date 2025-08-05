import { NextRequest, NextResponse } from "next/server";

// Define protected routes and their required roles
const PROTECTED_ROUTES = {
  "/admin": ["super-admin", "admin"],
  "/higher-authority": ["higher-authority"],
  "/institute": ["institute"],
  "/document-submission": ["institute"],
} as const;

// Routes that require any authentication
const AUTH_REQUIRED_ROUTES = [
  "/admin",
  "/higher-authority",
  "/institute",
  "/document-submission",
];

// Public routes that don't need authentication
const PUBLIC_ROUTES = [
  "/",
  "/overview",
  "/contact",
  "/plans",
  "/verify",
  "/login",
  "/register",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and API routes
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".") // Static files like images, css, js
  ) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  const requiresAuth = AUTH_REQUIRED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (requiresAuth) {
    // Check if user has a wallet connected (we'll use a cookie to track this)
    const hasWalletConnected =
      request.cookies.get("wallet-connected")?.value === "true";
    const userRole = request.cookies.get("user-role")?.value;
    const userApproved = request.cookies.get("user-approved")?.value === "true";

    // If no wallet connected, redirect to home with authentication required message
    if (!hasWalletConnected) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("auth-required", "true");
      url.searchParams.set("redirect", pathname);

      // Add a custom header to indicate this is an auth redirect
      const response = NextResponse.redirect(url);
      response.headers.set("X-Auth-Redirect", "true");
      return response;
    }

    // Check role-based access
    const requiredRoles = Object.entries(PROTECTED_ROUTES).find(([route]) =>
      pathname.startsWith(route)
    )?.[1];

    if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("access-denied", "true");
      return NextResponse.redirect(url);
    }

    // Check approval requirement for institute and higher-authority
    if (
      (userRole === "institute" || userRole === "higher-authority") &&
      !userApproved
    ) {
      if (!pathname.includes("?status=pending")) {
        const url = request.nextUrl.clone();
        url.searchParams.set("status", "pending");
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
