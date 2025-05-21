import { abi, contract } from "../contracts/";
import { usePublicClient } from "./usePublicClient.js";
const { client } = usePublicClient();

export const useReadTokenContract = () => {
  async function readTokenContract(functionName, args = []) {
    return await client.readContract({
      abi: abi.Token,
      address: contract.Token,
      functionName: functionName,
      args: args,
    });
  }

  return {
    readTokenContract,
  };
};
