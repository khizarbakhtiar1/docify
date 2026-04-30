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
import AddAdminButton from "./AddAdminButton";
import RemoveAdminButton from "./RemoveAdminButton";
import HighAuthApprovalButton from "./HighAuthApprovalButton";
import { useAuth } from "@/contexts/AuthContext";
import {
  getAllAdmins,
  getOwner,
  getPendingHigherAuthorities,
  getPendingInstitutes,
  getApprovedHigherAuthorities,
  getApprovedInstitutes,
  rejectHigherAuthority,
  rejectInstitute,
  parseContractError,
} from "@/services";

export function AdminDashboard() {
  const { user, address } = useAuth();

  // ── State ─────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("approvals");
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState("");
  const [admins, setAdmins] = useState([]);
  const [pendingAuthorities, setPendingAuthorities] = useState([]);
  const [pendingInstitutes, setPendingInstitutes] = useState([]);
  const [approvedAuthorities, setApprovedAuthorities] = useState([]);
  const [approvedInstitutes, setApprovedInstitutes] = useState([]);
  const [rejectingAddress, setRejectingAddress] = useState(null);

  // ── Fetch all data from blockchain ────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        ownerAddr,
        adminList,
        pendingHA,
        pendingInst,
        approvedHA,
        approvedInst,
      ] = await Promise.all([
        getOwner(),
        getAllAdmins(),
        getPendingHigherAuthorities(),
        getPendingInstitutes(),
        getApprovedHigherAuthorities(),
        getApprovedInstitutes(),
      ]);
      setOwner(ownerAddr);
      setAdmins(adminList);
      setPendingAuthorities(pendingHA);
      setPendingInstitutes(pendingInst);
      setApprovedAuthorities(approvedHA);
      setApprovedInstitutes(approvedInst);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Helpers ───────────────────────────────────────────────
  const truncate = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const isSuperAdmin = address && owner &&
    address.toLowerCase() === owner.toLowerCase();

  const handleRejectAuthority = async (authorityAddr) => {
    setRejectingAddress(authorityAddr);
    try {
      const tx = await rejectHigherAuthority(authorityAddr);
      await tx.wait();
      await fetchData();
    } catch (err) {
      alert(parseContractError(err));
    } finally {
      setRejectingAddress(null);
    }
  };

  const handleRejectInstitute = async (instAddr) => {
    setRejectingAddress(instAddr);
    try {
      const tx = await rejectInstitute(instAddr);
      await tx.wait();
      await fetchData();
    } catch (err) {
      alert(parseContractError(err));
    } finally {
      setRejectingAddress(null);
    }
  };

  // ── Stats ─────────────────────────────────────────────────
  const stats = [
    {
      title: "Pending Authorities",
      value: pendingAuthorities.length,
      icon: "🏛️",
    },
    {
      title: "Pending Institutes",
      value: pendingInstitutes.length,
      icon: "🏫",
    },
    {
      title: "Active Admins",
      value: admins.length,
      icon: "👥",
    },
    {
      title: "Approved Entities",
      value: approvedAuthorities.length + approvedInstitutes.length,
      icon: "✅",
    },
  ];

  // ── Loading State ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen gradient-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">
            Loading data from blockchain...
          </p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen gradient-background">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  {isSuperAdmin ? "Super Admin" : "Admin"} •{" "}
                  {truncate(address)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={activeTab === "approvals" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("approvals")}
                  className={activeTab === "approvals" ? "btn-gradient" : ""}
                >
                  🔍 Approvals
                </Button>
                <Button
                  variant={activeTab === "management" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("management")}
                  className={activeTab === "management" ? "btn-gradient" : ""}
                >
                  ⚙️ Management
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                className="text-gray-600"
              >
                🔄 Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 px-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ═══════════════════════════════════════════════════ */}
        {/* APPROVALS TAB                                       */}
        {/* ═══════════════════════════════════════════════════ */}
        {activeTab === "approvals" ? (
          <div className="space-y-6 animate-fade-in">
            {/* Pending Higher Authorities */}
            <Card className="glass-card shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      🏛️ Pending Higher Authorities
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Higher Authorities require 3 admin approvals to be
                      activated
                    </CardDescription>
                  </div>
                  <Badge className="status-pending">
                    {pendingAuthorities.length} Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {pendingAuthorities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg mb-1">No pending authorities</p>
                    <p className="text-sm">
                      All Higher Authority registrations have been processed.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-200">
                          <TableHead className="font-semibold text-gray-700">
                            Address
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            Name
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            Approvals
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingAuthorities.map((auth, index) => (
                          <TableRow
                            key={auth.address}
                            className="hover:bg-gray-50/50"
                          >
                            <TableCell className="font-mono text-sm text-blue-600">
                              {truncate(auth.address)}
                            </TableCell>
                            <TableCell className="font-medium text-gray-900">
                              {auth.authorityName}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                {auth.approvalCount}/3 approvals
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <HighAuthApprovalButton
                                  authorityAddress={auth.address}
                                  onSuccess={fetchData}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:bg-red-50 border-red-200"
                                  onClick={() =>
                                    handleRejectAuthority(auth.address)
                                  }
                                  disabled={rejectingAddress === auth.address}
                                >
                                  {rejectingAddress === auth.address
                                    ? "..."
                                    : "Reject"}
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

            {/* Pending Institutes */}
            <Card className="glass-card shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      🏫 Pending Institutes
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Institutes are approved by their designated Higher
                      Authority
                    </CardDescription>
                  </div>
                  <Badge className="status-pending">
                    {pendingInstitutes.length} Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {pendingInstitutes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg mb-1">No pending institutes</p>
                    <p className="text-sm">
                      All Institute registrations have been processed.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-200">
                          <TableHead className="font-semibold text-gray-700">
                            Address
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            Name
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            Higher Authority
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingInstitutes.map((inst) => (
                          <TableRow
                            key={inst.address}
                            className="hover:bg-gray-50/50"
                          >
                            <TableCell className="font-mono text-sm text-blue-600">
                              {truncate(inst.address)}
                            </TableCell>
                            <TableCell className="font-medium text-gray-900">
                              {inst.institudeName}
                            </TableCell>
                            <TableCell className="font-mono text-sm text-gray-600">
                              {truncate(inst.higherAuthority)}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                Awaiting Authority Approval
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
          </div>
        ) : (
          /* ═══════════════════════════════════════════════════ */
          /* MANAGEMENT TAB                                      */
          /* ═══════════════════════════════════════════════════ */
          <div className="space-y-6 animate-fade-in">
            <Card className="glass-card shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                      👥 Admin Management
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-1">
                      Manage platform administrators (max 5). Only the Super
                      Admin can add/remove admins.
                    </CardDescription>
                  </div>
                  <Badge className="status-success">
                    {admins.length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Admin Section — only super admin */}
                {isSuperAdmin && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                        +
                      </span>
                      Add New Administrator
                    </h3>
                    <AddAdminButton
                      admins={admins}
                      setAdmins={setAdmins}
                      onSuccess={fetchData}
                    />
                  </div>
                )}

                {/* Admin List */}
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="font-semibold text-gray-700">
                          Wallet Address
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Role
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700">
                          Status
                        </TableHead>
                        {isSuperAdmin && (
                          <TableHead className="font-semibold text-gray-700">
                            Actions
                          </TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admins.map((admin) => {
                        const isOwner =
                          admin.address.toLowerCase() ===
                          owner.toLowerCase();
                        return (
                          <TableRow
                            key={admin.address}
                            className="hover:bg-gray-50/50"
                          >
                            <TableCell className="font-mono text-sm">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    {admin.address.slice(2, 4).toUpperCase()}
                                  </span>
                                </div>
                                <span className="text-blue-600">
                                  {truncate(admin.address)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  isOwner
                                    ? "bg-purple-100 text-purple-800 text-xs"
                                    : "bg-blue-100 text-blue-800 text-xs"
                                }
                              >
                                {isOwner ? "Super Admin (Owner)" : "Admin"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft" />
                                <span className="text-green-600 text-sm font-medium">
                                  Active
                                </span>
                              </div>
                            </TableCell>
                            {isSuperAdmin && (
                              <TableCell>
                                {isOwner ? (
                                  <span className="text-xs text-gray-400">
                                    Cannot remove owner
                                  </span>
                                ) : (
                                  <RemoveAdminButton
                                    adminAddress={admin.address}
                                    onSuccess={fetchData}
                                  />
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Security Guidelines */}
            <Card className="glass-card shadow-xl animate-slide-up">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  Security Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">
                      Admin Responsibilities:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <span>
                          Review and approve Higher Authority registrations
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <span>
                          Each authority needs 3 different admin approvals
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <span>Monitor platform security and integrity</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">
                      Security Requirements:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span>All actions are on-chain and immutable</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span>
                          Only Super Admin (owner) can add/remove admins
                        </span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span>Maximum of 5 admins enforced by contract</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
