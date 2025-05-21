import { abi, contract } from "../contracts/";
import { usePublicClient } from "./usePublicClient.js";
const { client } = usePublicClient();

export const useReadSographContract = () => {
  async function readSographContract(functionName, args = []) {
    return await client.readContract({
      abi: abi.Sograph,
      address: contract.Sograph,
      functionName: functionName,
      args: args,
    });
  }

  return { readSographContract };
};
