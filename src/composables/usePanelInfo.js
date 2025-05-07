import {
  abi as tokenAbi,
  contract as tokenContract,
} from "../contracts/Token.js";
import {
  abi as votingAbi,
  contract as votingContract,
} from "../contracts/ProfileGovernance.js";
import { usePublicClient } from "./usePublicClient.js";
import { useUtils } from "./utils.js";
const { client } = usePublicClient();
const { toNumber } = useUtils();

export const usePanelInfo = () => {
  async function getPanelInfo() {
    const results = await client.multicall({
      contracts: [
        {
          abi: tokenAbi,
          address: tokenContract,
          functionName: "decimals",
        },
        {
          abi: votingAbi,
          address: votingContract,
          functionName: "minimumStakeAmount",
        },
        {
          abi: tokenAbi,
          address: tokenContract,
          functionName: "name",
        },
      ],
    });
    for (const result of results) {
      if (result.status == "failure") return null;
    }
    return {
      decimals: results[0].result,
      currency: results[2].result,
      minParticipation: toNumber(results[1].result),
      minParticipationFormated:
        toNumber(results[1].result) / 10 ** results[0].result,
    };
  }
  return { getPanelInfo };
};
