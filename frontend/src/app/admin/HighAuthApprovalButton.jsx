import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import { identityRegistryContract, getSigner } from "../../utils/ethers";

const HighAuthApprovalButton = ({ authorityAddress }) => {
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState(null);

  const handleApprove = async () => {
    setIsApproving(true);
    setError(null);
    try {
      const signer = await getSigner();
      const contractWithSigner = identityRegistryContract.connect(signer);

      const tx = await contractWithSigner.approveHigherAuthority(
        authorityAddress
      );
      await tx.wait();

      console.log("Higher Authority approved successfully");
    } catch (err) {
      console.error("Error approving Higher Authority:", err);
      setError(err.message);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div>
      <Button onClick={handleApprove} disabled={isApproving}>
        {isApproving ? "Approving..." : "Approve"}
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default HighAuthApprovalButton;
