import { abi, contract } from "../contracts/";
import { usePublicClient } from "./usePublicClient.js";
const { client } = usePublicClient();

export const useReadUserReportManagerContract = () => {
  async function readUserReportManagerContract(functionName, args = []) {
    return await client.readContract({
      abi: abi.UserReportManager,
      address: contract.UserReportManager,
      functionName: functionName,
      args: args,
    });
  }

  return {
    readUserReportManagerContract,
  };
};
