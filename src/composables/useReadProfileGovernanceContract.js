import { abi, contract } from "../contracts/";
import { usePublicClient } from "./usePublicClient.js";
const { client } = usePublicClient();

export const useReadProfileGovernanceContract = () => {
  async function readProfileGovernanceContract(functionName, args = []) {
    return await client.readContract({
      abi: abi.ProfileGovernance,
      address: contract.ProfileGovernance,
      functionName: functionName,
      args: args,
    });
  }

  return {
    readProfileGovernanceContract,
  };
};
