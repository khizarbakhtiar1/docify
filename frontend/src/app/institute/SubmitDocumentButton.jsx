import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SubmitDocumentButton = () => {
  return (
    <div>
      <Button className="h-8 gap-2 text-sm">
        <PlusIcon className="h-4 w-4" />
        <Link href="/document-submission">Submit Document Request</Link>
      </Button>
    </div>
  );
};

function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
export default SubmitDocumentButton;
