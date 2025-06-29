import { expect } from "chai";
import { ethers } from "hardhat";
import { CompoundV3 } from "@compound-v3/sdk";

describe("Compound v3 Integration", () => {
  let sdk: CompoundV3;
  let signer: any;

  before(async () => {
    // Get signer
    [signer] = await ethers.getSigners();
    
    // Initialize SDK
    sdk = new CompoundV3({
      provider: ethers.provider
    });
  });

  describe("Basic Operations", () => {
    it("should get account info", async () => {
      const accountInfo = await sdk.getAccountInfo(await signer.getAddress());
      expect(accountInfo.collateralValue).to.not.be.undefined;
      expect(accountInfo.borrowBalance).to.not.be.undefined;
    });

    it("should calculate supply APR", async () => {
      const apr = await sdk.getSupplyAPR();
      expect(apr).to.be.a('number');
    });

    it("should calculate borrow APR", async () => {
      const apr = await sdk.getBorrowAPR();
      expect(apr).to.be.a('number');
    });

    it("should get base token", async () => {
      const baseToken = await sdk.getBaseToken();
      expect(baseToken).to.be.a('string');
      expect(baseToken).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it("should get base token price feed", async () => {
      const priceFeed = await sdk.getBaseTokenPriceFeed();
      expect(priceFeed).to.be.a('string');
      expect(priceFeed).to.match(/^0x[a-fA-F0-9]{40}$/);
    });
  });

  describe("Advanced Operations", () => {
    it("should perform supply and withdraw operations", async () => {
      const baseToken = await sdk.getBaseToken();
      const amount = ethers.parseUnits("100", 6); // 100 USDC

      // Supply
      await sdk.supply({
        asset: baseToken,
        amount: amount
      }, signer);

      // Get collateral balance
      const balance = await sdk.getCollateralBalance(await signer.getAddress(), baseToken);
      expect(balance).to.equal(amount);

      // Withdraw
      await sdk.withdraw({
        asset: baseToken,
        amount: amount
      }, signer);

      // Verify withdrawal
      const finalBalance = await sdk.getCollateralBalance(await signer.getAddress(), baseToken);
      expect(finalBalance).to.equal(0);
    });

    it("should get borrow balance", async () => {
      const borrowBalance = await sdk.getBorrowBalance(await signer.getAddress());
      expect(borrowBalance).to.not.be.undefined;
    });

    it("should get asset price", async () => {
      const baseToken = await sdk.getBaseToken();
      const price = await sdk.getAssetPrice(baseToken);
      expect(price).to.not.be.undefined;
    });
  });
}); 