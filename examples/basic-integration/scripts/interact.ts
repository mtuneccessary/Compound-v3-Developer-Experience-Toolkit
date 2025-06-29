import { ethers } from "hardhat";
import { CompoundV3 } from "@compound-v3/sdk";
import { BatchSupply__factory } from "@compound-v3/contracts";

async function main() {
  // Get signer
  const [signer] = await ethers.getSigners();
  console.log("Using account:", await signer.getAddress());

  // Initialize SDK
  const sdk = new CompoundV3({
    provider: ethers.provider,
    signer: signer
  });

  // Get market info
  const usdcMarket = await sdk.getMarketInfo("USDC");
  console.log("\nUSDC Market Info:");
  console.log("Base Token:", usdcMarket.baseToken);
  console.log("Price Feed:", usdcMarket.baseTokenPriceFeed);

  // Get APRs
  const supplyAPR = await sdk.getSupplyAPR("USDC");
  const borrowAPR = await sdk.getBorrowAPR("USDC");
  console.log("\nMarket Rates:");
  console.log("Supply APR:", ethers.formatUnits(supplyAPR, 4), "%");
  console.log("Borrow APR:", ethers.formatUnits(borrowAPR, 4), "%");

  // Deploy BatchSupply contract if needed
  console.log("\nDeploying BatchSupply contract...");
  const BatchSupplyFactory = new BatchSupply__factory(signer);
  const batchSupply = await BatchSupplyFactory.deploy();
  await batchSupply.waitForDeployment();
  console.log("BatchSupply deployed to:", await batchSupply.getAddress());

  // Get current balances
  const supplyBalance = await sdk.getSupplyBalance("USDC", await signer.getAddress());
  const borrowBalance = await sdk.getBorrowBalance("USDC", await signer.getAddress());
  console.log("\nCurrent Balances:");
  console.log("Supply Balance:", ethers.formatUnits(supplyBalance, 6), "USDC");
  console.log("Borrow Balance:", ethers.formatUnits(borrowBalance, 6), "USDC");

  // Note: To actually supply or borrow, you would need:
  // 1. Real USDC tokens
  // 2. Approval for the Compound contract
  // 3. Sufficient collateral for borrowing
  console.log("\nTo perform actual supply/borrow operations:");
  console.log("1. Get testnet USDC (from faucet or DEX)");
  console.log("2. Approve USDC spending for the Compound contract");
  console.log("3. Call supply() or borrow() through the SDK");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 