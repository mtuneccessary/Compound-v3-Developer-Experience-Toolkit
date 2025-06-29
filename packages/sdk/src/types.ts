import { ethers, BigNumberish } from 'ethers';

export interface CompoundV3Config {
  provider: ethers.Provider;
  chainId?: number;
  marketAddress?: string;
}

export interface AccountInfo {
  collateralValue: BigNumberish;
  borrowBalance: BigNumberish;
}

export interface MarketInfo {
  baseToken: string;
  baseTokenPriceFeed: string;
}

export interface AssetInfo {
  price: BigNumberish;
  decimals: number;
}

export interface SupplyParams {
  asset: string;
  amount: BigNumberish;
}

export interface WithdrawParams {
  asset: string;
  amount: BigNumberish;
}

export interface BorrowParams {
  amount: BigNumberish;
}

export interface RepayParams {
  amount: BigNumberish;
} 