"use client";

import { useState } from "react";
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
import ApproveInstituteButton from "./ApproveInstituteButton";
import DocumentApprovalButton from "./DocumentApprovalButton";
import DocumentRejectButton from "./DocumentRejectButton";
import { useRouteGuard } from "@/hooks/useRouteGuard";

export function HigherAuthorityDashboard() {
  const { isAuthorized, isLoading } = useRouteGuard({
    allowedRoles: ["higher-authority"],
    requireApproval: true,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Route guard will handle redirect
  }
  const [activeTab, setActiveTab] = useState("pending-approvals");

  // Sample data
  const pendingInstitutes = [
    {
      id: 1,
      name: "Fast University",
      applicationType: "New Registration",
      submittedDate: "2024-01-15",
      priority: "High",
    },
    {
      id: 2,
      name: "Virtual University",
      applicationType: "License Renewal",
      submittedDate: "2024-01-12",
      priority: "Medium",
    },
    {
      id: 3,
      name: "Oxford University",
      applicationType: "Program Addition",
      submittedDate: "2024-01-10",
      priority: "Low",
    },
  ];

  const approvedInstitutes = [
    {
      id: 1,
      name: "MIT",
      approvedDate: "2024-01-08",
      status: "Active",
      documentsCount: 150,
    },
    {
      id: 2,
      name: "Harvard University",
      approvedDate: "2024-01-05",
      status: "Active",
      documentsCount: 89,
    },
    {
      id: 3,
      name: "Stanford University",
      approvedDate: "2024-01-02",
      status: "Active",
      documentsCount: 120,
    },
  ];

  const documentRequests = {
    pending: [
      {
        id: 1,
        institute: "MIT University",
        documentType: "Accreditation Certificate",
        submittedDate: "2024-01-14",
        priority: "High",
      },
      {
        id: 2,
        institute: "Harvard University",
        documentType: "Curriculum Approval",
        submittedDate: "2024-01-13",
        priority: "Medium",
      },
      {
        id: 3,
        institute: "Stanford University",
        documentType: "Facility Inspection Report",
        submittedDate: "2024-01-12",
        priority: "High",
      },
    ],
    approved: [
      {
        id: 1,
        institute: "MIT",
        documentType: "Accreditation Certificate",
        approvedDate: "2023-05-15",
        approvedBy: "Dr. Smith",
      },
      {
        id: 2,
        institute: "Harvard University",
        documentType: "Curriculum Approval",
        approvedDate: "2023-06-01",
        approvedBy: "Dr. Johnson",
      },
      {
        id: 3,
        institute: "Stanford University",
        documentType: "Facility Inspection Report",
        approvedDate: "2023-07-01",
        approvedBy: "Dr. Williams",
      },
    ],
    rejected: [
      {
        id: 1,
        institute: "Acme University",
        documentType: "Curriculum Approval",
        rejectedDate: "2023-04-30",
        reason: "Incomplete documentation",
      },
      {
        id: 2,
        institute: "Globex College",
        documentType: "Facility Inspection Report",
        rejectedDate: "2023-05-20",
        reason: "Standards not met",
      },
    ],
  };

  const stats = [
    {
      title: "Pending Institutes",
      value: pendingInstitutes.length,
      change: "+2 this week",
      icon: "🏛️",
      color: "blue",
    },
    {
      title: "Approved Institutes",
      value: approvedInstitutes.length,
      change: "+1 this month",
      icon: "✅",
      color: "green",
    },
    {
      title: "Document Requests",
      value: documentRequests.pending.length,
      change: "+5 today",
      icon: "📋",
      color: "gray",
    },
    {
      title: "Total Verifications",
      value: "1,247",
      change: "+89 this week",
      icon: "🔍",
      color: "blue",
    },
  ];

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-gray-100 text-gray-800",
      Low: "bg-green-100 text-green-800",
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
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <AuthorityIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Higher Authority Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Manage institutes and document approvals
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-900">
                    Active Authority
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                HA
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom pt-12 pb-8 px-6">
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
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 animate-fade-in">
          <Card className="glass-card">
            <CardContent className="p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1">
                  <TabsTrigger
                    value="pending-approvals"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    🏛️ Institute Approvals
                  </TabsTrigger>
                  <TabsTrigger
                    value="approved-institutes"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    ✅ Approved Institutes
                  </TabsTrigger>
                  <TabsTrigger
                    value="document-requests"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    📋 Document Requests
                  </TabsTrigger>
                </TabsList>

                {/* Pending Approvals Tab */}
                <TabsContent
                  value="pending-approvals"
                  className="space-y-6 mt-6"
                >
                  <Card className="glass-card shadow-xl animate-scale-in">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg flex items-center justify-center mr-3">
                              <ClockIcon className="w-5 h-5 text-white" />
                            </div>
                            Pending Institute Approvals
                          </CardTitle>
                          <CardDescription className="text-gray-600 mt-2">
                            Review and approve institutes awaiting approval
                          </CardDescription>
                        </div>
                        <Badge className="status-pending">
                          {pendingInstitutes.length} Pending
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-200">
                              <TableHead className="font-semibold text-gray-700">
                                Institute
                              </TableHead>
                              <TableHead className="font-semibold text-gray-700">
                                Application Type
                              </TableHead>
                              <TableHead className="font-semibold text-gray-700">
                                Priority
                              </TableHead>
                              <TableHead className="font-semibold text-gray-700">
                                Submitted
                              </TableHead>
                              <TableHead className="font-semibold text-gray-700">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {pendingInstitutes.map((institute, index) => (
                              <TableRow
                                key={institute.id}
                                className="hover:bg-gray-50/50 animate-slide-in-left"
                                style={{ animationDelay: `${index * 0.1}s` }}
                              >
                                <TableCell className="font-medium text-gray-900">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                      <BuildingIcon className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {institute.name}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        ID: INST-
                                        {institute.id
                                          .toString()
                                          .padStart(3, "0")}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                                    {institute.applicationType}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={`${getPriorityBadge(
                                      institute.priority
                                    )} text-xs`}
                                  >
                                    {institute.priority}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-gray-600 text-sm">
                                  {institute.submittedDate}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <ApproveInstituteButton />
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    >
                                      <XIcon className="w-4 h-4 mr-1" />
                                      Reject
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
                </TabsContent>

                {/* Approved Institutes Tab */}
                <TabsContent
                  value="approved-institutes"
                  className="space-y-6 mt-6"
                >
                  <Card className="glass-card shadow-xl animate-scale-in">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                              <CheckIcon className="w-5 h-5 text-white" />
                            </div>
                            Approved Institutes
                          </CardTitle>
                          <CardDescription className="text-gray-600 mt-2">
                            Institutes that have been approved and are actively
                            operating
                          </CardDescription>
                        </div>
                        <Badge className="status-success">
                          {approvedInstitutes.length} Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-gray-200">
                              <TableHead className="font-semibold text-gray-700">
                                Institute
                              </TableHead>
                              <TableHead className="font-semibold text-gray-700">
                                Approved Date
                              </TableHead>
                              <TableHead className="font-semibold text-gray-700">
                                Status
                              </TableHead>
                              <TableHead className="font-semibold text-gray-700">
                                Documents
                              </TableHead>
                              <TableHead className="font-semibold text-gray-700">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {approvedInstitutes.map((institute, index) => (
                              <TableRow
                                key={institute.id}
                                className="hover:bg-gray-50/50 animate-slide-in-right"
                                style={{ animationDelay: `${index * 0.1}s` }}
                              >
                                <TableCell className="font-medium text-gray-900">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                                      <BuildingIcon className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {institute.name}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        Active Institution
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-gray-600 text-sm">
                                  {institute.approvedDate}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft"></div>
                                    <span className="text-green-600 text-sm font-medium">
                                      {institute.status}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm font-medium text-gray-900">
                                    {institute.documentsCount} verified
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="btn-outline hover-lift"
                                    >
                                      <EyeIcon className="w-4 h-4 mr-1" />
                                      View
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-700"
                                    >
                                      <SettingsIcon className="w-4 h-4 mr-1" />
                                      Manage
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
                </TabsContent>

                {/* Document Requests Tab */}
                <TabsContent
                  value="document-requests"
                  className="space-y-6 mt-6"
                >
                  <Card className="glass-card shadow-xl animate-scale-in">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                          <DocumentIcon className="w-5 h-5 text-white" />
                        </div>
                        Document Requests
                      </CardTitle>
                      <CardDescription className="text-gray-600 mt-2">
                        Review and process document requests from institutes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="pending" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg p-1 mb-6">
                          <TabsTrigger
                            value="pending"
                            className="data-[state=active]:bg-white"
                          >
                            🕐 Pending ({documentRequests.pending.length})
                          </TabsTrigger>
                          <TabsTrigger
                            value="approved"
                            className="data-[state=active]:bg-white"
                          >
                            ✅ Approved ({documentRequests.approved.length})
                          </TabsTrigger>
                          <TabsTrigger
                            value="rejected"
                            className="data-[state=active]:bg-white"
                          >
                            ❌ Rejected ({documentRequests.rejected.length})
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="pending">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-gray-200">
                                  <TableHead className="font-semibold text-gray-700">
                                    Institute
                                  </TableHead>
                                  <TableHead className="font-semibold text-gray-700">
                                    Document Type
                                  </TableHead>
                                  <TableHead className="font-semibold text-gray-700">
                                    Priority
                                  </TableHead>
                                  <TableHead className="font-semibold text-gray-700">
                                    Submitted
                                  </TableHead>
                                  <TableHead className="font-semibold text-gray-700">
                                    Actions
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {documentRequests.pending.map((doc, index) => (
                                  <TableRow
                                    key={doc.id}
                                    className="hover:bg-gray-50/50 animate-slide-in-left"
                                    style={{
                                      animationDelay: `${index * 0.1}s`,
                                    }}
                                  >
                                    <TableCell className="font-medium text-gray-900">
                                      {doc.institute}
                                    </TableCell>
                                    <TableCell>
                                      <Badge className="bg-gray-100 text-gray-800 text-xs">
                                        {doc.documentType}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        className={`${getPriorityBadge(
                                          doc.priority
                                        )} text-xs`}
                                      >
                                        {doc.priority}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-sm">
                                      {doc.submittedDate}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-2">
                                        <DocumentApprovalButton />
                                        <DocumentRejectButton />
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TabsContent>

                        <TabsContent value="approved">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-gray-200">
                                  <TableHead className="font-semibold text-gray-700">
                                    Institute
                                  </TableHead>
                                  <TableHead className="font-semibold text-gray-700">
                                    Document Type
                                  </TableHead>
                                  <TableHead className="font-semibold text-gray-700">
                                    Approved Date
                                  </TableHead>
                                  <TableHead className="font-semibold text-gray-700">
                                    Approved By
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {documentRequests.approved.map((doc, index) => (
                                  <TableRow
                                    key={doc.id}
                                    className="hover:bg-gray-50/50 animate-slide-in-right"
                                    style={{
                                      animationDelay: `${index * 0.1}s`,
                                    }}
                                  >
                                    <TableCell className="font-medium text-gray-900">
                                      {doc.institute}
                                    </TableCell>
                                    <TableCell>
                                      <Badge className="bg-green-100 text-green-800 text-xs">
                                        {doc.documentType}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-sm">
                                      {doc.approvedDate}
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-sm">
                                      {doc.approvedBy}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TabsContent>

                        <TabsContent value="rejected">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="border-gray-200">
                                  <TableHead className="font-semibold text-gray-700">
                                    Institute
                                  </TableHead>
                                  <TableHead className="font-semibold text-gray-700">
                                    Document Type
                                  </TableHead>
                                  <TableHead className="font-semibold text-gray-700">
                                    Rejected Date
                                  </TableHead>
                                  <TableHead className="font-semibold text-gray-700">
                                    Reason
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {documentRequests.rejected.map((doc, index) => (
                                  <TableRow
                                    key={doc.id}
                                    className="hover:bg-gray-50/50 animate-slide-in-left"
                                    style={{
                                      animationDelay: `${index * 0.1}s`,
                                    }}
                                  >
                                    <TableCell className="font-medium text-gray-900">
                                      {doc.institute}
                                    </TableCell>
                                    <TableCell>
                                      <Badge className="bg-red-100 text-red-800 text-xs">
                                        {doc.documentType}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-sm">
                                      {doc.rejectedDate}
                                    </TableCell>
                                    <TableCell className="text-gray-600 text-sm">
                                      {doc.reason}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </TabsContent>
                      </Tabs>
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

// Icon Components
function AuthorityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4a2 2 0 0 0-2 2v1h16V6a2 2 0 0 0-2-2H4zM18 9H2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM4 13a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zm5-1a1 1 0 1 0 0 2h1a1 1 0 1 0 0-2H9z" />
    </svg>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function DocumentIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
