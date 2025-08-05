"use client";

import { Body } from "@/components/Body";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const searchParams = useSearchParams();
  const { connectWallet } = useAuth();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");

  useEffect(() => {
    if (searchParams.get("auth-required") === "true") {
      setShowAuthPrompt(true);
      setRedirectPath(searchParams.get("redirect") || "");

      // Auto-hide the prompt after 10 seconds
      const timer = setTimeout(() => {
        setShowAuthPrompt(false);
      }, 10000);

      return () => clearTimeout(timer);
    }

    if (searchParams.get("access-denied") === "true") {
      setShowAccessDenied(true);

      // Auto-hide the access denied message after 5 seconds
      const timer = setTimeout(() => {
        setShowAccessDenied(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleConnect = async () => {
    await connectWallet();
    setShowAuthPrompt(false);
    if (redirectPath) {
      window.location.href = redirectPath;
    }
  };

  return (
    <main className="min-h-screen">
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-orange-600">
                Authentication Required
              </CardTitle>
              <CardDescription>
                You need to connect your wallet to access this page
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Button onClick={handleConnect} className="w-full">
                Connect Wallet
              </Button>
              <Button
                onClick={() => setShowAuthPrompt(false)}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {showAccessDenied && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-red-600">Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access the requested page
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                onClick={() => setShowAccessDenied(false)}
                variant="outline"
                className="w-full"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <Body />
    </main>
  );
}
