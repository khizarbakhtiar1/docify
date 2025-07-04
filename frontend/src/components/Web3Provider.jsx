import { ethers } from "ethers";
import { useState, useEffect } from "react";

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const initProvider = async () => {
      if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
        } catch (error) {
          console.error("Failed to initialize Web3 provider:", error);
        }
      }
    };

    initProvider();
  }, []);

  if (!provider) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-gray-600">Loading Web3...</div>
      </div>
    );
  }

  return children;
};
