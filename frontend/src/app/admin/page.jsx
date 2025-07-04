import React from "react";
import { AdminDashboard } from "./AdminDashboard";
import { AdminRoute } from "@/components/ProtectedRoute";

const AdminPanel = () => {
  return (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  );
};

export default AdminPanel;
