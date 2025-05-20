import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

// Define public paths that should be accessible without authentication
const PUBLIC_PATHS = [
   "/",
   "/about",
   "/contact",
   "/companies",
   "/help-center",
   "/login",
   "/signup",
];

// Define role-based path patterns
const ROLE_PATHS: { [key in Role]: string[] } = {
   ADMIN: ["/admin"],
   USER: ["/dashboard"],
   COMPANY_ADMIN: ["/company-admin"],
};

// Define role-specific home pages
const ROLE_HOME_PAGES: { [key in Role]: string } = {
   ADMIN: "/admin",
   USER: "/dashboard",
   COMPANY_ADMIN: "/company-admin",
};

// Simple function to check if a path should be publicly accessible
function isPublicPath(pathname: string): boolean {
   if (PUBLIC_PATHS.includes(pathname)) return true;
   if (pathname.startsWith("/companies/")) return true;
   if (pathname.startsWith("/help-center/details/")) return true;
   // Check for static files that should be accessible
   if (
      pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|json|woff|woff2|ttf|eot)$/)
   ) {
      return true;
   }
   return false;
}

// Simple function to check if a path is an auth page
function isAuthPath(pathname: string): boolean {
   return pathname === "/login" || pathname === "/signup";
}

// Function to check if a path is valid (exists in the app)
function isValidPath(pathname: string): boolean {
   // First check if it's a public path
   if (isPublicPath(pathname)) return true;

   // Then check if it matches any role-specific paths
   return Object.values(ROLE_PATHS).some((paths) =>
      paths.some((path) => pathname.startsWith(path))
   );
}

// Function to check if user has access to a specific path based on their role
function hasRoleBasedAccess(pathname: string, userRole: Role): boolean {
   const userRolePaths = ROLE_PATHS[userRole];
   return userRolePaths.some((path) => pathname.startsWith(path));
}

// Interface for JWT payload
interface JwtPayload {
   id: string;
   role: Role;
   exp?: number;
}

// Function to decode JWT token without crypto verification
function decodeToken(token: string): JwtPayload | null {
   try {
      const decoded = jwtDecode<JwtPayload>(token);

      // Check if token is expired
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
         console.log("Token is expired");
         return null;
      }

      return decoded;
   } catch (error) {
      console.error("Token decode failed:", error);
      return null;
   }
}

export async function middleware(request: NextRequest) {
   console.log("Middleware executing for path:", request.nextUrl.pathname);

   // Get the pathname directly from the request URL
   const pathname = request.nextUrl.pathname;

   // 1. Always allow API routes to bypass the middleware
   if (pathname.startsWith("/api/")) {
      return NextResponse.next();
   }

   // 2. Check if the requested path is valid; otherwise, redirect to /not-found
   if (!isValidPath(pathname)) {
      console.log("Invalid path detected, redirecting to /not-found");
      return NextResponse.rewrite(new URL("/not-found", request.url));
   }

   // 3. Always allow public paths without any other checks
   if (isPublicPath(pathname)) {
      console.log("Public path detected, allowing access");
      return NextResponse.next();
   }

   // 4. Get the token to check authentication status
   const token = request.cookies.get("auth_token")?.value;
   console.log("Token exists:", !!token);

   // 5. If no token exists, redirect to login page for protected routes
   if (!token) {
      console.log("No token found, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
   } // 6. If token exists and user tries to access auth pages, redirect to their role homepage
   if (isAuthPath(pathname)) {
      const decoded = decodeToken(token);
      if (decoded && decoded.role) {
         console.log(
            "Auth path with valid token detected, redirecting to role homepage"
         );
         return NextResponse.redirect(
            new URL(ROLE_HOME_PAGES[decoded.role], request.url)
         );
      }
      // If token is invalid on auth page, allow access
      return NextResponse.next();
   }

   // 7. Decode token and handle role-based access for protected routes
   const decoded = decodeToken(token); // If token is invalid or expired, redirect to login
   if (!decoded) {
      console.log("Invalid or expired token, redirecting to login");
      // Don't delete the token here, let the login page handle it
      return NextResponse.redirect(new URL("/login", request.url));
   }

   const userRole = decoded.role;
   console.log("User role from token:", userRole);

   // Check if role is valid
   if (!(userRole in ROLE_PATHS)) {
      console.error("Invalid role in token:", userRole);
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
   }

   // Check if user is accessing their role-specific paths
   const hasAccess = hasRoleBasedAccess(pathname, userRole);
   console.log("User has access to this path:", hasAccess);

   if (hasAccess) {
      return NextResponse.next();
   }

   // Redirect to role-specific homepage if accessing unauthorized paths
   console.log(
      "Unauthorized access, redirecting to role homepage:",
      ROLE_HOME_PAGES[userRole]
   );
   return NextResponse.redirect(
      new URL(ROLE_HOME_PAGES[userRole], request.url)
   );
}

export const config = {
   matcher: [
      // Match all paths except static files and API routes
      "/((?!_next/static|_next/image|favicon.ico|api/).*)",
   ],
};

// Define Role enum to match Prisma schema
type Role = "USER" | "ADMIN" | "COMPANY_ADMIN";
