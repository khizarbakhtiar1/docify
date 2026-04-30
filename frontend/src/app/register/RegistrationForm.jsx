"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function Register() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("institute");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    instituteType: "",
    higherAuthority: "",
    authorityType: "",
    jurisdiction: "",
  });

  useEffect(() => {
    const fetchWalletAddress = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
          }
        } catch (error) {
          console.error("Error fetching wallet address:", error);
        }
      }
    };
    fetchWalletAddress();
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      if (window.ethereum) {
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Will be replaced with actual blockchain calls in Step 4
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Registration successful! Welcome to Docify as a ${activeTab === "institute" ? "Institute" : "Higher Authority"}.`);
      window.location.href = "/";
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.name && formData.email && walletAddress && 
           (activeTab === "institute" ? 
             (formData.instituteType && formData.higherAuthority) : 
             (formData.authorityType && formData.jurisdiction));
  };

  return (
    <div className="min-h-screen gradient-background py-12 px-4">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-4xl font-bold heading-gradient mb-4">
              Join Docify
            </h1>
            <p className="subheading-muted">
              Register as an educational institute or higher authority to start issuing and verifying digital credentials
            </p>
          </div>

          <Card className="glass-card shadow-2xl animate-scale-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-gray-600">
                Choose your role and complete the registration process
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {!isConnected ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 animate-pulse-soft">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13z"/>
                      <path d="M7 10h10v4H7z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-600 mb-6">
                    Connect your wallet to complete the registration process securely
                  </p>
                  <Button 
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="btn-gradient px-8 py-3"
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
                <div className="animate-slide-up">
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                      <TabsTrigger value="institute" className="text-center">
                        🏫 Institute
                      </TabsTrigger>
                      <TabsTrigger value="authority" className="text-center">
                        🏛️ Higher Authority
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="institute" className="space-y-6 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Institution Name *
                          </Label>
                          <Input
                            id="name"
                            placeholder="Enter institution name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="input-modern"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Official Email *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="institution@domain.edu"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="input-modern"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="wallet" className="text-sm font-medium text-gray-700">
                          Wallet Address
                        </Label>
                        <div className="relative">
                          <Input 
                            id="wallet" 
                            value={walletAddress} 
                            readOnly 
                            className="input-modern font-mono text-sm pr-12"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-soft"></div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="institute-type" className="text-sm font-medium text-gray-700">
                            Institution Type *
                          </Label>
                          <Select 
                            value={formData.instituteType}
                            onValueChange={(value) => handleInputChange("instituteType", value)}
                          >
                            <SelectTrigger className="input-modern">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="university">🎓 University</SelectItem>
                              <SelectItem value="college">🏫 College</SelectItem>
                              <SelectItem value="school">🏫 School</SelectItem>
                              <SelectItem value="training">📚 Training Center</SelectItem>
                              <SelectItem value="other">🏢 Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="higher-authority" className="text-sm font-medium text-gray-700">
                            Higher Authority *
                          </Label>
                          <Select 
                            value={formData.higherAuthority}
                            onValueChange={(value) => handleInputChange("higherAuthority", value)}
                          >
                            <SelectTrigger className="input-modern">
                              <SelectValue placeholder="Select authority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="authority1">Ministry of Education</SelectItem>
                              <SelectItem value="authority2">University Grants Commission</SelectItem>
                              <SelectItem value="authority3">State Education Board</SelectItem>
                              <SelectItem value="authority4">Accreditation Council</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="authority" className="space-y-6 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="auth-name" className="text-sm font-medium text-gray-700">
                            Authority Name *
                          </Label>
                          <Input
                            id="auth-name"
                            placeholder="Enter authority name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="input-modern"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="auth-email" className="text-sm font-medium text-gray-700">
                            Official Email *
                          </Label>
                          <Input
                            id="auth-email"
                            type="email"
                            placeholder="authority@gov.edu"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="input-modern"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="auth-wallet" className="text-sm font-medium text-gray-700">
                          Wallet Address
                        </Label>
                        <div className="relative">
                          <Input 
                            id="auth-wallet" 
                            value={walletAddress} 
                            readOnly 
                            className="input-modern font-mono text-sm pr-12"
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-soft"></div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="authority-type" className="text-sm font-medium text-gray-700">
                            Authority Type *
                          </Label>
                          <Select 
                            value={formData.authorityType}
                            onValueChange={(value) => handleInputChange("authorityType", value)}
                          >
                            <SelectTrigger className="input-modern">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="government">🏛️ Government Body</SelectItem>
                              <SelectItem value="accreditation">✅ Accreditation Council</SelectItem>
                              <SelectItem value="regulatory">📋 Regulatory Authority</SelectItem>
                              <SelectItem value="international">🌐 International Organization</SelectItem>
                              <SelectItem value="other">🏢 Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jurisdiction" className="text-sm font-medium text-gray-700">
                            Jurisdiction *
                          </Label>
                          <Input
                            id="jurisdiction"
                            placeholder="e.g., National, State, Regional"
                            value={formData.jurisdiction}
                            onChange={(e) => handleInputChange("jurisdiction", e.target.value)}
                            className="input-modern"
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>

            {isConnected && (
              <CardFooter className="pt-0">
                <form onSubmit={handleSubmit} className="w-full">
                  <Button 
                    type="submit" 
                    disabled={isLoading || !isFormValid()}
                    className="btn-gradient w-full py-3 text-base font-medium"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Creating Account...
                      </div>
                    ) : (
                      `Register as ${activeTab === "institute" ? "Institute" : "Higher Authority"}`
                    )}
                  </Button>
                </form>
              </CardFooter>
            )}
          </Card>

          <div className="text-center mt-8 animate-slide-up">
            <p className="text-gray-600">
              Already registered?{" "}
              <Link 
                href="/" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Go to Dashboard
              </Link>
            </p>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-center space-x-8 text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Blockchain Secured
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Instantly Verifiable
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Globally Trusted
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
