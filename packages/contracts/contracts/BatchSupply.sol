// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IComet {
    function supply(address asset, uint amount) external;
    function allow(address manager, bool isAllowed) external;
}

/**
 * @title BatchSupply
 * @notice A contract for supplying multiple assets to Compound v3 in a single transaction
 */
contract BatchSupply is Ownable {
    using SafeERC20 for IERC20;

    event BatchSupplied(
        address indexed user,
        address[] assets,
        uint256[] amounts
    );

    event CometUpdated(address indexed oldComet, address indexed newComet);

    IComet public comet;

    constructor(address _comet) Ownable(msg.sender) {
        require(_comet != address(0), "BatchSupply: comet cannot be zero address");
        comet = IComet(_comet);
    }

    /**
     * @notice Supply multiple assets to Compound v3 in a single transaction
     * @param assets Array of asset addresses to supply
     * @param amounts Array of amounts to supply for each asset
     */
    function batchSupply(
        address[] calldata assets,
        uint256[] calldata amounts
    ) external {
        require(
            assets.length == amounts.length,
            "BatchSupply: arrays length mismatch"
        );
        require(assets.length > 0, "BatchSupply: empty arrays");

        for (uint256 i = 0; i < assets.length; i++) {
            require(
                assets[i] != address(0),
                "BatchSupply: asset cannot be zero address"
            );
            require(amounts[i] > 0, "BatchSupply: amount must be greater than 0");

            IERC20 token = IERC20(assets[i]);
            token.safeTransferFrom(msg.sender, address(this), amounts[i]);
            token.forceApprove(address(comet), amounts[i]);
            comet.supply(assets[i], amounts[i]);
        }

        emit BatchSupplied(msg.sender, assets, amounts);
    }

    /**
     * @notice Update the Comet contract address
     * @param _comet New Comet contract address
     */
    function updateComet(address _comet) external onlyOwner {
        require(_comet != address(0), "BatchSupply: comet cannot be zero address");
        address oldComet = address(comet);
        comet = IComet(_comet);
        emit CometUpdated(oldComet, _comet);
    }

    /**
     * @notice Approve or revoke Comet's allowance to manage this contract's assets
     * @param manager Address to approve or revoke
     * @param isAllowed True to approve, false to revoke
     */
    function setManager(address manager, bool isAllowed) external onlyOwner {
        comet.allow(manager, isAllowed);
    }
} 