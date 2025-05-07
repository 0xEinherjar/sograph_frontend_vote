import { createPublicClient, http } from "viem";
import { useChain } from "./useChain.js";
const { monadTestnet } = useChain();

export const usePublicClient = () => {
  const client = createPublicClient({
    chain: {
      ...monadTestnet,
      contracts: {
        multicall3: {
          address: "0xcA11bde05977b3631167028862bE2a173976CA11",
        },
      },
    },
    transport: http(
      "https://special-special-telescope.monad-testnet.quiknode.pro/0c45fdba0a2cb850c282df0417a217f67ea8fbc6"
    ),
  });

  return { client };
};
