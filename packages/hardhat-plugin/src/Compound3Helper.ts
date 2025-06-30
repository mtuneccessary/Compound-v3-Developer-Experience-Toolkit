import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "ethers";

export class Compound3Helper {
  private readonly hre: HardhatRuntimeEnvironment;
  private readonly provider: ethers.Provider;

  constructor(hre: HardhatRuntimeEnvironment) {
    this.hre = hre;
    this.provider = hre.ethers.provider;
  }

  /**
   * Get the Compound v3 market address for the current network
   */
  async getMarketAddress(): Promise<string> {
    const network = await this.hre.network.name;
    const marketAddress = this.hre.config.compound3.markets[network];
    
    if (!marketAddress) {
      throw new Error(`No Compound v3 market address configured for network: ${network}`);
    }

    return marketAddress;
  }

  /**
   * Get account information from Compound v3
   */
  async getAccountInfo(account: string): Promise<{
    collateralValue: bigint;
    borrowBalance: bigint;
  }> {
    const marketAddress = await this.getMarketAddress();
    const abi = [
      "function getAccountInfo(address account) view returns (tuple(uint256 collateralValue, uint256 borrowBalance))",
    ];

    const contract = new ethers.Contract(marketAddress, abi, this.provider);
    return await contract.getAccountInfo(account);
  }

  /**
   * Supply assets to Compound v3
   */
  async supply(
    asset: string,
    amount: bigint,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransactionResponse> {
    const marketAddress = await this.getMarketAddress();
    const abi = [
      "function supply(address asset, uint256 amount) returns (bool)",
    ];

    const contract = new ethers.Contract(marketAddress, abi, signer);
    return await contract.supply(asset, amount);
  }

  /**
   * Withdraw assets from Compound v3
   */
  async withdraw(
    asset: string,
    amount: bigint,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransactionResponse> {
    const marketAddress = await this.getMarketAddress();
    const abi = [
      "function withdraw(address asset, uint256 amount) returns (bool)",
    ];

    const contract = new ethers.Contract(marketAddress, abi, signer);
    return await contract.withdraw(asset, amount);
  }

  /**
   * Borrow assets from Compound v3
   * @param asset The address of the asset to borrow
   * @param amount The amount to borrow
   * @param signer The signer to execute the transaction
   */
  async borrow(
    asset: string,
    amount: bigint,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransactionResponse> {
    const marketAddress = await this.getMarketAddress();
    const abi = [
      "function borrow(address asset, uint256 amount) returns (bool)",
    ];

    const contract = new ethers.Contract(marketAddress, abi, signer);
    return await contract.borrow(asset, amount);
  }

  /**
   * Repay borrowed assets to Compound v3
   * @param asset The address of the asset to repay
   * @param amount The amount to repay
   * @param signer The signer to execute the transaction
   */
  async repay(
    asset: string,
    amount: bigint,
    signer: ethers.Signer
  ): Promise<ethers.ContractTransactionResponse> {
    const marketAddress = await this.getMarketAddress();
    const abi = [
      "function repay(address asset, uint256 amount) returns (bool)",
    ];

    const contract = new ethers.Contract(marketAddress, abi, signer);
    return await contract.repay(asset, amount);
  }

  /**
   * Get market parameters for a specific asset
   * @param asset The address of the asset to get parameters for
   */
  async getMarketParameters(asset: string): Promise<{
    borrowRate: bigint;
    supplyRate: bigint;
    collateralFactor: bigint;
    liquidationThreshold: bigint;
    reserveFactor: bigint;
    totalSupply: bigint;
    totalBorrow: bigint;
  }> {
    const marketAddress = await this.getMarketAddress();
    const abi = [
      "function getMarketParameters(address asset) view returns (tuple(uint256 borrowRate, uint256 supplyRate, uint256 collateralFactor, uint256 liquidationThreshold, uint256 reserveFactor, uint256 totalSupply, uint256 totalBorrow))",
    ];

    const contract = new ethers.Contract(marketAddress, abi, this.provider);
    return await contract.getMarketParameters(asset);
  }

  /**
   * Get user's health factor
   * @param account The address of the account to check
   */
  async getHealthFactor(account: string): Promise<bigint> {
    const marketAddress = await this.getMarketAddress();
    const abi = [
      "function getHealthFactor(address account) view returns (uint256)",
    ];

    const contract = new ethers.Contract(marketAddress, abi, this.provider);
    return await contract.getHealthFactor(account);
  }
} 