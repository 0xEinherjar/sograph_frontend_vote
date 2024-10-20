<script setup>
import { useAccountEffect } from "@wagmi/vue";
import { useModeratorStore } from "./store/moderator";
import { useReadVotingContract } from "./composables/useReadVotingContract.js";
import { useReadTokenContract } from "./composables/useReadTokenContract.js";
import { useUtils } from "./composables/utils.js";
const { readVotingContract } = useReadVotingContract();
const { readTokenContract } = useReadTokenContract();
const moderatorStore = useModeratorStore();
const { toNumber } = useUtils();

useAccountEffect({
  async onConnect(data) {
    const participant = await readVotingContract("participants", [
      data.address,
    ]);
    moderatorStore.setActive(participant[0]);
    moderatorStore.setBalance(toNumber(participant[1]));
    moderatorStore.setWallet(data.address);
    moderatorStore.setConnected();
    const totalToken = await readTokenContract("balanceOf", [data.address]);
    moderatorStore.setTotalToken(toNumber(totalToken));
  },
  onDisconnect() {
    moderatorStore.resetModerator();
  },
});
</script>
<!-- prettier-ignore -->
<template>
  <router-view></router-view>
</template>
<style></style>
