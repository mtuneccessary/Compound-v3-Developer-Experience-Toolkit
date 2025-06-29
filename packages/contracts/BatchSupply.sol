// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

library BatchSupply {
    function supply(address[] memory assets, uint256[] memory amounts) external {
        require(assets.length == amounts.length, "Mismatched arrays");
        for (uint256 i = 0; i < assets.length; i++) {
            // Logic to supply each asset
        }
    }
} 