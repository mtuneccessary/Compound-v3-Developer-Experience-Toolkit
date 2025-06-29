"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompoundV3 = void 0;
const ethers_1 = require("ethers");
const addresses_1 = require("./constants/addresses");
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
];
class CompoundV3 {
    provider;
    marketAddress;
    contract;
    chainId;
    constructor(config) {
        this.provider = config.provider;
        this.chainId = config.chainId || 1; // Default to mainnet
        if (config.marketAddress) {
            this.marketAddress = config.marketAddress;
        }
        else {
            // Default to USDC market if no market address provided
            this.marketAddress = addresses_1.COMPOUND_V3_MARKETS[this.chainId].USDC;
        }
        this.contract = new ethers_1.ethers.Contract(this.marketAddress, COMET_ABI, this.provider);
    }
    /**
     * Get account information including collateral value and borrow balance
     * @param account The account address to query
     */
    async getAccountInfo(account) {
        const result = await this.contract.getAccountInfo.staticCall(account);
        return {
            collateralValue: result[0],
            borrowBalance: result[1]
        };
    }
    /**
     * Get the current supply APR for the market
     */
    async getSupplyAPR() {
        const utilization = await this.contract.getUtilization.staticCall();
        const supplyRate = await this.contract.getSupplyRate.staticCall(utilization);
        return Number(supplyRate) / 1e16; // Convert to percentage
    }
    /**
     * Get the current borrow APR for the market
     */
    async getBorrowAPR() {
        const utilization = await this.contract.getUtilization.staticCall();
        const borrowRate = await this.contract.getBorrowRate.staticCall(utilization);
        return Number(borrowRate) / 1e16; // Convert to percentage
    }
    /**
     * Get the collateral balance for a specific asset
     */
    async getCollateralBalance(account, asset) {
        return await this.contract.getCollateralBalance.staticCall(account, asset);
    }
    /**
     * Get the borrow balance for an account
     */
    async getBorrowBalance(account) {
        return await this.contract.getBorrowBalance.staticCall(account);
    }
    /**
     * Supply assets to the protocol
     */
    async supply(params, signer) {
        const connectedContract = this.contract.connect(signer);
        return await connectedContract.supply(params.asset, params.amount);
    }
    /**
     * Withdraw assets from the protocol
     */
    async withdraw(params, signer) {
        const connectedContract = this.contract.connect(signer);
        return await connectedContract.withdraw(params.asset, params.amount);
    }
    /**
     * Get the current price of an asset
     */
    async getAssetPrice(asset) {
        return await this.contract.getPrice.staticCall(asset);
    }
    /**
     * Get the base token address for the market
     */
    async getBaseToken() {
        return await this.contract.baseToken.staticCall();
    }
    /**
     * Get the base token price feed address
     */
    async getBaseTokenPriceFeed() {
        return await this.contract.baseTokenPriceFeed.staticCall();
    }
}
exports.CompoundV3 = CompoundV3;
