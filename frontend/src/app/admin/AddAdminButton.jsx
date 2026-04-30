"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { isAddress } from "ethers";
import { addAdmin, parseContractError } from "@/services";

const AddAdminButton = ({ onSuccess }) => {
  const [newAdminAddress, setNewAdminAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddAdmin = async () => {
    if (!newAdminAddress.trim() || !isAddress(newAdminAddress)) {
      setError("Please enter a valid Ethereum address");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const tx = await addAdmin(newAdminAddress);
      await tx.wait();
      setNewAdminAddress("");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(parseContractError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <input
          className="flex-1 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          type="text"
          value={newAdminAddress}
          onChange={(e) => setNewAdminAddress(e.target.value)}
          placeholder="Enter Ethereum address (0x...)"
        />
        <Button
          onClick={handleAddAdmin}
          disabled={isLoading}
          className="btn-gradient whitespace-nowrap"
        >
          {isLoading ? "Adding..." : "Add Admin"}
        </Button>
      </div>
      {error && (
        <p className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</p>
      )}
    </div>
  );
};

export default AddAdminButton;
