import React from "react";
import { DocumentSubmissionForm } from "./DocumentSubmissionForm";
import { PublicRoute } from "@/components/ProtectedRoute";

const DocumentSubmission = () => {
  return (
    <PublicRoute>
      <DocumentSubmissionForm />
    </PublicRoute>
  );
};

export default DocumentSubmission;
