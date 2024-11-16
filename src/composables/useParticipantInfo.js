import {
  abi as tokenAbi,
  contract as tokenContract,
} from "../contracts/Token.js";
import {
  abi as votingAbi,
  contract as votingContract,
} from "../contracts/Voting.js";
import { usePublicClient } from "./usePublicClient.js";
import { useUtils } from "./utils.js";
const { client } = usePublicClient();
const { toNumber } = useUtils();

export const useParticipantInfo = () => {
  async function getParticipantInfo(address) {
    const results = await client.multicall({
      contracts: [
        {
          abi: votingAbi,
          address: votingContract,
          functionName: "participants",
          args: [address],
        },
        {
          abi: tokenAbi,
          address: tokenContract,
          functionName: "balanceOf",
          args: [address],
        },
        {
          abi: tokenAbi,
          address: tokenContract,
          functionName: "decimals",
        },
      ],
    });
    for (const result of results) {
      if (result.status == "failure") return null;
    }

    return {
      active: results[0].result[0],
      participation: toNumber(results[0].result[1]) / 10 ** results[2].result,
      balance: toNumber(results[1].result) / 10 ** results[2].result,
    };
  }
  return { getParticipantInfo };
};
