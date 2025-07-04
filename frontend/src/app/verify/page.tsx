import { DocumentVerificationForm } from "./DocumentVerficationForm";
import { PublicRoute } from "@/components/ProtectedRoute";

const DocumentVerification = () => {
  return (
    <PublicRoute>
      <div className="py-14 px-8 max-w-sm mx-auto sm:max-w-md lg:max-w-xl">
        <DocumentVerificationForm />
      </div>
    </PublicRoute>
  );
};

export default DocumentVerification;
