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
      <Button size="sm" className="btn-gradient hover-lift" onClick={approveInstitute}>
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
        </svg>
        Approve
      </Button>
    </div>
  );
};

export default ApproveInstituteButton;
