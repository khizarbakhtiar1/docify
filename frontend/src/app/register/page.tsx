import { Register } from "./RegistrationForm";
import { PublicRoute } from "@/components/ProtectedRoute";

const register = () => {
  return (
    <PublicRoute>
      <div className="py-14 px-8 max-w-sm mx-auto sm:max-w-md lg:max-w-xl">
        <Register />
      </div>
    </PublicRoute>
  );
};

export default register;
