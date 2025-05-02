import { useUtils } from "./utils.js";
import { useReadProfileGovernanceContract } from "./useReadProfileGovernanceContract.js";
import { useReadTokenContract } from "./useReadTokenContract.js";
const { readProfileGovernanceContract } = useReadProfileGovernanceContract();
const { readTokenContract } = useReadTokenContract();
const { toNumber } = useUtils();

export const useParticipantInfo = () => {
  async function getParticipantInfo(address) {
    const participant = await readProfileGovernanceContract("participants", [
      address,
    ]);
    const totalEarnedRewards = await readProfileGovernanceContract(
      "getTotalEarnedRewards",
      [address]
    );
    const balanceOf = await readTokenContract("balanceOf", [address]);
    const decimals = await readTokenContract("decimals");
    return {
      active: participant[0],
      participation: toNumber(participant[3]) / 10 ** decimals,
      balance: toNumber(balanceOf) / 10 ** decimals,
      rewards: toNumber(totalEarnedRewards),
    };
  }
  return { getParticipantInfo };
};
