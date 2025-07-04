"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { addAdmin } from "@/utils/ethers";
import { ethers, isAddress } from "ethers";

const AddAdminButton = ({ admins, setAdmins }) => {
  const [newAdminAddress, setNewAdminAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddAdmin = async () => {
    if (
      newAdminAddress.trim() !== "" &&
      isAddress(newAdminAddress)
    ) {
      setIsLoading(true);
      setError(null);
      try {
        await addAdmin(newAdminAddress);
        setAdmins([
          ...admins,
          { id: `ADMIN-${admins.length + 1}`, address: newAdminAddress },
        ]);
        setNewAdminAddress("");
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Please enter a valid Ethereum address");
    }
  };

  return (
    <div className="gradient-card p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4">Add New Admin</h3>
      <div className="flex flex-col gap-4">
        <input
          className="py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          type="text"
          value={newAdminAddress}
          onChange={(e) => setNewAdminAddress(e.target.value)}
          placeholder="Enter Ethereum address (0x...)"
        />
        <Button 
          onClick={handleAddAdmin} 
          disabled={isLoading}
          className="btn-gradient w-full"
        >
          {isLoading ? "Adding..." : "Add Admin"}
        </Button>
        {error && (
          <p className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddAdminButton;
