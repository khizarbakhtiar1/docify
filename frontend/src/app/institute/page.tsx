import { InstituteDashboard } from "./InstituteDashboard";
import { InstituteRoute } from "@/components/ProtectedRoute";

export default function InstitutePage() {
  return (
    <InstituteRoute>
      <InstituteDashboard />
    </InstituteRoute>
  );
}
