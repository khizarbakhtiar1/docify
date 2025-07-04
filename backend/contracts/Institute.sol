// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IdentityRegistry.sol";

contract Institute is ERC721, Ownable {
    address public instituteAddress;
    address public higherAuthority;
    IdentityRegistry public identityRegistry;

    uint256 private _nextTokenId;

    mapping(bytes32 => bool) public documentRequests;
    mapping(bytes32 => bool) public approvedDocuments;
    mapping(uint256 => bytes32) public tokenToDocument;

    uint256 public creditBalance;
    uint256 public constant BASIC_PLAN_CREDITS = 100;
    uint256 public constant STANDARD_PLAN_CREDITS = 500;
    uint256 public constant PREMIUM_PLAN_CREDITS = 1500;
    uint256 public constant BASIC_PLAN_PRICE = 49 ether;
    uint256 public constant STANDARD_PLAN_PRICE = 199 ether;
    uint256 public constant PREMIUM_PLAN_PRICE = 499 ether;


    address private _superAdmin;

    event DocumentRequestSubmitted(bytes32 indexed documentHash);
    event SoulBoundTokenMinted(address indexed to, uint256 indexed tokenId, bytes32 indexed documentHash);
    event SoulBoundTokenRevoked(uint256 indexed tokenId, bytes32 indexed documentHash);
    event CreditsPurchased(uint256 amount, uint256 price);
    event FundsWithdrawn(address indexed to, uint256 amount);

    constructor(address _institute, address _higherAuthority, address _identityRegistry) ERC721("SoulBoundToken", "SBT") Ownable(msg.sender) {
        instituteAddress = _institute;
        higherAuthority = _higherAuthority;
        identityRegistry = IdentityRegistry(_identityRegistry);
        _superAdmin = msg.sender;  // Set the contract deployer as the super admin
        _transferOwnership(_institute);
    }

    modifier onlyHigherAuthority() {
        require(_msgSender() == higherAuthority, "Only higher authority can call this function");
        _;
    }

    modifier onlySuperAdmin() {
        require(_msgSender() == _superAdmin, "Only super admin can call this function");
        _;
    }

    function submitDocumentRequest(bytes32 _documentHash) external onlyOwner {
        require(!documentRequests[_documentHash], "Document request already submitted");
        require(creditBalance > 0, "Insufficient credits");
        documentRequests[_documentHash] = true;
        creditBalance--;
        emit DocumentRequestSubmitted(_documentHash);
    }

    function approveDocument(bytes32 _documentHash) external onlyHigherAuthority {
        require(documentRequests[_documentHash], "Document request not submitted");
        approvedDocuments[_documentHash] = true;
    }

    function rejectDocument(bytes32 _documentHash) external onlyHigherAuthority {
        require(documentRequests[_documentHash], "Document request not submitted");
        delete documentRequests[_documentHash];
    }

    function mintSoulBoundToken(address _to, bytes32 _documentHash) external onlyOwner {
        require(approvedDocuments[_documentHash], "Document not approved");

        uint256 newTokenId = _nextTokenId++;
        _safeMint(_to, newTokenId);
        tokenToDocument[newTokenId] = _documentHash;

        emit SoulBoundTokenMinted(_to, newTokenId, _documentHash);
    }

    function revokeSoulBoundToken(uint256 _tokenId) external onlyOwner {
        bytes32 documentHash = tokenToDocument[_tokenId];

        _burn(_tokenId);
        delete tokenToDocument[_tokenId];

        emit SoulBoundTokenRevoked(_tokenId, documentHash);
    }

    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "SoulBoundToken: token transfer is not allowed");
        return super._update(to, tokenId, auth);
    }

    function purchaseCredits(uint256 planType) external payable onlyOwner {
        uint256 credits;
        uint256 price;

        if (planType == 1) {
            credits = BASIC_PLAN_CREDITS;
            price = BASIC_PLAN_PRICE;
        } else if (planType == 2) {
            credits = STANDARD_PLAN_CREDITS;
            price = STANDARD_PLAN_PRICE;
        } else if (planType == 3) {
            credits = PREMIUM_PLAN_CREDITS;
            price = PREMIUM_PLAN_PRICE;
        } else {
            revert("Invalid plan type");
        }

        require(msg.value == price, "Incorrect payment amount");

        creditBalance += credits;
        emit CreditsPurchased(credits, price);
    }

    function getCreditBalance() external view returns (uint256) {
        return creditBalance;
    }

    // function for super admin to withdraw funds
    function withdrawFunds() external onlySuperAdmin {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = _superAdmin.call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(_superAdmin, balance);
    }

 
    function getSuperAdmin() external view returns (address) {
        return _superAdmin;
    }

    // Function to transfer super admin role
    function transferSuperAdmin(address newSuperAdmin) external onlySuperAdmin {
        require(newSuperAdmin != address(0), "New super admin is the zero address");
        _superAdmin = newSuperAdmin;
    }
}