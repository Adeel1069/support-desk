import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { prisma } from "./lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "./generated/prisma";
import {
  protectedPreFixes,
  protectedRoutes,
  publicRoutes,
} from "./lib/constants";

const isProtectedRoute = createRouteMatcher(protectedRoutes);
const isPublicRoute = createRouteMatcher(publicRoutes);

function redirectToDashboard(role: Role, req: NextRequest) {
  return NextResponse.redirect(
    new URL(`${role.toLowerCase()}/dashboard`, req.nextUrl.origin)
  );
}

function isAccessingOtherRoleArea(role: Role, path: string): boolean {
  return (
    (role !== Role.ADMIN && path.startsWith(protectedPreFixes.admin)) ||
    (role !== Role.AGENT && path.startsWith(protectedPreFixes.agent)) ||
    (role !== Role.USER && path.startsWith(protectedPreFixes.user))
  );
}

export default clerkMiddleware(async (auth, req) => {
  const { isAuthenticated, redirectToSignIn, userId } = await auth();

  // If trying to access protect routes without authentication
  if (!isAuthenticated && isProtectedRoute(req)) {
    return redirectToSignIn();
  }
  if (userId && isAuthenticated) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (user) {
      // If trying to access public routes after authentication
      if (isPublicRoute(req)) {
        return redirectToDashboard(user.role, req);
      }
      // If trying to access another role's area
      const path = req.nextUrl.pathname;
      if (isAccessingOtherRoleArea(user.role, path)) {
        return redirectToDashboard(user.role, req);
      }
    }
  }
});

export const config = {
  runtime: "nodejs",
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
