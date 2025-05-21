import { abi, contract } from "../contracts/";
import { usePublicClient } from "./usePublicClient.js";
import { useUtils } from "./utils.js";
const { client } = usePublicClient();
const { toNumber } = useUtils();
export const useParticipantInfo = () => {
  async function getParticipantInfo(address) {
    const results = await client.multicall({
      contracts: [
        {
          abi: abi.ProfileGovernance,
          address: contract.ProfileGovernance,
          functionName: "participants",
          args: [address],
        },
        {
          abi: abi.Token,
          address: contract.Token,
          functionName: "balanceOf",
          args: [address],
        },
        {
          abi: abi.Token,
          address: contract.Token,
          functionName: "decimals",
        },
        {
          abi: abi.ProfileGovernance,
          address: contract.ProfileGovernance,
          functionName: "getTotalEarnedRewards",
          args: [address],
        },
      ],
    });
    for (const result of results) {
      if (result.status == "failure") return null;
    }

    return {
      active: results[0].result[0],
      participation: toNumber(results[0].result[3]) / 10 ** results[2].result,
      balance: toNumber(results[1].result) / 10 ** results[2].result,
      rewards: toNumber(results[3].result),
    };
  }
  return { getParticipantInfo };
};
