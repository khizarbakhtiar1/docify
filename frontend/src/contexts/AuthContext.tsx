"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";

// Contract addresses - Update these with your deployed contract addresses
const IDENTITY_REGISTRY_ADDRESS =
  process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS || "";
const IDENTITY_REGISTRY_ABI = [
  "function admins(address) view returns (bool isAdmin, bool exists)",
  "function higherAuthorities(address) view returns (address walletAddress, string authorityName, uint8 approvalCount, bool isApproved, bool exists)",
  "function institutes(address) view returns (string institudeName, address higherAuthority, bool isApproved, bool exists)",
  "function owner() view returns (address)",
];

export type UserRole =
  | "super-admin"
  | "admin"
  | "higher-authority"
  | "institute"
  | "unregistered"
  | "user";

interface User {
  address: string;
  role: UserRole;
  isApproved: boolean;
  instituteName?: string;
  authorityName?: string;
}

interface AuthContextType {
  // Wallet connection
  isConnected: boolean;
  address: string | null;
  provider: ethers.BrowserProvider | null;

  // User data
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Methods
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  checkUserRole: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Cookie management for middleware
  const setCookie = useCallback(
    (name: string, value: string, days: number = 7) => {
      const expires = new Date();
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    },
    []
  );

  const deleteCookie = useCallback((name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }, []);

  // Initialize provider and check existing connection
  const initializeProvider = useCallback(async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(browserProvider);

        // Check if already connected
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          setCookie("wallet-connected", "true");
          await checkUserRole(accounts[0], browserProvider);
        }
      } catch (error) {
        console.error("Error initializing provider:", error);
        setError("Failed to initialize Web3 provider");
      }
    } else {
      setError(
        "MetaMask not detected. Please install MetaMask to use this application."
      );
    }
    setIsLoading(false);
  }, []);

  // Check user role from smart contract
  const checkUserRole = useCallback(
    async (userAddress?: string, providerInstance?: ethers.BrowserProvider) => {
      const targetAddress = userAddress || address;
      const targetProvider = providerInstance || provider;

      if (!targetAddress || !targetProvider || !IDENTITY_REGISTRY_ADDRESS) {
        console.warn("Missing requirements for role check");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const contract = new ethers.Contract(
          IDENTITY_REGISTRY_ADDRESS,
          IDENTITY_REGISTRY_ABI,
          targetProvider
        );

        // Check if user is super admin (owner)
        const owner = await contract.owner();
        if (targetAddress.toLowerCase() === owner.toLowerCase()) {
          const userData: User = {
            address: targetAddress,
            role: "super-admin",
            isApproved: true,
          };
          setUser(userData);
          setCookie("user-role", "super-admin");
          setCookie("user-approved", "true");
          redirectToRolePage("super-admin");
          return;
        }

        // Check if user is admin
        const adminData = await contract.admins(targetAddress);
        if (adminData.exists && adminData.isAdmin) {
          const userData: User = {
            address: targetAddress,
            role: "admin",
            isApproved: true,
          };
          setUser(userData);
          setCookie("user-role", "admin");
          setCookie("user-approved", "true");
          redirectToRolePage("admin");
          return;
        }

        // Check if user is higher authority
        const authorityData = await contract.higherAuthorities(targetAddress);
        if (authorityData.exists) {
          const userData: User = {
            address: targetAddress,
            role: "higher-authority",
            isApproved: authorityData.isApproved,
            authorityName: authorityData.authorityName,
          };
          setUser(userData);
          setCookie("user-role", "higher-authority");
          setCookie("user-approved", authorityData.isApproved.toString());
          redirectToRolePage("higher-authority", authorityData.isApproved);
          return;
        }

        // Check if user is institute
        const instituteData = await contract.institutes(targetAddress);
        if (instituteData.exists) {
          const userData: User = {
            address: targetAddress,
            role: "institute",
            isApproved: instituteData.isApproved,
            instituteName: instituteData.institudeName,
          };
          setUser(userData);
          setCookie("user-role", "institute");
          setCookie("user-approved", instituteData.isApproved.toString());
          redirectToRolePage("institute", instituteData.isApproved);
          return;
        }

        // User is not registered in any role
        const userData: User = {
          address: targetAddress,
          role: "unregistered",
          isApproved: false,
        };
        setUser(userData);
        setCookie("user-role", "unregistered");
        setCookie("user-approved", "false");
        redirectToRolePage("unregistered");
      } catch (error) {
        console.error("Error checking user role:", error);
        setError("Failed to verify user role. Please try again.");

        // Fallback to regular user
        const userData: User = {
          address: targetAddress,
          role: "user",
          isApproved: false,
        };
        setUser(userData);
        setCookie("user-role", "user");
        setCookie("user-approved", "false");
      } finally {
        setIsLoading(false);
      }
    },
    [address, provider]
  );

  // Redirect based on user role
  const redirectToRolePage = (role: UserRole, isApproved: boolean = true) => {
    const currentPath = window.location.pathname;

    // Don't redirect if already on the correct page
    const rolePages: Record<UserRole, string> = {
      "super-admin": "/admin",
      admin: "/admin",
      "higher-authority": "/higher-authority",
      institute: "/institute",
      unregistered: "/register",
      user: "/verify",
    };

    const targetPage = rolePages[role];

    // Only redirect if user is not on homepage and not on the target page
    // This prevents unnecessary redirects that cause blank pages
    if (currentPath === "/" || currentPath === targetPage) {
      return;
    }

    // For pending approvals, show appropriate waiting/status page
    if (!isApproved && (role === "higher-authority" || role === "institute")) {
      router.push(`${targetPage}?status=pending`);
      return;
    }

    router.push(targetPage);
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask not detected. Please install MetaMask to continue.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First ensure we have a provider
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const userAddress = accounts[0];
        setAddress(userAddress);
        setIsConnected(true);
        setCookie("wallet-connected", "true");

        await checkUserRole(userAddress, browserProvider);
      } else {
        setError("No accounts found. Please check your wallet connection.");
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        setError("Connection request was rejected. Please try again.");
      } else if (error.code === -32002) {
        setError(
          "A connection request is already pending. Please check your wallet."
        );
      } else {
        setError(
          "Failed to connect wallet. Please ensure MetaMask is unlocked and try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setUser(null);
    setError(null);

    // Clear cookies
    deleteCookie("wallet-connected");
    deleteCookie("user-role");
    deleteCookie("user-approved");

    // Actually disconnect from MetaMask if possible
    if (window.ethereum && window.ethereum.selectedAddress) {
      // Some wallets support programmatic disconnection
      if (window.ethereum.disconnect) {
        window.ethereum.disconnect();
      }
      // Alternative: Clear the connection by requesting account access with empty array
      // This effectively "disconnects" by not allowing any accounts
      window.ethereum
        .request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        })
        .catch(() => {
          // Ignore errors - user might cancel the permission request
          console.log("Wallet disconnect completed");
        });
    }

    router.push("/");
  };

  // Refresh user data
  const refreshUserData = async () => {
    if (address && provider) {
      await checkUserRole();
    }
  };

  // Handle account changes
  const handleAccountsChanged = useCallback(
    (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== address) {
        setAddress(accounts[0]);
        setIsConnected(true);
        setCookie("wallet-connected", "true");
        if (provider) {
          checkUserRole(accounts[0], provider);
        }
      }
    },
    [address, provider, checkUserRole, setCookie]
  );

  // Handle chain changes
  const handleChainChanged = useCallback(() => {
    // Reload the page when chain changes
    window.location.reload();
  }, []);

  useEffect(() => {
    initializeProvider();
  }, [initializeProvider]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [handleAccountsChanged, handleChainChanged]);

  const value: AuthContextType = {
    isConnected,
    address,
    provider,
    user,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    checkUserRole: () => checkUserRole(),
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
