"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import InstituteABI from "../../../../frontend/artifacts/contracts/Institute.sol/Institute.json";

const MintingButton = ({
  instituteAddress,
  documentHash,
  recipientAddress,
}) => {
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const mintToken = async () => {
    setIsMinting(true);
    setError(null);
    setSuccess(false);

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed!");
      }

      if (!instituteAddress || !documentHash || !recipientAddress) {
        throw new Error("Missing required parameters for minting");
      }

      // Connect to the user's Ethereum wallet
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Create a contract instance
      const instituteContract = new ethers.Contract(
        instituteAddress,
        InstituteABI.abi,
        signer
      );

      // Call the mintSoulBoundToken function
      const tx = await instituteContract.mintSoulBoundToken(
        recipientAddress,
        documentHash
      );
      
      console.log("Transaction sent:", tx.hash);
      await tx.wait();

      console.log("Soul Bound Token minted successfully");
      setSuccess(true);
      // You might want to add some callback here to update the UI or fetch updated data
    } catch (err) {
      console.error("Error minting Soul Bound Token:", err);
      setError(err.message || "Failed to mint token");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        size="sm"
        className="btn-gradient h-9 px-4 text-sm"
        onClick={mintToken}
        disabled={isMinting || success}
      >
        {isMinting ? "Minting..." : success ? "Minted!" : "Mint SBT"}
      </Button>
      
      {error && (
        <div className="text-red-500 text-xs p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="text-green-500 text-xs p-2 bg-green-50 rounded">
          Soul Bound Token minted successfully!
        </div>
      )}
    </div>
  );
};

export default MintingButton;

// const MintSoulBoundTokenButton = ({ instituteAddress, documentHash, recipientAddress }) => {
//   const [isMinting, setIsMinting] = useState(false);
//   const [error, setError] = useState(null);

//   const mintToken = async () => {
//     setIsMinting(true);
//     setError(null);

//     try {
//       // Connect to the user's Ethereum wallet
//       await window.ethereum.request({ method: 'eth_requestAccounts' });
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();

//       // Create a contract instance
//       const instituteContract = new ethers.Contract(instituteAddress, InstituteABI.abi, signer);

//       // Call the mintSoulBoundToken function
//       const tx = await instituteContract.mintSoulBoundToken(recipientAddress, documentHash);
//       await tx.wait();

//       console.log('Soul Bound Token minted successfully');
//       // You might want to add some callback here to update the UI or fetch updated data
//     } catch (err) {
//       console.error('Error minting Soul Bound Token:', err);
//       setError(err.message);
//     } finally {
//       setIsMinting(false);
//     }
//   };

//   return (
//     <div>
//       <Button
//         variant="outline"
//         className="bg-[#3B82F6] text-white hover:bg-[#2563EB] focus:ring-[#3B82F6]"
//         onClick={mintToken}
//         disabled={isMinting}
//       >
//         {isMinting ? 'Minting...' : 'Mint Soul Bound Token'}
//       </Button>
//       {error && <p className="text-red-500 mt-2">{error}</p>}
//     </div>
//   );
// };

// export default MintSoulBoundTokenButton;
