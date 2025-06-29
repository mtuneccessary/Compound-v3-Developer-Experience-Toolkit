"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference types="jest" />
const ethers_1 = require("ethers");
const index_1 = require("../index");
// Mock ethers
jest.mock('ethers', () => {
    const mockGetAccountInfo = jest.fn().mockResolvedValue({
        collateralValue: BigInt(1000),
        borrowBalance: BigInt(500),
    });
    class MockProvider {
        async getNetwork() {
            return { chainId: 1 };
        }
    }
    class MockContract {
        getAccountInfo = mockGetAccountInfo;
    }
    const ethers = {
        Contract: jest.fn().mockImplementation(() => new MockContract()),
        JsonRpcProvider: jest.fn().mockImplementation(() => new MockProvider()),
    };
    return { ethers };
});
describe('getAccountInfo', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should fetch account information', async () => {
        const provider = new ethers_1.ethers.JsonRpcProvider();
        const account = '0x1234567890123456789012345678901234567890';
        const accountInfo = await (0, index_1.getAccountInfo)(provider, account);
        expect(accountInfo).toEqual({
            collateralValue: BigInt(1000),
            borrowBalance: BigInt(500),
        });
        expect(ethers_1.ethers.Contract).toHaveBeenCalledWith('0xc3d688B66703497DAA19211EEdff47f25384cdc3', expect.any(Array), provider);
    });
});
