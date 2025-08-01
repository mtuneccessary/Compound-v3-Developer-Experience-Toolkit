import { ethers, Contract, BigNumberish, ContractRunner } from 'ethers';
import {
  AccountInfo,
  MarketInfo,
  AssetInfo,
  CompoundV3Config,
  SupplyParams,
  WithdrawParams,
  BorrowParams,
  RepayParams,
} from './types';
import { COMPOUND_V3_MARKETS } from './constants/addresses';

// ABIs
const COMET_ABI = [
  'function getAccountInfo(address account) view returns (tuple(uint256 collateralValue, uint256 borrowBalance))',
  'function supply(address asset, uint amount)',
  'function withdraw(address asset, uint amount)',
  'function getSupplyRate(uint utilization) view returns (uint)',
  'function getBorrowRate(uint utilization) view returns (uint)',
  'function getUtilization() view returns (uint)',
  'function getPrice(address asset) view returns (uint)',
  'function getCollateralBalance(address account, address asset) view returns (uint128)',
  'function getBorrowBalance(address account) view returns (uint256)',
  'function baseToken() view returns (address)',
  'function baseTokenPriceFeed() view returns (address)',
] as const;

export class CompoundV3 {
  private provider: ethers.Provider;
  private marketAddress: string;
  private contract: Contract & { [key: string]: any };
  private chainId: number;

  constructor(config: CompoundV3Config) {
    this.provider = config.provider;
    this.chainId = config.chainId || 1; // Default to mainnet

    if (config.marketAddress) {
      this.marketAddress = config.marketAddress;
    } else {
      // Default to USDC market if no market address provided
      this.marketAddress = COMPOUND_V3_MARKETS[this.chainId as keyof typeof COMPOUND_V3_MARKETS].USDC;
    }

    this.contract = new ethers.Contract(this.marketAddress, COMET_ABI, this.provider) as Contract & { [key: string]: any };
  }

  /**
   * Get account information including collateral value and borrow balance
   * @param account The account address to query
   */
  async getAccountInfo(account: string): Promise<AccountInfo> {
    const result = await this.contract.getAccountInfo.staticCall(account);
    return {
      collateralValue: result[0],
      borrowBalance: result[1]
    };
  }

  /**
   * Get the current supply APR for the market
   */
  async getSupplyAPR(): Promise<number> {
    const utilization = await this.contract.getUtilization.staticCall();
    const supplyRate = await this.contract.getSupplyRate.staticCall(utilization);
    return Number(supplyRate) / 1e16; // Convert to percentage
  }

  /**
   * Get the current borrow APR for the market
   */
  async getBorrowAPR(): Promise<number> {
    const utilization = await this.contract.getUtilization.staticCall();
    const borrowRate = await this.contract.getBorrowRate.staticCall(utilization);
    return Number(borrowRate) / 1e16; // Convert to percentage
  }

  /**
   * Get the collateral balance for a specific asset
   */
  async getCollateralBalance(account: string, asset: string): Promise<BigNumberish> {
    return await this.contract.getCollateralBalance.staticCall(account, asset);
  }

  /**
   * Get the borrow balance for an account
   */
  async getBorrowBalance(account: string): Promise<BigNumberish> {
    return await this.contract.getBorrowBalance.staticCall(account);
  }

  /**
   * Supply assets to the protocol
   */
  async supply(params: SupplyParams, signer: ethers.Signer): Promise<ethers.ContractTransactionResponse> {
    const connectedContract = this.contract.connect(signer) as Contract & { [key: string]: any };
    return await connectedContract.supply(params.asset, params.amount);
  }

  /**
   * Withdraw assets from the protocol
   */
  async withdraw(params: WithdrawParams, signer: ethers.Signer): Promise<ethers.ContractTransactionResponse> {
    const connectedContract = this.contract.connect(signer) as Contract & { [key: string]: any };
    return await connectedContract.withdraw(params.asset, params.amount);
  }

  /**
   * Get the current price of an asset
   */
  async getAssetPrice(asset: string): Promise<BigNumberish> {
    return await this.contract.getPrice.staticCall(asset);
  }

  /**
   * Get the base token address for the market
   */
  async getBaseToken(): Promise<string> {
    return await this.contract.baseToken.staticCall();
  }

  /**
   * Get the base token price feed address
   */
  async getBaseTokenPriceFeed(): Promise<string> {
    return await this.contract.baseTokenPriceFeed.staticCall();
  }
} 