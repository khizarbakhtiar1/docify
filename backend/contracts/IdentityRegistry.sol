// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract IdentityRegistry is Ownable {
    struct Admin {
        bool isAdmin;
        bool exists;
    }

    struct HigherAuthority {
        address walletAddress;
        string authorityName;
        uint8 approvalCount;
        bool isApproved;
        bool exists;
    }

    struct Institute {
        string institudeName;
        address higherAuthority;
        bool isApproved;
        bool exists;
    }

    mapping(address => Admin) public admins;
    uint8 public adminCount;

    mapping(address => HigherAuthority) public higherAuthorities;
    mapping(address => mapping(address => bool)) public higherAuthorityAdminApprovals;
    mapping(address => Institute) public institutes;

    uint8 public constant MAX_ADMINS = 5;
    uint8 public constant REQUIRED_APPROVALS = 3;

    address public factoryAddress;

    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event HigherAuthorityRegistered(address indexed authority);
    event HigherAuthorityApproved(address indexed authority);
    event HigherAuthorityRejected(address indexed authority);
    event InstituteRegistered(address indexed institute, address indexed authority);
    event InstituteApproved(address indexed institute);
    event InstituteRejected(address indexed institute);

    constructor() Ownable(msg.sender) {
        admins[msg.sender] = Admin(true, true);
        adminCount = 1;
    }

    modifier onlyAdmin() {
        require(admins[msg.sender].isAdmin, "Only admin can call this function");
        _;
    }

    function setFactory(address _factoryAddress) external onlyOwner {
        require(factoryAddress == address(0), "Factory already set");
        factoryAddress = _factoryAddress;
    }

    function addAdmin(address _newAdmin) external onlyOwner {
        require(!admins[_newAdmin].exists, "Admin already exists");
        require(adminCount < MAX_ADMINS, "Maximum admin limit reached");

        admins[_newAdmin] = Admin(true, true);
        adminCount++;

        emit AdminAdded(_newAdmin);
    }

    function removeAdmin(address _admin) external onlyOwner {
        require(admins[_admin].exists, "Admin does not exist");
        require(_admin != owner(), "Cannot remove super admin");

        delete admins[_admin];
        adminCount--;

        emit AdminRemoved(_admin);
    }

    function registerHigherAuthority(string memory _authorityName) external {
        require(!higherAuthorities[msg.sender].exists, "Higher authority already registered");

        higherAuthorities[msg.sender] = HigherAuthority({
            walletAddress: msg.sender,
            authorityName: _authorityName,
            approvalCount: 0,
            isApproved: false,
            exists: true
        });

        emit HigherAuthorityRegistered(msg.sender);
    }

    function approveHigherAuthority(address _authority) external onlyAdmin {
        require(higherAuthorities[_authority].exists, "Higher authority does not exist");
        require(!higherAuthorities[_authority].isApproved, "Higher authority already approved");
        require(!higherAuthorityAdminApprovals[_authority][msg.sender], "Admin has already approved this authority");

        higherAuthorityAdminApprovals[_authority][msg.sender] = true;
        higherAuthorities[_authority].approvalCount++;

        if (higherAuthorities[_authority].approvalCount >= REQUIRED_APPROVALS) {
            higherAuthorities[_authority].isApproved = true;
            IFactory(factoryAddress).createAuthorityContract(_authority);
            emit HigherAuthorityApproved(_authority);
        }
    }

    function rejectHigherAuthority(address _authority) external onlyAdmin {
        require(higherAuthorities[_authority].exists, "Higher authority does not exist");
        require(!higherAuthorities[_authority].isApproved, "Higher authority already approved");

        delete higherAuthorities[_authority];
        // Clear admin approvals
        for (uint i = 0; i < MAX_ADMINS; i++) {
            delete higherAuthorityAdminApprovals[_authority][address(uint160(i))];
        }

        emit HigherAuthorityRejected(_authority);
    }

    function registerInstitute(string memory _instituteName, address _higherAuthority) external {
        require(!institutes[msg.sender].exists, "Institute already registered");
        require(higherAuthorities[_higherAuthority].isApproved, "Invalid or unapproved higher authority");

        institutes[msg.sender] = Institute(_instituteName, _higherAuthority, false, true);

        emit InstituteRegistered(msg.sender, _higherAuthority);
    }

    function approveInstitute(address _institute) external {
        require(higherAuthorities[msg.sender].isApproved, "Only approved higher authority can approve institutes");
        require(institutes[_institute].exists, "Institute does not exist");
        require(institutes[_institute].higherAuthority == msg.sender, "Institute not under your authority");
        require(!institutes[_institute].isApproved, "Institute already approved");

        institutes[_institute].isApproved = true;
        IFactory(factoryAddress).createInstituteContract(_institute, msg.sender);

        emit InstituteApproved(_institute);
    }

    function rejectInstitute(address _institute) external {
        require(higherAuthorities[msg.sender].isApproved, "Only approved higher authority can reject institutes");
        require(institutes[_institute].exists, "Institute does not exist");
        require(institutes[_institute].higherAuthority == msg.sender, "Institute not under your authority");
        require(!institutes[_institute].isApproved, "Institute already approved");

        delete institutes[_institute];

        emit InstituteRejected(_institute);
    }
}

interface IFactory {
    function createAuthorityContract(address _authority) external;
    function createInstituteContract(address _institute, address _authority) external;
}