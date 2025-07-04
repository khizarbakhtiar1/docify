import React from "react";
import { HigherAuthorityDashboard } from "./HigherAuthorityDashboard";
import { HigherAuthorityRoute } from "@/components/ProtectedRoute";

const HighAuthPanel = () => {
  return (
    <HigherAuthorityRoute>
      <div className="">
        <HigherAuthorityDashboard />
      </div>
    </HigherAuthorityRoute>
  );
};

export default HighAuthPanel;
