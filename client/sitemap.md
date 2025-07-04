# Figroma - Document Verification Platform Sitemap

## Public Pages

### 🏠 **Homepage** (`/`)
- **Purpose**: Landing page with hero section and platform overview
- **Features**:
  - Hero section with gradient background
  - Platform introduction (Figroma/Docify)
  - Key features showcase
  - User testimonials
  - Statistics section
  - FAQ section
  - Call-to-action buttons for registration and login

### 📋 **About/Overview** (`/about`)
- **Purpose**: Detailed information about the platform
- **Features**:
  - Platform overview
  - How it works section
  - Benefits of blockchain verification
  - Use cases

### 💰 **Plans & Pricing** (`/plans`)
- **Purpose**: Subscription plans and pricing information
- **Features**:
  - Different pricing tiers
  - Feature comparison
  - Payment integration
  - Credits system information

### 🔍 **Document Verification** (`/verify`)
- **Purpose**: Public document verification interface
- **Features**:
  - Document verification form
  - QR code scanning capability
  - Instant verification results
  - Verification history

### 📞 **Contact Us** (`/contact`) ✨ **NEW**
- **Purpose**: Customer support and inquiries
- **Features**:
  - Contact form with validation
  - Multiple inquiry categories
  - Contact information display
  - Quick help section
  - Animated form interactions

## Authentication Pages

### 🔐 **Login** (`/login`)
- **Purpose**: User authentication via MetaMask wallet
- **Features**:
  - MetaMask wallet connection
  - Automatic role detection based on wallet address
  - Role-based redirection (Admin, Institute, Higher Authority)

### 📝 **Registration** (`/register`)
- **Purpose**: New user registration
- **Features**:
  - Tabbed interface (Institute vs Higher Authority)
  - Form validation
  - Wallet address integration
  - Institute type selection
  - Higher authority selection

## Role-Based Dashboards

### 👨‍💼 **Admin Dashboard** (`/admin`)
- **Access**: Admin users only (wallet: `0x3baf151492c11e3a883192ad635c27d9a1eb88b2`)
- **Features**:
  - Add new admin users
  - Remove admin access
  - Higher authority approval management
  - System oversight

### 🏫 **Institute Dashboard** (`/institute`)
- **Access**: Educational institutions (wallet: `0x8f2d5bdb4f7c380e05acea2950de9d03d9e75f4f`)
- **Features**:
  - Document submission interface
  - NFT minting for verified documents
  - Institution profile management
  - Document history

### ⚖️ **Higher Authority Dashboard** (`/higher-authority`)
- **Access**: Government/regulatory bodies (wallet: `0x82a0a98658ba88d518f430eacb1d72e8be4046c7`)
- **Features**:
  - Institute approval/rejection
  - Document approval workflow
  - Document rejection with reasons
  - Authority management

### 📄 **Document Submission** (`/document-submission`)
- **Purpose**: Document upload and submission interface
- **Features**:
  - File upload functionality
  - Document metadata entry
  - Submission tracking
  - Status updates

## Technical Architecture

### 🔧 **Frontend Technology Stack**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Web3**: Ethers.js for blockchain interaction
- **State Management**: React hooks

### 🎨 **Design System**
- **Color Scheme**: Blue gradient (`#0077B6` to `#00A8E8`)
- **Typography**: Inter font family
- **Components**: Card-based layouts with shadows
- **Animations**: Hover effects, transitions, loading states
- **Responsive**: Mobile-first design approach

### 🔗 **Smart Contracts** (Backend)
- **Authority.sol**: Role and permission management
- **Factory.sol**: Institute creation and management
- **IdentityRegistry.sol**: User identity management
- **Institute.sol**: Document verification and NFT minting

## Navigation Structure

```
Header Navigation:
├── Figroma Logo (Home)
├── Overview (/about)
├── Plans (/plans)
├── Verify (/verify)
├── Contact Us (/contact) ✨ NEW
└── Wallet Connect Button

Mobile Menu:
├── Home (/)
├── Overview (/about)
├── Plans (/plans)
├── Contact Us (/contact) ✨ NEW
└── Wallet Connect
```

## User Flow Diagrams

### 🔄 **New User Registration Flow**
1. User visits homepage
2. Clicks "Register" button
3. Connects MetaMask wallet
4. Selects role (Institute/Higher Authority)
5. Fills registration form
6. Submits for approval
7. Awaits approval from higher authority/admin

### ✅ **Document Verification Flow**
1. Institute submits document
2. Higher authority reviews and approves
3. Document gets minted as NFT
4. Public can verify using document ID/QR code
5. Verification result displayed instantly

### 📧 **Contact & Support Flow** ✨ **NEW**
1. User visits contact page
2. Selects inquiry category
3. Fills contact form with validation
4. Submits message
5. Receives confirmation
6. Support team responds within 24 hours

## Security Features

- **Wallet-Based Authentication**: MetaMask integration
- **Role-Based Access Control**: Different permissions per user type
- **Blockchain Verification**: Immutable document records
- **Smart Contract Security**: Solidity contracts with proper access controls

## Future Enhancements

- **Multi-language Support**: International accessibility
- **Advanced Analytics**: Dashboard analytics for institutions
- **API Integration**: Third-party verification APIs
- **Mobile App**: Native mobile application
- **Batch Operations**: Bulk document processing
- **Advanced Search**: Enhanced document search and filtering

---

**Last Updated**: January 2024  
**Version**: 2.0 (with Contact Page)  
**Status**: Active Development