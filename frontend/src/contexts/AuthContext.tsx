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
import {
  getOwner,
  isAdmin as checkIsAdmin,
  getHigherAuthority,
  getInstitute,
  validateConfig,
} from "@/services";

// ─── Types ──────────────────────────────────────────────────────

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

  // Config status
  isConfigValid: boolean;

  // Methods
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  checkUserRole: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

// ─── Ethereum Window Type ───────────────────────────────────────

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (
    event: string,
    handler: (...args: unknown[]) => void
  ) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

// ─── Context ────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ─── Provider ───────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { valid: isConfigValid } = validateConfig();
  const router = useRouter();

  // ── Cookie helpers (for middleware route guarding) ─────────
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

  // ── Role checking (uses services layer) ───────────────────
  const checkUserRole = useCallback(
    async (
      userAddress?: string,
      providerInstance?: ethers.BrowserProvider
    ) => {
      const targetAddress = userAddress || address;
      if (!targetAddress || !isConfigValid) {
        console.warn(
          "Cannot check role: missing address or contract config"
        );
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // 1. Check if super admin (contract owner)
        const owner = await getOwner();
        if (targetAddress.toLowerCase() === owner.toLowerCase()) {
          const userData: User = {
            address: targetAddress,
            role: "super-admin",
            isApproved: true,
          };
          setUser(userData);
          setCookie("user-role", "super-admin");
          setCookie("user-approved", "true");
          return;
        }

        // 2. Check if admin
        const adminStatus = await checkIsAdmin(targetAddress);
        if (adminStatus) {
          const userData: User = {
            address: targetAddress,
            role: "admin",
            isApproved: true,
          };
          setUser(userData);
          setCookie("user-role", "admin");
          setCookie("user-approved", "true");
          return;
        }

        // 3. Check if higher authority
        const authorityData = await getHigherAuthority(targetAddress);
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
          return;
        }

        // 4. Check if institute
        const instituteData = await getInstitute(targetAddress);
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
          return;
        }

        // 5. Not registered
        const userData: User = {
          address: targetAddress,
          role: "unregistered",
          isApproved: false,
        };
        setUser(userData);
        setCookie("user-role", "unregistered");
        setCookie("user-approved", "false");
      } catch (err) {
        console.error("Error checking user role:", err);
        setError("Failed to verify user role. Please check your network connection.");

        // Fallback: set as generic user so the app doesn't break
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
    [address, isConfigValid, setCookie]
  );

  // ── Initialize: check for existing wallet connection ──────
  const initializeProvider = useCallback(async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(browserProvider);

        // Check if already connected (no popup)
        const accounts = (await window.ethereum.request({
          method: "eth_accounts",
        })) as string[];

        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          setCookie("wallet-connected", "true");
          await checkUserRole(accounts[0], browserProvider);
        }
      } catch (err) {
        console.error("Error initializing provider:", err);
        setError("Failed to initialize Web3 provider");
      }
    }
    // No MetaMask is not an error — user just hasn't installed it
    setIsLoading(false);
  }, [checkUserRole, setCookie]);

  // ── Connect wallet ────────────────────────────────────────
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError(
        "MetaMask not detected. Please install MetaMask to continue."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      // Request account access (shows MetaMask popup)
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts.length > 0) {
        const userAddress = accounts[0];
        setAddress(userAddress);
        setIsConnected(true);
        setCookie("wallet-connected", "true");
        await checkUserRole(userAddress, browserProvider);
      } else {
        setError("No accounts found. Please check your wallet connection.");
      }
    } catch (err: unknown) {
      console.error("Error connecting wallet:", err);
      const error = err as { code?: number };
      if (error.code === 4001) {
        setError("Connection request was rejected. Please try again.");
      } else if (error.code === -32002) {
        setError(
          "A connection request is already pending. Please check your wallet."
        );
      } else {
        setError(
          "Failed to connect wallet. Please ensure MetaMask is unlocked."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ── Disconnect wallet ─────────────────────────────────────
  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress(null);
    setUser(null);
    setError(null);

    deleteCookie("wallet-connected");
    deleteCookie("user-role");
    deleteCookie("user-approved");

    router.push("/");
  };

  // ── Refresh user data ─────────────────────────────────────
  const refreshUserData = async () => {
    if (address) {
      await checkUserRole();
    }
  };

  // ── Handle account/chain changes ──────────────────────────
  const handleAccountsChanged = useCallback(
    (accounts: unknown) => {
      const accts = accounts as string[];
      if (accts.length === 0) {
        disconnectWallet();
      } else if (accts[0] !== address) {
        setAddress(accts[0]);
        setIsConnected(true);
        setCookie("wallet-connected", "true");
        checkUserRole(accts[0]);
      }
    },
    [address, checkUserRole, setCookie]
  );

  const handleChainChanged = useCallback(() => {
    // Reload page when chain changes so provider re-initializes
    window.location.reload();
  }, []);

  // ── Effects ───────────────────────────────────────────────
  useEffect(() => {
    initializeProvider();
  }, [initializeProvider]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          window.ethereum.removeListener(
            "chainChanged",
            handleChainChanged
          );
        }
      };
    }
  }, [handleAccountsChanged, handleChainChanged]);

  // ── Context value ─────────────────────────────────────────
  const value: AuthContextType = {
    isConnected,
    address,
    provider,
    user,
    isLoading,
    error,
    isConfigValid,
    connectWallet,
    disconnectWallet,
    checkUserRole: () => checkUserRole(),
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
