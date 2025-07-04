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
        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover-lift"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
            Rejecting...
          </div>
        ) : (
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
            Reject
          </div>
        )}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
};

export default DocumentRejectButton;
