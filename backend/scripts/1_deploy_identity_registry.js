const hre = require("hardhat");

async function main() {
  const IdentityRegistry = await hre.ethers.getContractFactory(
    "IdentityRegistry"
  );

  console.log("Deploying IdentityRegistry...");
  const identityRegistry = await IdentityRegistry.deploy();

  console.log(
    "IdentityRegistry deployed to:",
    await identityRegistry.getAddress()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
