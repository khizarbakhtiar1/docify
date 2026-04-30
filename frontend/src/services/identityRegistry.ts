/**
 * Service layer for IdentityRegistry smart contract interactions.
 * Handles admin management, higher authority, and institute registration/approval.
 */
import { ethers } from "ethers";
import {
  getIdentityRegistryRead,
  getIdentityRegistryWrite,
  getReadProvider,
  config,
  ABIS,
} from "./contracts";

// ─── Types ──────────────────────────────────────────────────────

export interface AdminData {
  address: string;
  isAdmin: boolean;
  exists: boolean;
}

export interface HigherAuthorityData {
  address: string;
  authorityName: string;
  isApproved: boolean;
  approvalCount: number;
  exists: boolean;
}

export interface InstituteData {
  address: string;
  institudeName: string;
  higherAuthority: string;
  isApproved: boolean;
  exists: boolean;
}

// ─── Read Functions ─────────────────────────────────────────────

/** Get the contract owner (super admin) address */
export async function getOwner(): Promise<string> {
  const contract = getIdentityRegistryRead();
  return contract.owner();
}

/** Check if an address is an admin */
export async function isAdmin(address: string): Promise<boolean> {
  const contract = getIdentityRegistryRead();
  const data = await contract.admins(address);
  return data.isAdmin;
}

/** Get admin data for an address */
export async function getAdminData(address: string): Promise<AdminData> {
  const contract = getIdentityRegistryRead();
  const data = await contract.admins(address);
  return {
    address,
    isAdmin: data.isAdmin,
    exists: data.exists,
  };
}

/** Get higher authority data for an address */
export async function getHigherAuthority(
  address: string
): Promise<HigherAuthorityData> {
  const contract = getIdentityRegistryRead();
  const data = await contract.higherAuthorities(address);
  return {
    address,
    authorityName: data.authorityName,
    isApproved: data.isApproved,
    approvalCount: Number(data.approvalCount),
    exists: data.exists,
  };
}

/** Get institute data for an address */
export async function getInstitute(address: string): Promise<InstituteData> {
  const contract = getIdentityRegistryRead();
  const data = await contract.institutes(address);
  return {
    address,
    institudeName: data.institudeName,
    higherAuthority: data.higherAuthority,
    isApproved: data.isApproved,
    exists: data.exists,
  };
}

/** Check if an admin has already approved a specific higher authority */
export async function hasAdminApproved(
  authorityAddress: string,
  adminAddress: string
): Promise<boolean> {
  const contract = getIdentityRegistryRead();
  return contract.higherAuthorityAdminApprovals(authorityAddress, adminAddress);
}

// ─── Event Query Functions ──────────────────────────────────────

/** Get all admins by querying AdminAdded/AdminRemoved events */
export async function getAllAdmins(): Promise<AdminData[]> {
  const contract = getIdentityRegistryRead();
  const provider = getReadProvider();

  // Query AdminAdded events
  const addedFilter = contract.filters.AdminAdded();
  const addedEvents = await contract.queryFilter(addedFilter, 0, "latest");

  // Query AdminRemoved events
  const removedFilter = contract.filters.AdminRemoved();
  const removedEvents = await contract.queryFilter(removedFilter, 0, "latest");

  // Build set of current admins
  const adminSet = new Set<string>();
  for (const event of addedEvents) {
    const parsed = contract.interface.parseLog({
      topics: event.topics as string[],
      data: event.data,
    });
    if (parsed) adminSet.add(parsed.args.admin);
  }
  for (const event of removedEvents) {
    const parsed = contract.interface.parseLog({
      topics: event.topics as string[],
      data: event.data,
    });
    if (parsed) adminSet.delete(parsed.args.admin);
  }

  // Also include the owner (first admin set in constructor)
  const owner = await contract.owner();
  adminSet.add(owner);

  // Verify each admin is still active
  const admins: AdminData[] = [];
  for (const addr of Array.from(adminSet)) {
    const data = await contract.admins(addr);
    if (data.isAdmin) {
      admins.push({ address: addr, isAdmin: true, exists: true });
    }
  }

  return admins;
}

/** Get pending (unapproved) higher authorities */
export async function getPendingHigherAuthorities(): Promise<
  HigherAuthorityData[]
> {
  const contract = getIdentityRegistryRead();

  // Query registration events
  const filter = contract.filters.HigherAuthorityRegistered();
  const events = await contract.queryFilter(filter, 0, "latest");

  const pending: HigherAuthorityData[] = [];
  const checked = new Set<string>();

  for (const event of events) {
    const parsed = contract.interface.parseLog({
      topics: event.topics as string[],
      data: event.data,
    });
    if (!parsed) continue;
    const addr = parsed.args.authority;
    if (checked.has(addr)) continue;
    checked.add(addr);

    const data = await contract.higherAuthorities(addr);
    if (data.exists && !data.isApproved) {
      pending.push({
        address: addr,
        authorityName: data.authorityName,
        isApproved: false,
        approvalCount: Number(data.approvalCount),
        exists: true,
      });
    }
  }

  return pending;
}

/** Get approved higher authorities */
export async function getApprovedHigherAuthorities(): Promise<
  HigherAuthorityData[]
> {
  const contract = getIdentityRegistryRead();

  // Query approval events
  const filter = contract.filters.HigherAuthorityApproved();
  const events = await contract.queryFilter(filter, 0, "latest");

  const approved: HigherAuthorityData[] = [];
  const checked = new Set<string>();

  for (const event of events) {
    const parsed = contract.interface.parseLog({
      topics: event.topics as string[],
      data: event.data,
    });
    if (!parsed) continue;
    const addr = parsed.args.authority;
    if (checked.has(addr)) continue;
    checked.add(addr);

    const data = await contract.higherAuthorities(addr);
    if (data.exists && data.isApproved) {
      approved.push({
        address: addr,
        authorityName: data.authorityName,
        isApproved: true,
        approvalCount: Number(data.approvalCount),
        exists: true,
      });
    }
  }

  return approved;
}

/** Get pending (unapproved) institutes */
export async function getPendingInstitutes(): Promise<InstituteData[]> {
  const contract = getIdentityRegistryRead();

  const filter = contract.filters.InstituteRegistered();
  const events = await contract.queryFilter(filter, 0, "latest");

  const pending: InstituteData[] = [];
  const checked = new Set<string>();

  for (const event of events) {
    const parsed = contract.interface.parseLog({
      topics: event.topics as string[],
      data: event.data,
    });
    if (!parsed) continue;
    const addr = parsed.args.institute;
    if (checked.has(addr)) continue;
    checked.add(addr);

    const data = await contract.institutes(addr);
    if (data.exists && !data.isApproved) {
      pending.push({
        address: addr,
        institudeName: data.institudeName,
        higherAuthority: data.higherAuthority,
        isApproved: false,
        exists: true,
      });
    }
  }

  return pending;
}

/** Get approved institutes */
export async function getApprovedInstitutes(): Promise<InstituteData[]> {
  const contract = getIdentityRegistryRead();

  const filter = contract.filters.InstituteApproved();
  const events = await contract.queryFilter(filter, 0, "latest");

  const approved: InstituteData[] = [];
  const checked = new Set<string>();

  for (const event of events) {
    const parsed = contract.interface.parseLog({
      topics: event.topics as string[],
      data: event.data,
    });
    if (!parsed) continue;
    const addr = parsed.args.institute;
    if (checked.has(addr)) continue;
    checked.add(addr);

    const data = await contract.institutes(addr);
    if (data.exists && data.isApproved) {
      approved.push({
        address: addr,
        institudeName: data.institudeName,
        higherAuthority: data.higherAuthority,
        isApproved: true,
        exists: true,
      });
    }
  }

  return approved;
}

// ─── Write Functions ────────────────────────────────────────────

/** Add a new admin (only owner/super admin) */
export async function addAdmin(
  address: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = await getIdentityRegistryWrite();
  return contract.addAdmin(address);
}

/** Remove an admin (only owner/super admin) */
export async function removeAdmin(
  address: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = await getIdentityRegistryWrite();
  return contract.removeAdmin(address);
}

/** Register as a higher authority */
export async function registerHigherAuthority(
  name: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = await getIdentityRegistryWrite();
  return contract.registerHigherAuthority(name);
}

/** Approve a higher authority (admin only) */
export async function approveHigherAuthority(
  address: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = await getIdentityRegistryWrite();
  return contract.approveHigherAuthority(address);
}

/** Reject a higher authority (admin only) */
export async function rejectHigherAuthority(
  address: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = await getIdentityRegistryWrite();
  return contract.rejectHigherAuthority(address);
}

/** Register as an institute */
export async function registerInstitute(
  name: string,
  higherAuthorityAddress: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = await getIdentityRegistryWrite();
  return contract.registerInstitute(name, higherAuthorityAddress);
}

/** Approve an institute (higher authority only) */
export async function approveInstitute(
  address: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = await getIdentityRegistryWrite();
  return contract.approveInstitute(address);
}

/** Reject an institute (higher authority only) */
export async function rejectInstitute(
  address: string
): Promise<ethers.ContractTransactionResponse> {
  const contract = await getIdentityRegistryWrite();
  return contract.rejectInstitute(address);
}
