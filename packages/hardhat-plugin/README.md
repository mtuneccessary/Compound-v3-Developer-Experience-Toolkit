# Hardhat Compound v3 Plugin

A Hardhat plugin for interacting with Compound v3 protocol. This plugin provides a set of utilities and tasks to make development with Compound v3 easier.

## Installation

```bash
npm install hardhat-compound3
# or
yarn add hardhat-compound3
# or
pnpm add hardhat-compound3
```

## Configuration

Add the following to your `hardhat.config.ts`:

```typescript
import "hardhat-compound3";

const config: HardhatUserConfig = {
  // ... other config options ...
  compound3: {
    enableGasReport: true, // Optional: Enable gas reporting for Compound v3 transactions
    markets: {
      mainnet: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
      goerli: "0x3EE77595A8459e93C2888b13aDB354017B198188",
      // Add other network market addresses as needed
    },
  },
};

export default config;
```

## Usage

Once installed and configured, you can access the Compound v3 helper through the Hardhat Runtime Environment:

```typescript
import { ethers } from "hardhat";

async function main() {
  // Get account information
  const account = "0x1234...";
  const accountInfo = await hre.compound3.getAccountInfo(account);
  console.log("Account Info:", accountInfo);

  // Supply assets
  const signer = await ethers.getSigner();
  const asset = "0x1234..."; // Asset address
  const amount = ethers.parseUnits("100", 18);
  await hre.compound3.supply(asset, amount, signer);

  // Withdraw assets
  await hre.compound3.withdraw(asset, amount, signer);
}
```

## API Reference

### `hre.compound3.getMarketAddress()`

Returns the Compound v3 market address for the current network.

### `hre.compound3.getAccountInfo(account: string)`

Returns account information including collateral value and borrow balance.

### `hre.compound3.supply(asset: string, amount: bigint, signer: ethers.Signer)`

Supply assets to Compound v3.

### `hre.compound3.withdraw(asset: string, amount: bigint, signer: ethers.Signer)`

Withdraw assets from Compound v3.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
