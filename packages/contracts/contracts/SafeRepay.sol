// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IComet {
    function supply(address asset, uint amount) external;
    function withdraw(address asset, uint amount) external;
    function allow(address manager, bool isAllowed) external;
    function getSupplyRate(uint utilization) external view returns (uint);
    function getBorrowRate(uint utilization) external view returns (uint);
    function getUtilization() external view returns (uint);
    function getPrice(address asset) external view returns (uint);
    function getCollateralBalance(address account, address asset) external view returns (uint128);
    function getBorrowBalance(address account) external view returns (uint256);
}

/**
 * @title SafeRepay
 * @notice A contract for safely repaying Compound v3 debt while maintaining a healthy collateral ratio
 */
contract SafeRepay is Ownable {
    using SafeERC20 for IERC20;

    event DebtRepaid(
        address indexed user,
        uint256 repayAmount,
        uint256 collateralWithdrawn
    );

    event CometUpdated(address indexed oldComet, address indexed newComet);

    IComet public comet;
    uint256 public constant SAFETY_MARGIN = 1.05e18; // 105% safety margin

    constructor(address _comet) Ownable(msg.sender) {
        require(_comet != address(0), "SafeRepay: comet cannot be zero address");
        comet = IComet(_comet);
    }

    /**
     * @notice Safely repay debt while maintaining a healthy collateral ratio
     * @param repayAmount Amount of debt to repay
     * @param collateralAsset Address of the collateral asset to withdraw
     */
    function safeRepay(
        uint256 repayAmount,
        address collateralAsset
    ) external {
        require(repayAmount > 0, "SafeRepay: repay amount must be greater than 0");
        require(
            collateralAsset != address(0),
            "SafeRepay: collateral asset cannot be zero address"
        );

        // Get current balances
        uint256 borrowBalance = comet.getBorrowBalance(msg.sender);
        uint128 collateralBalance = comet.getCollateralBalance(
            msg.sender,
            collateralAsset
        );

        require(
            borrowBalance >= repayAmount,
            "SafeRepay: repay amount exceeds borrow balance"
        );

        // Calculate collateral value and safe withdrawal amount
        uint256 collateralPrice = comet.getPrice(collateralAsset);
        uint256 collateralValue = (uint256(collateralBalance) * collateralPrice) /
            1e18;
        uint256 safeWithdrawalValue = (repayAmount * SAFETY_MARGIN) / 1e18;

        require(
            collateralValue >= safeWithdrawalValue,
            "SafeRepay: insufficient collateral for safe repayment"
        );

        // Calculate collateral amount to withdraw
        uint256 withdrawAmount = (safeWithdrawalValue * 1e18) / collateralPrice;

        // Execute repayment and withdrawal
        IERC20 token = IERC20(collateralAsset);
        token.safeTransferFrom(msg.sender, address(this), repayAmount);
        token.forceApprove(address(comet), repayAmount);
        comet.supply(collateralAsset, repayAmount);
        comet.withdraw(collateralAsset, withdrawAmount);

        emit DebtRepaid(msg.sender, repayAmount, withdrawAmount);
    }

    /**
     * @notice Update the Comet contract address
     * @param _comet New Comet contract address
     */
    function updateComet(address _comet) external onlyOwner {
        require(_comet != address(0), "SafeRepay: comet cannot be zero address");
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