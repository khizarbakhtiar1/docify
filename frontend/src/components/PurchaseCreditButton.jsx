"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { purchaseCredits, parseContractError, CreditPlan, PLAN_DETAILS } from "@/services";

const PurchaseCreditButton = ({ instituteContract, planType, isPro = false, onSuccess }) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePurchase = async () => {
    if (!instituteContract) {
      setError("Institute contract not found");
      return;
    }

    setIsPurchasing(true);
    setError(null);
    setSuccess(false);

    try {
      const tx = await purchaseCredits(instituteContract, planType);
      await tx.wait();
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(parseContractError(err));
    } finally {
      setIsPurchasing(false);
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
        disabled={isPurchasing || !instituteContract}
      >
        {isPurchasing ? "Processing..." : success ? "✓ Purchased!" : "Purchase Credits"}
      </Button>
      
      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-600 text-sm p-2 bg-green-50 rounded text-center">
          ✓ Credits purchased successfully!
        </div>
      )}
    </div>
  );
};

export default PurchaseCreditButton;
