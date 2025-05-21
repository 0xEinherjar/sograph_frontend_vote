import { abi, contract } from "../contracts/";
import { usePublicClient } from "./usePublicClient.js";
import { useUtils } from "./utils.js";
const { client } = usePublicClient();
const { toNumber } = useUtils();

export const usePanelInfo = () => {
  async function getPanelInfo() {
    const results = await client.multicall({
      contracts: [
        {
          abi: abi.Token,
          address: contract.Token,
          functionName: "decimals",
        },
        {
          abi: abi.ProfileGovernance,
          address: contract.ProfileGovernance,
          functionName: "minimumStakeAmount",
        },
        {
          abi: abi.Token,
          address: contract.Token,
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
