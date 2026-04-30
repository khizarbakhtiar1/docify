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
        </div>
        <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Docify. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
