"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import IdentityRegistryABI from "../../../../frontend/artifacts/contracts/IdentityRegistry.sol/IdentityRegistry.json"; // Make sure to import your ABI
const identityRegistryContract = "0x2A02EA91c93974D46533Abf1746061FA8c99352E";

const ApproveInstituteButton = () => {
  const approveInstitute = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

          const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        identityRegistryContract,
        IdentityRegistryABI,
        signer
      );

      const tx = await contract.approveInstitute();
      await tx.wait();

      console.log("Institute approved successfully");
    } catch (error) {
      console.error("Error approving institute:", error);
    }
  };

  return (
    <div>
      <Button size="sm" onClick={approveInstitute}>
        Approve Institute
      </Button>
    </div>
  );
};

export default ApproveInstituteButton;
