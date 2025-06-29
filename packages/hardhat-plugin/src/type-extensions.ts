import { Compound3Helper } from "./Compound3Helper";
import { ethers } from "ethers";

declare module "hardhat/types" {
  export interface HardhatConfig {
    compound3: {
      enableGasReport: boolean;
      markets: {
        [network: string]: string;
      };
    };
  }

  export interface HardhatUserConfig {
    compound3?: {
      enableGasReport?: boolean;
      markets?: {
        [network: string]: string;
      };
    };
  }
}

declare module "hardhat/types/runtime" {
  export interface HardhatRuntimeEnvironment {
    compound3: Compound3Helper;
    ethers: {
      provider: ethers.Provider;
    };
  }
} 