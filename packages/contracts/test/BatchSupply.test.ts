import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("BatchSupply", function () {
  async function deployBatchSupplyFixture(): Promise<{
    batchSupply: Contract;
    comet: Contract;
    token1: Contract;
    token2: Contract;
    owner: HardhatEthersSigner;
    user: HardhatEthersSigner;
  }> {
    const [owner, user] = await ethers.getSigners();

    // Deploy mock ERC20 tokens
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const token1 = await MockERC20.deploy("Token1", "TK1");
    const token2 = await MockERC20.deploy("Token2", "TK2");

    // Deploy mock Comet
    const MockComet = await ethers.getContractFactory("MockComet");
    const comet = await MockComet.deploy();

    // Deploy BatchSupply
    const BatchSupply = await ethers.getContractFactory("BatchSupply");
    const batchSupply = await BatchSupply.deploy(await comet.getAddress());

    // Mint tokens to user
    await token1.mint(user.address, ethers.parseEther("1000"));
    await token2.mint(user.address, ethers.parseEther("1000"));

    return {
      batchSupply,
      comet,
      token1,
      token2,
      owner,
      user,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { batchSupply, owner } = await loadFixture(deployBatchSupplyFixture);
      expect(await batchSupply.owner()).to.equal(owner.address);
    });

    it("Should set the right comet address", async function () {
      const { batchSupply, comet } = await loadFixture(deployBatchSupplyFixture);
      expect(await batchSupply.comet()).to.equal(await comet.getAddress());
    });

    it("Should revert if comet address is zero", async function () {
      const BatchSupply = await ethers.getContractFactory("BatchSupply");
      await expect(
        BatchSupply.deploy(ethers.ZeroAddress)
      ).to.be.revertedWith("BatchSupply: comet cannot be zero address");
    });
  });

  describe("Batch Supply", function () {
    it("Should supply multiple assets", async function () {
      const { batchSupply, token1, token2, user } = await loadFixture(
        deployBatchSupplyFixture
      );

      const amount1 = ethers.parseEther("100");
      const amount2 = ethers.parseEther("200");

      // Approve tokens
      await token1.connect(user).approve(batchSupply.getAddress(), amount1);
      await token2.connect(user).approve(batchSupply.getAddress(), amount2);

      // Perform batch supply
      await expect(
        batchSupply
          .connect(user)
          .batchSupply(
            [await token1.getAddress(), await token2.getAddress()],
            [amount1, amount2]
          )
      )
        .to.emit(batchSupply, "BatchSupplied")
        .withArgs(
          user.address,
          [await token1.getAddress(), await token2.getAddress()],
          [amount1, amount2]
        );
    });

    it("Should revert if arrays length mismatch", async function () {
      const { batchSupply, token1, token2, user } = await loadFixture(
        deployBatchSupplyFixture
      );

      await expect(
        batchSupply
          .connect(user)
          .batchSupply([await token1.getAddress()], [ethers.parseEther("100"), ethers.parseEther("200")])
      ).to.be.revertedWith("BatchSupply: arrays length mismatch");
    });

    it("Should revert if arrays are empty", async function () {
      const { batchSupply, user } = await loadFixture(deployBatchSupplyFixture);

      await expect(
        batchSupply.connect(user).batchSupply([], [])
      ).to.be.revertedWith("BatchSupply: empty arrays");
    });

    it("Should revert if asset address is zero", async function () {
      const { batchSupply, user } = await loadFixture(deployBatchSupplyFixture);

      await expect(
        batchSupply
          .connect(user)
          .batchSupply([ethers.ZeroAddress], [ethers.parseEther("100")])
      ).to.be.revertedWith("BatchSupply: asset cannot be zero address");
    });

    it("Should revert if amount is zero", async function () {
      const { batchSupply, token1, user } = await loadFixture(
        deployBatchSupplyFixture
      );

      await expect(
        batchSupply
          .connect(user)
          .batchSupply([await token1.getAddress()], [0])
      ).to.be.revertedWith("BatchSupply: amount must be greater than 0");
    });
  });

  describe("Admin Functions", function () {
    it("Should update comet address", async function () {
      const { batchSupply, owner } = await loadFixture(deployBatchSupplyFixture);
      const newCometAddress = "0x1234567890123456789012345678901234567890";

      await expect(batchSupply.connect(owner).updateComet(newCometAddress))
        .to.emit(batchSupply, "CometUpdated")
        .withArgs(await batchSupply.comet(), newCometAddress);

      expect(await batchSupply.comet()).to.equal(newCometAddress);
    });

    it("Should revert if non-owner tries to update comet", async function () {
      const { batchSupply, user } = await loadFixture(deployBatchSupplyFixture);
      const newCometAddress = "0x1234567890123456789012345678901234567890";

      await expect(
        batchSupply.connect(user).updateComet(newCometAddress)
      ).to.be.revertedWithCustomError(batchSupply, "OwnableUnauthorizedAccount");
    });

    it("Should set manager", async function () {
      const { batchSupply, owner } = await loadFixture(deployBatchSupplyFixture);
      const manager = "0x1234567890123456789012345678901234567890";

      await expect(batchSupply.connect(owner).setManager(manager, true))
        .to.not.be.reverted;
    });

    it("Should revert if non-owner tries to set manager", async function () {
      const { batchSupply, user } = await loadFixture(deployBatchSupplyFixture);
      const manager = "0x1234567890123456789012345678901234567890";

      await expect(
        batchSupply.connect(user).setManager(manager, true)
      ).to.be.revertedWithCustomError(batchSupply, "OwnableUnauthorizedAccount");
    });
  });
}); 