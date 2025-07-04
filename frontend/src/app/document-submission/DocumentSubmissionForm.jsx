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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    setError("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setDocumentType("");
        setHolderName("");
        setDocumentId("");
        setDocumentHash("");
        setFile(null);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError("Failed to submit document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateDocumentHash = () => {
    // Generate a more realistic hash
    const randomHash = "0x" + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setDocumentHash(randomHash);
  };

  const documentTypes = [
    { value: "degree", label: "🎓 Degree Certificate", icon: "🎓" },
    { value: "diploma", label: "📜 Diploma", icon: "📜" },
    { value: "transcript", label: "📊 Academic Transcript", icon: "📊" },
    { value: "certificate", label: "🏆 Professional Certificate", icon: "🏆" },
    { value: "license", label: "🔖 Professional License", icon: "🔖" },
    { value: "birth-certificate", label: "👶 Birth Certificate", icon: "👶" },
    { value: "marriage-certificate", label: "💒 Marriage Certificate", icon: "💒" },
    { value: "passport", label: "🛂 Passport", icon: "🛂" },
    { value: "id-card", label: "🆔 ID Card", icon: "🆔" }
  ];
  return (
    <div className="min-h-screen gradient-background section-padding pt-24">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center space-y-6 mb-12 animate-slide-up">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-full px-4 py-2 text-sm font-medium text-blue-700">
            <DocumentIcon className="w-4 h-4" />
            <span>Document Submission</span>
          </div>
          <h1 className="text-responsive-xl font-bold heading-gradient">
            Submit Document for Verification
          </h1>
          <p className="subheading-muted max-w-2xl mx-auto">
            Upload and submit your documents for blockchain verification. 
            All submissions are encrypted and processed securely.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Document Info</p>
                <p className="text-xs text-gray-500">Enter document details</p>
              </div>
            </div>
            <div className="flex-1 mx-4 h-1 bg-gray-200 rounded-full">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-1/3"></div>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                2
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Upload & Submit</p>
                <p className="text-xs text-gray-400">Final verification</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card shadow-2xl animate-scale-in">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                  <DocumentIcon className="w-5 h-5 text-white" />
                </div>
                Document Submission Form
              </CardTitle>
              <CardDescription className="text-gray-600">
                Fill in the required information to submit your document for verification
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {success && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 animate-bounce-in">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <CheckIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Document Submitted Successfully!</h3>
                      <p className="text-green-600">Your document has been submitted for verification and will be processed shortly.</p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6 animate-bounce-in">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-4">
                      <AlertIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-800">Submission Failed</h3>
                      <p className="text-red-600">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Document Type */}
                <div className="space-y-3 animate-slide-in-left">
                  <label className="block text-lg font-semibold text-gray-900">
                    Document Type <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={documentType}
                    onValueChange={(value) => setDocumentType(value)}
                  >
                    <SelectTrigger className="input-modern h-14 text-lg">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Document Holder Name */}
                <div className="space-y-3 animate-slide-in-left" style={{animationDelay: '0.1s'}}>
                  <label className="block text-lg font-semibold text-gray-900">
                    Document Holder Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    placeholder="Enter the full name of the document holder"
                    className="input-modern h-14 text-lg"
                    required
                  />
                </div>

                {/* Document ID */}
                <div className="space-y-3 animate-slide-in-left" style={{animationDelay: '0.2s'}}>
                  <label className="block text-lg font-semibold text-gray-900">
                    Document ID <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    placeholder="Enter the unique document identification number"
                    className="input-modern h-14 text-lg"
                    required
                  />
                </div>

                {/* Document Hash */}
                <div className="space-y-3 animate-slide-in-left" style={{animationDelay: '0.3s'}}>
                  <label className="block text-lg font-semibold text-gray-900">
                    Document Hash
                  </label>
                  <div className="flex gap-3">
                    <Input
                      type="text"
                      value={documentHash}
                      onChange={(e) => setDocumentHash(e.target.value)}
                      placeholder="Blockchain hash will be generated automatically"
                      className="input-modern h-14 text-lg flex-1 font-mono text-sm"
                      readOnly
                    />
                    <Button
                      type="button"
                      onClick={generateDocumentHash}
                      className="btn-gradient-secondary h-14 px-6 whitespace-nowrap"
                    >
                      <HashIcon className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    Click generate to create a unique hash for blockchain verification
                  </p>
                </div>
                {/* File Upload */}
                <div className="space-y-3 animate-slide-in-left" style={{animationDelay: '0.4s'}}>
                  <label className="block text-lg font-semibold text-gray-900">
                    Upload Document <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 hover-lift py-8 px-6"
                    >
                                              {file ? (
                         <div className="flex flex-col items-center justify-center space-y-6 py-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <CheckIcon className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-600">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for upload
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setFile(null)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove file
                          </Button>
                        </div>
                                              ) : (
                         <div className="flex flex-col items-center justify-center space-y-6 py-4">
                                                     <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-2">
                             <UploadIcon className="w-10 h-10 text-white" />
                           </div>
                                                     <div className="text-center mb-4">
                             <p className="text-xl font-semibold text-gray-900 mb-2">
                               Drop your document here
                             </p>
                             <p className="text-base text-gray-600">
                               or <span className="text-blue-600 font-medium">browse files</span>
                             </p>
                           </div>
                                                     <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 bg-white/50 rounded-lg py-3 px-4">
                             <span className="flex items-center gap-1">✅ <span className="font-medium">PDF, DOC, DOCX</span></span>
                             <span className="flex items-center gap-1">✅ <span className="font-medium">PNG, JPG, JPEG</span></span>
                             <span className="flex items-center gap-1">✅ <span className="font-medium">Max 10MB</span></span>
                           </div>
                        </div>
                      )}
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      />
                    </label>
                  </div>
                </div>
                {/* Submit Section */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 animate-slide-up">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-14 text-lg"
                    onClick={() => {
                      setDocumentType("");
                      setHolderName("");
                      setDocumentId("");
                      setDocumentHash("");
                      setFile(null);
                      setError("");
                      setSuccess(false);
                    }}
                  >
                    <RefreshIcon className="w-5 h-5 mr-2" />
                    Reset Form
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-14 text-lg btn-gradient"
                    disabled={loading || !documentType || !holderName || !documentId || !file}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Submitting Document...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <SendIcon className="w-5 h-5 mr-2" />
                        Submit for Verification
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 animate-fade-in">
            <Card className="glass-card hover-lift">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <SecureIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Submission</h3>
                <p className="text-gray-600 text-sm">All documents are encrypted and stored securely using blockchain technology.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-lift">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <ClockIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Processing</h3>
                <p className="text-gray-600 text-sm">Documents are typically processed and verified within 24-48 hours.</p>
              </CardContent>
            </Card>
            
            <Card className="glass-card hover-lift">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <VerifyIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Recognition</h3>
                <p className="text-gray-600 text-sm">Verified documents are recognized by institutions worldwide.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon Components
function UploadIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function DocumentIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function CheckIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function AlertIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="m12 17 .01 0" />
    </svg>
  );
}

function HashIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="9" y2="9" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" />
      <line x1="16" x2="14" y1="3" y2="21" />
    </svg>
  );
}

function RefreshIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function SendIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

function SecureIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ClockIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function VerifyIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12l2 2 4-4" />
      <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" />
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    </svg>
  );
}
