import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ethers } from "ethers";
import IdentityRegistryABI from "../../../../frontend/artifacts/contracts/IdentityRegistry.sol/IdentityRegistry.json"; // Adjust the path as needed

const RemoveAdminButton = ({ admin, admins, setAdmins }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoveAdmin = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature.");
      return;
    }

    setIsRemoving(true);

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contractAddress = "0x2A02EA91c93974D46533Abf1746061FA8c99352E";
      const contract = new ethers.Contract(
        contractAddress,
        IdentityRegistryABI.abi,
        signer
      );

      // Check if the current user is the owner of the contract
      const owner = await contract.owner();
      const currentAddress = await signer.getAddress();

      if (owner.toLowerCase() !== currentAddress.toLowerCase()) {
        throw new Error("Only the contract owner can remove admins.");
      }

      const tx = await contract.removeAdmin(admin.address);
      await tx.wait();

      setAdmins(admins.filter((a) => a.address !== admin.address));
      alert("Admin removed successfully!");
    } catch (error) {
      console.error("Error removing admin:", error);
      alert(`Failed to remove admin: ${error.message}`);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div>
      <Button
        variant="outline"
        onClick={handleRemoveAdmin}
        disabled={isRemoving}
      >
        {isRemoving ? "Removing..." : "Remove"}
      </Button>
    </div>
  );
};

export default RemoveAdminButton;
