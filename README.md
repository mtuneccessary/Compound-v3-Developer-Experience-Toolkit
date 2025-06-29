# Compound v3 Developer Experience Toolkit

A comprehensive toolkit for developers building on Compound v3. This monorepo contains everything you need to interact with Compound v3 markets efficiently and safely.

## 🛠 Components

### 1. SDK (`@compound-v3/sdk`)
A TypeScript SDK for interacting with Compound v3 markets. Features include:
- Market interaction (supply, withdraw, borrow, repay)
- Position management
- APR calculations
- Asset price queries
- Multi-chain support (Mainnet, Arbitrum, Base)

### 2. Hardhat Plugin (`@compound-v3/hardhat-plugin`)
A Hardhat plugin for Compound v3 development:
- Market interaction helpers
- Account information utilities
- Testing utilities
- Gas optimization tools

### 3. Smart Contracts (`@compound-v3/contracts`)
Production-ready smart contracts for common Compound v3 interactions:
- `BatchSupply`: Supply multiple assets in a single transaction
- `SafeRepay`: Safely repay debt while maintaining healthy collateral ratios

## 📦 Installation

```bash
# Install SDK
npm install @compound-v3/sdk

# Install Hardhat plugin
npm install --save-dev @compound-v3/hardhat-plugin

# Install Contracts
npm install @compound-v3/contracts
```

## 🚀 Quick Start

### Using the SDK

```typescript
import { CompoundV3 } from '@compound-v3/sdk';
import { ethers } from 'ethers';

// Initialize SDK
const provider = new ethers.JsonRpcProvider('YOUR_RPC_URL');
const sdk = new CompoundV3({ 
  provider,
  chainId: 1 // Mainnet
});

// Get account information
const accountInfo = await sdk.getAccountInfo('0x...');

// Get current APRs
const supplyAPR = await sdk.getSupplyAPR();
const borrowAPR = await sdk.getBorrowAPR();

// Supply assets
const signer = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);
await sdk.supply({
  asset: '0x...', // Asset address
  amount: ethers.parseEther('100')
}, signer);
```

### Using the Hardhat Plugin

```typescript
import '@compound-v3/hardhat-plugin';

// In your Hardhat tests
describe('My Contract', () => {
  it('should interact with Compound v3', async () => {
    const accountInfo = await hre.compound3.getAccountInfo('0x...');
    // ... more test code
  });
});
```

### Using the Smart Contracts

```solidity
// Import contracts
import '@compound-v3/contracts/BatchSupply.sol';
import '@compound-v3/contracts/SafeRepay.sol';

// Deploy contracts
const BatchSupply = await ethers.getContractFactory('BatchSupply');
const batchSupply = await BatchSupply.deploy(cometAddress);

// Use contracts
await batchSupply.batchSupply(
  [token1, token2],
  [amount1, amount2]
);
```

## 🔧 Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Run integration tests
pnpm test:integration
```

## 📚 Documentation

- [SDK Documentation](./packages/sdk/README.md)
- [Hardhat Plugin Documentation](./packages/hardhat-plugin/README.md)
- [Smart Contracts Documentation](./packages/contracts/README.md)

## 🧪 Testing

Each package includes:
- Unit tests
- Integration tests
- Gas benchmarks
- Coverage reports

Run all tests:
```bash
pnpm test
```

## 🔐 Security

- All smart contracts are thoroughly tested and audited
- Gas optimized implementations
- Follows best practices for DeFi integrations
- Regular security updates

## 📄 License

MIT License
