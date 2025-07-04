"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const AuthStatus: React.FC = () => {
  const { user, isConnected, isLoading, connectWallet, error } = useAuth();

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect your wallet to access role-specific features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={connectWallet} className="w-full">
            Connect Wallet
          </Button>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Error</CardTitle>
          <CardDescription>
            Unable to load user information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={connectWallet} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getRoleColor = (role: string, isApproved: boolean) => {
    if (!isApproved && (role === 'higher-authority' || role === 'institute')) {
      return 'yellow';
    }
    
    switch (role) {
      case 'super-admin':
        return 'purple';
      case 'admin':
        return 'blue';
      case 'higher-authority':
        return 'green';
      case 'institute':
        return 'cyan';
      case 'unregistered':
        return 'gray';
      default:
        return 'default';
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

  const getActionText = (role: string) => {
    switch (role) {
      case 'super-admin':
      case 'admin':
        return 'Go to Admin Dashboard';
      case 'higher-authority':
        return 'Go to Authority Dashboard';
      case 'institute':
        return 'Go to Institute Dashboard';
      case 'unregistered':
        return 'Complete Registration';
      default:
        return 'Verify Documents';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Account Status
          <Badge variant={getRoleColor(user.role, user.isApproved) as any}>
            {user.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </CardTitle>
        <CardDescription>
          Wallet: {user.address?.slice(0, 6)}...{user.address?.slice(-4)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.role === 'institute' && user.instituteName && (
          <div>
            <p className="text-sm font-medium">Institute</p>
            <p className="text-sm text-gray-600">{user.instituteName}</p>
          </div>
        )}
        
        {user.role === 'higher-authority' && user.authorityName && (
          <div>
            <p className="text-sm font-medium">Authority</p>
            <p className="text-sm text-gray-600">{user.authorityName}</p>
          </div>
        )}

        {!user.isApproved && (user.role === 'higher-authority' || user.role === 'institute') && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              {user.role === 'higher-authority' 
                ? 'Your higher authority registration is pending approval from administrators.'
                : 'Your institute registration is pending approval from your higher authority.'
              }
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Button asChild className="w-full">
            <Link href={getRolePage(user.role)}>
              {getActionText(user.role)}
            </Link>
          </Button>
          
          {user.role !== 'unregistered' && (
            <Button asChild variant="outline" className="w-full">
              <Link href="/verify">
                Verify Documents
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 