/// <reference types="jest" />
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Compound3Helper } from "../Compound3Helper";
import { ethers } from "ethers";

// Mock ethers
const mockGetAccountInfo = jest.fn().mockResolvedValue({
  collateralValue: BigInt(1000),
  borrowBalance: BigInt(500),
});

const mockProvider = {
  getNetwork: jest.fn().mockResolvedValue({ chainId: 1 }),
};

jest.mock("ethers", () => {
  const MockContract = jest.fn().mockImplementation(() => ({
    getAccountInfo: mockGetAccountInfo,
  }));

  return {
    Contract: MockContract,
    JsonRpcProvider: jest.fn(() => mockProvider),
    ethers: {
      Contract: MockContract,
    },
  };
});

describe("Compound3Helper", () => {
  let helper: Compound3Helper;
  let mockHre: HardhatRuntimeEnvironment;
  let mockProvider: jest.Mocked<ethers.Provider>;
  let mockSigner: jest.Mocked<ethers.Signer>;
  let mockContract: jest.Mocked<ethers.Contract>;

  beforeEach(() => {
    // Mock provider
    mockProvider = {
      getNetwork: jest.fn().mockResolvedValue({ name: "mainnet" }),
    } as any;

    // Mock signer
    mockSigner = {
      provider: mockProvider,
    } as any;

    // Mock HRE
    mockHre = {
      ethers: {
        provider: mockProvider,
      },
      network: {
        name: "mainnet",
      },
      config: {
        compound3: {
          markets: {
            mainnet: "0x1234567890123456789012345678901234567890",
          },
        },
      },
    } as any;

    // Create helper instance
    helper = new Compound3Helper(mockHre);

    // Mock Contract
    mockContract = {
      getAccountInfo: jest.fn(),
      supply: jest.fn(),
      withdraw: jest.fn(),
      borrow: jest.fn(),
      repay: jest.fn(),
      getMarketParameters: jest.fn(),
      getHealthFactor: jest.fn(),
    } as any;

    // Mock ethers.Contract constructor
    (ethers.Contract as jest.Mock) = jest.fn().mockImplementation(() => mockContract);
  });

  describe("getMarketAddress", () => {
    it("should return the correct market address for mainnet", async () => {
      const address = await helper.getMarketAddress();
      expect(address).toBe("0x1234567890123456789012345678901234567890");
    });

    it("should throw error for unsupported network", async () => {
      mockHre.network.name = "unsupported";
      await expect(helper.getMarketAddress()).rejects.toThrow(
        "No Compound v3 market address configured for network: unsupported"
      );
    });
  });

  describe("getAccountInfo", () => {
    it("should return account information", async () => {
      const account = "0x1234567890123456789012345678901234567890";
      const mockAccountInfo = {
        collateralValue: BigInt(1000),
        borrowBalance: BigInt(500),
      };

      mockContract.getAccountInfo.mockResolvedValue(mockAccountInfo);
      
      const accountInfo = await helper.getAccountInfo(account);
      
      expect(accountInfo).toEqual({
        collateralValue: BigInt(1000),
        borrowBalance: BigInt(500),
      });
      expect(mockContract.getAccountInfo).toHaveBeenCalledWith(account);
    });
  });

  describe("borrow", () => {
    it("should call borrow on the contract with correct parameters", async () => {
      const asset = "0x1234567890123456789012345678901234567890";
      const amount = BigInt(1000);
      
      await helper.borrow(asset, amount, mockSigner);

      expect(mockContract.borrow).toHaveBeenCalledWith(asset, amount);
    });
  });

  describe("repay", () => {
    it("should call repay on the contract with correct parameters", async () => {
      const asset = "0x1234567890123456789012345678901234567890";
      const amount = BigInt(1000);
      
      await helper.repay(asset, amount, mockSigner);

      expect(mockContract.repay).toHaveBeenCalledWith(asset, amount);
    });
  });

  describe("getMarketParameters", () => {
    it("should return market parameters for an asset", async () => {
      const asset = "0x1234567890123456789012345678901234567890";
      const mockParameters = {
        borrowRate: BigInt(100),
        supplyRate: BigInt(50),
        collateralFactor: BigInt(800),
        liquidationThreshold: BigInt(850),
        reserveFactor: BigInt(100),
        totalSupply: BigInt(1000000),
        totalBorrow: BigInt(500000),
      };

      mockContract.getMarketParameters.mockResolvedValue(mockParameters);
      
      const result = await helper.getMarketParameters(asset);

      expect(result).toEqual(mockParameters);
      expect(mockContract.getMarketParameters).toHaveBeenCalledWith(asset);
    });
  });

  describe("getHealthFactor", () => {
    it("should return health factor for an account", async () => {
      const account = "0x1234567890123456789012345678901234567890";
      const mockHealthFactor = BigInt(1500); // 1.5 with 3 decimals

      mockContract.getHealthFactor.mockResolvedValue(mockHealthFactor);
      
      const result = await helper.getHealthFactor(account);

      expect(result).toEqual(mockHealthFactor);
      expect(mockContract.getHealthFactor).toHaveBeenCalledWith(account);
    });
  });
}); 