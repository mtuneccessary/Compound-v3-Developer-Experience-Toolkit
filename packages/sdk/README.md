# Compound v3 SDK

A TypeScript SDK for interacting with Compound v3 markets. This SDK provides a simple, type-safe interface for all Compound v3 operations.

## Installation

```bash
npm install @compound-v3/sdk ethers
```

## Features

- 🔒 Type-safe interfaces for all operations
- 🌐 Multi-chain support (Mainnet, Arbitrum, Base)
- 📊 Market data and APR calculations
- 💰 Position management
- ⚡ Optimized for Ethers v6

## Usage

### Initialization

```typescript
import { CompoundV3 } from '@compound-v3/sdk';
import { ethers } from 'ethers';

// Initialize with default mainnet USDC market
const sdk = new CompoundV3({
  provider: new ethers.JsonRpcProvider('YOUR_RPC_URL')
});

// Or specify a different market/chain
const sdk = new CompoundV3({
  provider: new ethers.JsonRpcProvider('YOUR_RPC_URL'),
  chainId: 42161, // Arbitrum
  marketAddress: '0x...' // Custom market address
});
```

### Account Information

```typescript
// Get account overview
const accountInfo = await sdk.getAccountInfo('0x...');
console.log('Collateral Value:', accountInfo.collateralValue);
console.log('Borrow Balance:', accountInfo.borrowBalance);

// Get specific balances
const collateralBalance = await sdk.getCollateralBalance('0x...', assetAddress);
const borrowBalance = await sdk.getBorrowBalance('0x...');
```

### Market Data

```typescript
// Get current rates
const supplyAPR = await sdk.getSupplyAPR();
const borrowAPR = await sdk.getBorrowAPR();

// Get asset prices
const price = await sdk.getAssetPrice(assetAddress);

// Get base token info
const baseToken = await sdk.getBaseToken();
const priceFeed = await sdk.getBaseTokenPriceFeed();
```

### Transactions

```typescript
// Initialize signer
const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

// Supply assets
await sdk.supply({
  asset: '0x...', // Asset address
  amount: ethers.parseEther('100')
}, signer);

// Withdraw assets
await sdk.withdraw({
  asset: '0x...', // Asset address
  amount: ethers.parseEther('50')
}, signer);
```

## API Reference

### Constructor

```typescript
new CompoundV3(config: CompoundV3Config)
```

Configuration options:
- `provider`: Ethers provider
- `chainId?`: Chain ID (default: 1)
- `marketAddress?`: Custom market address

### Methods

#### Account Information
- `getAccountInfo(account: string): Promise<AccountInfo>`
- `getCollateralBalance(account: string, asset: string): Promise<BigNumberish>`
- `getBorrowBalance(account: string): Promise<BigNumberish>`

#### Market Data
- `getSupplyAPR(): Promise<number>`
- `getBorrowAPR(): Promise<number>`
- `getAssetPrice(asset: string): Promise<BigNumberish>`
- `getBaseToken(): Promise<string>`
- `getBaseTokenPriceFeed(): Promise<string>`

#### Transactions
- `supply(params: SupplyParams, signer: Signer): Promise<ContractTransactionResponse>`
- `withdraw(params: WithdrawParams, signer: Signer): Promise<ContractTransactionResponse>`

## Types

```typescript
interface AccountInfo {
  collateralValue: BigNumberish;
  borrowBalance: BigNumberish;
}

interface SupplyParams {
  asset: string;
  amount: BigNumberish;
}

interface WithdrawParams {
  asset: string;
  amount: BigNumberish;
}
```

## Error Handling

The SDK throws standard ethers.js errors for contract interactions. Always wrap calls in try-catch blocks:

```typescript
try {
  await sdk.supply({
    asset: assetAddress,
    amount: amount
  }, signer);
} catch (error) {
  if (error.code === 'CALL_EXCEPTION') {
    console.error('Transaction reverted:', error.reason);
  } else {
    console.error('Error:', error);
  }
}
```

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Run with coverage
pnpm test:coverage
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](../../CONTRIBUTING.md) first.

## License

MIT License 