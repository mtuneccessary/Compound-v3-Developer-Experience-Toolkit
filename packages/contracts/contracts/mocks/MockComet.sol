// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockComet {
    mapping(address => bool) public managers;
    mapping(address => mapping(address => uint128)) public collateralBalances;
    mapping(address => uint256) public borrowBalances;
    mapping(address => uint256) public prices;

    function supply(address asset, uint amount) external {
        // Mock implementation
    }

    function withdraw(address asset, uint amount) external {
        // Mock implementation
    }

    function allow(address manager, bool isAllowed) external {
        managers[manager] = isAllowed;
    }

    function getSupplyRate(uint utilization) external pure returns (uint) {
        return utilization * 2; // Mock implementation
    }

    function getBorrowRate(uint utilization) external pure returns (uint) {
        return utilization * 3; // Mock implementation
    }

    function getUtilization() external pure returns (uint) {
        return 800000000000000000; // 80% utilization
    }

    function getPrice(address asset) external view returns (uint) {
        return prices[asset] > 0 ? prices[asset] : 1e18; // Default 1:1 price
    }

    function getCollateralBalance(address account, address asset) external view returns (uint128) {
        return collateralBalances[account][asset];
    }

    function getBorrowBalance(address account) external view returns (uint256) {
        return borrowBalances[account];
    }

    // Helper functions for testing
    function setCollateralBalance(address account, address asset, uint128 balance) external {
        collateralBalances[account][asset] = balance;
    }

    function setBorrowBalance(address account, uint256 balance) external {
        borrowBalances[account] = balance;
    }

    function setPrice(address asset, uint256 price) external {
        prices[asset] = price;
    }
} 