import { http, createConfig } from "@wagmi/vue";
import { metaMask, coinbaseWallet } from "@wagmi/vue/connectors";
import { getWagmiConnectorV2 } from "@binance/w3w-wagmi-connector-v2";
import { bscTestnet } from "viem/chains";

const binanceWallet = getWagmiConnectorV2();

export const config = createConfig({
  chains: [bscTestnet],
  connectors: [metaMask(), binanceWallet(), coinbaseWallet()],
  transports: {
    [bscTestnet.id]: http(
      "https://special-special-telescope.bsc-testnet.quiknode.pro/0c45fdba0a2cb850c282df0417a217f67ea8fbc6"
    ),
  },
});
