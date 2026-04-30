"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { purchaseCredits, CreditPlan, PLAN_DETAILS } from "@/services";
import { useContractWrite } from "@/hooks/useContractWrite";

const PurchaseCreditButton = ({ instituteContract, planType, isPro = false, onSuccess }) => {
  const [localError, setLocalError] = useState(null);
  const { execute, isLoading, isSuccess } = useContractWrite();

  const handlePurchase = async () => {
    if (!instituteContract) {
      setLocalError("Institute contract not found");
      return;
    }

    setLocalError(null);

    const receipt = await execute(() => purchaseCredits(instituteContract, planType), {
      successMessage: "Credits purchased successfully!",
    });

    if (receipt && onSuccess) {
      onSuccess();
    }
  };

  const plan = PLAN_DETAILS[planType];
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
        onClick={handlePurchase}
        disabled={isLoading || !instituteContract}
      >
        {isLoading ? "Processing..." : isSuccess ? "✓ Purchased!" : "Purchase Credits"}
      </Button>
      
      {localError && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {localError}
        </div>
      )}

      {isSuccess && (
        <div className="text-green-600 text-sm p-2 bg-green-50 rounded text-center">
          ✓ Credits purchased successfully!
        </div>
      )}
    </div>
  );
};

export default PurchaseCreditButton;
