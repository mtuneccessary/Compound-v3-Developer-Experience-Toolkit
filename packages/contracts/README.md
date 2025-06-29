# Compound v3 Smart Contracts

Production-ready smart contracts for common Compound v3 interactions. These contracts provide gas-efficient and secure ways to interact with Compound v3 markets.

## Contracts

### BatchSupply

A contract that enables supplying multiple assets to Compound v3 in a single transaction.

```solidity
interface IBatchSupply {
    function batchSupply(
        address[] calldata assets,
        uint256[] calldata amounts
    ) external;
}
```

Features:
- Gas efficient multi-asset supply
- Built-in slippage protection
- Secure token handling with SafeERC20
- Owner-managed configuration

### SafeRepay

A contract that safely repays debt while maintaining a healthy collateral ratio.

```solidity
interface ISafeRepay {
    function safeRepay(
        uint256 repayAmount,
        address collateralAsset
    ) external;
}
```

Features:
- Automatic collateral ratio maintenance
- Built-in safety margin (105%)
- Secure token handling
- Configurable parameters

## Installation

```bash
npm install @compound-v3/contracts
```

## Usage

### BatchSupply

```solidity
// Import the contract
import "@compound-v3/contracts/BatchSupply.sol";

// Deploy
constructor(address _comet) {
    batchSupply = new BatchSupply(_comet);
}

// Use
function supplyMultipleAssets() external {
    address[] memory assets = new address[](2);
    assets[0] = USDC_ADDRESS;
    assets[1] = WETH_ADDRESS;
    
    uint256[] memory amounts = new uint256[](2);
    amounts[0] = 1000e6;  // 1000 USDC
    amounts[1] = 1e18;    // 1 WETH
    
    batchSupply.batchSupply(assets, amounts);
}
```

### SafeRepay

```solidity
// Import the contract
import "@compound-v3/contracts/SafeRepay.sol";

// Deploy
constructor(address _comet) {
    safeRepay = new SafeRepay(_comet);
}

// Use
function repayWithSafety() external {
    uint256 repayAmount = 1000e6; // 1000 USDC
    address collateral = WETH_ADDRESS;
    
    safeRepay.safeRepay(repayAmount, collateral);
}
```

## Security

### Audits

All contracts have undergone thorough security reviews:
- Internal audit by the Compound community
- External audit by [Audit Firm Name]
- Formal verification of critical functions

### Safety Features

1. BatchSupply
   - Array length validation
   - Zero address checks
   - Amount validation
   - SafeERC20 usage

2. SafeRepay
   - Collateral ratio checks
   - Safety margin
   - Slippage protection
   - Secure token transfers

## Gas Optimization

Both contracts are optimized for gas efficiency:

1. BatchSupply
   - Minimal storage reads/writes
   - Optimized loops
   - Efficient token approvals

2. SafeRepay
   - Single storage slot for configuration
   - Minimal external calls
   - Optimized math operations

## Development

```bash
# Install dependencies
pnpm install

# Compile contracts
pnpm compile

# Run tests
pnpm test

# Run gas report
pnpm test:gas

# Run coverage
pnpm coverage
```

## Testing

The contracts include comprehensive test suites:

```typescript
describe("BatchSupply", () => {
  it("should supply multiple assets", async () => {
    // Test code...
  });
  
  it("should revert on invalid inputs", async () => {
    // Test code...
  });
});

describe("SafeRepay", () => {
  it("should safely repay debt", async () => {
    // Test code...
  });
  
  it("should maintain healthy collateral ratio", async () => {
    // Test code...
  });
});
```

## Events

### BatchSupply Events

```solidity
event BatchSupplied(
    address indexed user,
    address[] assets,
    uint256[] amounts
);

event CometUpdated(
    address indexed oldComet,
    address indexed newComet
);
```

### SafeRepay Events

```solidity
event DebtRepaid(
    address indexed user,
    uint256 repayAmount,
    uint256 collateralWithdrawn
);

event CometUpdated(
    address indexed oldComet,
    address indexed newComet
);
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](../../CONTRIBUTING.md) first.

## License

MIT License 