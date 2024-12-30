import { abi, contract } from "../contracts/UserReportManager.js";
import { usePublicClient } from "./usePublicClient.js";
const { client } = usePublicClient();

export const useReadUserReportManagerContract = () => {
  async function readUserReportManagerContract(functionName, args = []) {
    return await client.readContract({
      abi: abi,
      address: contract,
      functionName: functionName,
      args: args,
    });
  }

  return {
    readUserReportManagerContract,
  };
};
