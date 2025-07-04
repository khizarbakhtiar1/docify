# Docify Routing & Authentication System

This document explains the comprehensive routing and authentication system implemented for the Docify blockchain-based document verification platform.

## Overview

The system provides role-based access control with automatic routing based on user wallet connections and their roles in the smart contracts. When a user connects their wallet, the system automatically:

1. Checks their role from the IdentityRegistry smart contract
2. Redirects them to the appropriate dashboard
3. Protects routes based on their permissions
4. Handles approval states for higher authorities and institutes

## User Roles

### 1. Super Admin (`super-admin`)
- **Description**: The owner of the IdentityRegistry contract
- **Permissions**: Full access to all admin functions
- **Default Route**: `/admin`
- **Access**: Admin dashboard with all privileges

### 2. Admin (`admin`)
- **Description**: Up to 5 admins who can manage higher authorities
- **Permissions**: Can approve/reject higher authority registrations
- **Default Route**: `/admin`
- **Access**: Admin dashboard with authority management

### 3. Higher Authority (`higher-authority`)
- **Description**: Educational authorities that can approve institutes
- **Permissions**: Can approve/reject institute registrations
- **Default Route**: `/higher-authority`
- **Approval Required**: Yes (needs 3+ admin approvals)
- **Pending State**: Shown dashboard with pending status

### 4. Institute (`institute`)
- **Description**: Educational institutions that can issue documents
- **Permissions**: Can mint and manage documents
- **Default Route**: `/institute`
- **Approval Required**: Yes (needs higher authority approval)
- **Pending State**: Shown dashboard with pending status

### 5. Unregistered (`unregistered`)
- **Description**: Connected wallet not registered in any role
- **Permissions**: Can only register for roles
- **Default Route**: `/register`
- **Access**: Registration form to apply for roles

### 6. User (`user`)
- **Description**: Regular users or fallback role
- **Permissions**: Can only verify documents
- **Default Route**: `/verify`
- **Access**: Document verification functionality

## Authentication Flow

### 1. Wallet Connection
```typescript
// Triggered when user clicks "Connect Wallet"
connectWallet() -> checkUserRole() -> redirectToRolePage()
```

### 2. Role Verification
The system checks roles in this order:
1. Super Admin (contract owner)
2. Admin (from admins mapping)
3. Higher Authority (from higherAuthorities mapping)
4. Institute (from institutes mapping)
5. Unregistered (not in any mapping)
6. User (fallback)

### 3. Automatic Routing
Based on the user's role and approval status:
- **Approved roles**: Redirect to role-specific dashboard
- **Pending approval**: Redirect to dashboard with pending status
- **Unregistered**: Redirect to registration page
- **Error**: Stay on current page with error handling

## Protected Routes

### Route Protection Components

#### `ProtectedRoute`
Base component that handles authentication and authorization:
```typescript
<ProtectedRoute 
  allowedRoles={['admin', 'super-admin']} 
  requireApproval={true}
>
  <YourComponent />
</ProtectedRoute>
```

#### `AdminRoute`
Protects admin-only pages:
```typescript
<AdminRoute>
  <AdminDashboard />
</AdminRoute>
```

#### `HigherAuthorityRoute`
Protects higher authority pages (requires approval):
```typescript
<HigherAuthorityRoute>
  <AuthorityDashboard />
</HigherAuthorityRoute>
```

#### `InstituteRoute`
Protects institute pages (requires approval):
```typescript
<InstituteRoute>
  <InstituteDashboard />
</InstituteRoute>
```

#### `PublicRoute`
For pages accessible to all connected users:
```typescript
<PublicRoute>
  <DocumentVerification />
</PublicRoute>
```

## Page Structure

### Protected Pages
- `/admin` - Admin dashboard (AdminRoute)
- `/higher-authority` - Higher authority dashboard (HigherAuthorityRoute)
- `/institute` - Institute dashboard (InstituteRoute)

### Public Pages (require wallet connection)
- `/register` - Registration forms (PublicRoute)
- `/verify` - Document verification (PublicRoute)
- `/plans` - Pricing plans (PublicRoute)
- `/contact` - Contact information (PublicRoute)

### Open Pages (no wallet required)
- `/` - Landing page
- `/overview` - About/overview page

## Authentication Context

The `AuthContext` provides:

### State
- `isConnected`: Wallet connection status
- `address`: Connected wallet address
- `user`: User object with role and approval status
- `isLoading`: Loading state for async operations
- `error`: Error messages

### Methods
- `connectWallet()`: Connect MetaMask wallet
- `disconnectWallet()`: Disconnect and clear state
- `checkUserRole()`: Verify role from smart contract
- `refreshUserData()`: Refresh user information

## Smart Contract Integration

### Contract Addresses (Environment Variables)
```env
NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=""
NEXT_PUBLIC_FACTORY_ADDRESS=""
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=""
```

### Contract Methods Used
- `owner()`: Get super admin address
- `admins(address)`: Check admin status
- `higherAuthorities(address)`: Get higher authority info
- `institutes(address)`: Get institute info

## Error Handling

### Common Error States
1. **MetaMask Not Detected**: Prompt user to install MetaMask
2. **Connection Rejected**: User rejected wallet connection
3. **Network Error**: Unable to connect to blockchain
4. **Role Check Failed**: Error reading from smart contract
5. **Unauthorized Access**: User trying to access restricted page

### Error Display
- Loading states with spinners
- Error cards with retry buttons
- Approval pending notifications
- Access denied messages with navigation options

## Security Features

### Access Control
- Role-based route protection
- Approval status verification
- Automatic redirection on unauthorized access
- Session management with wallet events

### Wallet Security
- Account change detection
- Chain change handling
- Automatic session cleanup on disconnection
- Secure contract interaction

## Development Setup

### 1. Install Dependencies
```bash
npm install ethers
```

### 2. Configure Environment
Copy `.env.example` to `.env.local` and update contract addresses:
```env
NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS="0x..."
```

### 3. Add to Layout
```typescript
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
```

### 4. Use in Components
```typescript
import { useAuth } from '@/contexts/AuthContext';

export function MyComponent() {
  const { user, isConnected, connectWallet } = useAuth();
  
  if (!isConnected) {
    return <button onClick={connectWallet}>Connect Wallet</button>;
  }
  
  return <div>Welcome, {user.role}!</div>;
}
```

## Testing

### Test Scenarios
1. **Role-based access**: Test each role can only access appropriate pages
2. **Approval flow**: Test pending states for higher authorities and institutes
3. **Wallet disconnection**: Test cleanup and redirection
4. **Network switching**: Test handling of chain changes
5. **Error recovery**: Test error states and retry functionality

### Mock Data
For testing without deployed contracts, you can modify the AuthContext to use mock data:
```typescript
// In development, use mock contract responses
const mockUserRole = 'admin'; // Change for testing different roles
```

## Future Enhancements

### Planned Features
1. **Multi-signature approval**: Implement multi-sig for critical operations
2. **Role hierarchy**: More granular role-based permissions
3. **Session persistence**: Remember user state across browser sessions
4. **Audit logging**: Track user actions and role changes
5. **Mobile wallet support**: WalletConnect integration
6. **Gasless transactions**: Meta-transactions for better UX

This routing system provides a robust foundation for the Docify platform with proper security, user experience, and scalability considerations. 