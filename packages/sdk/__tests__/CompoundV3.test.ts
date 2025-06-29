import { ethers } from 'ethers';
import { CompoundV3 } from '../src/CompoundV3';
import { COMPOUND_V3_MARKETS } from '../src/constants/addresses';

// Mock provider
const mockProvider = {
  getNetwork: jest.fn().mockResolvedValue({ chainId: 1 }),
} as unknown as ethers.Provider;

describe('CompoundV3', () => {
  let sdk: CompoundV3;

  beforeEach(() => {
    sdk = new CompoundV3({ provider: mockProvider });
  });

  describe('constructor', () => {
    it('should initialize with default mainnet USDC market', () => {
      expect(sdk).toBeDefined();
    });

    it('should initialize with custom market address', () => {
      const customMarket = '0x1234567890123456789012345678901234567890';
      const customSdk = new CompoundV3({
        provider: mockProvider,
        marketAddress: customMarket,
      });
      expect(customSdk).toBeDefined();
    });
  });

  describe('getAccountInfo', () => {
    it('should fetch account information', async () => {
      const mockAccountInfo = {
        collateralValue: ethers.parseEther('100'),
        borrowBalance: ethers.parseEther('50'),
      };

      // Mock the contract call
      const mockContract = {
        getAccountInfo: jest.fn().mockResolvedValue(mockAccountInfo),
      };

      // @ts-ignore - Accessing private property for testing
      sdk.contract = mockContract;

      const result = await sdk.getAccountInfo('0x1234567890123456789012345678901234567890');
      expect(result).toEqual(mockAccountInfo);
    });
  });

  describe('getSupplyAPR', () => {
    it('should return the correct supply APR', async () => {
      const mockUtilization = ethers.parseEther('0.8'); // 80% utilization
      const mockSupplyRate = ethers.parseEther('0.05'); // 5% APR

      // Mock the contract calls
      const mockContract = {
        getUtilization: jest.fn().mockResolvedValue(mockUtilization),
        getSupplyRate: jest.fn().mockResolvedValue(mockSupplyRate),
      };

      // @ts-ignore - Accessing private property for testing
      sdk.contract = mockContract;

      const result = await sdk.getSupplyAPR();
      expect(result).toBeCloseTo(5); // Should be close to 5%
    });
  });

  describe('getBorrowAPR', () => {
    it('should return the correct borrow APR', async () => {
      const mockUtilization = ethers.parseEther('0.8'); // 80% utilization
      const mockBorrowRate = ethers.parseEther('0.08'); // 8% APR

      // Mock the contract calls
      const mockContract = {
        getUtilization: jest.fn().mockResolvedValue(mockUtilization),
        getBorrowRate: jest.fn().mockResolvedValue(mockBorrowRate),
      };

      // @ts-ignore - Accessing private property for testing
      sdk.contract = mockContract;

      const result = await sdk.getBorrowAPR();
      expect(result).toBeCloseTo(8); // Should be close to 8%
    });
  });
}); 