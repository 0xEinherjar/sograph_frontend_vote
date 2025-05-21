<script setup>
import { ref, watch } from "vue";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { Loading } from "./";
import { useUtils } from "../composables/utils";
import { abi, contract } from "../contracts/";
import { useErrorStore } from "../store/error.js";
const props = defineProps(["rewards", "isConnected"]);
const event = defineEmits(["rewardsClaimed"]);
const { writeContractAsync, data, error } = useWriteContract();
const { valueDisplay } = useUtils();
const isLoading = ref(false);
const errorStore = useErrorStore();

async function claim() {
  if (!props.isConnected || !props.rewards) return;
  isLoading.value = true;
  await writeContractAsync({
    abi: abi.ProfileGovernance,
    address: contract.ProfileGovernance,
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
    event("rewardsClaimed");
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-panel__body">
    <div class="c-panel__input">
      <div class="c-panel__input-body u-flex-line-between">
        <span>{{ valueDisplay(props.rewards) }}</span>
        <span class="c-panel__input-currency u-flex-line">
          <img src="../assets/coin.png" alt="coin">
          <span>WBTC</span>
        </span>
      </div>
    </div>
    <button @click="claim" type="button" class="c-panel__button">
      <template v-if="!isLoading">Claim</template>
      <loading v-else type="small" theme="dark"/>
    </button>
  </div>
</template>
