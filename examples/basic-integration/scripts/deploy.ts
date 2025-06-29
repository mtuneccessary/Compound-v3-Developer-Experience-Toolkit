import { ethers } from "hardhat";
import { BatchSupply__factory } from "@compound-v3/contracts";

async function main() {
  console.log("Deploying BatchSupply contract...");

  // Get signer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", await deployer.getAddress());

  // Deploy BatchSupply
  const BatchSupplyFactory = new BatchSupply__factory(deployer);
  const batchSupply = await BatchSupplyFactory.deploy();
  await batchSupply.waitForDeployment();

  console.log("BatchSupply deployed to:", await batchSupply.getAddress());
  console.log("\nVerify with:");
  console.log(`npx hardhat verify ${await batchSupply.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 