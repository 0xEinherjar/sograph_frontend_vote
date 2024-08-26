import { ethers, Contract } from "ethers";
import { storeToRefs } from "pinia";
import { useUtils } from "../composables/utils.js";
import { useModeratorStore } from "../store/moderator.js";
import voteAbi from "../contracts/Voting.json";
import Profile from "./profile.js";
const { toNumber } = useUtils();

export default class Vote {
  static address = voteAbi.address;
  static voteContract;
  static profileContract;
  static provider;
  static rpc = "https://data-seed-prebsc-1-s1.binance.org:8545/";

  async init(window) {
    Vote.provider =
      window.ethereum && window.ethereum.chainId === "0x61"
        ? new ethers.BrowserProvider(window.ethereum)
        : new ethers.JsonRpcProvider(Vote.rpc);

    Vote.voteContract = new Contract(
      voteAbi.address,
      voteAbi.abi,
      Vote.provider
    );
  }

  async executeContractMethod(method, ...args) {
    try {
      const signer = await Vote.provider.getSigner();
      const transaction = await Vote.voteContract
        .connect(signer)
        [method](...args);
      await transaction.wait();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.reason || "" };
    }
  }

  createAssessment({ user, reason }) {
    return this.executeContractMethod("createAssessment", user, reason);
  }

  stake({ amount }) {
    return this.executeContractMethod("stake", amount);
  }

  withdraw({ amount }) {
    return this.executeContractMethod("withdraw", amount);
  }

  executeAssessment({ id }) {
    return this.executeContractMethod("executeAssessment", id);
  }

  vote({ id, option }) {
    return this.executeContractMethod("vote", id, option);
  }

  async getAssessments() {
    try {
      const transaction = await Vote.voteContract.fetchAllAssessment();
      if (transaction[0].length == 0) return { data: [], success: true };
      const profile = new Profile();
      const data = [];
      for (const item of transaction) {
        if (item[6] && toNumber(item[7]) == 4) {
          data.push({
            id: toNumber(item[0]),
            voteEnd: toNumber(item[1]),
            voteStart: toNumber(item[2]),
            reason: item[3],
            proposer: item[4],
            profile: item[5],
            executed: item[6],
            state: toNumber(item[7]),
            profileAvatar: null,
            profileName: item[5],
            profileHandle: null,
          });
        } else {
          const { data: user, success } = await profile.getProfile(item[5]);
          if (!success) continue;
          data.push({
            id: toNumber(item[0]),
            voteEnd: toNumber(item[1]),
            voteStart: toNumber(item[2]),
            reason: item[3],
            proposer: item[4],
            profile: item[5],
            executed: item[6],
            state: toNumber(item[7]),
            profileAvatar: user.avatar,
            profileName: user.name,
            profileHandle: user.handle,
          });
        }
      }
      return { success: true, data: data.reverse() };
    } catch (error) {
      return { success: false, message: error.reason || "" };
    }
  }

  async getMinParticipation() {
    try {
      const transaction = await Vote.voteContract.minParticipation();
      return { success: true, data: toNumber(transaction) };
    } catch (error) {
      return { success: false, message: error.reason || "" };
    }
  }

  async getParticipant() {
    try {
      const { moderator } = storeToRefs(useModeratorStore());
      const transaction = await Vote.voteContract.participants(
        moderator.value.wallet
      );
      const data = {
        isActive: transaction[0],
        balance: toNumber(transaction[1]),
      };
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.reason || "" };
    }
  }
}
