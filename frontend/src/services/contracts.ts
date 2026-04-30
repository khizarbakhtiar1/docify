/**
 * Core contract configuration and provider management.
 * All contract interactions flow through this module.
 */
import { ethers } from "ethers";

// ABIs — imported from compiled artifacts
import IdentityRegistryArtifact from "../../artifacts/contracts/IdentityRegistry.sol/IdentityRegistry.json";
import FactoryArtifact from "../../artifacts/contracts/Factory.sol/Factory.json";
import AuthorityArtifact from "../../artifacts/contracts/Authority.sol/Authority.json";
import InstituteArtifact from "../../artifacts/contracts/Institute.sol/Institute.json";

// ─── Environment Config ────────────────────────────────────────
export const config = {
  identityRegistryAddress:
    process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS || "",
  factoryAddress: process.env.NEXT_PUBLIC_FACTORY_ADDRESS || "",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8545",
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "1337", 10),
} as const;

// ─── ABI Exports ────────────────────────────────────────────────
export const ABIS = {
  IdentityRegistry: IdentityRegistryArtifact.abi,
  Factory: FactoryArtifact.abi,
  Authority: AuthorityArtifact.abi,
  Institute: InstituteArtifact.abi,
} as const;

// ─── Provider Helpers ───────────────────────────────────────────

/** Read-only provider (no wallet needed) */
export function getReadProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider(config.rpcUrl);
}

/** Get a browser wallet signer (requires MetaMask/injected wallet) */
export async function getSigner(): Promise<ethers.Signer> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("No wallet detected. Please install MetaMask.");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider.getSigner();
}

/** Get a browser wallet provider */
export function getBrowserProvider(): ethers.BrowserProvider | null {
  if (typeof window === "undefined" || !window.ethereum) return null;
  return new ethers.BrowserProvider(window.ethereum);
}

// ─── Contract Instance Factories ────────────────────────────────

/** IdentityRegistry — read-only */
export function getIdentityRegistryRead(): ethers.Contract {
  if (!config.identityRegistryAddress)
    throw new Error("NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS not set");
  return new ethers.Contract(
    config.identityRegistryAddress,
    ABIS.IdentityRegistry,
    getReadProvider()
  );
}

/** IdentityRegistry — with signer for write operations */
export async function getIdentityRegistryWrite(): Promise<ethers.Contract> {
  if (!config.identityRegistryAddress)
    throw new Error("NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS not set");
  const signer = await getSigner();
  return new ethers.Contract(
    config.identityRegistryAddress,
    ABIS.IdentityRegistry,
    signer
  );
}

/** Factory — read-only */
export function getFactoryRead(): ethers.Contract {
  if (!config.factoryAddress)
    throw new Error("NEXT_PUBLIC_FACTORY_ADDRESS not set");
  return new ethers.Contract(
    config.factoryAddress,
    ABIS.Factory,
    getReadProvider()
  );
}

/** Factory — with signer */
export async function getFactoryWrite(): Promise<ethers.Contract> {
  if (!config.factoryAddress)
    throw new Error("NEXT_PUBLIC_FACTORY_ADDRESS not set");
  const signer = await getSigner();
  return new ethers.Contract(config.factoryAddress, ABIS.Factory, signer);
}

/** Authority contract at a specific address — read-only */
export function getAuthorityRead(contractAddress: string): ethers.Contract {
  return new ethers.Contract(
    contractAddress,
    ABIS.Authority,
    getReadProvider()
  );
}

/** Authority contract at a specific address — with signer */
export async function getAuthorityWrite(
  contractAddress: string
): Promise<ethers.Contract> {
  const signer = await getSigner();
  return new ethers.Contract(contractAddress, ABIS.Authority, signer);
}

/** Institute contract at a specific address — read-only */
export function getInstituteRead(contractAddress: string): ethers.Contract {
  return new ethers.Contract(
    contractAddress,
    ABIS.Institute,
    getReadProvider()
  );
}

/** Institute contract at a specific address — with signer */
export async function getInstituteWrite(
  contractAddress: string
): Promise<ethers.Contract> {
  const signer = await getSigner();
  return new ethers.Contract(contractAddress, ABIS.Institute, signer);
}

// ─── Utility ────────────────────────────────────────────────────

/** Validate that required env vars are set */
export function validateConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!config.identityRegistryAddress)
    missing.push("NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS");
  if (!config.factoryAddress) missing.push("NEXT_PUBLIC_FACTORY_ADDRESS");
  return { valid: missing.length === 0, missing };
}

/** Parse a Solidity revert reason into a human-readable message */
export function parseContractError(error: unknown): string {
  const err = error as Record<string, unknown>;
  // ethers v6 error format
  if (err?.reason) return String(err.reason);
  if (err?.message) {
    const match = String(err.message).match(
      /reason="([^"]+)"/
    );
    if (match) return match[1];
    // User rejected
    if (String(err.message).includes("user rejected"))
      return "Transaction was cancelled by the user.";
    // Insufficient funds
    if (String(err.message).includes("insufficient funds"))
      return "Insufficient ETH balance for this transaction.";
    return String(err.message).slice(0, 200);
  }
  return "An unknown error occurred.";
}
