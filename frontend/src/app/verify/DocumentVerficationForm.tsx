"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getInstituteContract,
  getTokenDocument,
  getTokenOwner,
  getInstituteOwner,
  getInstitute,
  getHigherAuthority,
  parseContractError,
} from "@/services";

interface VerificationResult {
  tokenId: number;
  ownerAddress: string;
  documentHash: string;
  instituteEOA: string;
  instituteName: string;
  instituteContract: string;
  higherAuthorityAddress: string;
  higherAuthorityName: string;
}

export function DocumentVerificationForm() {
  const [tokenId, setTokenId] = useState("");
  const [instituteAddr, setInstituteAddr] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const truncate = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenId.trim() || !instituteAddr.trim()) return;

    setIsVerifying(true);
    setError(null);
    setResult(null);
    setNotFound(false);

    try {
      const tokenNum = parseInt(tokenId, 10);
      if (isNaN(tokenNum) || tokenNum < 0) {
        setError("Token ID must be a valid positive number.");
        setIsVerifying(false);
        return;
      }

      // 1. Get the Institute contract address via Factory
      const instContract = await getInstituteContract(instituteAddr);
      if (!instContract || instContract === "0x0000000000000000000000000000000000000000") {
        setNotFound(true);
        setIsVerifying(false);
        return;
      }

      // 2. Get the document hash from the token
      let docHash: string;
      let ownerAddr: string;
      try {
        docHash = await getTokenDocument(instContract, tokenNum);
        ownerAddr = await getTokenOwner(instContract, tokenNum);
      } catch {
        setNotFound(true);
        setIsVerifying(false);
        return;
      }

      if (!docHash || docHash === "0x" + "0".repeat(64)) {
        setNotFound(true);
        setIsVerifying(false);
        return;
      }

      // 3. Get institute details
      const instEOA = await getInstituteOwner(instContract);
      const instData = await getInstitute(instEOA);

      // 4. Get higher authority details
      let haName = "Unknown";
      try {
        const haData = await getHigherAuthority(instData.higherAuthority);
        haName = haData.authorityName;
      } catch {
        // HA lookup might fail if not found
      }

      setResult({
        tokenId: tokenNum,
        ownerAddress: ownerAddr,
        documentHash: docHash,
        instituteEOA: instEOA,
        instituteName: instData.institudeName,
        instituteContract: instContract,
        higherAuthorityAddress: instData.higherAuthority,
        higherAuthorityName: haName,
      });
    } catch (err) {
      setError(parseContractError(err));
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight mb-4">
              Document Verification
            </h1>
            <p className="text-gray-500 text-lg max-w-lg mx-auto">
              Instantly verify the authenticity of any Soul Bound Token
              credential by querying the blockchain directly.
            </p>
          </div>

          <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
            <CardHeader className="text-center border-b border-gray-100 pb-6">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Verify On-Chain
              </CardTitle>
              <CardDescription className="text-gray-500 mt-2">
                Enter the institute address and SBT token ID to verify a credential
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              <form className="space-y-6" onSubmit={handleVerify}>
                <div className="space-y-3">
                  <Label htmlFor="inst-addr" className="text-sm font-medium text-gray-700">
                    Institute Wallet Address *
                  </Label>
                  <Input
                    id="inst-addr"
                    type="text"
                    placeholder="0x..."
                    value={instituteAddr}
                    onChange={(e) => setInstituteAddr(e.target.value)}
                    required
                    className="input-modern font-mono text-sm"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="token-id" className="text-sm font-medium text-gray-700">
                    SBT Token ID *
                  </Label>
                  <Input
                    id="token-id"
                    type="number"
                    placeholder="e.g. 1, 2, 3..."
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    required
                    min="0"
                    className="input-modern text-center text-lg"
                  />
                  <p className="text-xs text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    The token ID is the numeric ID of the Soul Bound Token issued by the institute
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {notFound && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
                    <div className="text-3xl mb-2">⚠️</div>
                    <h3 className="text-lg font-semibold text-yellow-800 mb-1">Token Not Found</h3>
                    <p className="text-sm text-yellow-700">
                      No SBT was found with this token ID at the given institute address. 
                      The token may not exist or may have been revoked.
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isVerifying || !tokenId.trim() || !instituteAddr.trim()}
                  className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2 rounded-md transition-colors"
                >
                  {isVerifying ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3" />
                      Querying Blockchain...
                    </div>
                  ) : (
                    "Verify Document"
                  )}
                </Button>
              </form>
            </CardContent>

            {result && (
              <CardFooter className="border-t border-gray-200 mt-6">
                <div className="w-full space-y-6 animate-slide-up">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-green-600 mb-2">✅ Document Verified</h3>
                    <p className="text-gray-600">
                      This Soul Bound Token is authentic and exists on the blockchain
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        Token Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Token ID:</span>
                          <span className="font-bold text-gray-900">#{result.tokenId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Holder:</span>
                          <span className="font-mono text-sm text-blue-600">
                            {truncate(result.ownerAddress)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Document Hash:</span>
                          <span className="font-mono text-xs text-gray-700">
                            {truncate(result.documentHash)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        Issuer Details
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Institute:</span>
                          <span className="font-medium">{result.instituteName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Institute Address:</span>
                          <span className="font-mono text-sm text-blue-600">
                            {truncate(result.instituteEOA)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Higher Authority:</span>
                          <span className="font-medium">{result.higherAuthorityName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Token Standard:</span>
                          <span className="font-medium">ERC-721 (SBT)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
                    <Button
                      onClick={() => { setResult(null); setTokenId(""); setInstituteAddr(""); }}
                      className="bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      Verify Another
                    </Button>
                  </div>
                </div>
              </CardFooter>
            )}
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-center text-sm">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">On-Chain Verification</h3>
              <p className="text-gray-500">Queries the blockchain directly with no intermediary.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Tamper-Proof</h3>
              <p className="text-gray-500">Soul Bound Tokens cannot be transferred or forged.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Globally Verifiable</h3>
              <p className="text-gray-500">Anyone can verify credentials instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
