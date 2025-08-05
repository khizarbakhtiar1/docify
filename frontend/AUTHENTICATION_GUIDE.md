# Authentication & Authorization Guide

This document explains the comprehensive authentication and authorization system implemented in the Docify frontend application.

## Overview

The authentication system uses a **three-layer security approach**:

1. **Server-side Middleware Protection** - Blocks unauthorized requests at the server level
2. **Component-level Protection** - Wraps protected components with authentication checks
3. **Route Guard Hooks** - Provides additional security at the component level

## Architecture

### 1. Middleware (`middleware.ts`)

The Next.js middleware provides **server-side route protection** before pages are rendered:

- **Route-based Protection**: Defines which routes require authentication and specific roles
- **Cookie-based State**: Uses cookies to track authentication state for server-side checks
- **Automatic Redirects**: Redirects unauthorized users with appropriate error messages
- **Role Verification**: Checks user roles and approval status

#### Protected Routes Configuration

```typescript
const PROTECTED_ROUTES = {
  "/admin": ["super-admin", "admin"],
  "/higher-authority": ["higher-authority"],
  "/institute": ["institute"],
  "/document-submission": ["institute"],
};
```

### 2. AuthContext (`src/contexts/AuthContext.tsx`)

The authentication context manages the application's authentication state:

- **Wallet Connection**: Handles MetaMask integration
- **Role Detection**: Queries smart contracts to determine user roles
- **State Management**: Manages user data, connection status, and errors
- **Cookie Synchronization**: Syncs client state with server-side cookies
- **Automatic Redirects**: Routes users to appropriate dashboards based on their roles

#### User Roles

- `super-admin`: Contract owner with full system access
- `admin`: System administrators
- `higher-authority`: Educational authorities (requires approval)
- `institute`: Educational institutions (requires approval)
- `unregistered`: Connected wallet but not registered
- `user`: Fallback for connected wallets

### 3. ProtectedRoute Component (`src/components/ProtectedRoute.tsx`)

Component-level protection wrapper that:

- **Authentication Check**: Verifies wallet connection
- **Role Authorization**: Validates user role against allowed roles
- **Approval Verification**: Checks approval status for roles that require it
- **Loading States**: Shows appropriate loading and error states
- **Access Denial**: Displays proper error messages for unauthorized access

#### Usage Examples

```jsx
// Protect admin routes
<AdminRoute>
  <AdminDashboard />
</AdminRoute>

// Protect higher authority routes
<HigherAuthorityRoute>
  <HigherAuthorityDashboard />
</HigherAuthorityRoute>

// Custom protection
<ProtectedRoute allowedRoles={['admin', 'super-admin']} requireApproval={false}>
  <CustomComponent />
</ProtectedRoute>
```

### 4. Route Guard Hook (`src/hooks/useRouteGuard.ts`)

Additional component-level security hook that:

- **Real-time Monitoring**: Continuously monitors authentication state
- **Dynamic Redirects**: Redirects based on current route and user status
- **Authorization Status**: Returns authorization status for conditional rendering
- **Granular Control**: Provides fine-grained control over route access

#### Usage

```jsx
export function SomeProtectedComponent() {
  const { isAuthorized, isLoading } = useRouteGuard({
    allowedRoles: ["admin"],
    requireApproval: true,
  });

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthorized) return null; // Will redirect automatically

  return <ProtectedContent />;
}
```

## Security Features

### 1. Multi-layer Protection

- **Server-side**: Middleware blocks requests before they reach components
- **Client-side**: Components verify authorization before rendering
- **Real-time**: Hooks monitor authentication state changes

### 2. Race Condition Prevention

- **Loading States**: Proper loading states prevent unauthorized content flashing
- **Router Replace**: Uses `router.replace()` instead of `push()` for security redirects
- **State Synchronization**: Cookies keep server and client state in sync

### 3. Approval Flow Management

- **Pending States**: Handles pending approval states for institutes and higher authorities
- **Status Indicators**: Shows appropriate messages for different approval states
- **Conditional Access**: Restricts access based on approval status

### 4. Error Handling

- **Authentication Errors**: Clear error messages for authentication failures
- **Access Denied**: Informative messages when access is denied
- **Network Errors**: Handles Web3 and network-related errors gracefully

## Implementation Details

### Cookie Management

The system uses HTTP-only cookies for server-side authentication state:

```typescript
// Set authentication cookies
setCookie("wallet-connected", "true");
setCookie("user-role", userRole);
setCookie("user-approved", "true");

// Clear cookies on logout
deleteCookie("wallet-connected");
deleteCookie("user-role");
deleteCookie("user-approved");
```

### Middleware Flow

1. **Request Interception**: Middleware intercepts all requests
2. **Route Analysis**: Determines if route requires authentication
3. **Cookie Verification**: Checks authentication cookies
4. **Role Validation**: Validates user role against required roles
5. **Approval Check**: Verifies approval status if required
6. **Redirect or Continue**: Redirects unauthorized users or allows access

### Component Protection Flow

1. **Context Check**: Component checks authentication context
2. **Loading State**: Shows loading while verifying authentication
3. **Role Verification**: Validates user role and approval status
4. **Conditional Rendering**: Renders content only if authorized

## Testing the Implementation

### Test Cases

1. **Unauthenticated Access**:

   - Visit `/higher-authority` without wallet connection
   - Should redirect to home with authentication prompt

2. **Wrong Role Access**:

   - Connect as regular user and visit `/admin`
   - Should redirect to home with access denied message

3. **Pending Approval**:

   - Connect as unapproved higher authority
   - Should show pending approval message

4. **Authorized Access**:
   - Connect with appropriate role and approval
   - Should access dashboard normally

### Manual Testing Steps

1. **Disconnect Wallet**: Ensure all protected routes redirect properly
2. **Wrong Role**: Connect with different roles and test access
3. **Direct URL Access**: Type protected URLs directly in browser
4. **Page Refresh**: Refresh protected pages to test state persistence
5. **Account Switching**: Switch MetaMask accounts and test role changes

## Best Practices

### 1. Always Use Protection

Every protected route should use at least one protection method:

```jsx
// ✅ Good - Multiple layers
<ProtectedRoute allowedRoles={['admin']}>
  <ComponentWithRouteGuard />
</ProtectedRoute>

// ❌ Bad - No protection
<AdminDashboard />
```

### 2. Handle Loading States

Always handle loading states to prevent content flashing:

```jsx
if (isLoading) {
  return <LoadingSpinner />;
}
```

### 3. Graceful Error Handling

Provide clear error messages for different scenarios:

```jsx
if (error) {
  return <ErrorMessage message={error} />;
}
```

### 4. Role-based Conditional Rendering

Use role information for conditional feature access:

```jsx
{
  user?.role === "admin" && <AdminOnlyFeature />;
}
```

## Troubleshooting

### Common Issues

1. **"Authentication Required" on refresh**:

   - Check if cookies are being set properly
   - Verify middleware configuration

2. **Infinite redirect loops**:

   - Check for circular redirect logic
   - Ensure fallback routes are accessible

3. **Role not detected**:

   - Verify smart contract integration
   - Check network connection and contract addresses

4. **Access denied for valid users**:
   - Check role configuration in middleware
   - Verify approval status is being checked correctly

### Debug Steps

1. **Check Browser Cookies**: Verify authentication cookies are set
2. **Console Logs**: Check browser console for authentication errors
3. **Network Tab**: Monitor smart contract calls and responses
4. **Redux DevTools**: If using Redux, check authentication state

## Security Considerations

### 1. Never Trust Client-side Only

- Always verify authorization on the server-side (middleware)
- Client-side checks are for UX, not security

### 2. Secure Cookie Configuration

- Use `SameSite=Lax` for CSRF protection
- Set appropriate expiration times
- Consider using `HttpOnly` for sensitive data

### 3. Smart Contract Security

- Verify contract addresses and ABIs
- Handle contract call failures gracefully
- Implement proper error handling for Web3 operations

### 4. State Management

- Clear authentication state on logout
- Handle account switching properly
- Implement proper session timeout

This multi-layered approach ensures robust security while maintaining a smooth user experience.
