"use client";

import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";
import { WalletConnect } from "./WalletConnect";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center" prefetch={false}>
                          <Image
                  src="/black-text.png"
                  alt="Docify"
                  width={220}
                  height={100}
                  className="h-24 w-auto"
                />
        </Link>
        
        <nav className="hidden items-center gap-8 md:flex">
          <NavigationMenu>
            <NavigationMenuList className="gap-6">
              {(user?.role === "super-admin" || user?.role === "admin") && (
                <NavigationMenuLink asChild>
                  <Link
                    href="/admin"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none"
                    prefetch={false}
                  >
                    Admin Dashboard
                  </Link>
                </NavigationMenuLink>
              )}
              {user?.role === "higher-authority" && (
                <NavigationMenuLink asChild>
                  <Link
                    href="/higher-authority"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none"
                    prefetch={false}
                  >
                    Authority Dashboard
                  </Link>
                </NavigationMenuLink>
              )}
              {user?.role === "institute" && (
                <NavigationMenuLink asChild>
                  <Link
                    href="/institute"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none"
                    prefetch={false}
                  >
                    Institute Dashboard
                  </Link>
                </NavigationMenuLink>
              )}
              <NavigationMenuLink asChild>
                <Link
                  href="/verify"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none"
                  prefetch={false}
                >
                  Verify
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  href="/contact"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 focus:bg-blue-50 focus:text-blue-700 focus:outline-none"
                  prefetch={false}
                >
                  Contact
                </Link>
              </NavigationMenuLink>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <WalletConnect />
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="gradient-background border-r border-gray-200/50">
            <div className="flex h-16 items-center justify-between px-4">
              <Link
                href="/"
                className="flex items-center"
                prefetch={false}
              >
                          <Image
            src="/black-text.png"
            alt="Docify"
            width={220}
            height={100}
            className="h-24 w-auto"
          />
              </Link>
            </div>
            <nav className="grid gap-2 px-4 py-6">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                prefetch={false}
              >
                <HomeIcon className="h-5 w-5" />
                <span>Home</span>
              </Link>
              {(user?.role === "super-admin" || user?.role === "admin") && (
                <Link
                  href="/admin"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  prefetch={false}
                >
                  <PuzzleIcon className="h-5 w-5" />
                  <span>Admin Dashboard</span>
                </Link>
              )}
              {user?.role === "higher-authority" && (
                <Link
                  href="/higher-authority"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  prefetch={false}
                >
                  <PuzzleIcon className="h-5 w-5" />
                  <span>Authority Dashboard</span>
                </Link>
              )}
              {user?.role === "institute" && (
                <Link
                  href="/institute"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  prefetch={false}
                >
                  <PuzzleIcon className="h-5 w-5" />
                  <span>Institute Dashboard</span>
                </Link>
              )}
              <Link
                href="/verify"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                prefetch={false}
              >
                <ShieldCheckIcon className="h-5 w-5" />
                <span>Verify</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                prefetch={false}
              >
                <MailIcon className="h-5 w-5" />
                <span>Contact Us</span>
              </Link>
            </nav>
            <div className="border-t border-gray-200 px-4 py-6">
              <WalletConnect />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function MenuIcon(props: any) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
