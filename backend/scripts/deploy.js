const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("=".repeat(60));
  console.log("  Docify — Unified Contract Deployment");
  console.log("=".repeat(60));
  console.log(`Network:  ${network}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance:  ${hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address))} ETH`);
  console.log("-".repeat(60));

  // 1. Deploy IdentityRegistry
  console.log("\n[1/3] Deploying IdentityRegistry...");
  const IdentityRegistry = await hre.ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy();
  await identityRegistry.waitForDeployment();
  const identityRegistryAddress = await identityRegistry.getAddress();
  console.log(`  ✅ IdentityRegistry deployed to: ${identityRegistryAddress}`);

  // 2. Deploy Factory
  console.log("\n[2/3] Deploying Factory...");
  const Factory = await hre.ethers.getContractFactory("Factory");
  const factory = await Factory.deploy(identityRegistryAddress, deployer.address);
  await factory.waitForDeployment();
  const factoryAddress = await factory.getAddress();
  console.log(`  ✅ Factory deployed to: ${factoryAddress}`);

  // 3. Link Factory to IdentityRegistry
  console.log("\n[3/3] Linking Factory to IdentityRegistry...");
  const setFactoryTx = await identityRegistry.setFactory(factoryAddress);
  await setFactoryTx.wait();
  console.log(`  ✅ Factory address set in IdentityRegistry`);

  // Save deployment info
  const deployment = {
    network,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    contracts: {
      IdentityRegistry: identityRegistryAddress,
      Factory: factoryAddress,
    },
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${network}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deployment, null, 2));
  console.log(`\n📄 Deployment info saved to: deployments/${network}.json`);

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("  DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log(`  Network:            ${network}`);
  console.log(`  Deployer (Super Admin): ${deployer.address}`);
  console.log(`  IdentityRegistry:   ${identityRegistryAddress}`);
  console.log(`  Factory:            ${factoryAddress}`);
  console.log("=".repeat(60));

  // Generate .env snippet for frontend
  console.log("\n📋 Add these to your frontend/.env.local:");
  console.log(`  NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS=${identityRegistryAddress}`);
  console.log(`  NEXT_PUBLIC_FACTORY_ADDRESS=${factoryAddress}`);
  console.log(`  NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545`);
  console.log(`  NEXT_PUBLIC_CHAIN_ID=1337`);
  console.log("");

  return deployment;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
