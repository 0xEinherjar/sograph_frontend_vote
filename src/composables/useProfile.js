import { useUtils } from "./utils";
import { useReadSographContract } from "./useReadSographContract";
import { useReadProfileContract } from "./useReadProfileContract.js";
import { usePrepare } from "./prepare.js";
import { BaseError, ContractFunctionRevertedError } from "viem";
const { isAddress, toNumber } = useUtils();
const { readProfileContract } = useReadProfileContract();
const { readSographContract } = useReadSographContract();
const prepare = usePrepare();

export const useProfile = () => {
  async function getProfile(profile) {
    try {
      if (!isAddress(profile)) {
        const address = await readSographContract("ownerOfHandle", [profile]);
        if (address == "0x0000000000000000000000000000000000000000")
          return { success: false, message: "profile address not found" };
        profile = address;
      }
      const [profileId, role] = await readSographContract("getUserByAddress", [
        profile,
      ]);

      const profileInfo = await readProfileContract("getProfileById", [
        toNumber(profileId),
      ]);

      const data = await prepare.profile(profileInfo);
      if (!data) return { success: false, message: "" };
      data.id = toNumber(profileId);
      data.role = toNumber(role);
      data.owner = profile;
      return { success: true, data };
    } catch (error) {
      if (error instanceof BaseError) {
        const revertError = error.walk(
          (err) => err instanceof ContractFunctionRevertedError
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.args[0] ?? "";
          if (errorName == "profile banned") {
            return {
              success: false,
              message: "BANNED",
            };
          }
          if (errorName == "user not found") {
            return {
              success: false,
              message: "NOT_FOUND",
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

  return { getProfile };
};
