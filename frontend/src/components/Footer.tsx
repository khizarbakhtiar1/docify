"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-gray-100 pt-12 pb-8 sm:pt-16 sm:pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-y-0 sm:gap-x-8">
          <div className="space-y-6">
            <div id="contact" className="text-2xl font-extrabold text-gray-900">
              DOCIFY
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              Securely verify and manage your important documents with our
              decentralized application.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-y-4 sm:col-span-2 lg:col-span-1">
            <div>
              <div className="text-gray-900 font-medium mb-2">Quick Links</div>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-gray-600 hover:text-gray-900"
                    prefetch={false}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/verify"
                    className="text-gray-600 hover:text-gray-900"
                    prefetch={false}
                  >
                    Verify Documents
                  </Link>
                </li>
                <li>
                  <Link
                    href="/overview"
                    className="text-gray-600 hover:text-gray-900"
                    prefetch={false}
                  >
                    Overview
                  </Link>
                </li>
                <li>
                  <Link
                    href="/plans"
                    className="text-gray-600 hover:text-gray-900"
                    prefetch={false}
                  >
                    Plans
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 hover:text-gray-900"
                    prefetch={false}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-gray-900 font-medium mb-2">Resources</div>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/overview"
                    className="text-gray-600 hover:text-gray-900"
                    prefetch={false}
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/verify"
                    className="text-gray-600 hover:text-gray-900"
                    prefetch={false}
                  >
                    Verification API
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="text-gray-600 hover:text-gray-900"
                    prefetch={false}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/khizarbakhtiar1/docify"
                    className="text-gray-600 hover:text-gray-900"
                    prefetch={false}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-end space-x-4">
            <Link
              href="#"
              className="text-gray-600 hover:text-gray-900"
              prefetch={false}
            >
              <TwitterIcon className="w-6 h-6" />
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-gray-900"
              prefetch={false}
            >
              <GitlabIcon className="w-6 h-6" />
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-gray-900"
              prefetch={false}
            >
              <DiscIcon className="w-6 h-6" />
            </Link>
            <Link
              href="#"
              className="text-gray-600 hover:text-gray-900"
              prefetch={false}
            >
              <TextIcon className="w-6 h-6" />
            </Link>
          </div>
        </div>
        <div className="mt-12 sm:mt-16 flex justify-center">
          <Button
            className="btn-gradient flex items-center space-x-2 hover-lift shadow-lg"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <ArrowUpIcon className="w-5 h-5" />
            <span>Back to Top</span>
          </Button>
        </div>
      </div>
    </footer>
  );
}

function ArrowUpIcon(props: any) {
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
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function DiscIcon(props: any) {
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
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function GitlabIcon(props: any) {
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
      <path d="m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z" />
    </svg>
  );
}

function TextIcon(props: any) {
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
      <path d="M17 6.1H3" />
      <path d="M21 12.1H3" />
      <path d="M15.1 18H3" />
    </svg>
  );
}

function TwitterIcon(props: any) {
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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function XIcon(props: any) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
