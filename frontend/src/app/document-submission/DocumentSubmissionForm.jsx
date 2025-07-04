"use client";

import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DocumentSubmissionForm() {
  const [documentType, setDocumentType] = useState("");
  const [holderName, setHolderName] = useState("");
  const [documentId, setDocumentId] = useState("");
  const [documentHash, setDocumentHash] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitDocument(
        documentType,
        holderName,
        documentId,
        documentHash,
        file
      );
      setSuccess(true);
    } catch (err) {
      setError("Failed to submit document. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const generateDocumentHash = () => {
    const hash = "0x1234567890abcdef";
    setDocumentHash(hash);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md sm:p-10"
    >
      <div className="mb-4">
        <label
          htmlFor="documentType"
          className="block text-gray-700 font-bold mb-2"
        >
          Document Type
        </label>
        <Select
          id="documentType"
          value={documentType}
          className="w-full"
          onValueChange={(value) => setDocumentType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="birth-certificate">Birth Certificate</SelectItem>
            <SelectItem value="marriage-certificate">
              Marriage Certificate
            </SelectItem>
            <SelectItem value="death-certificate">Death Certificate</SelectItem>
            <SelectItem value="diploma">Diploma</SelectItem>
            <SelectItem value="degree">Degree</SelectItem>
            <SelectItem value="transcript">Transcript</SelectItem>
            <SelectItem value="license">License</SelectItem>
            <SelectItem value="passport">Passport</SelectItem>
            <SelectItem value="id-card">ID Card</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mb-4">
        <label
          htmlFor="holderName"
          className="block text-gray-700 font-bold mb-2"
        >
          Document Holder Name
        </label>
        <Input
          id="holderName"
          type="text"
          value={holderName}
          onChange={(e) => setHolderName(e.target.value)}
          placeholder="Enter document holder name"
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="documentId"
          className="block text-gray-700 font-bold mb-2"
        >
          Document ID
        </label>
        <Input
          id="documentId"
          type="text"
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
          placeholder="Enter document ID"
          className="w-full"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="documentHash"
          className="block text-gray-700 font-bold mb-2"
        >
          Document Hash
        </label>
        <div className="flex items-center">
          <Input
            id="documentHash"
            type="text"
            value={documentHash}
            onChange={(e) => setDocumentHash(e.target.value)}
            placeholder="Document hash"
            className="w-full"
            readOnly
          />
          <Button
            type="button"
            onClick={generateDocumentHash}
            className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded"
          >
            Generate
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <label
          htmlFor="document"
          className="block text-gray-700 font-bold mb-2"
        >
          Upload Document
        </label>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            {file ? (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">{file.name}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadIcon className="w-10 h-10 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  SVG, PNG, JPG or GIF (MAX. 800x400px)
                </p>
              </div>
            )}
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>
      </div>
      {error && (
        <div
          className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error:</strong> {error}
        </div>
      )}
      {success && (
        <div
          className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Success:</strong> Document submitted
          successfully.
        </div>
      )}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="mr-2" /> Submitting...
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}

function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}
