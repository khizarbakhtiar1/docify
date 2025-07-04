// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IdentityRegistry.sol";
import "./Authority.sol";
import "./Institute.sol";

contract Factory is Ownable {
    IdentityRegistry public immutable identityRegistry;
    address public superHigherAuthority;
    
    mapping(address => address) public authorityContracts;
    mapping(address => address) public instituteContracts;

    event AuthorityContractCreated(address indexed authority, address contractAddress);
    event InstituteContractCreated(address indexed institute, address contractAddress, address indexed authority);
    event SuperHigherAuthoritySet(address indexed superHigherAuthority);

    constructor(address _identityRegistryAddress, address initialOwner) Ownable(initialOwner) {
        identityRegistry = IdentityRegistry(_identityRegistryAddress);
    }

    function setSuperHigherAuthority(address _superHigherAuthority) external onlyOwner {
        require(superHigherAuthority == address(0), "Super higher authority already set");
        superHigherAuthority = _superHigherAuthority;
        emit SuperHigherAuthoritySet(_superHigherAuthority);
    }

    function createAuthorityContract(address _authority) external {
        require(msg.sender == address(identityRegistry), "Only IdentityRegistry can create Authority contracts");
        require(authorityContracts[_authority] == address(0), "Authority contract already exists");
        authorityContracts[_authority] = address(new Authority(_authority, address(identityRegistry), _authority == superHigherAuthority));
        emit AuthorityContractCreated(_authority, authorityContracts[_authority]);
    }

    function createInstituteContract(address _institute, address _authority) external {
        require(msg.sender == address(identityRegistry), "Only IdentityRegistry can create Institute contracts");
        require(instituteContracts[_institute] == address(0), "Institute contract already exists");
        require(authorityContracts[_authority] != address(0), "Invalid authority");
        address newInstituteContract = address(new Institute(_institute, _authority, address(identityRegistry)));
        instituteContracts[_institute] = newInstituteContract;
        Authority(authorityContracts[_authority]).addInstitute(_institute, newInstituteContract);
        emit InstituteContractCreated(_institute, newInstituteContract, _authority);
    }

    function getAuthorityContract(address _authority) external view returns (address) {
        return authorityContracts[_authority];
    }

    function getInstituteContract(address _institute) external view returns (address) {
        return instituteContracts[_institute];
    }
}