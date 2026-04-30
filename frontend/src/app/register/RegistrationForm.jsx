"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { TransactionStatus } from "@/components/TransactionStatus";
import { useAuth } from "@/contexts/AuthContext";
import { useContractWrite } from "@/hooks/useContractWrite";
import {
  registerInstitute,
  registerHigherAuthority,
  getApprovedHigherAuthorities,
} from "@/services";

export function Register() {
  const router = useRouter();
  const { isConnected, address, connectWallet, user, refreshUserData, isLoading: authLoading } = useAuth();
  const { execute, state: txState, txHash, error: txError, reset: txReset } = useContractWrite();

  const [activeTab, setActiveTab] = useState("institute");
  const [instituteName, setInstituteName] = useState("");
  const [authorityName, setAuthorityName] = useState("");
  const [selectedAuthority, setSelectedAuthority] = useState("");
  const [approvedAuthorities, setApprovedAuthorities] = useState([]);
  const [loadingAuthorities, setLoadingAuthorities] = useState(false);
  const [formError, setFormError] = useState(null);

  // Fetch approved higher authorities for the institute dropdown
  useEffect(() => {
    const fetchAuthorities = async () => {
      setLoadingAuthorities(true);
      try {
        const authorities = await getApprovedHigherAuthorities();
        setApprovedAuthorities(authorities);
      } catch (err) {
        console.error("Error fetching authorities:", err);
        // Non-fatal — dropdown will be empty with a message
      } finally {
        setLoadingAuthorities(false);
      }
    };
    fetchAuthorities();
  }, []);

  // Redirect if already registered
  useEffect(() => {
    if (user && user.role !== "unregistered" && user.role !== "user") {
      const rolePages = {
        "super-admin": "/admin",
        admin: "/admin",
        "higher-authority": "/higher-authority",
        institute: "/institute",
      };
      const target = rolePages[user.role];
      if (target) {
        router.push(target);
      }
    }
  }, [user, router]);

  const handleSubmitInstitute = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!instituteName.trim() || instituteName.trim().length < 3) {
      setFormError("Institute name must be at least 3 characters.");
      return;
    }
    if (!selectedAuthority) {
      setFormError("Please select a Higher Authority.");
      return;
    }

    const receipt = await execute(() =>
      registerInstitute(instituteName.trim(), selectedAuthority)
    );

    if (receipt) {
      // Refresh role — user is now a pending institute
      await refreshUserData();
    }
  };

  const handleSubmitAuthority = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!authorityName.trim() || authorityName.trim().length < 3) {
      setFormError("Authority name must be at least 3 characters.");
      return;
    }

    const receipt = await execute(() =>
      registerHigherAuthority(authorityName.trim())
    );

    if (receipt) {
      // Refresh role — user is now a pending higher authority
      await refreshUserData();
    }
  };

  const truncateAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
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
              Register as an educational institute or higher authority to start
              issuing and verifying digital credentials on the blockchain
            </p>
          </div>

          <Card className="glass-card shadow-2xl animate-scale-in">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Create Your Account
              </CardTitle>
              <CardDescription className="text-gray-600">
                Choose your role and complete the on-chain registration
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {!isConnected ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 animate-pulse-soft">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Connect Your Wallet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Connect your wallet to register on the blockchain
                  </p>
                  <Button
                    onClick={connectWallet}
                    disabled={authLoading}
                    className="btn-gradient px-8 py-3"
                  >
                    {authLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Connecting...
                      </div>
                    ) : (
                      "Connect Wallet"
                    )}
                  </Button>
                </div>
              ) : (
                <div className="animate-slide-up">
                  {/* Already registered notice */}
                  {user && user.role !== "unregistered" && user.role !== "user" && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-6">
                      <p className="text-sm text-blue-800">
                        You are already registered as <strong>{user.role}</strong>.
                        {!user.isApproved && " Your registration is pending approval."}
                      </p>
                    </div>
                  )}

                  <Tabs
                    value={activeTab}
                    onValueChange={(val) => {
                      setActiveTab(val);
                      setFormError(null);
                      txReset();
                    }}
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

                    {/* ── Institute Registration Tab ────────────────── */}
                    <TabsContent
                      value="institute"
                      className="space-y-6 animate-fade-in"
                    >
                      <form onSubmit={handleSubmitInstitute} className="space-y-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="inst-name"
                            className="text-sm font-medium text-gray-700"
                          >
                            Institution Name *
                          </Label>
                          <Input
                            id="inst-name"
                            placeholder="Enter institution name"
                            value={instituteName}
                            onChange={(e) => setInstituteName(e.target.value)}
                            className="input-modern"
                            minLength={3}
                            required
                          />
                          <p className="text-xs text-gray-500">
                            This name will be stored on the blockchain and cannot be changed.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="wallet"
                            className="text-sm font-medium text-gray-700"
                          >
                            Wallet Address
                          </Label>
                          <div className="relative">
                            <Input
                              id="wallet"
                              value={address || ""}
                              readOnly
                              className="input-modern font-mono text-sm pr-12"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-soft" />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="higher-authority"
                            className="text-sm font-medium text-gray-700"
                          >
                            Higher Authority *
                          </Label>
                          {loadingAuthorities ? (
                            <div className="flex items-center gap-2 p-3 border rounded-lg bg-gray-50">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                              <span className="text-sm text-gray-500">
                                Loading authorities from blockchain...
                              </span>
                            </div>
                          ) : approvedAuthorities.length === 0 ? (
                            <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                              <p className="text-sm text-yellow-800">
                                No approved Higher Authorities found on-chain. 
                                An authority must be registered and approved before institutes can register.
                              </p>
                            </div>
                          ) : (
                            <Select
                              value={selectedAuthority}
                              onValueChange={setSelectedAuthority}
                            >
                              <SelectTrigger className="input-modern">
                                <SelectValue placeholder="Select a Higher Authority" />
                              </SelectTrigger>
                              <SelectContent>
                                {approvedAuthorities.map((auth) => (
                                  <SelectItem
                                    key={auth.address}
                                    value={auth.address}
                                  >
                                    🏛️ {auth.authorityName} ({truncateAddress(auth.address)})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>

                        {formError && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">{formError}</p>
                          </div>
                        )}

                        <TransactionStatus
                          state={txState}
                          txHash={txHash}
                          error={txError}
                          onRetry={() => {
                            txReset();
                            handleSubmitInstitute(new Event("submit"));
                          }}
                          onReset={txReset}
                        />

                        {txState === "success" ? (
                          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-xl">
                            <p className="text-green-800 font-medium mb-2">
                              🎉 Registration submitted!
                            </p>
                            <p className="text-sm text-green-600">
                              Your institute is now pending approval from the selected Higher Authority.
                              You will be notified once approved.
                            </p>
                          </div>
                        ) : (
                          <Button
                            type="submit"
                            disabled={
                              txState === "confirming" ||
                              txState === "pending" ||
                              !instituteName.trim() ||
                              !selectedAuthority ||
                              approvedAuthorities.length === 0
                            }
                            className="btn-gradient w-full py-3 text-base font-medium"
                          >
                            {txState === "confirming" || txState === "pending" ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                                Processing...
                              </div>
                            ) : (
                              "Register as Institute"
                            )}
                          </Button>
                        )}
                      </form>
                    </TabsContent>

                    {/* ── Higher Authority Registration Tab ─────────── */}
                    <TabsContent
                      value="authority"
                      className="space-y-6 animate-fade-in"
                    >
                      <form onSubmit={handleSubmitAuthority} className="space-y-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="auth-name"
                            className="text-sm font-medium text-gray-700"
                          >
                            Authority Name *
                          </Label>
                          <Input
                            id="auth-name"
                            placeholder="Enter authority name"
                            value={authorityName}
                            onChange={(e) => setAuthorityName(e.target.value)}
                            className="input-modern"
                            minLength={3}
                            required
                          />
                          <p className="text-xs text-gray-500">
                            This name will be stored on the blockchain and cannot be changed.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="auth-wallet"
                            className="text-sm font-medium text-gray-700"
                          >
                            Wallet Address
                          </Label>
                          <div className="relative">
                            <Input
                              id="auth-wallet"
                              value={address || ""}
                              readOnly
                              className="input-modern font-mono text-sm pr-12"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-soft" />
                            </div>
                          </div>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                          <h4 className="text-sm font-medium text-blue-800 mb-1">
                            ℹ️ Approval Process
                          </h4>
                          <p className="text-xs text-blue-600">
                            After registration, your application will need approval from 3
                            platform admins before your Authority account is activated.
                            You&apos;ll be able to manage institutes once approved.
                          </p>
                        </div>

                        {formError && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">{formError}</p>
                          </div>
                        )}

                        <TransactionStatus
                          state={txState}
                          txHash={txHash}
                          error={txError}
                          onRetry={() => {
                            txReset();
                            handleSubmitAuthority(new Event("submit"));
                          }}
                          onReset={txReset}
                        />

                        {txState === "success" ? (
                          <div className="text-center p-4 bg-green-50 border border-green-200 rounded-xl">
                            <p className="text-green-800 font-medium mb-2">
                              🎉 Registration submitted!
                            </p>
                            <p className="text-sm text-green-600">
                              Your Higher Authority application has been submitted on-chain.
                              It requires approval from 3 admins to be activated.
                            </p>
                          </div>
                        ) : (
                          <Button
                            type="submit"
                            disabled={
                              txState === "confirming" ||
                              txState === "pending" ||
                              !authorityName.trim()
                            }
                            className="btn-gradient w-full py-3 text-base font-medium"
                          >
                            {txState === "confirming" || txState === "pending" ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                                Processing...
                              </div>
                            ) : (
                              "Register as Higher Authority"
                            )}
                          </Button>
                        )}
                      </form>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
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
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  Blockchain Secured
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                  Instantly Verifiable
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
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
