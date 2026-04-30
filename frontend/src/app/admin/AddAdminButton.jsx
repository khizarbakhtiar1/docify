"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { isAddress } from "ethers";
import { addAdmin } from "@/services";
import { useContractWrite } from "@/hooks/useContractWrite";

const AddAdminButton = ({ onSuccess }) => {
  const [newAdminAddress, setNewAdminAddress] = useState("");
  const [localError, setLocalError] = useState(null);
  const { execute, isLoading } = useContractWrite();

  const handleAddAdmin = async () => {
    if (!newAdminAddress.trim() || !isAddress(newAdminAddress)) {
      setLocalError("Please enter a valid Ethereum address");
      return;
    }

    setLocalError(null);
    const receipt = await execute(() => addAdmin(newAdminAddress), {
      successMessage: "Admin added successfully",
    });

    if (receipt) {
      setNewAdminAddress("");
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <input
          className="flex-1 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          type="text"
          value={newAdminAddress}
          onChange={(e) => { setNewAdminAddress(e.target.value); setLocalError(null); }}
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
      {localError && (
        <p className="text-red-500 text-sm p-2 bg-red-50 rounded">{localError}</p>
      )}
    </div>
  );
};

export default AddAdminButton;
