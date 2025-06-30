# Compound v3 Hardhat Plugin

A Hardhat plugin for Compound v3 development that provides helpers, fixtures, and utilities for testing and deployment.

## Installation

```bash
npm install --save-dev @compound-v3/hardhat-plugin
```

## Configuration

Add the plugin to your `hardhat.config.ts`:

```typescript
import '@compound-v3/hardhat-plugin';

const config: HardhatUserConfig = {
  // ... your other config
  compound3: {
    // Optional: Override default market addresses
    markets: {
      mainnet: {
        USDC: '0x...',
        // ... other markets
      }
    }
  }
};

export default config;
```

## Features

- 🔧 Market interaction helpers
- 📊 Account information utilities
- 🧪 Testing utilities and fixtures
- ⛽ Gas optimization tools
- 🌐 Multi-chain support

## Usage

### Market Interaction

```typescript
import { ethers } from 'hardhat';

// Get market information
const marketInfo = await hre.compound3.getMarketInfo('USDC');

// Get account information
const accountInfo = await hre.compound3.getAccountInfo('0x...');

// Supply assets
await hre.compound3.supply('USDC', ethers.parseUnits('1000', 6));

// Get current rates
const supplyRate = await hre.compound3.getSupplyRate();
const borrowRate = await hre.compound3.getBorrowRate();
```

### Testing Utilities

```typescript
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';

describe('My Contract', function() {
  // Use the compound3 fixture
  async function deployFixture() {
    const [owner, user] = await ethers.getSigners();
    
    // Get a Compound v3 market instance
    const market = await hre.compound3.getMarket('USDC');
    
    // Deploy your contract
    const MyContract = await ethers.getContractFactory('MyContract');
    const myContract = await MyContract.deploy(market.address);
    
    return { market, myContract, owner, user };
  }

  it('should interact with Compound v3', async function() {
    const { market, myContract, user } = await loadFixture(deployFixture);
    
    // Use the helper to supply assets
    await hre.compound3.supply('USDC', ethers.parseUnits('1000', 6));
    
    // Test your contract
    await myContract.connect(user).doSomething();
    
    // Verify the results
    const accountInfo = await hre.compound3.getAccountInfo(user.address);
    expect(accountInfo.collateralValue).to.be.gt(0);
  });
});
```

### Gas Optimization

```typescript
// Get gas estimates for operations
const gasEstimate = await hre.compound3.estimateGas.supply('USDC', amount);

// Get optimal gas price
const gasPrice = await hre.compound3.getOptimalGasPrice();

// Execute gas-optimized transaction
await hre.compound3.executeWithOptimalGas(
  market.supply(amount)
);
```

## API Reference

### Market Operations

- `getMarketInfo(asset: string): Promise<MarketInfo>`
- `getAccountInfo(account: string): Promise<AccountInfo>`
- `supply(asset: string, amount: BigNumberish): Promise<ContractTransaction>`
- `withdraw(asset: string, amount: BigNumberish): Promise<ContractTransaction>`
- `borrow(asset: string, amount: BigNumberish): Promise<ContractTransaction>`
- `repay(asset: string, amount: BigNumberish): Promise<ContractTransaction>`
- `getMarketParameters(asset: string): Promise<MarketParameters>`
- `getHealthFactor(account: string): Promise<BigNumber>`
- `getSupplyRate(): Promise<BigNumber>`
- `getBorrowRate(): Promise<BigNumber>`

### Testing Utilities

- `getMarket(asset: string): Promise<Contract>`
- `deployMockToken(name: string, symbol: string): Promise<Contract>`
- `deployMockPriceFeed(price: BigNumberish): Promise<Contract>`
- `impersonateAccount(address: string): Promise<SignerWithAddress>`

### Gas Optimization

- `estimateGas: { [key: string]: Function }`
- `getOptimalGasPrice(): Promise<BigNumber>`
- `executeWithOptimalGas(tx: Promise<any>): Promise<ContractTransaction>`

## Types

```typescript
interface MarketInfo {
  address: string;
  baseToken: string;
  baseTokenPriceFeed: string;
  // ... other market info
}

interface AccountInfo {
  collateralValue: BigNumberish;
  borrowBalance: BigNumberish;
}

interface MarketParameters {
  borrowRate: BigNumberish;
  supplyRate: BigNumberish;
  collateralFactor: BigNumberish;
  liquidationThreshold: BigNumberish;
  reserveFactor: BigNumberish;
  totalSupply: BigNumberish;
  totalBorrow: BigNumberish;
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
