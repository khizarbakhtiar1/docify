"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface RouteGuardConfig {
  allowedRoles: UserRole[];
  requireApproval?: boolean;
  redirectTo?: string;
}

/**
 * Hook to guard routes based on user authentication and authorization
 * This provides an additional layer of security on top of middleware
 */
export const useRouteGuard = ({
  allowedRoles,
  requireApproval = true,
  redirectTo = "/",
}: RouteGuardConfig) => {
  const { user, isConnected, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;

    // If not connected, redirect with auth required
    if (!isConnected) {
      const url = new URL(redirectTo, window.location.origin);
      url.searchParams.set("auth-required", "true");
      url.searchParams.set("redirect", pathname);
      router.replace(url.toString());
      return;
    }

    // If no user data, wait for it to load
    if (!user) return;

    // Check role authorization
    if (!allowedRoles.includes(user.role)) {
      const url = new URL(redirectTo, window.location.origin);
      url.searchParams.set("access-denied", "true");
      router.replace(url.toString());
      return;
    }

    // Check approval requirement
    if (
      requireApproval &&
      !user.isApproved &&
      (user.role === "higher-authority" || user.role === "institute")
    ) {
      // If already on the same route with pending status, don't redirect
      if (!pathname.includes("status=pending")) {
        const url = new URL(pathname, window.location.origin);
        url.searchParams.set("status", "pending");
        router.replace(url.toString());
      }
      return;
    }
  }, [
    user,
    isConnected,
    isLoading,
    allowedRoles,
    requireApproval,
    redirectTo,
    router,
    pathname,
  ]);

  return {
    isAuthorized:
      !isLoading &&
      isConnected &&
      user &&
      allowedRoles.includes(user.role) &&
      (!requireApproval ||
        user.isApproved ||
        (user.role !== "higher-authority" && user.role !== "institute")),
    isLoading,
    user,
  };
};
