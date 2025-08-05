"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  requireApproval?: boolean;
  fallbackRoute?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireApproval = true,
  fallbackRoute = "/",
}) => {
  const { user, isLoading, isConnected, connectWallet, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isConnected) {
      // Add a small delay to prevent race conditions with auth state
      const timer = setTimeout(() => {
        const url = new URL(fallbackRoute, window.location.origin);
        url.searchParams.set("auth-required", "true");
        url.searchParams.set("redirect", window.location.pathname);
        router.replace(url.toString());
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isConnected, router, fallbackRoute]);

  // Always show loading first to prevent flashing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Block rendering if not connected - middleware should have caught this
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please connect your wallet to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={connectWallet} className="w-full">
              Connect Wallet
            </Button>
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error state
  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={connectWallet} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check user role authorization
  if (user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-orange-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-sm text-gray-600">
              <p>
                Your role:{" "}
                <span className="font-medium capitalize">{user.role}</span>
              </p>
              <p>
                Required roles:{" "}
                <span className="font-medium">{allowedRoles.join(", ")}</span>
              </p>
            </div>
            <Button onClick={() => router.push("/")} variant="outline">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check approval requirement
  if (
    user &&
    requireApproval &&
    !user.isApproved &&
    (user.role === "higher-authority" || user.role === "institute")
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-yellow-600">Approval Pending</CardTitle>
            <CardDescription>Your account is pending approval</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-sm text-gray-600">
              {user.role === "higher-authority" && (
                <p>
                  Your higher authority registration is being reviewed by
                  administrators.
                </p>
              )}
              {user.role === "institute" && (
                <p>
                  Your institute registration is being reviewed by your higher
                  authority.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full"
              >
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authorized, render children
  return <>{children}</>;
};

// Convenience components for specific roles
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute allowedRoles={["super-admin", "admin"]}>
    {children}
  </ProtectedRoute>
);

export const HigherAuthorityRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute allowedRoles={["higher-authority"]} requireApproval={true}>
    {children}
  </ProtectedRoute>
);

export const InstituteRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute allowedRoles={["institute"]} requireApproval={true}>
    {children}
  </ProtectedRoute>
);

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute
    allowedRoles={[
      "user",
      "unregistered",
      "super-admin",
      "admin",
      "higher-authority",
      "institute",
    ]}
    requireApproval={false}
  >
    {children}
  </ProtectedRoute>
);
