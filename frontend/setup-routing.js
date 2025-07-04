#!/usr/bin/env node

/**
 * Docify Routing Setup Script
 * 
 * This script helps set up and test the routing system
 * Run with: node setup-routing.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Docify Routing & Authentication Setup');
console.log('=====================================\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📄 Creating .env.local file...');
  
  const envContent = `# Smart Contract Addresses
# Update these with your deployed contract addresses
NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=""
NEXT_PUBLIC_FACTORY_ADDRESS=""

# Blockchain Network Configuration  
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_CHAIN_NAME="Sepolia"
NEXT_PUBLIC_RPC_URL="https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"

# Application Configuration
NEXT_PUBLIC_APP_NAME="Docify"
NEXT_PUBLIC_APP_VERSION="1.0.0"
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('⚠️  Please update the contract addresses in .env.local\n');
} else {
  console.log('✅ .env.local file already exists\n');
}

console.log('🔧 Setup Complete! Here\'s what was implemented:\n');

console.log('📁 File Structure:');
console.log('├── src/contexts/AuthContext.tsx     - Authentication & role management');
console.log('├── src/components/ProtectedRoute.tsx - Route protection components');
console.log('├── src/components/WalletConnect.tsx  - Enhanced wallet connection');
console.log('├── src/components/AuthStatus.tsx     - User status display');
console.log('├── src/types/ethereum.d.ts          - TypeScript declarations');
console.log('└── ROUTING_GUIDE.md                 - Complete documentation\n');

console.log('🛡️ Protected Routes:');
console.log('├── /admin            - AdminRoute (super-admin, admin)');
console.log('├── /higher-authority - HigherAuthorityRoute (higher-authority)');
console.log('├── /institute        - InstituteRoute (institute)');
console.log('├── /register         - PublicRoute (all connected users)');
console.log('└── /verify           - PublicRoute (all connected users)\n');

console.log('👤 User Roles & Routing:');
console.log('├── Super Admin      → /admin');
console.log('├── Admin            → /admin');
console.log('├── Higher Authority → /higher-authority');
console.log('├── Institute        → /institute');
console.log('├── Unregistered     → /register');
console.log('└── User             → /verify\n');

console.log('🔄 Authentication Flow:');
console.log('1. User connects wallet');
console.log('2. System checks role from IdentityRegistry contract');
console.log('3. Auto-redirect to appropriate dashboard');
console.log('4. Protected routes enforce role-based access\n');

console.log('⚙️ Next Steps:');
console.log('1. Deploy your smart contracts');
console.log('2. Update contract addresses in .env.local');
console.log('3. Start the development server: npm run dev');
console.log('4. Test with different wallet addresses\n');

console.log('🧪 Testing Different Roles:');
console.log('To test different roles, you can temporarily modify the AuthContext:');
console.log('1. Open src/contexts/AuthContext.tsx');
console.log('2. In the checkUserRole function, add mock data:');
console.log('   // For testing - remove in production');
console.log('   setUser({ address: targetAddress, role: "admin", isApproved: true });');
console.log('   return;\n');

console.log('📚 Documentation:');
console.log('- Read ROUTING_GUIDE.md for complete system documentation');
console.log('- Check component comments for implementation details');
console.log('- See smart contracts for role definitions\n');

console.log('✨ Features Implemented:');
console.log('✅ Role-based authentication');
console.log('✅ Automatic routing on wallet connection');
console.log('✅ Protected route components');
console.log('✅ Approval status handling');
console.log('✅ Error state management');
console.log('✅ Wallet event handling');
console.log('✅ TypeScript support');
console.log('✅ Responsive UI components\n');

console.log('🎉 Your routing system is ready!');
console.log('Happy coding! 🚀');

// Create a test configuration object for easy role testing
const testConfig = {
  roles: {
    'super-admin': {
      description: 'Contract owner with full admin access',
      route: '/admin',
      mockData: { role: 'super-admin', isApproved: true }
    },
    'admin': {
      description: 'Admin who can manage higher authorities',
      route: '/admin',
      mockData: { role: 'admin', isApproved: true }
    },
    'higher-authority': {
      description: 'Educational authority that manages institutes',
      route: '/higher-authority',
      mockData: { role: 'higher-authority', isApproved: true, authorityName: 'Test University Board' }
    },
    'institute': {
      description: 'Educational institution that issues documents',
      route: '/institute',
      mockData: { role: 'institute', isApproved: true, instituteName: 'Test University' }
    },
    'unregistered': {
      description: 'Connected wallet not registered in any role',
      route: '/register',
      mockData: { role: 'unregistered', isApproved: false }
    },
    'user': {
      description: 'Regular user who can verify documents',
      route: '/verify',
      mockData: { role: 'user', isApproved: false }
    }
  }
};

// Save test configuration
fs.writeFileSync(
  path.join(__dirname, 'test-roles.json'),
  JSON.stringify(testConfig, null, 2)
);

console.log('\n📋 Test configuration saved to test-roles.json'); 