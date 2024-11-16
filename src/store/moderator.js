import { defineStore } from "pinia";
import { ref } from "vue";

export const useModeratorStore = defineStore("moderator", () => {
  const moderator = ref({
    isConnected: false,
    isActive: false,
    wallet: null,
    balance: null,
    participation: 0,
    totalToken: 0,
  });

  if (localStorage.getItem("moderator")) {
    moderator.value = JSON.parse(localStorage.getItem("moderator"));
  }
  function setData(data) {
    moderator.value.isConnected = true;
    moderator.value.isActive = data.active;
    moderator.value.wallet = data.wallet;
    moderator.value.balance = data.balance;
    moderator.value.participation = data.participation;
    localStorage.setItem("moderator", JSON.stringify(moderator.value));
  }
  function resetModerator() {
    moderator.value.isConnected = false;
    moderator.value.isActive = false;
    moderator.value.wallet = null;
    moderator.value.participation = null;
    moderator.value.balance = null;
    moderator.value.totalToken = null;
    localStorage.removeItem("moderator");
  }

  return {
    moderator,
    setData,
    resetModerator,
  };
});
