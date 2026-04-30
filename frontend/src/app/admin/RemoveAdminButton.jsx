"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { removeAdmin, parseContractError } from "@/services";

const RemoveAdminButton = ({ adminAddress, onSuccess }) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState(null);

  const handleRemoveAdmin = async () => {
    setIsRemoving(true);
    setError(null);
    try {
      const tx = await removeAdmin(adminAddress);
      await tx.wait();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error removing admin:", err);
      setError(parseContractError(err));
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRemoveAdmin}
        disabled={isRemoving}
        className="text-red-600 hover:bg-red-50 border-red-200"
      >
        {isRemoving ? "Removing..." : "Remove"}
      </Button>
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default RemoveAdminButton;
