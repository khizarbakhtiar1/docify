/**
 * Service layer for Authority smart contract interactions.
 * Handles document approval/rejection and institute management for a specific Authority.
 */
import { ethers } from "ethers";
import { getAuthorityRead, getAuthorityWrite } from "./contracts";

// ─── Types ──────────────────────────────────────────────────────

export interface AuthorityInfo {
  contractAddress: string;
  owner: string;
  isSuperAuthority: boolean;
}

// ─── Read Functions ─────────────────────────────────────────────

/** Get the owner (higher authority EOA) of an Authority contract */
export async function getAuthorityOwner(
  contractAddress: string
): Promise<string> {
  const contract = getAuthorityRead(contractAddress);
  return contract.owner();
}

/** Check if a specific Authority is a super authority */
export async function isSuperAuthority(
  contractAddress: string
): Promise<boolean> {
  const contract = getAuthorityRead(contractAddress);
  return contract.isSuperAuthority();
}

/** Get the Institute contract address registered under this Authority for a given institute EOA */
export async function getInstituteUnderAuthority(
  contractAddress: string,
  instituteEOA: string
): Promise<string> {
  const contract = getAuthorityRead(contractAddress);
  return contract.institutes(instituteEOA);
}

/** Get all institutes under this authority by querying events */
export async function getInstitutesUnderAuthority(
  contractAddress: string
): Promise<Array<{ instituteEOA: string; instituteContract: string }>> {
  const contract = getAuthorityRead(contractAddress);

  const filter = contract.filters.InstituteAdded();
  const events = await contract.queryFilter(filter, 0, "latest");

  // Also check for removed institutes
  const revokedFilter = contract.filters.InstituteAccessRevoked();
  const revokedEvents = await contract.queryFilter(
    revokedFilter,
    0,
    "latest"
  );
  const revokedSet = new Set<string>();
  for (const event of revokedEvents) {
    const parsed = contract.interface.parseLog({
      topics: event.topics as string[],
      data: event.data,
    });
    if (parsed) revokedSet.add(parsed.args.institute);
  }

  const institutes: Array<{ instituteEOA: string; instituteContract: string }> =
    [];
  for (const event of events) {
    const parsed = contract.interface.parseLog({
      topics: event.topics as string[],
      data: event.data,
    });
    if (!parsed) continue;
    const instituteEOA = parsed.args.institute;
    if (revokedSet.has(instituteEOA)) continue;

    const instituteContract = await contract.institutes(instituteEOA);
    if (instituteContract !== ethers.ZeroAddress) {
      institutes.push({ instituteEOA, instituteContract });
    }
  }

  return institutes;
}

// ─── Write Functions ────────────────────────────────────────────

/** Approve a document request from an institute */
export async function approveDocumentRequest(
  authorityContractAddr: string,
  instituteEOA: string,
  documentHash: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = await getAuthorityWrite(authorityContractAddr);
  return contract.approveDocumentRequest(instituteEOA, documentHash);
}

/** Reject a document request from an institute */
export async function rejectDocumentRequest(
  authorityContractAddr: string,
  instituteEOA: string,
  documentHash: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = await getAuthorityWrite(authorityContractAddr);
  return contract.rejectDocumentRequest(instituteEOA, documentHash);
}

/** Revoke an institute's access */
export async function revokeInstituteAccess(
  authorityContractAddr: string,
  instituteEOA: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = await getAuthorityWrite(authorityContractAddr);
  return contract.revokeInstituteAccess(instituteEOA);
}
