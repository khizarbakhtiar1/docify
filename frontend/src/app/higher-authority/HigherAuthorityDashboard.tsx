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
import DocumentAprrovalButton from "./DocumentApprovalButton";
import DocumentRejectButton from "./DocumentRejectButton";

export function HigherAuthorityDashboard() {
  const [activeTab, setActiveTab] = useState("pending-approvals");
  return (
    <div className=" p-14 px-8 flex min-h-screen w-full bg-muted/40">
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="grid gap-4 ">
          {activeTab === "pending-approvals" && (
            <Card className="col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle>Pending Institute Approvals</CardTitle>
                <CardDescription>
                  Review and approve institutes awaiting approval.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Institute Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">
                        Fast University
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-white text-black border border-gray-300"
                        >
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ApproveInstituteButton />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Virtual University
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-white text-black border border-gray-300"
                        >
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ApproveInstituteButton />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Oxford University
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-white text-black border border-gray-300"
                        >
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ApproveInstituteButton />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
          {activeTab === "approved-institutes" && (
            <Card className="col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle>Approved Institutes</CardTitle>
                <CardDescription>
                  View the list of approved institutes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Institute Name</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">MIT</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-600"
                        >
                          Approved
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Harvard University
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-600"
                        >
                          Approved
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Stanford University
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-600"
                        >
                          Approved
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
          {activeTab === "document-requests" && (
            <Card className="col-span-2 lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle>Document Requests</CardTitle>
                <CardDescription>
                  Review and process document requests from institutes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending">
                  <TabsList>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pending">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Institute Name</TableHead>
                          <TableHead>Document Type</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            MIT University
                          </TableCell>
                          <TableCell>Accreditation Certificate</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <DocumentAprrovalButton />
                              <DocumentRejectButton />
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Harvard University
                          </TableCell>
                          <TableCell>Curriculum Approval</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <DocumentAprrovalButton />
                              <DocumentRejectButton />
                            </div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Stanford University
                          </TableCell>
                          <TableCell>Facility Inspection Report</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <DocumentAprrovalButton />
                              <DocumentRejectButton />
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="approved">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Institute Name</TableHead>
                          <TableHead>Document Type</TableHead>
                          <TableHead>Approved Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">MIT</TableCell>
                          <TableCell>Accreditation Certificate</TableCell>
                          <TableCell>2023-05-15</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Harvard University
                          </TableCell>
                          <TableCell>Curriculum Approval</TableCell>
                          <TableCell>2023-06-01</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Stanford University
                          </TableCell>
                          <TableCell>Facility Inspection Report</TableCell>
                          <TableCell>2023-07-01</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="rejected">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Institute Name</TableHead>
                          <TableHead>Document Type</TableHead>
                          <TableHead>Rejected Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">
                            Acme University
                          </TableCell>
                          <TableCell>Curriculum Approval</TableCell>
                          <TableCell>2023-04-30</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            Globex College
                          </TableCell>
                          <TableCell>Facility Inspection Report</TableCell>
                          <TableCell>2023-05-20</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
        <div className="flex justify-center gap-2">
          <Button
            variant={
              activeTab === "pending-approvals" ? "secondary" : "outline"
            }
            onClick={() => setActiveTab("pending-approvals")}
          >
            Pending Approvals
          </Button>
          <Button
            variant={
              activeTab === "approved-institutes" ? "secondary" : "outline"
            }
            onClick={() => setActiveTab("approved-institutes")}
          >
            Approved Institutes
          </Button>
          <Button
            variant={
              activeTab === "document-requests" ? "secondary" : "outline"
            }
            onClick={() => setActiveTab("document-requests")}
          >
            Document Requests
          </Button>
        </div>
      </main>
    </div>
  );
}
