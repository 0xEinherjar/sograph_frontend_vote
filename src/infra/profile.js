import { ethers, Contract, isError } from "ethers";
import { useUtils } from "../composables/utils.js";
import { usePrepare } from "../composables/prepare.js";
import sographAbi from "../contracts/Sograph.json";
import profileAbi from "../contracts/ProfileNFT.json";

export default class Profile {
  static profileContract;
  static sographContract;
  static provider;
  static rpc = "https://data-seed-prebsc-1-s1.binance.org:8545/";

  async init(window) {
    Profile.provider =
      window.ethereum && window.ethereum.chainId === "0x61"
        ? new ethers.BrowserProvider(window.ethereum)
        : new ethers.JsonRpcProvider(Profile.rpc);

    Profile.sographContract = this._getContract(sographAbi);
    Profile.profileContract = this._getContract(profileAbi);
  }

  _getContract(abi) {
    return new Contract(abi.address, abi.abi, Profile.provider);
  }

  async getProfile(user) {
    const prepare = usePrepare();
    const { toNumber } = useUtils();
    try {
      const transaction = await Profile.sographContract.getUserByAddress(user);

      const transactionProfile = await Profile.profileContract.getProfileById(
        toNumber(transaction[0])
      );
      const data = await prepare.profile(transactionProfile);
      if (!data) return { success: false, message: "" };
      return {
        success: true,
        data: {
          ...data,
          id: toNumber(transaction[0]),
          role: toNumber(transaction[1]),
          owner: user,
        },
      };
    } catch (error) {
      if (isError(error, "CALL_EXCEPTION")) {
        const messages = {
          "profile banned": "BANNED",
          "user not found": "NOT_FOUND",
        };
        return {
          success: false,
          message: messages[error.reason] || "",
        };
      }
      return { success: false, message: "" };
    }
  }
}
