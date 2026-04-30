"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MintingButton from "./MintingButton";
import { Pricing } from "@/components/pricing.jsx";
import { useAuth } from "@/contexts/AuthContext";
import {
  getInstituteContract,
  getCreditBalance,
  getDocumentRequests,
  getMintedTokens,
  submitDocumentRequest,
  computeDocumentHash,
  revokeSoulBoundToken,
  parseContractError,
} from "@/services";
import { useContractWrite } from "@/hooks/useContractWrite";

export function InstituteDashboard() {
  const { user, address } = useAuth();

  // ── State ─────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("documents");
  const [loading, setLoading] = useState(true);
  const [instituteContract, setInstituteContract] = useState(null);
  const [credits, setCredits] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [mintedTokens, setMintedTokens] = useState([]);

  // Submit document form
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Revoke
  const [revokingTokenId, setRevokingTokenId] = useState(null);

  // ── Fetch blockchain data ─────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      // Get institute contract address from Factory
      const contractAddr = await getInstituteContract(address);
      if (!contractAddr || contractAddr === "0x0000000000000000000000000000000000000000") {
        setLoading(false);
        return;
      }
      setInstituteContract(contractAddr);

      // Fetch all data in parallel
      const [creditBalance, docRequests, tokens] = await Promise.all([
        getCreditBalance(contractAddr),
        getDocumentRequests(contractAddr),
        getMintedTokens(contractAddr),
      ]);

      setCredits(creditBalance);
      setDocuments(docRequests);
      setMintedTokens(tokens);
    } catch (err) {
      console.error("Error fetching institute data:", err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Helpers ───────────────────────────────────────────────
  const truncate = (str) =>
    str ? `${str.slice(0, 10)}...${str.slice(-8)}` : "";

  const pendingDocs = documents.filter((d) => d.isRequested && !d.isApproved);
  const approvedDocs = documents.filter((d) => d.isApproved);

  // ── Submit Document Handler ───────────────────────────────
  const { execute: executeSubmit, isLoading: isSubmitting } = useContractWrite();
  const { execute: executeRevoke, isLoading: isRevoking } = useContractWrite();

  const handleSubmitDocument = async (e) => {
    e.preventDefault();
    if (!selectedFile || !instituteContract) return;

    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const hash = await computeDocumentHash(selectedFile);
      const receipt = await executeSubmit(() => submitDocumentRequest(instituteContract, hash), {
        successMessage: "Document submitted successfully",
      });
      
      if (receipt) {
        setSubmitSuccess(true);
        setSelectedFile(null);
        setShowSubmitForm(false);
        await fetchData();
      }
    } catch (err) {
      setSubmitError(err.message || "Failed to compute document hash");
    }
  };

  // ── Revoke Token Handler ──────────────────────────────────
  const handleRevoke = async (tokenId) => {
    if (!instituteContract) return;
    setRevokingTokenId(tokenId);
    const receipt = await executeRevoke(() => revokeSoulBoundToken(instituteContract, tokenId), {
      successMessage: "Token revoked successfully",
    });
    setRevokingTokenId(null);
    if (receipt) await fetchData();
  };

  // ── Stats ─────────────────────────────────────────────────
  const stats = [
    { title: "Available Credits", value: credits, icon: "💰" },
    { title: "Pending Documents", value: pendingDocs.length, icon: "📋" },
    { title: "Approved Documents", value: approvedDocs.length, icon: "📄" },
    { title: "Minted Tokens", value: mintedTokens.length, icon: "🏷️" },
  ];

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen gradient-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading institute data from blockchain...</p>
        </div>
      </div>
    );
  }

  if (!instituteContract) {
    return (
      <div className="min-h-screen gradient-background flex items-center justify-center">
        <Card className="glass-card max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">🏫</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Institute Contract</h2>
            <p className="text-gray-600">
              Your institute contract has not been deployed yet. This happens automatically
              when your Higher Authority approves your registration.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen gradient-background pt-16">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Institute Dashboard</h1>
                <p className="text-sm text-gray-600">
                  {user?.institudeName || "Institute"} • {credits} Credits
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={activeTab === "documents" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("documents")}
                  className={activeTab === "documents" ? "btn-gradient" : ""}
                >
                  📄 Documents
                </Button>
                <Button
                  variant={activeTab === "tokens" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("tokens")}
                  className={activeTab === "tokens" ? "btn-gradient" : ""}
                >
                  🏷️ Tokens
                </Button>
                <Button
                  variant={activeTab === "credits" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("credits")}
                  className={activeTab === "credits" ? "btn-gradient" : ""}
                >
                  💰 Credits
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={fetchData}>
                🔄
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-12 px-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 animate-slide-up">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ═══════ Documents Tab ═══════ */}
        {activeTab === "documents" && (
          <div className="space-y-6 animate-fade-in">
            {/* Submit Document Action */}
            <Card className="glass-card shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Submit Document</h3>
                    <p className="text-gray-600">Upload a document to request verification from your Higher Authority</p>
                  </div>
                  <Button
                    className="btn-gradient"
                    onClick={() => setShowSubmitForm(!showSubmitForm)}
                  >
                    {showSubmitForm ? "Cancel" : "+ Submit Document"}
                  </Button>
                </div>

                {showSubmitForm && (
                  <form onSubmit={handleSubmitDocument} className="mt-6 p-4 bg-gray-50 rounded-xl space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="doc-file" className="text-sm font-medium text-gray-700">
                        Select Document File
                      </Label>
                      <Input
                        id="doc-file"
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="input-modern"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        The file will be hashed (SHA-256) and the hash submitted on-chain. 
                        The file itself is NOT stored on the blockchain.
                      </p>
                    </div>

                    {submitError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">{submitError}</p>
                      </div>
                    )}

                    {submitSuccess && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">Document submitted! Awaiting authority approval.</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting || !selectedFile}
                      className="btn-gradient"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Document Hash"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Pending Documents */}
            <Card className="glass-card shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900">
                    📋 Pending Documents
                  </CardTitle>
                  <Badge className="status-pending">{pendingDocs.length} Pending</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {pendingDocs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No pending documents. Submit a document above to get started.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold text-gray-700">Document Hash</TableHead>
                          <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingDocs.map((doc) => (
                          <TableRow key={doc.documentHash} className="hover:bg-gray-50/50">
                            <TableCell className="font-mono text-sm text-blue-600">
                              {truncate(doc.documentHash)}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                Awaiting Approval
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Approved Documents */}
            <Card className="glass-card shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      ✅ Approved Documents
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Ready to mint as Soul Bound Tokens
                    </CardDescription>
                  </div>
                  <Badge className="status-success">{approvedDocs.length} Approved</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {approvedDocs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No approved documents yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold text-gray-700">Document Hash</TableHead>
                          <TableHead className="font-semibold text-gray-700">Status</TableHead>
                          <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {approvedDocs.map((doc) => (
                          <TableRow key={doc.documentHash} className="hover:bg-gray-50/50">
                            <TableCell className="font-mono text-sm text-blue-600">
                              {truncate(doc.documentHash)}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800 text-xs">Approved</Badge>
                            </TableCell>
                            <TableCell>
                              <MintingButton
                                instituteContract={instituteContract}
                                documentHash={doc.documentHash}
                                onSuccess={fetchData}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════ Tokens Tab ═══════ */}
        {activeTab === "tokens" && (
          <div className="space-y-6 animate-fade-in">
            <Card className="glass-card shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      🏷️ Minted Soul Bound Tokens
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Non-transferable tokens permanently recorded on blockchain
                    </CardDescription>
                  </div>
                  <Badge className="status-success">{mintedTokens.length} Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {mintedTokens.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p className="text-lg mb-1">No tokens minted yet</p>
                    <p className="text-sm">Mint approved documents as SBTs from the Documents tab.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold text-gray-700">Token ID</TableHead>
                          <TableHead className="font-semibold text-gray-700">Recipient</TableHead>
                          <TableHead className="font-semibold text-gray-700">Document Hash</TableHead>
                          <TableHead className="font-semibold text-gray-700">Status</TableHead>
                          <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mintedTokens.map((token) => (
                          <TableRow key={token.tokenId} className="hover:bg-gray-50/50">
                            <TableCell className="font-mono text-sm font-bold text-gray-900">
                              #{token.tokenId}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-blue-600">
                              {token.recipient.slice(0, 6)}...{token.recipient.slice(-4)}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-gray-600 max-w-[200px] truncate">
                              {truncate(token.documentHash)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft" />
                                <span className="text-green-600 text-sm font-medium">Active</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50 border-red-200"
                                onClick={() => handleRevoke(token.tokenId)}
                                disabled={revokingTokenId === token.tokenId}
                              >
                                {revokingTokenId === token.tokenId ? "..." : "Revoke"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════ Credits Tab ═══════ */}
        {activeTab === "credits" && (
          <div className="space-y-6 animate-fade-in">
            <Card className="glass-card shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      💰 Credit Balance
                    </CardTitle>
                    <CardDescription>Current credit balance and purchase options</CardDescription>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-3">
                    <span className="text-2xl font-bold text-blue-700">{credits}</span>
                    <span className="text-sm text-blue-600 ml-2">Credits</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Pricing instituteContract={instituteContract} onSuccess={fetchData} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
