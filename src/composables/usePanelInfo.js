import { useReadProfileGovernanceContract } from "./useReadProfileGovernanceContract.js";
import { useReadTokenContract } from "./useReadTokenContract.js";
import { useUtils } from "./utils.js";
const { toNumber } = useUtils();
const { readProfileGovernanceContract } = useReadProfileGovernanceContract();
const { readTokenContract } = useReadTokenContract();

export const usePanelInfo = () => {
  async function getPanelInfo() {
    const decimals = await readTokenContract("decimals");
    const name = await readTokenContract("name");
    const minParticipation = await readProfileGovernanceContract(
      "minimumStakeAmount"
    );
    return {
      decimals: decimals,
      currency: name,
      minParticipation: toNumber(minParticipation),
      minParticipationFormated: toNumber(minParticipation) / 10 ** decimals,
    };
  }
  return { getPanelInfo };
};
