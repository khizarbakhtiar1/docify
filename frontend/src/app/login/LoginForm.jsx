"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchWalletAddress = async () => {
      try {
        if (typeof window.ethereum !== "undefined") {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
          }
        }
      } catch (error) {
        console.error("Error fetching wallet address:", error);
      }
    };
    fetchWalletAddress();
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      } else {
        alert("Please install MetaMask to connect your wallet");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const lowerCaseWalletAddress = walletAddress.toLowerCase();

      // Simulate loading for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (lowerCaseWalletAddress === "0x3baf151492c11e3a883192ad635c27d9a1eb88b2") {
        window.location.href = "/admin";
      } else if (lowerCaseWalletAddress === "0x8f2d5bdb4f7c380e05acea2950de9d03d9e75f4f") {
        window.location.href = "/institute";
      } else if (lowerCaseWalletAddress === "0x82a0a98658ba88d518f430eacb1d72e8be4046c7") {
        window.location.href = "/higher-authority";
      } else {
        alert("Wallet address not recognized. Please register first or contact support.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-background py-12 px-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold heading-gradient mb-2">
            Welcome Back
          </h1>
          <p className="subheading-muted">
            Connect your wallet to access your dashboard
          </p>
        </div>

        <Card className="glass-card shadow-2xl animate-fade-in">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Secure Login
            </CardTitle>
            <CardDescription className="text-gray-600">
              Authentication via blockchain wallet
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="wallet-address" className="text-sm font-medium text-gray-700">
                Wallet Address
              </Label>
              
              {!isConnected ? (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4 animate-pulse-soft">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13z"/>
                        <path d="M7 10h10v4H7z"/>
                      </svg>
                    </div>
                    <p className="text-gray-600 mb-4">Connect your wallet to continue</p>
                  </div>
                  <Button 
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="btn-gradient w-full py-3"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Connecting...
                      </div>
                    ) : (
                      "Connect Wallet"
                    )}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Input
                      id="wallet-address"
                      value={walletAddress}
                      readOnly
                      className="input-modern font-mono text-sm pr-12"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-soft"></div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-green-600 mt-2">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    Wallet Connected
                  </div>
                </>
              )}
            </div>
          </CardContent>

          {isConnected && (
            <CardFooter className="pt-0">
              <form onSubmit={handleSubmit} className="w-full">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="btn-gradient w-full py-3 text-base font-medium"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Authenticating...
                    </div>
                  ) : (
                    "Access Dashboard"
                  )}
                </Button>
              </form>
            </CardFooter>
          )}
        </Card>

        <div className="text-center mt-8 animate-slide-up">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <Link 
              href="/register" 
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
            >
              Register here
            </Link>
          </p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Secure • Decentralized • Trusted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
