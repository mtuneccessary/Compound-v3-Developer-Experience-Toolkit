# Setting Up Your Development Environment

This guide will walk you through setting up your development environment for Stylus smart contract development.

## System Requirements

- Operating System: Linux, macOS, or Windows (with WSL2)
- Memory: 8GB RAM minimum (16GB recommended)
- Storage: 1GB free space for tools and dependencies
- Internet connection for downloading packages

## Installing Required Tools

### 1. Install Rust and Cargo

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Add Rust to your current shell:
```bash
source $HOME/.cargo/env
```

Verify the installation:
```bash
rustc --version
cargo --version
```

### 2. Install WebAssembly Target

```bash
rustup target add wasm32-unknown-unknown
```

### 3. Install Stylus CLI

```bash
cargo install stylus-cli
```

### 4. Configure Your IDE

We recommend using VS Code with the following extensions:
- rust-analyzer
- CodeLLDB
- Even Better TOML
- WebAssembly

### 5. Set Up Your First Project

Create a new Stylus project:
```bash
stylus new my-project
cd my-project
```

## Verifying Your Setup

Run the following commands to verify everything is working:

```bash
# Build the project
cargo build

# Run tests
cargo test

# Build for WebAssembly
cargo build --target wasm32-unknown-unknown
```

## Next Steps

Now that your environment is set up, you can:
1. Create your first contract (see Hello World tutorial)
2. Learn about contract structure
3. Explore Stylus patterns and best practices 