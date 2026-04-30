"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { approveHigherAuthority, parseContractError } from "@/services";

const HighAuthApprovalButton = ({ authorityAddress, onSuccess }) => {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState(null);

  const handleApprove = async () => {
    setIsApproving(true);
    setError(null);
    try {
      const tx = await approveHigherAuthority(authorityAddress);
      await tx.wait();
      console.log("Higher Authority approved successfully");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error approving Higher Authority:", err);
      setError(parseContractError(err));
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div>
      <Button onClick={handleApprove} disabled={isApproving}>
        {isApproving ? "Approving..." : "Approve"}
      </Button>
      {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
    </div>
  );
};

export default HighAuthApprovalButton;
