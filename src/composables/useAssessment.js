import { useUtils } from "./utils";
import { useReadProfileGovernanceContract } from "./useReadProfileGovernanceContract.js";
import { BaseError, ContractFunctionRevertedError } from "viem";
import { useProfile } from "./useProfile.js";
const { toNumber } = useUtils();
const { readProfileGovernanceContract } = useReadProfileGovernanceContract();
const { getProfile } = useProfile();
export const useAssessment = () => {
  async function getAssessment() {
    try {
      console.log("chegou");

      const assessments = await readProfileGovernanceContract(
        "getAllAssessments"
      );
      console.log("chegou 2");
      console.log(assessments);

      if (assessments.length == 0) return { data: [], success: true };
      const data = [];
      for (const assessment of assessments) {
        if (assessment.executed && toNumber(assessment.state) == 4) {
          data.push({
            id: toNumber(assessment.id),
            voteEnd: toNumber(assessment.voteEnd),
            voteStart: toNumber(assessment.voteStart),
            reason: assessment.reason,
            proposer: assessment.proposer,
            profile: assessment.profile,
            executed: assessment.executed,
            state: toNumber(assessment.state),
            profileAvatar: null,
            profileName: assessment.profile,
            profileHandle: null,
          });
        } else {
          const { data: user, success } = await getProfile(assessment.profile);
          if (!success) continue;
          data.push({
            id: toNumber(assessment.id),
            voteEnd: toNumber(assessment.voteEnd),
            voteStart: toNumber(assessment.voteStart),
            reason: assessment.reason,
            proposer: assessment.proposer,
            profile: assessment.profile,
            executed: assessment.executed,
            state: toNumber(assessment.state),
            profileAvatar: user.avatar,
            profileName: user.name,
            profileHandle: user.handle,
          });
        }
      }

      return { success: true, data: data.reverse() };
    } catch (error) {
      if (error instanceof BaseError) {
        const revertError = error.walk(
          (err) => err instanceof ContractFunctionRevertedError
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.args[0] ?? "";
          if (errorName) {
            return {
              success: false,
              message: "",
            };
          }
        }
      }
      return {
        success: false,
        message: "",
      };
    }
  }

  return { getAssessment };
};
