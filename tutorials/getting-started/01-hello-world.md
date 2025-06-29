# Hello World in Stylus

Welcome to Stylus, a powerful smart contract platform that brings Rust's safety and performance to blockchain development. This tutorial will guide you through creating your first Stylus smart contract.

## Prerequisites

Before starting, ensure you have:
- Rust installed (1.75.0 or later)
- Cargo installed
- Basic knowledge of Rust programming
- Basic understanding of blockchain concepts

## Your First Contract

Here's a simple Hello World contract in Stylus:

```rust
use stylus_sdk::{prelude::*, msg};

#[contract]
pub struct HelloWorld;

#[external]
impl HelloWorld {
    pub fn greet(&self) -> Result<String, msg::Error> {
        Ok("Hello, Stylus World!".to_string())
    }
}
```

Let's break down what's happening:

1. We import necessary items from the Stylus SDK
2. The `#[contract]` attribute marks our struct as a smart contract
3. The `#[external]` attribute makes the implementation accessible from outside
4. Our contract has one function `greet` that returns a simple greeting

## Building the Contract

1. Create a new project:
```bash
cargo new hello-world
cd hello-world
```

2. Add dependencies to `Cargo.toml`:
```toml
[package]
name = "hello-world"
version = "0.1.0"
edition = "2021"

[dependencies]
stylus-sdk = "0.4.0"
```

## Building and Testing

To build your contract:

```bash
cargo build --target wasm32-unknown-unknown
```

To test your contract:

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greeting() {
        let contract = HelloWorld;
        assert_eq!(
            contract.greet().unwrap(),
            "Hello, Stylus World!".to_string()
        );
    }
}
```

## Next Steps

Now that you've created your first contract, you're ready to:
1. Set up your development environment
2. Learn about contract structure
3. Explore more complex contract interactions

Continue to the next section to learn how to set up your development environment properly.

## Exercises

1. Modify the greeting to include a custom message
2. Add a function parameter to personalize the greeting
3. Implement a counter that tracks how many times the contract has been greeted

## Additional Resources

- [Stylus Documentation](https://docs.arbitrum.io/stylus)
- [Rust Book](https://doc.rust-lang.org/book/)
- [Stylus GitHub Repository](https://github.com/arbitrum/stylus) 