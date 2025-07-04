"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export function WalletConnect() {
  const { 
    isConnected, 
    address, 
    user, 
    isLoading, 
    connectWallet, 
    disconnectWallet, 
    error 
  } = useAuth();

  const formatAddress = (addr: string) => {
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'higher-authority':
        return 'Higher Authority';
      case 'institute':
        return 'Institute';
      case 'unregistered':
        return 'Unregistered';
      case 'user':
        return 'User';
      default:
        return 'Unknown';
    }
  };

  const getRolePage = (role: string) => {
    switch (role) {
      case 'super-admin':
      case 'admin':
        return '/admin';
      case 'higher-authority':
        return '/higher-authority';
      case 'institute':
        return '/institute';
      case 'unregistered':
        return '/register';
      default:
        return '/verify';
    }
  };

  if (isLoading) {
    return (
      <Button disabled variant="outline" className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        Loading...
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={isConnected ? "outline" : "default"}
          onClick={isConnected ? undefined : connectWallet}
          className={`flex items-center gap-2 ${
            isConnected
              ? "bg-white text-black border border-black hover:bg-gray-200"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          {isConnected && address ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {formatAddress(address)}
              </div>
              <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <WalletIcon className="h-4 w-4" />
              Connect Wallet
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      {isConnected && (
        <DropdownMenuContent align="end" className="w-56">
          {user && (
            <>
              <div className="px-3 py-2 border-b">
                <p className="text-sm font-medium">{getRoleDisplayName(user.role)}</p>
                <p className="text-xs text-gray-500">
                  {user.role === 'institute' && user.instituteName && user.instituteName}
                  {user.role === 'higher-authority' && user.authorityName && user.authorityName}
                  {!user.isApproved && (user.role === 'higher-authority' || user.role === 'institute') && 
                    <span className="text-yellow-600"> (Pending Approval)</span>
                  }
                </p>
              </div>
              <DropdownMenuItem asChild>
                <Link href={getRolePage(user.role)} className="flex items-center gap-2 w-full cursor-pointer">
                  <DashboardIcon className="h-4 w-4" />
                  <span>Go to Dashboard</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem asChild>
            <Link href="/verify" className="flex items-center gap-2 w-full cursor-pointer">
              <VerifyIcon className="h-4 w-4" />
              <span>Verify Documents</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            <button
              onClick={disconnectWallet}
              className="flex items-center gap-2 w-full"
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Disconnect Wallet</span>
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function DashboardIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  );
}

function VerifyIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m9 12 2 2 4-4" />
      <path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" />
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    </svg>
  );
}

function WalletIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
} 