import { defineStore } from "pinia";
import { ref } from "vue";

export const useModeratorStore = defineStore("moderator", () => {
  const moderator = ref({
    isConnected: false,
    isActive: false,
    wallet: null,
    balance: null,
    totalToken: 0,
  });

  if (localStorage.getItem("moderator")) {
    moderator.value = JSON.parse(localStorage.getItem("moderator"));
  }
  function setConnected() {
    moderator.value.isConnected = true;
    localStorage.setItem("moderator", JSON.stringify(moderator.value));
  }
  function setWallet(wallet) {
    moderator.value.wallet = wallet;
    localStorage.setItem("moderator", JSON.stringify(moderator.value));
  }
  function setBalance(balance) {
    moderator.value.balance = balance;
    localStorage.setItem("moderator", JSON.stringify(moderator.value));
  }
  function setTotalToken(total) {
    moderator.value.totalToken = total;
    localStorage.setItem("moderator", JSON.stringify(moderator.value));
  }
  function setActive(isActive) {
    moderator.value.isActive = isActive;
    localStorage.setItem("moderator", JSON.stringify(moderator.value));
  }

  function resetModerator() {
    moderator.value.isConnected = false;
    moderator.value.isActive = false;
    moderator.value.wallet = null;
    moderator.value.balance = null;
    moderator.value.totalToken = null;
    localStorage.removeItem("moderator");
  }

  return {
    moderator,
    setConnected,
    setBalance,
    setTotalToken,
    setWallet,
    resetModerator,
    setActive,
  };
});
