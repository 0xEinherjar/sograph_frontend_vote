import { useUtils } from "./utils";
import { useReadVotingContract } from "./useReadVotingContract.js";
import { BaseError, ContractFunctionRevertedError } from "viem";
const { toNumber } = useUtils();
const { readVotingContract } = useReadVotingContract();

export const useReport = () => {
  async function getReport(cursor, size) {
    try {
      const [reported, newCursor] = await readVotingContract("getReports", [
        cursor,
        size,
      ]);
      if (reported.length == 0) return { success: true, data: [], cursor: 0 };
      const data = [];
      for (const item of reported) {
        data.push({
          id: toNumber(item.id),
          reported: item.reported,
          counter: toNumber(item.counter),
          executed: item.executed,
          isAssessment: item.isAssessment,
          reasons: {
            spam: toNumber(item.totalSpam),
            violenceSpeech: toNumber(item.totalViolenceSpeech),
            childAbuse: toNumber(item.totalChildAbuse),
            illegalDrugs: toNumber(item.totalIllegalDrugs),
            terrorism: toNumber(item.totalTerrorism),
            other: toNumber(item.totalOther),
          },
        });
      }
      return { success: true, data: data, cursor: toNumber(newCursor) };
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

  return { getReport };
};
