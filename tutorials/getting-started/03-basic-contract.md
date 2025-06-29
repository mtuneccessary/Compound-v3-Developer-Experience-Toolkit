# Your First Stylus Smart Contract

This tutorial will guide you through creating a basic smart contract using Stylus. We'll create a simple token contract that demonstrates core Stylus concepts.

## Contract Overview

We'll create a basic token contract with the following features:
- Minting new tokens
- Transferring tokens between addresses
- Checking token balances
- Events for transfers and mints

## Prerequisites

Ensure you have completed:
1. [Hello World](01-hello-world.md)
2. [Environment Setup](02-environment-setup.md)

## Creating the Contract

Create a new file `src/lib.rs`:

```rust
use stylus_sdk::{
    prelude::*,
    storage::{StorageMap, StorageU256},
    evm::event,
};

// Define events
#[event]
struct Transfer {
    #[indexed]
    from: Address,
    #[indexed]
    to: Address,
    value: U256,
}

#[event]
struct Mint {
    #[indexed]
    to: Address,
    value: U256,
}

// Contract structure
#[contract]
pub struct BasicToken {
    /// Total supply of tokens
    total_supply: StorageU256,
    /// Mapping of addresses to balances
    balances: StorageMap<Address, U256>,
    /// Contract owner
    owner: StorageAddress,
}

// Contract implementation
#[external]
impl BasicToken {
    /// Constructor - called when contract is deployed
    pub fn constructor() -> Self {
        let mut contract = Self {
            total_supply: StorageU256::new(storage_key!("total_supply")),
            balances: StorageMap::new(storage_key!("balances")),
            owner: StorageAddress::new(storage_key!("owner")),
        };
        
        // Set deployer as owner
        contract.owner.set(msg::sender());
        
        contract
    }

    /// Mint new tokens (only owner)
    pub fn mint(&mut self, to: Address, amount: U256) -> Result<bool, Vec<u8>> {
        // Check if sender is owner
        if msg::sender() != self.owner.get() {
            return Err("Not owner".into());
        }

        // Update balances
        let new_balance = self.balances.get(&to).saturating_add(amount);
        self.balances.insert(to, new_balance);
        
        // Update total supply
        let new_supply = self.total_supply.get().saturating_add(amount);
        self.total_supply.set(new_supply);

        // Emit event
        event::emit(Mint { to, value: amount });
        
        Ok(true)
    }

    /// Transfer tokens to another address
    pub fn transfer(&mut self, to: Address, amount: U256) -> Result<bool, Vec<u8>> {
        let from = msg::sender();
        let from_balance = self.balances.get(&from);
        
        // Check sufficient balance
        if from_balance < amount {
            return Err("Insufficient balance".into());
        }

        // Update balances
        self.balances.insert(from, from_balance - amount);
        let to_balance = self.balances.get(&to).saturating_add(amount);
        self.balances.insert(to, to_balance);

        // Emit transfer event
        event::emit(Transfer {
            from,
            to,
            value: amount,
        });

        Ok(true)
    }

    /// Get balance of an address
    pub fn balance_of(&self, account: Address) -> U256 {
        self.balances.get(&account)
    }

    /// Get total supply
    pub fn total_supply(&self) -> U256 {
        self.total_supply.get()
    }
}

// Tests
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mint() {
        let mut contract = BasicToken::constructor();
        let owner = msg::sender();
        let user = Address::from([1u8; 20]);
        
        // Test minting
        assert!(contract.mint(user, 100.into()).is_ok());
        assert_eq!(contract.balance_of(user), 100.into());
        assert_eq!(contract.total_supply(), 100.into());
        
        // Test minting from non-owner
        msg::set_sender(user);
        assert!(contract.mint(user, 100.into()).is_err());
    }

    #[test]
    fn test_transfer() {
        let mut contract = BasicToken::constructor();
        let owner = msg::sender();
        let user1 = Address::from([1u8; 20]);
        let user2 = Address::from([2u8; 20]);
        
        // Mint tokens to user1
        assert!(contract.mint(user1, 100.into()).is_ok());
        
        // Test transfer
        msg::set_sender(user1);
        assert!(contract.transfer(user2, 50.into()).is_ok());
        assert_eq!(contract.balance_of(user1), 50.into());
        assert_eq!(contract.balance_of(user2), 50.into());
        
        // Test insufficient balance
        assert!(contract.transfer(user2, 100.into()).is_err());
    }
}
```

## Understanding the Code

### Contract Structure

The contract has several key components:

1. **Events**
   - `Transfer`: Emitted when tokens are transferred
   - `Mint`: Emitted when new tokens are created

2. **Storage Variables**
   - `total_supply`: Tracks total token supply
   - `balances`: Maps addresses to token balances
   - `owner`: Stores contract owner's address

3. **Functions**
   - `constructor`: Initializes the contract
   - `mint`: Creates new tokens (owner only)
   - `transfer`: Moves tokens between addresses
   - `balance_of`: Checks an address's balance
   - `total_supply`: Returns total supply

### Key Concepts

1. **Storage**
   - `StorageU256`: For storing numbers
   - `StorageMap`: For key-value mappings
   - `StorageAddress`: For storing addresses

2. **Events**
   - Use `#[event]` attribute
   - `#[indexed]` for searchable parameters
   - Emitted using `event::emit()`

3. **Access Control**
   - Owner-only functions
   - Balance checks
   - Error handling

## Building and Testing

1. Build the contract:
```bash
cargo stylus build
```

2. Run tests:
```bash
cargo test
```

## Deploying the Contract

1. Set up your environment:
```bash
export PRIVATE_KEY=your_private_key
```

2. Deploy:
```bash
cargo stylus deploy
```

## Interacting with the Contract

You can interact with your contract using the Stylus CLI or web3 libraries:

```bash
# Mint tokens
cargo stylus call mint 0x... 1000

# Check balance
cargo stylus call balance_of 0x...

# Transfer tokens
cargo stylus call transfer 0x... 500
```

## Common Patterns

1. **Safe Math**
   - Use `saturating_add` for overflow protection
   - Check balances before transfers

2. **Access Control**
   - Check sender identity
   - Use modifiers (owner-only functions)

3. **Events**
   - Emit events for important state changes
   - Index important parameters

## Exercises

1. Add an allowance system for delegated transfers
2. Implement token burning functionality
3. Add a function to change the owner
4. Add decimals and token name/symbol

## Next Steps

1. Learn about more advanced patterns in the [Patterns](../patterns/01-access-control.md) section
2. Explore contract upgradability
3. Learn about gas optimization

## Additional Resources

- [ERC-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20)
- [Rust Smart Contract Best Practices](https://docs.arbitrum.io/stylus/best-practices)
- [Stylus Security Considerations](https://docs.arbitrum.io/stylus/security)

# Basic Contract Structure

This guide explains the fundamental structure of a Stylus smart contract and its key components.

## Contract Anatomy

A basic Stylus contract consists of these main parts:

```rust
use stylus_sdk::{prelude::*, storage::StorageVec};

// Contract state
#[contract]
pub struct Counter {
    count: StorageVec<u64>,
}

// Contract implementation
#[external]
impl Counter {
    // Constructor
    pub fn new() -> Self {
        Self {
            count: StorageVec::new()
        }
    }

    // Public methods
    pub fn increment(&mut self) -> Result<(), msg::Error> {
        let current = self.count.get(0).unwrap_or(0);
        self.count.set(0, current + 1);
        Ok(())
    }

    pub fn get_count(&self) -> Result<u64, msg::Error> {
        Ok(self.count.get(0).unwrap_or(0))
    }
}

// Tests
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_counter() {
        let mut counter = Counter::new();
        assert_eq!(counter.get_count().unwrap(), 0);
        counter.increment().unwrap();
        assert_eq!(counter.get_count().unwrap(), 1);
    }
}
```

## Key Components

1. **State Variables**
   - Defined in the contract struct
   - Use `StorageVec`, `StorageMap`, etc. for persistent storage
   - Must implement proper serialization

2. **Constructor**
   - Named `new()`
   - Initializes contract state
   - Called only once when deploying

3. **Public Methods**
   - Marked with `#[external]`
   - Can modify state (`&mut self`) or read-only (`&self`)
   - Return `Result` type for error handling

4. **Events**
   ```rust
   #[event]
   pub struct CounterIncremented {
       pub new_value: u64,
   }
   ```

5. **Error Handling**
   ```rust
   #[derive(Debug)]
   pub enum CounterError {
       Overflow,
       InvalidValue,
   }
   ```

## Best Practices

1. **State Management**
   - Use appropriate storage types
   - Minimize storage operations
   - Consider gas costs

2. **Security**
   - Implement access control
   - Check for overflow/underflow
   - Validate inputs

3. **Testing**
   - Write unit tests
   - Test edge cases
   - Use test helpers

## Example: Complete Counter Contract

```rust
use stylus_sdk::{
    prelude::*,
    storage::StorageVec,
    msg,
};

#[event]
pub struct CounterIncremented {
    pub new_value: u64,
}

#[contract]
pub struct Counter {
    count: StorageVec<u64>,
    owner: StorageVec<Address>,
}

#[external]
impl Counter {
    pub fn new() -> Self {
        let mut counter = Self {
            count: StorageVec::new(),
            owner: StorageVec::new(),
        };
        counter.owner.push(msg::sender());
        counter.count.push(0);
        counter
    }

    pub fn increment(&mut self) -> Result<(), msg::Error> {
        let current = self.count.get(0).unwrap_or(0);
        let new_value = current.checked_add(1).ok_or("Overflow")?;
        self.count.set(0, new_value);
        
        // Emit event
        msg::emit(CounterIncremented { new_value });
        Ok(())
    }

    pub fn get_count(&self) -> Result<u64, msg::Error> {
        Ok(self.count.get(0).unwrap_or(0))
    }
}
``` 