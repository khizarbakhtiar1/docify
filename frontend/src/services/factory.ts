/**
 * Service layer for Factory smart contract interactions.
 * Provides lookup of deployed Authority and Institute contract addresses.
 */
import { ethers } from "ethers";
import { getFactoryRead } from "./contracts";

/** Get the Authority contract address for a higher authority's EOA */
export async function getAuthorityContract(
  higherAuthorityAddress: string
): Promise<string> {
  const contract = getFactoryRead();
  const addr = await contract.getAuthorityContract(higherAuthorityAddress);
  return addr;
}

/** Get the Institute contract address for an institute's EOA */
export async function getInstituteContract(
  instituteAddress: string
): Promise<string> {
  const contract = getFactoryRead();
  const addr = await contract.getInstituteContract(instituteAddress);
  return addr;
}

/** Check if an Authority contract exists for the given address */
export async function hasAuthorityContract(
  higherAuthorityAddress: string
): Promise<boolean> {
  const addr = await getAuthorityContract(higherAuthorityAddress);
  return addr !== ethers.ZeroAddress;
}

/** Check if an Institute contract exists for the given address */
export async function hasInstituteContract(
  instituteAddress: string
): Promise<boolean> {
  const addr = await getInstituteContract(instituteAddress);
  return addr !== ethers.ZeroAddress;
}
