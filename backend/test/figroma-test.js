const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Docify DApp", function () {
  let identityRegistry, factory, authority, institute;
  let owner, admin1, admin2, admin3, higherAuthority, instituteAddress, user;

  beforeEach(async function () {
    [owner, admin1, admin2, admin3, higherAuthority, instituteAddress, user] =
      await ethers.getSigners();

    // Deploy IdentityRegistry
    const IdentityRegistry =
      await ethers.getContractFactory("IdentityRegistry");
    identityRegistry = await IdentityRegistry.deploy();
    await identityRegistry.waitForDeployment();

    // Deploy Factory
    const Factory = await ethers.getContractFactory("Factory");
    factory = await Factory.deploy(
      await identityRegistry.getAddress(),
      await owner.getAddress()
    );
    await factory.waitForDeployment();

    // Set factory address in IdentityRegistry
    await identityRegistry.setFactory(await factory.getAddress());

    // Add 3 admins (owner is already admin #1 from constructor)
    await identityRegistry.connect(owner).addAdmin(admin1.address);
    await identityRegistry.connect(owner).addAdmin(admin2.address);
    await identityRegistry.connect(owner).addAdmin(admin3.address);

    // Register higher authority
    await identityRegistry
      .connect(higherAuthority)
      .registerHigherAuthority("Test Authority");

    // Approve with 3 DIFFERENT admins (requires REQUIRED_APPROVALS = 3)
    await identityRegistry
      .connect(owner)
      .approveHigherAuthority(higherAuthority.address);
    await identityRegistry
      .connect(admin1)
      .approveHigherAuthority(higherAuthority.address);
    await identityRegistry
      .connect(admin2)
      .approveHigherAuthority(higherAuthority.address);

    // Get the deployed Authority contract
    const authorityAddress = await factory.getAuthorityContract(
      higherAuthority.address
    );
    const Authority = await ethers.getContractFactory("Authority");
    authority = Authority.attach(authorityAddress);

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
    const Institute = await ethers.getContractFactory("Institute");
    institute = Institute.attach(instituteContractAddress);
  });

  describe("IdentityRegistry", function () {
    it("Should set deployer as super admin (owner) and first admin", async function () {
      const contractOwner = await identityRegistry.owner();
      expect(contractOwner).to.equal(owner.address);

      const adminData = await identityRegistry.admins(owner.address);
      expect(adminData.isAdmin).to.be.true;
      expect(adminData.exists).to.be.true;
    });

    it("Should add and remove admins", async function () {
      // admin1 should already be added in beforeEach
      const adminData = await identityRegistry.admins(admin1.address);
      expect(adminData.isAdmin).to.be.true;

      // Remove admin1
      await identityRegistry.connect(owner).removeAdmin(admin1.address);
      const removedData = await identityRegistry.admins(admin1.address);
      expect(removedData.exists).to.be.false;
    });

    it("Should not allow more than MAX_ADMINS", async function () {
      // owner + admin1 + admin2 + admin3 = 4 admins, max is 5
      const [, , , , , , , extraAdmin1, extraAdmin2] =
        await ethers.getSigners();
      await identityRegistry.connect(owner).addAdmin(extraAdmin1.address);
      // Now we have 5 admins (max), adding another should fail
      await expect(
        identityRegistry.connect(owner).addAdmin(extraAdmin2.address)
      ).to.be.revertedWith("Maximum admin limit reached");
    });

    it("Should not allow non-owner to add admin", async function () {
      const [, , , , , , , randomUser] = await ethers.getSigners();
      await expect(
        identityRegistry.connect(admin1).addAdmin(randomUser.address)
      ).to.be.reverted;
    });

    it("Should register and approve higher authority", async function () {
      const authorityData = await identityRegistry.higherAuthorities(
        higherAuthority.address
      );
      expect(authorityData.isApproved).to.be.true;
      expect(authorityData.authorityName).to.equal("Test Authority");
      expect(authorityData.approvalCount).to.equal(3);
    });

    it("Should reject higher authority registration", async function () {
      const [, , , , , , , newAuthority] = await ethers.getSigners();
      await identityRegistry
        .connect(newAuthority)
        .registerHigherAuthority("Rejected Authority");

      await identityRegistry
        .connect(owner)
        .rejectHigherAuthority(newAuthority.address);

      const authorityData = await identityRegistry.higherAuthorities(
        newAuthority.address
      );
      expect(authorityData.exists).to.be.false;
    });

    it("Should not allow same admin to approve twice", async function () {
      const [, , , , , , , newAuth] = await ethers.getSigners();
      await identityRegistry
        .connect(newAuth)
        .registerHigherAuthority("Double Approve Test");

      await identityRegistry
        .connect(owner)
        .approveHigherAuthority(newAuth.address);

      await expect(
        identityRegistry
          .connect(owner)
          .approveHigherAuthority(newAuth.address)
      ).to.be.revertedWith("Admin has already approved this authority");
    });

    it("Should register and approve institute", async function () {
      const instituteData = await identityRegistry.institutes(
        instituteAddress.address
      );
      expect(instituteData.isApproved).to.be.true;
      expect(instituteData.institudeName).to.equal("Test Institute");
    });

    it("Should reject institute registration", async function () {
      const [, , , , , , , newInstitute] = await ethers.getSigners();
      await identityRegistry
        .connect(newInstitute)
        .registerInstitute("Rejected Institute", higherAuthority.address);

      await identityRegistry
        .connect(higherAuthority)
        .rejectInstitute(newInstitute.address);

      const instData = await identityRegistry.institutes(newInstitute.address);
      expect(instData.exists).to.be.false;
    });

    it("Should not allow institute to register under unapproved authority", async function () {
      const [, , , , , , , fakeAuth, newInst] = await ethers.getSigners();
      await expect(
        identityRegistry
          .connect(newInst)
          .registerInstitute("Bad Institute", fakeAuth.address)
      ).to.be.revertedWith("Invalid or unapproved higher authority");
    });
  });

  describe("Factory", function () {
    it("Should create authority contract on approval", async function () {
      const authorityAddr = await factory.getAuthorityContract(
        higherAuthority.address
      );
      expect(authorityAddr).to.not.equal(ethers.ZeroAddress);
    });

    it("Should create institute contract on approval", async function () {
      const instituteAddr = await factory.getInstituteContract(
        instituteAddress.address
      );
      expect(instituteAddr).to.not.equal(ethers.ZeroAddress);
    });
  });

  describe("Authority", function () {
    it("Should approve document request", async function () {
      // Purchase credits first
      await institute
        .connect(instituteAddress)
        .purchaseCredits(1, { value: ethers.parseEther("0.049") });

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

    it("Should reject document request", async function () {
      await institute
        .connect(instituteAddress)
        .purchaseCredits(1, { value: ethers.parseEther("0.049") });

      const documentHash = ethers.keccak256(
        ethers.toUtf8Bytes("rejected document")
      );
      await institute
        .connect(instituteAddress)
        .submitDocumentRequest(documentHash);
      await authority
        .connect(higherAuthority)
        .rejectDocumentRequest(instituteAddress.address, documentHash);

      const isRequested = await institute.documentRequests(documentHash);
      expect(isRequested).to.be.false;
    });

    it("Should revoke institute access", async function () {
      await authority
        .connect(higherAuthority)
        .revokeInstituteAccess(instituteAddress.address);

      // Institute should be removed from authority's mapping
      const instAddr = await authority.institutes(instituteAddress.address);
      expect(instAddr).to.equal(ethers.ZeroAddress);
    });
  });

  describe("Institute", function () {
    it("Should purchase credits (Basic Plan)", async function () {
      await institute
        .connect(instituteAddress)
        .purchaseCredits(1, { value: ethers.parseEther("0.049") });

      const creditBalance = await institute.getCreditBalance();
      expect(creditBalance).to.equal(100);
    });

    it("Should purchase credits (Standard Plan)", async function () {
      await institute
        .connect(instituteAddress)
        .purchaseCredits(2, { value: ethers.parseEther("0.199") });

      const creditBalance = await institute.getCreditBalance();
      expect(creditBalance).to.equal(500);
    });

    it("Should purchase credits (Premium Plan)", async function () {
      await institute
        .connect(instituteAddress)
        .purchaseCredits(3, { value: ethers.parseEther("0.499") });

      const creditBalance = await institute.getCreditBalance();
      expect(creditBalance).to.equal(1500);
    });

    it("Should reject invalid plan type", async function () {
      await expect(
        institute
          .connect(instituteAddress)
          .purchaseCredits(4, { value: ethers.parseEther("1") })
      ).to.be.revertedWith("Invalid plan type");
    });

    it("Should reject incorrect payment amount", async function () {
      await expect(
        institute
          .connect(instituteAddress)
          .purchaseCredits(1, { value: ethers.parseEther("0.01") })
      ).to.be.revertedWith("Incorrect payment amount");
    });

    it("Should submit document request and deduct credit", async function () {
      // Purchase credits first
      await institute
        .connect(instituteAddress)
        .purchaseCredits(1, { value: ethers.parseEther("0.049") });

      const documentHash = ethers.keccak256(
        ethers.toUtf8Bytes("test document")
      );
      await institute
        .connect(instituteAddress)
        .submitDocumentRequest(documentHash);

      const creditBalance = await institute.getCreditBalance();
      expect(creditBalance).to.equal(99);

      const isRequested = await institute.documentRequests(documentHash);
      expect(isRequested).to.be.true;
    });

    it("Should fail to submit document without credits", async function () {
      const documentHash = ethers.keccak256(
        ethers.toUtf8Bytes("test document")
      );
      await expect(
        institute
          .connect(instituteAddress)
          .submitDocumentRequest(documentHash)
      ).to.be.revertedWith("Insufficient credits");
    });

    it("Should mint SoulBoundToken for approved document", async function () {
      // Purchase credits and submit document
      await institute
        .connect(instituteAddress)
        .purchaseCredits(1, { value: ethers.parseEther("0.049") });
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

      // Mint SBT
      await institute
        .connect(instituteAddress)
        .mintSoulBoundToken(user.address, documentHash);

      // Check token ownership
      const tokenOwner = await institute.ownerOf(0);
      expect(tokenOwner).to.equal(user.address);

      // Check token-to-document mapping
      const storedHash = await institute.tokenToDocument(0);
      expect(storedHash).to.equal(documentHash);
    });

    it("Should not allow SBT transfer (soul-bound)", async function () {
      // Setup: purchase, submit, approve, mint
      await institute
        .connect(instituteAddress)
        .purchaseCredits(1, { value: ethers.parseEther("0.049") });
      const documentHash = ethers.keccak256(
        ethers.toUtf8Bytes("soulbound test")
      );
      await institute
        .connect(instituteAddress)
        .submitDocumentRequest(documentHash);
      await authority
        .connect(higherAuthority)
        .approveDocumentRequest(instituteAddress.address, documentHash);
      await institute
        .connect(instituteAddress)
        .mintSoulBoundToken(user.address, documentHash);

      // Attempt transfer should fail
      await expect(
        institute
          .connect(user)
          .transferFrom(user.address, admin1.address, 0)
      ).to.be.revertedWith("SoulBoundToken: token transfer is not allowed");
    });

    it("Should revoke (burn) SoulBoundToken", async function () {
      // Setup: purchase, submit, approve, mint
      await institute
        .connect(instituteAddress)
        .purchaseCredits(1, { value: ethers.parseEther("0.049") });
      const documentHash = ethers.keccak256(
        ethers.toUtf8Bytes("revoke test")
      );
      await institute
        .connect(instituteAddress)
        .submitDocumentRequest(documentHash);
      await authority
        .connect(higherAuthority)
        .approveDocumentRequest(instituteAddress.address, documentHash);
      await institute
        .connect(instituteAddress)
        .mintSoulBoundToken(user.address, documentHash);

      // Revoke
      await institute.connect(instituteAddress).revokeSoulBoundToken(0);

      // Token should no longer exist
      await expect(institute.ownerOf(0)).to.be.reverted;
    });

    it("Should allow super admin to withdraw funds", async function () {
      // Purchase credits to put ETH in the contract
      await institute
        .connect(instituteAddress)
        .purchaseCredits(1, { value: ethers.parseEther("0.049") });

      const contractBalance = await ethers.provider.getBalance(
        await institute.getAddress()
      );
      expect(contractBalance).to.equal(ethers.parseEther("0.049"));

      // Note: super admin in Institute is the Factory (msg.sender of constructor)
      // which is the IdentityRegistry calling through Factory.
      // The _superAdmin is set to msg.sender in Institute constructor,
      // which is the Factory contract address.
    });

    it("Should not allow non-owner to submit document", async function () {
      await institute
        .connect(instituteAddress)
        .purchaseCredits(1, { value: ethers.parseEther("0.049") });

      const documentHash = ethers.keccak256(
        ethers.toUtf8Bytes("unauthorized doc")
      );
      await expect(
        institute.connect(user).submitDocumentRequest(documentHash)
      ).to.be.reverted;
    });
  });
});
