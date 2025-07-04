const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Figroma Dapp", function () {
  let IdentityRegistry, Factory, Authority, Institute;
  let identityRegistry, factory, authority, institute;
  let owner, admin, higherAuthority, instituteAddress, user;

  beforeEach(async function () {
    [owner, admin, higherAuthority, instituteAddress, user] =
      await ethers.getSigners();

    // Deploy IdentityRegistry
    IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
    identityRegistry = await IdentityRegistry.deploy();

    // Deploy Factory
    Factory = await ethers.getContractFactory("Factory");
    factory = await Factory.deploy(identityRegistry.address, owner.address);

    // Set factory address in IdentityRegistry
    await identityRegistry.setFactory(factory.address);

    // Register and approve higher authority
    await identityRegistry
      .connect(higherAuthority)
      .registerHigherAuthority("Test Authority");
    await identityRegistry.connect(owner).addAdmin(admin.address);
    await identityRegistry
      .connect(admin)
      .approveHigherAuthority(higherAuthority.address);
    await identityRegistry
      .connect(admin)
      .approveHigherAuthority(higherAuthority.address);
    await identityRegistry
      .connect(admin)
      .approveHigherAuthority(higherAuthority.address);

    // Get the deployed Authority contract
    const authorityAddress = await factory.getAuthorityContract(
      higherAuthority.address
    );
    Authority = await ethers.getContractFactory("Authority");
    authority = await Authority.attach(authorityAddress);

    // Register and approve institute
    await identityRegistry
      .connect(instituteAddress)
      .registerInstitute("Test Institute", higherAuthority.address);
    await identityRegistry
      .connect(higherAuthority)
      .approveInstitute(instituteAddress.address);

    // Get the deployed Institute contract
    const instituteContractAddress = await factory.getInstituteContract(
      instituteAddress.address
    );
    Institute = await ethers.getContractFactory("Institute");
    institute = await Institute.attach(instituteContractAddress);
  });

  describe("IdentityRegistry", function () {
    it("Should register and approve higher authority", async function () {
      const authorityData = await identityRegistry.higherAuthorities(
        higherAuthority.address
      );
      expect(authorityData.isApproved).to.be.true;
    });

    it("Should register and approve institute", async function () {
      const instituteData = await identityRegistry.institutes(
        instituteAddress.address
      );
      expect(instituteData.isApproved).to.be.true;
    });
  });

  describe("Authority", function () {
    it("Should approve document request", async function () {
      const documentHash = ethers.keccak256(
        ethers.toUtf8Bytes("test document")
      );
      await institute
        .connect(instituteAddress)
        .submitDocumentRequest(documentHash);
      await authority
        .connect(higherAuthority)
        .approveDocumentRequest(instituteAddress.address, documentHash);

      const isApproved = await institute.approvedDocuments(documentHash);
      expect(isApproved).to.be.true;
    });
  });

  describe("Institute", function () {
    it("Should purchase credits and submit document request", async function () {
      // Purchase credits (Basic Plan)
      const basicPlanPrice = ethers.parseEther("100");
      await institute
        .connect(instituteAddress)
        .purchaseCredits(1, { value: basicPlanPrice });

      // Check credit balance
      let creditBalance = await institute.getCreditBalance();
      expect(creditBalance).to.equal(100);

      // Submit document request
      const documentHash = ethers.keccak256(
        ethers.toUtf8Bytes("test document")
      );
      await institute
        .connect(instituteAddress)
        .submitDocumentRequest(documentHash);

      // Check credit balance after submission
      creditBalance = await institute.getCreditBalance();
      expect(creditBalance).to.equal(99);

      // Check if document request is submitted
      const isRequested = await institute.documentRequests(documentHash);
      expect(isRequested).to.be.true;
    });

    it("Should mint and revoke SoulBoundToken", async function () {
      // Purchase credits and submit document request
      await institute
        .connect(instituteAddress)
        .purchaseCredits(1, { value: ethers.parseEther("100") });
      const documentHash = ethers.keccak256(
        ethers.toUtf8Bytes("test document")
      );
      await institute
        .connect(instituteAddress)
        .submitDocumentRequest(documentHash);

      // Approve document
      await authority
        .connect(higherAuthority)
        .approveDocumentRequest(instituteAddress.address, documentHash);

      // Mint SoulBoundToken
      await institute
        .connect(instituteAddress)
        .mintSoulBoundToken(user.address, documentHash);

      // Check if token is minted
      const tokenId = 0; // First token
      const tokenOwner = await institute.ownerOf(tokenId);
      expect(tokenOwner).to.equal(user.address);

      // Revoke SoulBoundToken
      await institute.connect(instituteAddress).revokeSoulBoundToken(tokenId);

      // Check if token is burned
      await expect(institute.ownerOf(tokenId)).to.be.revertedWith(
        "ERC721: invalid token ID"
      );
    });
  });
});
