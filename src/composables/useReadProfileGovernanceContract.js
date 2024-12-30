import { abi, contract } from "../contracts/ProfileGovernance.js";
import { usePublicClient } from "./usePublicClient.js";
const { client } = usePublicClient();

export const useReadProfileGovernanceContract = () => {
  async function readProfileGovernanceContract(functionName, args = []) {
    return await client.readContract({
      abi: abi,
      address: contract,
      functionName: functionName,
      args: args,
    });
  }

  return {
    readProfileGovernanceContract,
  };
};
