"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountInfo = getAccountInfo;
const ethers_1 = require("ethers");
// Example function to fetch account information
async function getAccountInfo(provider, account) {
    // Contract address for the Compound v3 contract
    const contractAddress = '0xc3d688B66703497DAA19211EEdff47f25384cdc3';
    // Minimal ABI for getAccountInfo
    const contractABI = [
        "function getAccountInfo(address account) view returns (tuple(uint256 collateralValue, uint256 borrowBalance))"
    ];
    const contract = new ethers_1.ethers.Contract(contractAddress, contractABI, provider);
    const accountInfo = await contract.getAccountInfo(account);
    return accountInfo;
}
__exportStar(require("./src/CompoundV3"), exports);
__exportStar(require("./src/types"), exports);
__exportStar(require("./src/constants/addresses"), exports);
