# Basic Integration Example

This example demonstrates how to use the Compound v3 Developer Toolkit components together, including the SDK, smart contracts, and Hardhat plugin.

## Features

- SDK integration for market information and APR calculations
- BatchSupply contract deployment and usage
- Integration tests showing component interaction
- Testnet interaction script

## Prerequisites

- Node.js 16+
- pnpm
- An Ethereum RPC URL (Mainnet for forking, Goerli for testnet)
- A wallet private key with some ETH (for testnet deployment)

## Setup

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your values:
- `MAINNET_RPC_URL`: Ethereum mainnet RPC URL (for forking)
- `GOERLI_RPC_URL`: Goerli testnet RPC URL
- `PRIVATE_KEY`: Your wallet private key
- `ETHERSCAN_API_KEY`: (Optional) For contract verification

## Running Tests

The integration tests use Hardhat's mainnet forking feature to simulate interaction with live Compound v3 markets:

```bash
pnpm test
```

## Testnet Interaction

To interact with Compound v3 on Goerli testnet:

```bash
pnpm run interact
```

This will:
1. Connect to the Goerli testnet
2. Show market information
3. Deploy the BatchSupply contract
4. Display your current positions

## Contract Deployment

To deploy the BatchSupply contract:

```bash
pnpm run deploy
```

## Key Files

- `hardhat.config.ts`: Hardhat configuration with Compound plugin
- `test/integration.test.ts`: Integration tests
- `scripts/interact.ts`: Testnet interaction script
- `scripts/deploy.ts`: Contract deployment script

## Notes

- The example uses USDC market by default
- For actual token operations, you'll need testnet tokens
- Use Compound's faucet or a DEX to get testnet tokens
- Always verify contract addresses match the intended network 