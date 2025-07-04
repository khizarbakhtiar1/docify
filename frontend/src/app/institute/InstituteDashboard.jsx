"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import SubmitDocumentButton from "./SubmitDocumentButton";
import MintingButton from "./MintingButton";
import { Pricing } from "@/components/pricing.jsx";

export function InstituteDashboard() {
  const [activeTab, setActiveTab] = useState("documents");
  const [credits] = useState(1250);
  const [authorizedCredits] = useState(500);

  const approvedDocuments = [
    {
      id: 1,
      name: "Bachelor's Degree Certificate",
      type: "Degree",
      submittedDate: "2024-01-10",
      approvedDate: "2024-01-12",
      status: "Approved",
      priority: "High"
    },
    {
      id: 2,
      name: "Academic Transcript",
      type: "Transcript",
      submittedDate: "2024-01-08",
      approvedDate: "2024-01-11",
      status: "Approved",
      priority: "Medium"
    },
    {
      id: 3,
      name: "Faculty Recommendation Letter",
      type: "Letter",
      submittedDate: "2024-01-05",
      approvedDate: "2024-01-09",
      status: "Approved",
      priority: "Low"
    },
    {
      id: 4,
      name: "Internship Certificate",
      type: "Certificate",
      submittedDate: "2024-01-03",
      approvedDate: "2024-01-07",
      status: "Approved",
      priority: "Medium"
    }
  ];

  const mintedTokens = [
    {
      id: 1,
      name: "Bachelor's Degree Certificate",
      tokenId: "ABC12345-DEF6-789G-HIJ0-123456789KLM",
      mintedDate: "2024-01-13",
      recipient: "John Smith",
      status: "Active"
    },
    {
      id: 2,
      name: "Academic Transcript",
      tokenId: "XYZ98765-ABC1-234D-EFG5-987654321NOP",
      mintedDate: "2024-01-12",
      recipient: "Jane Doe",
      status: "Active"
    },
    {
      id: 3,
      name: "Faculty Recommendation Letter",
      tokenId: "LMN13579-OPQ2-468R-STU6-135792468VWX",
      mintedDate: "2024-01-10",
      recipient: "Michael Johnson",
      status: "Active"
    }
  ];

  const stats = [
    {
      title: "Available Credits",
      value: credits,
      change: `+${authorizedCredits} authorized`,
      icon: "💰",
      color: "blue"
    },
    {
      title: "Approved Documents",
      value: approvedDocuments.length,
      change: "+2 this week",
      icon: "📄",
      color: "green"
    },
    {
      title: "Minted Tokens",
      value: mintedTokens.length,
      change: "+1 today",
      icon: "🏷️",
      color: "purple"
    },
    {
      title: "Active Recipients",
      value: new Set(mintedTokens.map(t => t.recipient)).size,
      change: "All verified",
      icon: "👥",
      color: "orange"
    }
  ];

  const getDocumentIcon = (type) => {
    const icons = {
      Degree: "🎓",
      Transcript: "📊",
      Letter: "📝",
      Certificate: "🏆"
    };
    return icons[type] || "📄";
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800"
    };
    return variants[priority] || variants.Medium;
  };

  return (
    <div className="min-h-screen gradient-background pt-16">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Institute Dashboard</h1>
                <p className="text-sm text-gray-600">Manage certificates and credentials</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Institute Info */}
              <div className="hidden md:flex items-center space-x-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                    </svg>
                    <span className="text-sm font-medium text-blue-900">{credits.toLocaleString()} Credits</span>
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Higher Authority: HEC</span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={activeTab === "documents" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("documents")}
                  className={activeTab === "documents" ? "btn-gradient shadow-lg" : "hover:bg-white/50"}
                >
                  📄 Documents
                </Button>
                <Button
                  variant={activeTab === "tokens" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("tokens")}
                  className={activeTab === "tokens" ? "btn-gradient shadow-lg" : "hover:bg-white/50"}
                >
                  🏷️ Tokens
                </Button>
                <Button
                  variant={activeTab === "credits" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("credits")}
                  className={activeTab === "credits" ? "btn-gradient shadow-lg" : "hover:bg-white/50"}
                >
                  💰 Credits
                </Button>
              </div>
              
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Image
                  src="/placeholder-user.jpg"
                  width={32}
                  height={32}
                  alt="Institute Avatar"
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-12 px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 animate-slide-up">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card hover-lift">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-12 animate-slide-up">
          <Card className="glass-card shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Quick Actions</h3>
                  <p className="text-gray-600">Streamline your document management workflow</p>
                </div>
                <div className="flex items-center space-x-3">
                  <SubmitDocumentButton />
                  <Button className="btn-gradient">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                    Bulk Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {activeTab === "documents" && (
          <div className="space-y-6 animate-fade-in">
            <Card className="glass-card shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      Approved Documents
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      Documents approved by higher authority, ready for minting as blockchain certificates
                    </CardDescription>
                  </div>
                  <Badge className="status-success">
                    {approvedDocuments.length} Ready to Mint
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="font-semibold text-gray-700">Document</TableHead>
                        <TableHead className="font-semibold text-gray-700">Type</TableHead>
                        <TableHead className="font-semibold text-gray-700">Priority</TableHead>
                        <TableHead className="font-semibold text-gray-700">Submitted</TableHead>
                        <TableHead className="font-semibold text-gray-700">Approved</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedDocuments.map((doc, index) => (
                        <TableRow key={doc.id} className="hover:bg-gray-50/50 animate-slide-in-left" style={{animationDelay: `${index * 0.1}s`}}>
                          <TableCell className="font-medium text-gray-900">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{getDocumentIcon(doc.type)}</div>
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-sm text-gray-500">ID: DOC-{doc.id.toString().padStart(3, '0')}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-800 text-xs">
                              {doc.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getPriorityBadge(doc.priority)} text-xs`}>
                              {doc.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">
                            {doc.submittedDate}
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">
                            {doc.approvedDate}
                          </TableCell>
                          <TableCell>
                            <MintingButton document={doc} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "tokens" && (
          <div className="space-y-6 animate-fade-in">
            <Card className="glass-card shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      Minted SBT Tokens
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      Soul Bound Tokens issued to students, permanently recorded on blockchain
                    </CardDescription>
                  </div>
                  <Badge className="status-success">
                    {mintedTokens.length} Active Tokens
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="font-semibold text-gray-700">Document</TableHead>
                        <TableHead className="font-semibold text-gray-700">Token ID</TableHead>
                        <TableHead className="font-semibold text-gray-700">Recipient</TableHead>
                        <TableHead className="font-semibold text-gray-700">Minted Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mintedTokens.map((token, index) => (
                        <TableRow key={token.id} className="hover:bg-gray-50/50 animate-slide-in-right" style={{animationDelay: `${index * 0.1}s`}}>
                          <TableCell className="font-medium text-gray-900">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"/>
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium">{token.name}</p>
                                <p className="text-sm text-gray-500">SBT-{token.id.toString().padStart(3, '0')}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-600">
                                {token.tokenId.slice(0, 8)}...{token.tokenId.slice(-8)}
                              </span>
                              <button className="text-gray-400 hover:text-gray-600">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z"/>
                                  <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11.586l-3-3a1 1 0 00-1.414 1.414L11.586 11H4V5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6z"/>
                                </svg>
                              </button>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-gray-900">
                            {token.recipient}
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">
                            {token.mintedDate}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft"></div>
                              <span className="text-green-600 text-sm font-medium">{token.status}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="btn-outline hover-lift"
                              >
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                                </svg>
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover-lift"
                              >
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd"/>
                                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                                </svg>
                                Revoke
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "credits" && (
          <div className="space-y-6 animate-fade-in">
            <Card className="glass-card shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"/>
                    </svg>
                  </div>
                  Purchase Credits
                </CardTitle>
                <CardDescription>
                  Select a plan to purchase additional credits for document processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Pricing />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
