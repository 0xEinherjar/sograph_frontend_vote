import { createPublicClient, http } from "viem";
import { useChain } from "./useChain.js";

const { monadTestnet } = useChain();
export const usePublicClient = () => {
  const client = createPublicClient({
    chain: monadTestnet,
    transport: http(),
  });

  return { client };
};
