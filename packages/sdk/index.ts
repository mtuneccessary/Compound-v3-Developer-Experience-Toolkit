import { ethers } from 'ethers';

// Example function to fetch account information
export async function getAccountInfo(provider: ethers.JsonRpcProvider, account: string) {
  // Contract address for the Compound v3 contract
  const contractAddress = '0xc3d688B66703497DAA19211EEdff47f25384cdc3';
  
  // Minimal ABI for getAccountInfo
  const contractABI = [
    "function getAccountInfo(address account) view returns (tuple(uint256 collateralValue, uint256 borrowBalance))"
  ];

  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  const accountInfo = await contract.getAccountInfo(account);
  return accountInfo;
}

export * from './src/CompoundV3';
export * from './src/types';
export * from './src/constants/addresses'; 