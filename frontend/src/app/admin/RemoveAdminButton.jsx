"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { removeAdmin } from "@/services";
import { useContractWrite } from "@/hooks/useContractWrite";

const RemoveAdminButton = ({ adminAddress, onSuccess }) => {
  const { execute, isLoading } = useContractWrite();

  const handleRemoveAdmin = async () => {
    const receipt = await execute(() => removeAdmin(adminAddress), {
      successMessage: "Admin removed successfully",
    });
    if (receipt && onSuccess) onSuccess();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRemoveAdmin}
      disabled={isLoading}
      className="text-red-600 hover:bg-red-50 border-red-200"
    >
      {isLoading ? "Removing..." : "Remove"}
    </Button>
  );
};

export default RemoveAdminButton;
