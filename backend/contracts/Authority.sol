// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IdentityRegistry.sol";
import "./Institute.sol";

contract Authority is Ownable {
    address public higherAuthority;
    IdentityRegistry public identityRegistry;
    mapping(address => address) public institutes;
    bool public isSuperAuthority;

    event DocumentRequestApproved(address indexed institute, bytes32 indexed documentHash);
    event DocumentRequestRejected(address indexed institute, bytes32 indexed documentHash);
    event InstituteAccessRevoked(address indexed institute);

    constructor(address _higherAuthority, address _identityRegistry, bool _isSuperAuthority) 
        Ownable(_higherAuthority)
    {
        higherAuthority = _higherAuthority;
        identityRegistry = IdentityRegistry(_identityRegistry);
        isSuperAuthority = _isSuperAuthority;
    }

    modifier onlyHigherAuthority() {
        require(_msgSender() == higherAuthority, "Only higher authority can call this function");
        _;
    }

    function addInstitute(address _institute, address _instituteContract) external {
        require(_msgSender() == identityRegistry.factoryAddress(), "Only factory can add institutes");
        institutes[_institute] = _instituteContract;
    }

    function approveDocumentRequest(address _institute, bytes32 _documentHash) external onlyOwner {
        require(institutes[_institute] != address(0), "Institute not registered under this authority");
        if (isSuperAuthority) {
            Institute(institutes[_institute]).approveDocument(_documentHash);
            emit DocumentRequestApproved(_institute, _documentHash);
        } else {
            Institute(institutes[_institute]).approveDocument(_documentHash);
            emit DocumentRequestApproved(_institute, _documentHash);
        }
    }

    function rejectDocumentRequest(address _institute, bytes32 _documentHash) external onlyOwner {
        require(institutes[_institute] != address(0), "Institute not registered under this authority");
        require(!isSuperAuthority, "Super Authority cannot reject documents");
        Institute(institutes[_institute]).rejectDocument(_documentHash);
        emit DocumentRequestRejected(_institute, _documentHash);
    }

    function revokeInstituteAccess(address _institute) external onlyOwner {
        require(institutes[_institute] != address(0), "Institute not registered under this authority");
        delete institutes[_institute];
        emit InstituteAccessRevoked(_institute);
    }
}