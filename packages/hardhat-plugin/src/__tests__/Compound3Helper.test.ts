/// <reference types="jest" />
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
  let mockHre: any;

  beforeEach(() => {
    mockHre = {
      network: {
        name: "mainnet",
      },
      config: {
        compound3: {
          markets: {
            mainnet: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
          },
        },
      },
      ethers: {
        provider: mockProvider,
      },
    };

    helper = new Compound3Helper(mockHre);
  });

  describe("getMarketAddress", () => {
    it("should return the correct market address for mainnet", async () => {
      const address = await helper.getMarketAddress();
      expect(address).toBe("0xc3d688B66703497DAA19211EEdff47f25384cdc3");
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
      const accountInfo = await helper.getAccountInfo(account);
      
      expect(accountInfo).toEqual({
        collateralValue: BigInt(1000),
        borrowBalance: BigInt(500),
      });

      expect(ethers.Contract).toHaveBeenCalledWith(
        "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
        expect.any(Array),
        mockProvider
      );
    });
  });
}); 