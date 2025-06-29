import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@compound-v3/hardhat-plugin";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: process.env.MAINNET_RPC_URL || "https://eth-mainnet.alchemyapi.io/v2/demo",
        enabled: true,
      },
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL || "https://eth-goerli.alchemyapi.io/v2/demo",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  compound3: {
    markets: {
      USDC: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
      WETH: "0xA17581A9E3356d9A858b789D68B4d866e593aE94"
    }
  }
};

export default config; 