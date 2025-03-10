import { createPublicClient, http } from "viem";
import { useChain } from "./useChain.js";
const { monadTestnet } = useChain();

export const usePublicClient = () => {
  const client = createPublicClient({
    chain: monadTestnet,
    transport: http(
      "https://special-special-telescope.monad-testnet.quiknode.pro/0c45fdba0a2cb850c282df0417a217f67ea8fbc6"
    ),
  });

  return { client };
};
