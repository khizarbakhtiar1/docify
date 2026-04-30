"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mintSoulBoundToken, parseContractError } from "@/services";
import { isAddress } from "ethers";

const MintingButton = ({ instituteContract, documentHash, onSuccess }) => {
  const [showForm, setShowForm] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleMint = async (e) => {
    e.preventDefault();
    if (!recipientAddress || !isAddress(recipientAddress)) {
      setError("Please enter a valid recipient address");
      return;
    }

    setIsMinting(true);
    setError(null);
    try {
      const tx = await mintSoulBoundToken(
        instituteContract,
        recipientAddress,
        documentHash
      );
      await tx.wait();
      setSuccess(true);
      setRecipientAddress("");
      setShowForm(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(parseContractError(err));
    } finally {
      setIsMinting(false);
    }
  };

  if (success) {
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
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="Recipient address (0x...)"
            className="text-xs h-8 w-48"
            required
          />
          <Button
            type="submit"
            size="sm"
            className="btn-gradient h-8"
            disabled={isMinting}
          >
            {isMinting ? "..." : "Mint"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => { setShowForm(false); setError(null); }}
          >
            ✕
          </Button>
        </form>
      )}
      {error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
    </div>
  );
};



export default MintingButton;
