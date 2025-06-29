import { BigNumberish } from 'ethers';

export interface AccountInfo {
  collateralValue: BigNumberish;
  borrowBalance: BigNumberish;
}

export interface MarketInfo {
  baseToken: string;
  baseTokenPriceFeed: string;
  supplyKink: BigNumberish;
  supplyPerYearInterestRateSlopeLow: BigNumberish;
  supplyPerYearInterestRateSlopeHigh: BigNumberish;
  supplyPerYearInterestRateBase: BigNumberish;
  borrowKink: BigNumberish;
  borrowPerYearInterestRateSlopeLow: BigNumberish;
  borrowPerYearInterestRateSlopeHigh: BigNumberish;
  borrowPerYearInterestRateBase: BigNumberish;
  storeFrontPriceFactor: BigNumberish;
  trackingIndexScale: BigNumberish;
  baseTrackingSupplySpeed: BigNumberish;
  baseTrackingBorrowSpeed: BigNumberish;
  baseMinForRewards: BigNumberish;
  baseBorrowMin: BigNumberish;
  targetReserves: BigNumberish;
}

export interface AssetInfo {
  asset: string;
  priceFeed: string;
  scale: BigNumberish;
  borrowCollateralFactor: BigNumberish;
  liquidateCollateralFactor: BigNumberish;
  liquidationFactor: BigNumberish;
  supplyCap: BigNumberish;
}

export interface CompoundV3Config {
  provider: any; // ethers.Provider
  marketAddress?: string;
  chainId?: number;
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