# Figroma DApp - Complete User Guide and Documentation

## Table of Contents

1. Introduction
2. User Roles
3. Getting Started
4. Super Admin Functions
5. Admin Functions
6. Higher Authority Registration and Functions
7. Institute Registration and Functions
8. Document Verification Process
9. Soul-Bound Token (SBT) Minting
10. Credit System
11. Technical Details
12. Security Considerations
13. Troubleshooting
14. Conclusion

## 1. Introduction

Figroma DApp is a decentralized application designed to facilitate secure and transparent document verification and issuance of non-transferrable credentials in the form of Soul-Bound Tokens (SBTs). The DApp connects Higher Authorities, Institutes, and end-users in a trustless environment, leveraging blockchain technology for immutability and transparency.

## 2. User Roles

- **Super Admin**: The highest authority in the system, responsible for managing admins and overseeing the entire DApp.
- **Admins**: Assist in managing the DApp, particularly in approving Higher Authorities.
- **Higher Authorities**: Oversee and approve Institutes and their document requests.
- **Institutes**: Submit document requests and mint SBTs for approved documents.
- **End-users**: Recipients of the Soul-Bound Tokens representing verified credentials.

## 3. Getting Started

To use the Figroma DApp:

1. Connect your Ethereum wallet (e.g., MetaMask) to the DApp.
2. Ensure you have sufficient ETH for gas fees and, for Institutes, to purchase credits.
3. Navigate to the appropriate section based on your role (Admin, Higher Authority, or Institute).

## 4. Super Admin Functions

The Super Admin is set during the initial deployment of the IdentityRegistry contract. They can:

- Add new admins (up to a maximum of 5) using the `addAdmin` function.
- Remove admins using the `removeAdmin` function.
- Set the Super Higher Authority in the Factory contract.
- Oversee the entire DApp operations.

## 5. Admin Functions

Admins play a crucial role in onboarding Higher Authorities:

- Review Higher Authority registration requests.
- Approve Higher Authorities using the `approveHigherAuthority` function.
- A minimum of 3 admin approvals is required for a Higher Authority to be fully onboarded.

## 6. Higher Authority Registration and Functions

### Registration:

1. Navigate to the "Register as Higher Authority" section.
2. Provide required information (e.g., authority name, wallet address).
3. Submit the registration request using the `registerHigherAuthority` function.
4. Wait for admin approvals (requires 3 approvals).

### Functions:

Once approved, Higher Authorities can:

- Review and approve Institute registrations using `approveInstitute`.
- Reject Institute registrations using `rejectInstitute`.
- Approve document requests from Institutes using `approveDocumentRequest`.
- Reject document requests using `rejectDocumentRequest`.
- Revoke Institute access if necessary using `revokeInstituteAccess`.

## 7. Institute Registration and Functions

### Registration:

1. Go to the "Register as Institute" section.
2. Provide required information (institute name, wallet address).
3. Select the appropriate Higher Authority from the list.
4. Submit the registration request using `registerInstitute`.
5. Wait for approval from the selected Higher Authority.

### Functions:

Once approved, Institutes can:

- Purchase credits for document verification.
- Submit document requests to their Higher Authority using `submitDocumentRequest`.
- Mint Soul-Bound Tokens for approved documents using `mintSoulBoundToken`.

## 8. Document Verification Process

1. Institute submits a document request (requires credits).
2. Higher Authority reviews the request.
3. Higher Authority approves or rejects the document.
4. If approved, the Institute can mint an SBT for the document.

## 9. Soul-Bound Token (SBT) Minting

For approved documents:

1. Institute navigates to the "Mint SBT" section.
2. Enters the recipient's address and the approved document hash.
3. Calls the `mintSoulBoundToken` function.
4. The SBT is minted and sent to the recipient's address.

Note: SBTs are non-transferrable and represent verified credentials.

## 10. Credit System

Institutes need credits to submit document requests:

- Navigate to the "Purchase Credits" section.
- Choose a plan:
  - Basic: 100 credits for $49
  - Standard: 500 credits for $199
  - Premium: 1500 credits for $499
- Use the `purchaseCredits` function to buy credits.
- Each document request consumes one credit.

## 11. Technical Details

The DApp consists of four main smart contracts:

- IdentityRegistry: Manages registrations and approvals.
- Factory: Creates instances for Higher Authorities and Institutes.
- Authority: Handles document approvals and Institute management.
- Institute: Manages document requests and SBT minting.

For detailed function descriptions, refer to the individual contract documentation.

## 12. Security Considerations

- Keep your private keys secure and never share them.
- Verify all transaction details before signing.
- For Institutes: Ensure document hashes are accurate before submission.
- Report any suspicious activities to the Super Admin.

## 13. Troubleshooting

- Transaction Failure: Ensure you have sufficient ETH for gas fees.
- Registration Issues: Verify all information is correct and try again.
- Approval Delays: Higher Authority approvals require multiple admin confirmations, which may take time.
- Credit Purchase Problems: Double-check the ETH amount matches the selected plan.

## 14. Conclusion

The Figroma DApp provides a secure and transparent platform for document verification and credential issuance. By following this guide, users in various roles can effectively navigate and utilize the DApp's features. For any additional questions or support, please contact the DApp administrators.

Remember to always interact with the DApp through its official interface and be cautious of potential phishing attempts or unauthorized copies of the DApp.
