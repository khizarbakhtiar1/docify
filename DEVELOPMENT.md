# Docify Development Guide

Welcome to the Docify developer guide. This document explains how to set up and run the Docify application locally with a simulated blockchain environment.

## Prerequisites

- Node.js (v18+)
- npm or yarn
- MetaMask (or another browser wallet) extension installed

## Quick Start

The easiest way to start the entire stack (local node, contract deployment, and frontend server) is to run from the root directory:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
npm run dev
```

This single command will:
1. Start a local Hardhat Ethereum node.
2. Wait 5 seconds, then deploy all contracts and populate test data.
3. Export ABIs to the frontend.
4. Start the Next.js frontend development server.

You can then view the application at [http://localhost:3000](http://localhost:3000).

## Local Blockchain Setup Details

When the local node starts, Hardhat provisions 20 test accounts with 10,000 ETH each. Our `setup-dev.js` script automatically sets up the platform with the first few accounts:

### Test Accounts & Roles

You can import these accounts into MetaMask using the private keys printed in the console when the local node starts (`npm run dev:contracts`).

1. **Account 0 (Super Admin)**: Deploys the contracts and is the owner.
2. **Account 1 (Admin 1)**: Platform Admin.
3. **Account 2 (Admin 2)**: Platform Admin.
4. **Account 3 (Higher Authority)**: A pre-registered and approved Higher Authority ("Global Accreditation Board").
5. **Account 4 (Institute)**: A pre-registered and approved Institute ("Tech University"), linked to the Higher Authority, with 100 pre-purchased credits.
6. **Account 5 (User/Student)**: A normal user address for testing SBT minting.

### Testing Flows

**1. Institute Flow**
- Connect MetaMask using **Account 4**.
- Navigate to the Institute Dashboard.
- You will see 100 available credits.
- Select a file to submit a document hash (a test document is already submitted by default).
- You can mint an SBT to **Account 5**.

**2. Higher Authority Flow**
- Connect MetaMask using **Account 3**.
- Navigate to the Higher Authority Dashboard.
- You can approve or reject institutes and document requests.

**3. Admin Flow**
- Connect MetaMask using **Account 0, 1, or 2**.
- Navigate to the Admin Dashboard.
- You can approve or reject pending Higher Authorities.

## Environment Variables

The `setup-dev.js` script automatically generates a `.env.local` file in the `frontend` directory containing the deployed contract addresses. It should look like this:

```env
NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=0x...
NEXT_PUBLIC_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_CHAIN_ID=31337
```

For custom configurations or connecting to testnets (Sepolia/Vanar), you can override these values in your `.env.local`. Supported networks are configured in `frontend/src/config/networks.ts`.
