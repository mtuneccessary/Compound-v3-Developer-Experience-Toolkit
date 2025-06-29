import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("SafeRepay", function () {
  async function deploySafeRepayFixture(): Promise<{
    safeRepay: Contract;
    comet: Contract;
    collateralToken: Contract;
    owner: HardhatEthersSigner;
    user: HardhatEthersSigner;
  }> {
    const [owner, user] = await ethers.getSigners();

    // Deploy mock ERC20 token
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const collateralToken = await MockERC20.deploy("Collateral", "COL");

    // Deploy mock Comet
    const MockComet = await ethers.getContractFactory("MockComet");
    const comet = await MockComet.deploy();

    // Deploy SafeRepay
    const SafeRepay = await ethers.getContractFactory("SafeRepay");
    const safeRepay = await SafeRepay.deploy(await comet.getAddress());

    // Mint tokens to user
    await collateralToken.mint(user.address, ethers.parseEther("1000"));

    // Setup mock balances and prices
    await comet.setCollateralBalance(
      user.address,
      await collateralToken.getAddress(),
      ethers.parseEther("100")
    );
    await comet.setBorrowBalance(user.address, ethers.parseEther("50"));
    await comet.setPrice(await collateralToken.getAddress(), ethers.parseEther("2")); // 1 COL = 2 ETH

    return {
      safeRepay,
      comet,
      collateralToken,
      owner,
      user,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { safeRepay, owner } = await loadFixture(deploySafeRepayFixture);
      expect(await safeRepay.owner()).to.equal(owner.address);
    });

    it("Should set the right comet address", async function () {
      const { safeRepay, comet } = await loadFixture(deploySafeRepayFixture);
      expect(await safeRepay.comet()).to.equal(await comet.getAddress());
    });

    it("Should revert if comet address is zero", async function () {
      const SafeRepay = await ethers.getContractFactory("SafeRepay");
      await expect(
        SafeRepay.deploy(ethers.ZeroAddress)
      ).to.be.revertedWith("SafeRepay: comet cannot be zero address");
    });
  });

  describe("Safe Repay", function () {
    it("Should repay debt and withdraw collateral", async function () {
      const { safeRepay, comet, collateralToken, user } = await loadFixture(
        deploySafeRepayFixture
      );

      const repayAmount = ethers.parseEther("10");

      // Approve tokens
      await collateralToken
        .connect(user)
        .approve(safeRepay.getAddress(), repayAmount);

      // Perform safe repay
      await expect(
        safeRepay
          .connect(user)
          .safeRepay(repayAmount, await collateralToken.getAddress())
      )
        .to.emit(safeRepay, "DebtRepaid")
        .withArgs(user.address, repayAmount, ethers.parseEther("5.25")); // 10 * 1.05 / 2
    });

    it("Should revert if repay amount is zero", async function () {
      const { safeRepay, collateralToken, user } = await loadFixture(
        deploySafeRepayFixture
      );

      await expect(
        safeRepay
          .connect(user)
          .safeRepay(0, await collateralToken.getAddress())
      ).to.be.revertedWith("SafeRepay: repay amount must be greater than 0");
    });

    it("Should revert if collateral asset is zero address", async function () {
      const { safeRepay, user } = await loadFixture(deploySafeRepayFixture);

      await expect(
        safeRepay.connect(user).safeRepay(ethers.parseEther("10"), ethers.ZeroAddress)
      ).to.be.revertedWith("SafeRepay: collateral asset cannot be zero address");
    });

    it("Should revert if repay amount exceeds borrow balance", async function () {
      const { safeRepay, collateralToken, user } = await loadFixture(
        deploySafeRepayFixture
      );

      await expect(
        safeRepay
          .connect(user)
          .safeRepay(ethers.parseEther("60"), await collateralToken.getAddress())
      ).to.be.revertedWith("SafeRepay: repay amount exceeds borrow balance");
    });

    it("Should revert if insufficient collateral for safe repayment", async function () {
      const { safeRepay, comet, collateralToken, user } = await loadFixture(
        deploySafeRepayFixture
      );

      // Set a very low collateral balance
      await comet.setCollateralBalance(
        user.address,
        await collateralToken.getAddress(),
        ethers.parseEther("1")
      );

      await expect(
        safeRepay
          .connect(user)
          .safeRepay(ethers.parseEther("10"), await collateralToken.getAddress())
      ).to.be.revertedWith("SafeRepay: insufficient collateral for safe repayment");
    });
  });

  describe("Admin Functions", function () {
    it("Should update comet address", async function () {
      const { safeRepay, owner } = await loadFixture(deploySafeRepayFixture);
      const newCometAddress = "0x1234567890123456789012345678901234567890";

      await expect(safeRepay.connect(owner).updateComet(newCometAddress))
        .to.emit(safeRepay, "CometUpdated")
        .withArgs(await safeRepay.comet(), newCometAddress);

      expect(await safeRepay.comet()).to.equal(newCometAddress);
    });

    it("Should revert if non-owner tries to update comet", async function () {
      const { safeRepay, user } = await loadFixture(deploySafeRepayFixture);
      const newCometAddress = "0x1234567890123456789012345678901234567890";

      await expect(
        safeRepay.connect(user).updateComet(newCometAddress)
      ).to.be.revertedWithCustomError(safeRepay, "OwnableUnauthorizedAccount");
    });

    it("Should set manager", async function () {
      const { safeRepay, owner } = await loadFixture(deploySafeRepayFixture);
      const manager = "0x1234567890123456789012345678901234567890";

      await expect(safeRepay.connect(owner).setManager(manager, true))
        .to.not.be.reverted;
    });

    it("Should revert if non-owner tries to set manager", async function () {
      const { safeRepay, user } = await loadFixture(deploySafeRepayFixture);
      const manager = "0x1234567890123456789012345678901234567890";

      await expect(
        safeRepay.connect(user).setManager(manager, true)
      ).to.be.revertedWithCustomError(safeRepay, "OwnableUnauthorizedAccount");
    });
  });
}); 