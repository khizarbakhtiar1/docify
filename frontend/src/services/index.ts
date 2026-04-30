/**
 * Blockchain services barrel export.
 * Import from '@/services' to access all contract interaction functions.
 */

// Core config and utilities
export {
  config,
  validateConfig,
  parseContractError,
  getSigner,
  getBrowserProvider,
  getReadProvider,
  ABIS,
} from "./contracts";

// IdentityRegistry
export {
  getOwner,
  isAdmin,
  getAdminData,
  getHigherAuthority,
  getInstitute,
  hasAdminApproved,
  getAllAdmins,
  getPendingHigherAuthorities,
  getApprovedHigherAuthorities,
  getPendingInstitutes,
  getApprovedInstitutes,
  addAdmin,
  removeAdmin,
  registerHigherAuthority,
  approveHigherAuthority,
  rejectHigherAuthority,
  registerInstitute,
  approveInstitute,
  rejectInstitute,
} from "./identityRegistry";
export type {
  AdminData,
  HigherAuthorityData,
  InstituteData,
} from "./identityRegistry";

// Factory
export {
  getAuthorityContract,
  getInstituteContract,
  hasAuthorityContract,
  hasInstituteContract,
} from "./factory";

// Authority
export {
  getAuthorityOwner,
  isSuperAuthority,
  getInstituteUnderAuthority,
  getInstitutesUnderAuthority,
  approveDocumentRequest,
  rejectDocumentRequest,
  revokeInstituteAccess,
} from "./authority";
export type { AuthorityInfo } from "./authority";

// Institute
export {
  getCreditBalance,
  isDocumentRequested,
  isDocumentApproved,
  getTokenDocument,
  getTokenOwner,
  getInstituteOwner,
  getDocumentRequests,
  getMintedTokens,
  submitDocumentRequest,
  purchaseCredits,
  mintSoulBoundToken,
  revokeSoulBoundToken,
  computeDocumentHash,
  computeTextHash,
  CreditPlan,
  PLAN_DETAILS,
} from "./institute";
export type { DocumentRequest, MintedToken } from "./institute";
