"use client";
import React, { useState } from "react";
import Image from "next/image";
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
import Link from "next/link";

export function DocumentVerificationForm() {
  const [showResults, setShowResults] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [tokenId, setTokenId] = useState("");
  const [isValidFormat, setIsValidFormat] = useState(true);

  const validateTokenId = (value: string) => {
    const pattern = /^[A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12}$/;
    return pattern.test(value);
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setTokenId(value);
    if (value.length > 0) {
      setIsValidFormat(validateTokenId(value));
    } else {
      setIsValidFormat(true);
    }
  };

  const handleVerifyClick = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateTokenId(tokenId)) {
      setIsValidFormat(false);
      return;
    }
    
    setIsVerifying(true);
    
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsVerifying(false);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen gradient-background py-12 px-4">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-slide-up">
            <h1 className="text-4xl font-bold heading-gradient mb-4">
              Document Verification
            </h1>
            <p className="subheading-muted max-w-2xl mx-auto">
              Instantly verify the authenticity of any digital credential or certificate issued through our blockchain-secured platform
            </p>
          </div>

          <Card className="glass-card shadow-2xl animate-scale-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-semibold text-gray-800 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                Verify Authenticity
              </CardTitle>
              <CardDescription className="text-gray-600">
                Enter your document&apos;s unique token ID to verify its authenticity and view details
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <form className="space-y-6" onSubmit={handleVerifyClick}>
                <div className="space-y-3">
                  <Label htmlFor="token" className="text-sm font-medium text-gray-700">
                    Document Token ID *
                  </Label>
                  <div className="relative">
                    <Input
                      id="token"
                      type="text"
                      placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                      value={tokenId}
                      onChange={handleTokenChange}
                      required
                      className={`input-modern font-mono text-center text-lg py-4 ${
                        !isValidFormat && tokenId.length > 0 ? 'border-red-300 focus:ring-red-500' : ''
                      }`}
                    />
                    {tokenId.length > 0 && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {isValidFormat ? (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {!isValidFormat && tokenId.length > 0 && (
                    <p className="text-red-500 text-sm flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                      Invalid token format. Please enter a valid token ID.
                    </p>
                  )}
                  <p className="text-xs text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    Token ID is found on your digital certificate or document
                  </p>
                </div>

                <Button 
                  type="submit" 
                  disabled={isVerifying || !isValidFormat || tokenId.length === 0}
                  className="btn-gradient w-full py-4 text-lg font-medium"
                >
                  {isVerifying ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Verifying Document...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      Verify Document
                    </div>
                  )}
                </Button>
              </form>

              {/* Sample Token for Demo */}
              <div className="text-center py-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Try with sample token:</p>
                <button 
                  onClick={() => setTokenId("ABC12345-DEF6-789G-HIJ0-123456789KLM")}
                  className="text-blue-600 hover:text-blue-700 font-mono text-sm bg-blue-50 px-3 py-1 rounded transition-colors duration-200"
                >
                  ABC12345-DEF6-789G-HIJ0-123456789KLM
                </button>
              </div>
            </CardContent>

            {showResults && (
              <CardFooter className="border-t border-gray-200 mt-6">
                <div className="w-full space-y-6 animate-slide-up">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce-in">
                      <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-green-600 mb-2">✅ Document Verified</h3>
                    <p className="text-gray-600">This document is authentic and has been verified on the blockchain</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        Document Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Document Owner:</span>
                          <span className="font-medium">John Doe</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Document Type:</span>
                          <span className="font-medium">Bachelor&apos;s Degree</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Issuing Institute:</span>
                          <span className="font-medium">University of Technology</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Issuance Date:</span>
                          <span className="font-medium">May 15, 2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="status-success">Verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        Blockchain Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Blockchain:</span>
                          <span className="font-medium">Ethereum</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Token Standard:</span>
                          <span className="font-medium">ERC-721</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Approving Authority:</span>
                          <span className="font-medium">Dr. Jane Smith</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Verified:</span>
                          <span className="font-medium">Just now</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <Image
                          src="/placeholder-qrcode.svg"
                          width={80}
                          height={80}
                          alt="Document QR Code"
                          className="mx-auto mb-2"
                        />
                        <p className="text-xs text-gray-500">QR Code</p>
                      </div>
                      <Link
                        href="#"
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 flex items-center"
                        prefetch={false}
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                        </svg>
                        Share Document
                      </Link>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="hover-lift">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                        Download Certificate
                      </Button>
                      <Button 
                        onClick={() => {setShowResults(false); setTokenId("");}}
                        className="btn-gradient-secondary"
                      >
                        Verify Another
                      </Button>
                    </div>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>

          <div className="text-center mt-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Instant Verification</h3>
                <p className="text-sm text-gray-600">Get results in seconds using blockchain technology</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Tamper-Proof</h3>
                <p className="text-sm text-gray-600">Documents secured by immutable blockchain records</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">Globally Trusted</h3>
                <p className="text-sm text-gray-600">Accepted worldwide by institutions and employers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
