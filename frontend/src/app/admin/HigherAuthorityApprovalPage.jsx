import React, { useState, useEffect } from "react";
import HighAuthApprovalButton from "./HighAuthApprovalButton";
import { identityRegistryContract } from "../path/to/your/ethers/file";

const HigherAuthorityApprovalPage = () => {
  const [pendingAuthorities, setPendingAuthorities] = useState([]);

  useEffect(() => {
    // Fetch pending higher authorities
    const fetchPendingAuthorities = async () => {
      // This is a placeholder. You'll need to implement a method to fetch pending authorities
      // from your smart contract or backend
      const authorities = await getPendingAuthorities();
      setPendingAuthorities(authorities);
    };

    fetchPendingAuthorities();
  }, []);

  return (
    <div>
      <h1>Approve Higher Authorities</h1>
      {pendingAuthorities.map((authority) => (
        <div key={authority.address}>
          <p>Name: {authority.name}</p>
          <p>Address: {authority.address}</p>
          <HighAuthApprovalButton authorityAddress={authority.address} />
        </div>
      ))}
    </div>
  );
};

export default HigherAuthorityApprovalPage;
