/**
 * React hook for handling blockchain write operations with state management.
 * Provides loading, success, error states and transaction tracking.
 */
"use client";

import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { parseContractError } from "@/services/contracts";

export type TransactionState =
  | "idle"
  | "confirming" // user is signing in wallet
  | "pending" // tx submitted, waiting for block
  | "success"
  | "error";

export interface UseContractWriteReturn {
  /** Execute a contract write function */
  execute: (
    contractCall: () => Promise<ethers.ContractTransactionResponse>
  ) => Promise<ethers.ContractTransactionReceipt | null>;
  /** Current state of the transaction */
  state: TransactionState;
  /** Whether the transaction is in progress (confirming or pending) */
  isLoading: boolean;
  /** Whether the transaction succeeded */
  isSuccess: boolean;
  /** Whether the transaction failed */
  isError: boolean;
  /** Error message if failed */
  error: string | null;
  /** Transaction hash (available after submission) */
  txHash: string | null;
  /** Reset state back to idle */
  reset: () => void;
}

export function useContractWrite(): UseContractWriteReturn {
  const [state, setState] = useState<TransactionState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const reset = useCallback(() => {
    setState("idle");
    setError(null);
    setTxHash(null);
  }, []);

  const execute = useCallback(
    async (
      contractCall: () => Promise<ethers.ContractTransactionResponse>
    ): Promise<ethers.ContractTransactionReceipt | null> => {
      try {
        setState("confirming");
        setError(null);
        setTxHash(null);

        // User signs transaction in wallet
        const tx = await contractCall();
        setTxHash(tx.hash);
        setState("pending");

        // Wait for transaction to be mined
        const receipt = await tx.wait();
        setState("success");

        // Auto-reset after 5 seconds
        setTimeout(() => {
          setState("idle");
        }, 5000);

        return receipt;
      } catch (err) {
        const message = parseContractError(err);
        setError(message);
        setState("error");
        return null;
      }
    },
    []
  );

  return {
    execute,
    state,
    isLoading: state === "confirming" || state === "pending",
    isSuccess: state === "success",
    isError: state === "error",
    error,
    txHash,
    reset,
  };
}
