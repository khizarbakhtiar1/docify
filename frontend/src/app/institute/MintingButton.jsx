"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { mintSoulBoundToken } from "@/services";
import { isAddress } from "ethers";
import { useContractWrite } from "@/hooks/useContractWrite";

const MintingButton = ({ instituteContract, documentHash, onSuccess }) => {
  const [showForm, setShowForm] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [localError, setLocalError] = useState(null);
  
  const { execute, isLoading, isSuccess } = useContractWrite();

  const handleMint = async (e) => {
    e.preventDefault();
    if (!recipientAddress || !isAddress(recipientAddress)) {
      setLocalError("Please enter a valid recipient address");
      return;
    }

    setLocalError(null);
    const receipt = await execute(() => mintSoulBoundToken(
      instituteContract,
      recipientAddress,
      documentHash
    ), {
      successMessage: "Soul Bound Token minted successfully!",
    });

    if (receipt) {
      setRecipientAddress("");
      setShowForm(false);
      if (onSuccess) onSuccess();
    }
  };

  if (isSuccess) {
    return (
      <Badge className="bg-green-100 text-green-800 text-xs">
        ✓ Minted
      </Badge>
    );
  }

  return (
    <div className="space-y-2">
      {!showForm ? (
        <Button
          size="sm"
          className="btn-gradient"
          onClick={() => setShowForm(true)}
        >
          Mint SBT
        </Button>
      ) : (
        <form onSubmit={handleMint} className="flex items-center gap-2">
          <Input
            type="text"
            value={recipientAddress}
            onChange={(e) => { setRecipientAddress(e.target.value); setLocalError(null); }}
            placeholder="Recipient address (0x...)"
            className="text-xs h-8 w-48"
            required
          />
          <Button
            type="submit"
            size="sm"
            className="btn-gradient h-8"
            disabled={isLoading}
          >
            {isLoading ? "..." : "Mint"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => { setShowForm(false); setLocalError(null); }}
          >
            ✕
          </Button>
        </form>
      )}
      {localError && (
        <p className="text-red-500 text-xs">{localError}</p>
      )}
    </div>
  );
};

export default MintingButton;
