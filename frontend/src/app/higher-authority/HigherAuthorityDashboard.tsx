"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  getInstitute,
  approveInstitute,
  rejectInstitute,
  getApprovedInstitutes,
  getPendingInstitutes,
  getAuthorityContract,
  getInstitutesUnderAuthority,
  approveDocumentRequest,
  rejectDocumentRequest,
  getDocumentRequests,
  parseContractError,
} from "@/services";
import type { InstituteData, DocumentRequest } from "@/services";
import { useContractWrite } from "@/hooks/useContractWrite";

interface ExtendedDocRequest extends DocumentRequest {
  instituteEOA: string;
  instituteContract: string;
}

export function HigherAuthorityDashboard() {
  const { user, address } = useAuth();

  // ── State ─────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("pending-approvals");
  const [loading, setLoading] = useState(true);
  const [pendingInstitutes, setPendingInstitutes] = useState<InstituteData[]>([]);
  const [myApprovedInstitutes, setMyApprovedInstitutes] = useState<InstituteData[]>([]);
  const [authorityContractAddr, setAuthorityContractAddr] = useState<string | null>(null);
  const [documentRequests, setDocumentRequests] = useState<ExtendedDocRequest[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ── Fetch all data from blockchain ────────────────────────
  const fetchData = useCallback(async () => {
    if (!address) return;
    setLoading(true);

    try {
      // 1. Get pending institutes under this authority
      const allPending = await getPendingInstitutes();
      const myPending = allPending.filter(
        (inst) => inst.higherAuthority.toLowerCase() === address.toLowerCase()
      );
      setPendingInstitutes(myPending);

      // 2. Get approved institutes under this authority
      const allApproved = await getApprovedInstitutes();
      const myApproved = allApproved.filter(
        (inst) => inst.higherAuthority.toLowerCase() === address.toLowerCase()
      );
      setMyApprovedInstitutes(myApproved);

      // 3. Get Authority contract address via Factory
      try {
        const authAddr = await getAuthorityContract(address);
        if (authAddr && authAddr !== "0x0000000000000000000000000000000000000000") {
          setAuthorityContractAddr(authAddr);

          // 4. Get document requests from institutes under this authority
          const institutes = await getInstitutesUnderAuthority(authAddr);
          const allDocRequests: ExtendedDocRequest[] = [];
          for (const inst of institutes) {
            try {
              const requests = await getDocumentRequests(inst.instituteContract);
              for (const req of requests) {
                allDocRequests.push({
                  ...req,
                  instituteEOA: inst.instituteEOA,
                  instituteContract: inst.instituteContract,
                });
              }
            } catch (err) {
              console.error(`Error fetching docs for ${inst.instituteEOA}:`, err);
            }
          }
          setDocumentRequests(allDocRequests);
        }
      } catch (err) {
        console.error("Error fetching authority contract:", err);
      }
    } catch (err) {
      console.error("Error fetching HA data:", err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Helpers ───────────────────────────────────────────────
  const truncate = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const { execute: executeWrite, isLoading: isWriting } = useContractWrite();

  const handleApproveInstitute = async (instAddr: string) => {
    setActionLoading(instAddr);
    const receipt = await executeWrite(() => approveInstitute(instAddr), {
      successMessage: "Institute approved successfully",
    });
    setActionLoading(null);
    if (receipt) await fetchData();
  };

  const handleRejectInstitute = async (instAddr: string) => {
    setActionLoading(`reject-${instAddr}`);
    const receipt = await executeWrite(() => rejectInstitute(instAddr), {
      successMessage: "Institute rejected successfully",
    });
    setActionLoading(null);
    if (receipt) await fetchData();
  };

  const handleApproveDocument = async (instEOA: string, docHash: string) => {
    if (!authorityContractAddr) return;
    setActionLoading(`doc-approve-${docHash}`);
    const receipt = await executeWrite(() => approveDocumentRequest(authorityContractAddr, instEOA, docHash), {
      successMessage: "Document approved successfully",
    });
    setActionLoading(null);
    if (receipt) await fetchData();
  };

  const handleRejectDocument = async (instEOA: string, docHash: string) => {
    if (!authorityContractAddr) return;
    setActionLoading(`doc-reject-${docHash}`);
    const receipt = await executeWrite(() => rejectDocumentRequest(authorityContractAddr, instEOA, docHash), {
      successMessage: "Document rejected successfully",
    });
    setActionLoading(null);
    if (receipt) await fetchData();
  };

  // ── Computed values ───────────────────────────────────────
  const pendingDocs = documentRequests.filter((d) => d.isRequested && !d.isApproved);
  const approvedDocs = documentRequests.filter((d) => d.isApproved);

  const stats = [
    { title: "Pending Institutes", value: pendingInstitutes.length, icon: "🏛️" },
    { title: "Approved Institutes", value: myApprovedInstitutes.length, icon: "✅" },
    { title: "Pending Documents", value: pendingDocs.length, icon: "📋" },
    { title: "Approved Documents", value: approvedDocs.length, icon: "🔍" },
  ];

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen gradient-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading data from blockchain...</p>
        </div>
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
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Higher Authority Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  {user?.authorityName || "Authority"} • {truncate(address || "")}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-blue-900">
                    Active Authority
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={fetchData} className="text-gray-600">
                🔄 Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom pt-12 pb-8 px-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
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

        {/* Navigation */}
        <div className="mb-8 animate-fade-in">
          <Card className="glass-card">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
                  <TabsTrigger value="pending-approvals" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    🏛️ Pending Institutes ({pendingInstitutes.length})
                  </TabsTrigger>
                  <TabsTrigger value="approved-institutes" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    ✅ Approved ({myApprovedInstitutes.length})
                  </TabsTrigger>
                  <TabsTrigger value="document-requests" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    📋 Documents ({pendingDocs.length})
                  </TabsTrigger>
                </TabsList>

                {/* ── Pending Institutes ────────────────────── */}
                <TabsContent value="pending-approvals" className="space-y-6 mt-6">
                  <Card className="glass-card shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-900">
                            Pending Institute Approvals
                          </CardTitle>
                          <CardDescription className="text-gray-600 mt-1">
                            Institutes registered under your authority awaiting approval
                          </CardDescription>
                        </div>
                        <Badge className="status-pending">{pendingInstitutes.length} Pending</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {pendingInstitutes.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <p className="text-lg mb-1">No pending institutes</p>
                          <p className="text-sm">All registrations have been processed.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-gray-200">
                                <TableHead className="font-semibold text-gray-700">Address</TableHead>
                                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {pendingInstitutes.map((inst) => (
                                <TableRow key={inst.address} className="hover:bg-gray-50/50">
                                  <TableCell className="font-mono text-sm text-blue-600">
                                    {truncate(inst.address)}
                                  </TableCell>
                                  <TableCell className="font-medium text-gray-900">
                                    {inst.institudeName}
                                  </TableCell>
                                  <TableCell>
                                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                      Pending Approval
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        className="btn-gradient"
                                        onClick={() => handleApproveInstitute(inst.address)}
                                        disabled={actionLoading === inst.address}
                                      >
                                        {actionLoading === inst.address ? "..." : "✓ Approve"}
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:bg-red-50 border-red-200"
                                        onClick={() => handleRejectInstitute(inst.address)}
                                        disabled={actionLoading === `reject-${inst.address}`}
                                      >
                                        {actionLoading === `reject-${inst.address}` ? "..." : "✕ Reject"}
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ── Approved Institutes ───────────────────── */}
                <TabsContent value="approved-institutes" className="space-y-6 mt-6">
                  <Card className="glass-card shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold text-gray-900">
                            Approved Institutes
                          </CardTitle>
                          <CardDescription className="text-gray-600 mt-1">
                            Institutes operating under your authority
                          </CardDescription>
                        </div>
                        <Badge className="status-success">{myApprovedInstitutes.length} Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {myApprovedInstitutes.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                          <p className="text-lg mb-1">No approved institutes yet</p>
                          <p className="text-sm">Approve pending institutes to see them here.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-gray-200">
                                <TableHead className="font-semibold text-gray-700">Address</TableHead>
                                <TableHead className="font-semibold text-gray-700">Name</TableHead>
                                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {myApprovedInstitutes.map((inst) => (
                                <TableRow key={inst.address} className="hover:bg-gray-50/50">
                                  <TableCell className="font-mono text-sm text-blue-600">
                                    {truncate(inst.address)}
                                  </TableCell>
                                  <TableCell className="font-medium text-gray-900">
                                    {inst.institudeName}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft" />
                                      <span className="text-green-600 text-sm font-medium">Active</span>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* ── Document Requests ─────────────────────── */}
                <TabsContent value="document-requests" className="space-y-6 mt-6">
                  <Card className="glass-card shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        📋 Document Requests
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-1">
                        Review and process document requests from your institutes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!authorityContractAddr ? (
                        <div className="text-center py-12 text-gray-500">
                          <p className="text-lg mb-1">Authority contract not deployed</p>
                          <p className="text-sm">
                            Your Authority contract will be created when you approve your first institute.
                          </p>
                        </div>
                      ) : (
                        <Tabs defaultValue="pending-docs" className="w-full">
                          <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-lg p-1 mb-6">
                            <TabsTrigger value="pending-docs" className="data-[state=active]:bg-white">
                              🕐 Pending ({pendingDocs.length})
                            </TabsTrigger>
                            <TabsTrigger value="approved-docs" className="data-[state=active]:bg-white">
                              ✅ Approved ({approvedDocs.length})
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="pending-docs">
                            {pendingDocs.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <p>No pending document requests.</p>
                              </div>
                            ) : (
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="border-gray-200">
                                      <TableHead className="font-semibold text-gray-700">Institute</TableHead>
                                      <TableHead className="font-semibold text-gray-700">Document Hash</TableHead>
                                      <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {pendingDocs.map((doc) => (
                                      <TableRow key={doc.documentHash} className="hover:bg-gray-50/50">
                                        <TableCell className="font-mono text-sm text-blue-600">
                                          {truncate(doc.instituteEOA)}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-gray-600 max-w-[200px] truncate">
                                          {doc.documentHash}
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex gap-2">
                                            <Button
                                              size="sm"
                                              className="btn-gradient"
                                              onClick={() => handleApproveDocument(doc.instituteEOA, doc.documentHash)}
                                              disabled={actionLoading === `doc-approve-${doc.documentHash}`}
                                            >
                                              {actionLoading === `doc-approve-${doc.documentHash}` ? "..." : "✓ Approve"}
                                            </Button>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              className="text-red-600 hover:bg-red-50 border-red-200"
                                              onClick={() => handleRejectDocument(doc.instituteEOA, doc.documentHash)}
                                              disabled={actionLoading === `doc-reject-${doc.documentHash}`}
                                            >
                                              {actionLoading === `doc-reject-${doc.documentHash}` ? "..." : "✕ Reject"}
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </TabsContent>

                          <TabsContent value="approved-docs">
                            {approvedDocs.length === 0 ? (
                              <div className="text-center py-8 text-gray-500">
                                <p>No approved documents yet.</p>
                              </div>
                            ) : (
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="border-gray-200">
                                      <TableHead className="font-semibold text-gray-700">Institute</TableHead>
                                      <TableHead className="font-semibold text-gray-700">Document Hash</TableHead>
                                      <TableHead className="font-semibold text-gray-700">Status</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {approvedDocs.map((doc) => (
                                      <TableRow key={doc.documentHash} className="hover:bg-gray-50/50">
                                        <TableCell className="font-mono text-sm text-blue-600">
                                          {truncate(doc.instituteEOA)}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-gray-600 max-w-[200px] truncate">
                                          {doc.documentHash}
                                        </TableCell>
                                        <TableCell>
                                          <Badge className="bg-green-100 text-green-800 text-xs">Approved</Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
