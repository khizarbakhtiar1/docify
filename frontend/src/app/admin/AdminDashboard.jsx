"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Web3Provider } from "@/components/Web3Provider";
import Image from "next/image";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("approvals");
  const [admins, setAdmins] = useState([
    { id: "0xDc927Bd56CF9DfC2e3779C7E3D6d28dA1C219969", name: "Farzan Ahmad" },
    { id: "0x7DD92c8aC584503885B95009330d89Da158E5f41", name: "Syed Asmar" },
    { id: "0x8C0100Bd2C2Db24e3d63275716eFd89159781727", name: "Emad Zaheer" },
  ]);
  const [approvedRequests, setApprovedRequests] = useState([]);

  const pendingRequests = [
    {
      id: "REQ-001",
      requestedBy: "University of Technology",
      description: "Institute Registration Approval",
      status: "Pending",
      priority: "High",
      date: "2024-01-15",
      type: "Institute"
    },
    {
      id: "REQ-002",
      requestedBy: "State Education Board",
      description: "Authority Registration Request",
      status: "Pending",
      priority: "Medium",
      date: "2024-01-14",
      type: "Authority"
    },
    {
      id: "REQ-003",
      requestedBy: "Technical College",
      description: "Document Verification Access",
      status: "Pending",
      priority: "High",
      date: "2024-01-13",
      type: "Institute"
    },
    {
      id: "REQ-004",
      requestedBy: "International Accreditation",
      description: "Global Recognition Setup",
      status: "Pending",
      priority: "Low",
      date: "2024-01-12",
      type: "Authority"
    },
  ];

  const stats = [
    {
      title: "Total Requests",
      value: pendingRequests.length,
      change: "+2 today",
      icon: "📝",
      color: "blue"
    },
    {
      title: "Active Admins",
      value: admins.length,
      change: "All active",
      icon: "👥",
      color: "green"
    },
    {
      title: "Approved Today",
      value: approvedRequests.length,
      change: "+3 this week",
      icon: "✅",
      color: "purple"
    },
    {
      title: "Pending Reviews",
      value: pendingRequests.filter(r => r.priority === "High").length,
      change: "High priority",
      icon: "⚡",
      color: "orange"
    }
  ];

  const getPriorityBadge = (priority) => {
    const variants = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800"
    };
    return variants[priority] || variants.Medium;
  };

  const getTypeBadge = (type) => {
    return type === "Institute" 
      ? "bg-blue-100 text-blue-800" 
      : "bg-purple-100 text-purple-800";
  };

  return (
    <div className="min-h-screen gradient-background">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage platform operations</p>
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
              
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Image
                  src="/placeholder-user.jpg"
                  width={32}
                  height={32}
                  alt="Admin Avatar"
                  className="rounded-full"
                />
              </div>
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

        {/* Main Content */}
        {activeTab === "approvals" ? (
          <div className="space-y-6 animate-fade-in">
            <Card className="glass-card shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      Pending Approvals
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      Review and approve registration requests from institutions and authorities
                    </CardDescription>
                  </div>
                  <Badge className="status-pending">
                    {pendingRequests.length} Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="font-semibold text-gray-700">Request ID</TableHead>
                        <TableHead className="font-semibold text-gray-700">Organization</TableHead>
                        <TableHead className="font-semibold text-gray-700">Description</TableHead>
                        <TableHead className="font-semibold text-gray-700">Type</TableHead>
                        <TableHead className="font-semibold text-gray-700">Priority</TableHead>
                        <TableHead className="font-semibold text-gray-700">Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRequests.map((request, index) => (
                        <TableRow key={request.id} className="hover:bg-gray-50/50 animate-slide-in-left" style={{animationDelay: `${index * 0.1}s`}}>
                          <TableCell className="font-mono text-sm font-medium text-blue-600">
                            {request.id}
                          </TableCell>
                          <TableCell className="font-medium text-gray-900">
                            {request.requestedBy}
                          </TableCell>
                          <TableCell className="text-gray-700 max-w-xs">
                            {request.description}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getTypeBadge(request.type)} text-xs`}>
                              {request.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getPriorityBadge(request.priority)} text-xs`}>
                              {request.priority}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">
                            {request.date}
                          </TableCell>
                          <TableCell>
                            <HighAuthApprovalButton
                              setApprovedRequests={setApprovedRequests}
                              request={request}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Approved Requests */}
            {approvedRequests.length > 0 && (
              <Card className="glass-card shadow-xl animate-slide-up">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    Approved Requests
                  </CardTitle>
                  <CardDescription>
                    Successfully processed registration requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {approvedRequests.map((request, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200 animate-scale-in">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{request.requestedBy}</p>
                            <p className="text-sm text-gray-600">{request.description}</p>
                          </div>
                        </div>
                        <Badge className="status-success">Approved</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <Card className="glass-card shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      Admin Management
                    </CardTitle>
                    <CardDescription className="text-gray-600 mt-2">
                      Add and manage platform administrators with blockchain-level security
                    </CardDescription>
                  </div>
                  <Badge className="status-success">
                    {admins.length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-blue-900">Add New Administrator</h3>
                  </div>
                  <Web3Provider>
                    <AddAdminButton />
                  </Web3Provider>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="font-semibold text-gray-700">Wallet Address</TableHead>
                        <TableHead className="font-semibold text-gray-700">Name</TableHead>
                        <TableHead className="font-semibold text-gray-700">Role</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {admins.map((admin, index) => (
                        <TableRow key={admin.id} className="hover:bg-gray-50/50 animate-slide-in-right" style={{animationDelay: `${index * 0.1}s`}}>
                          <TableCell className="font-mono text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M21 18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13z"/>
                                </svg>
                              </div>
                              <span className="text-blue-600">
                                {admin.id.slice(0, 6)}...{admin.id.slice(-4)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-gray-900">
                            {admin.name}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-purple-100 text-purple-800 text-xs">
                              Platform Admin
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft"></div>
                              <span className="text-green-600 text-sm font-medium">Active</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <RemoveAdminButton
                              admin={admin}
                              admins={admins}
                              setAdmins={setAdmins}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Admin Guidelines */}
            <Card className="glass-card shadow-xl animate-slide-up">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  Security Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Admin Responsibilities:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        <span>Review and approve institution registrations</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        <span>Manage platform administrator access</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        <span>Monitor system security and integrity</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Security Requirements:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>Wallet-based authentication required</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>All actions recorded on blockchain</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        <span>Multi-signature approval process</span>
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
