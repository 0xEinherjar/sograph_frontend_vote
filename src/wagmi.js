import { http, createConfig } from "@wagmi/vue";
import { metaMask, coinbaseWallet } from "@wagmi/vue/connectors";
import { getWagmiConnectorV2 } from "@binance/w3w-wagmi-connector-v2";
import { defineChain } from "viem";

const binanceWallet = getWagmiConnectorV2();

const monadTestnet = defineChain({
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Monad",
    symbol: "MON",
  },
  rpcUrls: {
    default: {
      http: [
        "https://special-special-telescope.base-sepolia.quiknode.pro/0c45fdba0a2cb850c282df0417a217f67ea8fbc6",
      ],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://testnet.monadexplorer.com/" },
  },
});

export const config = createConfig({
  chains: [monadTestnet],
  connectors: [metaMask(), binanceWallet(), coinbaseWallet()],
  transports: {
    [monadTestnet.id]: http(
      "https://special-special-telescope.base-sepolia.quiknode.pro/0c45fdba0a2cb850c282df0417a217f67ea8fbc6"
    ),
  },
});
