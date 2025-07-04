"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import AuthorityABI from "../../../../frontend/artifacts/contracts/Authority.sol/Authority.json";
import { Button } from "@/components/ui/button";

const DocumentRejectButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleReject = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        const signer = await provider.getSigner();
        const authorityAddress = "0xYourAuthorityContractAddress"; // will fetch the Authority contract address
        const authorityContract = new ethers.Contract(
          authorityAddress,
          AuthorityABI,
          signer
        );

        const instituteAddress = "0xInstituteAddress"; // will fetch institute address
        const documentHash = "0xDocumentHash"; // will fetch the document hash

        const tx = await authorityContract.rejectDocumentRequest(
          instituteAddress,
          documentHash
        );
        await tx.wait();

        setSuccess("Document request rejected successfully.");
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
      <Button
        onClick={handleReject}
        disabled={loading}
        variant="outline"
        size="sm"
      >
        {loading ? "Rejecting..." : "Reject"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
};

export default DocumentRejectButton;
