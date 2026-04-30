/**
 * Service layer for Institute smart contract interactions.
 * Handles document submissions, credit purchases, SBT minting, and token queries.
 */
import { ethers } from "ethers";
import { getInstituteRead, getInstituteWrite } from "./contracts";

// ─── Types ──────────────────────────────────────────────────────

export enum CreditPlan {
  Basic = 1,
  Standard = 2,
  Premium = 3,
}

export const PLAN_DETAILS = {
  [CreditPlan.Basic]: {
    name: "Basic",
    credits: 100,
    price: "0.049", // ETH
  },
  [CreditPlan.Standard]: {
    name: "Standard",
    credits: 500,
    price: "0.199",
  },
  [CreditPlan.Premium]: {
    name: "Premium",
    credits: 1500,
    price: "0.499",
  },
} as const;

export interface DocumentRequest {
  documentHash: string;
  isRequested: boolean;
  isApproved: boolean;
  blockNumber?: number;
}

export interface MintedToken {
  tokenId: number;
  recipient: string;
  documentHash: string;
  blockNumber?: number;
}

// ─── Read Functions ─────────────────────────────────────────────

/** Get the current credit balance for an institute */
export async function getCreditBalance(
  contractAddress: string
): Promise<number> {
  const contract = getInstituteRead(contractAddress);
  const balance = await contract.getCreditBalance();
  return Number(balance);
}

/** Check if a document has been requested */
export async function isDocumentRequested(
  contractAddress: string,
  documentHash: string
): Promise<boolean> {
  const contract = getInstituteRead(contractAddress);
  return contract.documentRequests(documentHash);
}

/** Check if a document has been approved */
export async function isDocumentApproved(
  contractAddress: string,
  documentHash: string
): Promise<boolean> {
  const contract = getInstituteRead(contractAddress);
  return contract.approvedDocuments(documentHash);
}

/** Get the document hash for a given token ID */
export async function getTokenDocument(
  contractAddress: string,
  tokenId: number
): Promise<string> {
  const contract = getInstituteRead(contractAddress);
  return contract.tokenToDocument(tokenId);
}

/** Get the owner of a specific SBT token */
export async function getTokenOwner(
  contractAddress: string,
  tokenId: number
): Promise<string> {
  const contract = getInstituteRead(contractAddress);
  return contract.ownerOf(tokenId);
}

/** Get the institute's EOA address */
export async function getInstituteOwner(
  contractAddress: string
): Promise<string> {
  const contract = getInstituteRead(contractAddress);
  return contract.owner();
}

// ─── Event Query Functions ──────────────────────────────────────

/** Get all submitted document requests from events */
export async function getDocumentRequests(
  contractAddress: string
): Promise<DocumentRequest[]> {
  const contract = getInstituteRead(contractAddress);

  const filter = contract.filters.DocumentRequestSubmitted();
  const events = await contract.queryFilter(filter, 0, "latest");

  const requests: DocumentRequest[] = [];
  for (const event of events) {
    const parsed = contract.interface.parseLog({
      topics: event.topics as string[],
      data: event.data,
    });
    if (!parsed) continue;
    const hash = parsed.args.documentHash;

    const isRequested = await contract.documentRequests(hash);
    const isApproved = await contract.approvedDocuments(hash);

    requests.push({
      documentHash: hash,
      isRequested,
      isApproved,
      blockNumber: event.blockNumber,
    });
  }

  return requests;
}

/** Get all minted SBT tokens from events */
export async function getMintedTokens(
  contractAddress: string
): Promise<MintedToken[]> {
  const contract = getInstituteRead(contractAddress);

  const filter = contract.filters.SoulBoundTokenMinted();
  const events = await contract.queryFilter(filter, 0, "latest");

  const tokens: MintedToken[] = [];
  for (const event of events) {
    const parsed = contract.interface.parseLog({
      topics: event.topics as string[],
      data: event.data,
    });
    if (!parsed) continue;

    tokens.push({
      tokenId: Number(parsed.args.tokenId),
      recipient: parsed.args.to,
      documentHash: parsed.args.documentHash,
      blockNumber: event.blockNumber,
    });
  }

  return tokens;
}

// ─── Write Functions ────────────────────────────────────────────

/** Submit a document request (requires credits > 0) */
export async function submitDocumentRequest(
  contractAddress: string,
  documentHash: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = await getInstituteWrite(contractAddress);
  return contract.submitDocumentRequest(documentHash);
}

/** Purchase credits by selecting a plan */
export async function purchaseCredits(
  contractAddress: string,
  plan: CreditPlan
): Promise<ethers.ContractTransactionResponse> {
  const planInfo = PLAN_DETAILS[plan];
  if (!planInfo) throw new Error("Invalid plan type");

  const contract = await getInstituteWrite(contractAddress);
  return contract.purchaseCredits(plan, {
    value: ethers.parseEther(planInfo.price),
  });
}

/** Mint a SoulBound Token for an approved document */
export async function mintSoulBoundToken(
  contractAddress: string,
  recipientAddress: string,
  documentHash: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = await getInstituteWrite(contractAddress);
  return contract.mintSoulBoundToken(recipientAddress, documentHash);
}

/** Revoke (burn) a SoulBound Token */
export async function revokeSoulBoundToken(
  contractAddress: string,
  tokenId: number
): Promise<ethers.ContractTransactionResponse> {
  const contract = await getInstituteWrite(contractAddress);
  return contract.revokeSoulBoundToken(tokenId);
}

// ─── Utility ────────────────────────────────────────────────────

/** Compute a document hash from file contents (for frontend use) */
export async function computeDocumentHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = new Uint8Array(hashBuffer);
  // Convert to bytes32 hex string
  return "0x" + Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Compute a document hash from a text string */
export function computeTextHash(text: string): string {
  return ethers.keccak256(ethers.toUtf8Bytes(text));
}
