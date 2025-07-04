import React from "react";
import { InstituteDashboard } from "./InstituteDashboard";
import { InstituteRoute } from "@/components/ProtectedRoute";

const InstitutePanel = () => {
  return (
    <InstituteRoute>
      <InstituteDashboard />
    </InstituteRoute>
  );
};

export default InstitutePanel;
