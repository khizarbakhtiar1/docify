import { ethers } from "ethers";
import IdentityRegistryArtifact from "../../../frontend/artifacts/contracts/IdentityRegistry.sol/IdentityRegistry.json";
import FactoryArtifact from "../../../frontend/artifacts/contracts/Factory.sol/Factory.json";

const RPC_URL = "https://rpc-vanguard.vanarchain.com";

const provider = new ethers.JsonRpcProvider(RPC_URL);

// Function to get a signer (for use in browser with MetaMask)
const getSigner = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    return browserProvider.getSigner();
  }
  throw new Error("MetaMask not detected");
};

// Function to create a contract instance with a signer
const getContractWithSigner = async (contractAddress, contractABI) => {
  const signer = await getSigner();
  return new ethers.Contract(contractAddress, contractABI, signer);
};

const identityRegistryContract = new ethers.Contract(
  "0x2A02EA91c93974D46533Abf1746061FA8c99352E", // IdentityRegistry contract address
  IdentityRegistryArtifact.abi,
  provider
);

const factoryContract = new ethers.Contract(
  "0x3CBC12B08fa3f3E78AF683Eef8Bfe6978664e9c1", // Factory contract address
  FactoryArtifact.abi,
  provider
);

//function that requires a signer (writing to the blockchain)
const addAdmin = async (newAdminAddress) => {
  try {
    const contractWithSigner = await getContractWithSigner(
      "0x2A02EA91c93974D46533Abf1746061FA8c99352E",
      IdentityRegistryArtifact.abi
    );
    const tx = await contractWithSigner.addAdmin(newAdminAddress);
    await tx.wait();
    console.log("New admin added:", newAdminAddress);
    return true;
  } catch (error) {
    console.error("Error adding admin:", error);
    throw error;
  }
};

const approveHigherAuthority = async (authorityAddress) => {
  try {
    const contractWithSigner = await getContractWithSigner(
      "0x2A02EA91c93974D46533Abf1746061FA8c99352E",
      IdentityRegistryArtifact.abi
    );
    const tx = await contractWithSigner.approveHigherAuthority(
      authorityAddress
    );
    await tx.wait();
    console.log("Higher Authority approved:", authorityAddress);
    return true;
  } catch (error) {
    console.error("Error approving Higher Authority:", error);
    throw error;
  }
};

const getPendingAuthorities = async () => {
  const filter = identityRegistryContract.filters.HigherAuthorityRegistered();
  const events = await identityRegistryContract.queryFilter(filter);

  const pendingAuthorities = [];

  for (const event of events) {
    const authority = await identityRegistryContract.higherAuthorities(
      event.args.authority
    );
    if (!authority.isApproved) {
      pendingAuthorities.push({
        address: event.args.authority,
        name: authority.authorityName,
      });
    }
  }

  return pendingAuthorities;
};

export {
  provider,
  getSigner,
  getContractWithSigner,
  identityRegistryContract,
  factoryContract,
  addAdmin,
  approveHigherAuthority,
  getPendingAuthorities,
};
