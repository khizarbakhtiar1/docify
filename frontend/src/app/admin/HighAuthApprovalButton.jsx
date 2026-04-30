"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { approveHigherAuthority } from "@/services";
import { useContractWrite } from "@/hooks/useContractWrite";

const HighAuthApprovalButton = ({ authorityAddress, onSuccess }) => {
  const { execute, isLoading } = useContractWrite();

  const handleApprove = async () => {
    await execute(() => approveHigherAuthority(authorityAddress), {
      successMessage: "Higher Authority approved successfully",
    });
    if (onSuccess) onSuccess();
  };

  return (
    <Button onClick={handleApprove} disabled={isLoading}>
      {isLoading ? "Approving..." : "Approve"}
    </Button>
  );
};

export default HighAuthApprovalButton;
