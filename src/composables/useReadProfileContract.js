import { abi, contract } from "../contracts/";
import { usePublicClient } from "./usePublicClient.js";
const { client } = usePublicClient();

export const useReadProfileContract = () => {
  async function readProfileContract(functionName, args = []) {
    return await client.readContract({
      abi: abi.ProfileNFT,
      address: contract.ProfileNFT,
      functionName: functionName,
      args: args,
    });
  }

  return { readProfileContract };
};
