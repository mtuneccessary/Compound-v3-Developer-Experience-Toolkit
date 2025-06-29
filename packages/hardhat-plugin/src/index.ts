import { extendConfig, extendEnvironment } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { Compound3Helper } from "./Compound3Helper";
import "./type-extensions";

// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    // Get the default config for compound3
    const defaultConfig = {
      enableGasReport: false,
      markets: {
        mainnet: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
        goerli: "0x3EE77595A8459e93C2888b13aDB354017B198188",
      },
    };

    config.compound3 = {
      ...defaultConfig,
      ...(userConfig.compound3 || {}),
    };
  }
);

extendEnvironment((hre) => {
  // We add a field to the Hardhat Runtime Environment here.
  // We use lazyObject to avoid initializing things until they are actually needed.
  hre.compound3 = lazyObject(() => new Compound3Helper(hre));
}); 