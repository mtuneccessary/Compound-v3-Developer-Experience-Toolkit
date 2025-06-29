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
} 