/**
 * Inline transaction status indicator component.
 * Shows visual feedback for each stage of a blockchain transaction.
 */
"use client";

import React from "react";
import { TransactionState } from "@/hooks/useContractWrite";

interface TransactionStatusProps {
  state: TransactionState;
  txHash: string | null;
  error: string | null;
  onRetry?: () => void;
  onReset?: () => void;
  /** Optional block explorer base URL */
  explorerUrl?: string;
}

export function TransactionStatus({
  state,
  txHash,
  error,
  onRetry,
  onReset,
  explorerUrl,
}: TransactionStatusProps) {
  if (state === "idle") return null;

  return (
    <div className="mt-4 animate-fade-in">
      {state === "confirming" && (
        <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="w-5 h-5 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Waiting for wallet confirmation...
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              Please confirm the transaction in your wallet.
            </p>
          </div>
        </div>
      )}

      {state === "pending" && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-800">
              Transaction submitted. Waiting for confirmation...
            </p>
            {txHash && (
              <p className="text-xs text-blue-600 mt-1 font-mono">
                TX:{" "}
                {explorerUrl ? (
                  <a
                    href={`${explorerUrl}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-blue-800"
                  >
                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </a>
                ) : (
                  <span>
                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      )}

      {state === "success" && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-green-800">
              Transaction confirmed!
            </p>
            {txHash && (
              <p className="text-xs text-green-600 mt-1 font-mono">
                TX:{" "}
                {explorerUrl ? (
                  <a
                    href={`${explorerUrl}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-green-800"
                  >
                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </a>
                ) : (
                  <span>
                    {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </span>
                )}
              </p>
            )}
          </div>
          {onReset && (
            <button
              onClick={onReset}
              className="text-xs text-green-700 hover:text-green-900 font-medium"
            >
              Dismiss
            </button>
          )}
        </div>
      )}

      {state === "error" && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-4 h-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">
              Transaction failed
            </p>
            {error && (
              <p className="text-xs text-red-600 mt-1">{error}</p>
            )}
          </div>
          <div className="flex gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg font-medium transition-colors"
              >
                Retry
              </button>
            )}
            {onReset && (
              <button
                onClick={onReset}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
