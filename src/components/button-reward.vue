<script setup>
import { ref, watch } from "vue";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/ProfileGovernance.js";
import { useErrorStore } from "../store/error.js";
import { Loading } from "./";
import { useModeratorStore } from "../store/moderator.js";
import { storeToRefs } from "pinia";
import { useUtils } from "../composables/utils.js";
const { valueDisplay } = useUtils();
const moderatorStore = useModeratorStore();
const { moderator } = storeToRefs(moderatorStore);
const { writeContractAsync, data, error } = useWriteContract();
const isLoading = ref(false);
const errorStore = useErrorStore();

async function claim() {
  if (!moderator.value.isConnected || !moderator.value.rewards) return;
  isLoading.value = true;
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "claim",
  });
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(error, (newError) => {
  if (newError) {
    errorStore.setError(newError);
    isLoading.value = false;
  }
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    isLoading.value = false;
    moderatorStore.setReward(0);
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <button @click="claim" class="c-panel__button c-panel__button-primary" type="button">
    <template v-if="!isLoading">Claim Rewards <template v-if="moderator.rewards > 0">({{ valueDisplay(moderator.rewards) }} WBTC)</template></template>
    <loading v-else type="small" theme="dark"/>
  </button>
</template>
