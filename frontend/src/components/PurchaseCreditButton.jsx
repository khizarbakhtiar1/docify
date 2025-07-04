"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ethers, parseEther } from "ethers";
import InstituteABI from "../../../frontend/artifacts/contracts/Institute.sol/Institute.json";

const PurchaseCreditButton = ({ instituteAddress, planType, isPro = false }) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState(null);

  const planDetails = {
    1: { credits: 100, price: "0.049" }, // Using string to avoid floating point issues
    2: { credits: 500, price: "0.199" },
    3: { credits: 1500, price: "0.499" },
  };

  const purchaseCredits = async () => {
    setIsPurchasing(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed!");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const instituteContract = new ethers.Contract(
        instituteAddress,
        InstituteABI.abi,
        signer
      );

      const plan = planDetails[planType];
      const tx = await instituteContract.purchaseCredits(planType, {
        value: parseEther(plan.price),
      });
      
      console.log("Transaction sent:", tx.hash);
      await tx.wait();

      console.log(`${plan.credits} credits purchased successfully`);
      // Add callback or state update here to reflect the new credit balance
    } catch (err) {
      console.error("Error purchasing credits:", err);
      setError(err.message || "Transaction failed");
    } finally {
      setIsPurchasing(false);
    }
  };

  const plan = planDetails[planType];
  if (!plan) {
    return <div className="text-red-500">Invalid plan type</div>;
  }

  return (
    <div className="space-y-4">
      <div className="gradient-card p-4 rounded-lg">
        <div className="text-center">
          <div className={`text-2xl font-bold ${
            isPro ? 'text-purple-600' : 'text-blue-600'
          }`}>{plan.credits}</div>
          <div className="text-sm text-gray-600">Credits</div>
          <div className="text-lg font-semibold mt-2">{plan.price} ETH</div>
        </div>
      </div>
      
      <Button
        className={`w-full ${
          isPro 
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white' 
            : 'btn-gradient'
        }`}
        onClick={purchaseCredits}
        disabled={isPurchasing || !instituteAddress}
      >
        {isPurchasing ? "Processing..." : "Purchase Credits"}
      </Button>
      
      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default PurchaseCreditButton;
