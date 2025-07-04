"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import AuthorityABI from "../../../../frontend/artifacts/contracts/Authority.sol/Authority.json";
import { Button } from "@/components/ui/button";
const DocumentApprovalButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleApprove = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        const signer = await provider.getSigner();
        const authorityAddress = "0xYourAuthorityContractAddress"; // will fetch Authority contract address here
        const authorityContract = new ethers.Contract(
          authorityAddress,
          AuthorityABI,
          signer
        );

        const instituteAddress = "0xInstituteAddress"; // will fetch institute address
        const documentHash = "0xDocumentHash"; // will fetch the document hash

        const tx = await authorityContract.approveDocumentRequest(
          instituteAddress,
          documentHash
        );
        await tx.wait();

        setSuccess("Document request approved successfully.");
      } else {
        setError("MetaMask is not installed.");
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleApprove} disabled={loading} size="sm">
        {loading ? "Approving..." : "Approve"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
};

export default DocumentApprovalButton;
