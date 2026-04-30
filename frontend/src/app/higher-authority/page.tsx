import { HigherAuthorityDashboard } from "./HigherAuthorityDashboard";
import { HigherAuthorityRoute } from "@/components/ProtectedRoute";

export default function HigherAuthorityPage() {
  return (
    <HigherAuthorityRoute>
      <HigherAuthorityDashboard />
    </HigherAuthorityRoute>
  );
}
