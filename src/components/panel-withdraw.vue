<script setup>
import { ref, watch } from "vue";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/ProfileGovernance.js";
import { useErrorStore } from "../store/error.js";
import { Loading } from "./";
const errorStore = useErrorStore();
const props = defineProps(["participation", "isConnected", "decimals"]);
const event = defineEmits(["withdraw"]);
const { writeContractAsync, data, error } = useWriteContract();
const amountVote = ref(0);
const isLoading = ref(false);

function max() {
  if (!props.isConnected) return;
  amountVote.value = props.participation;
}

async function unstake() {
  isLoading.value = true;
  const amount = amountVote.value * 10 ** props.decimals;
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "unstake",
    args: [amount],
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
    event("withdraw", props.amount);
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-panel__body">
    <div class="c-panel__input">
      <div class="c-panel__input-header u-flex-line-between">
        <div @click="max" class="u-cursor-pointer">Balance: {{ props.participation }}</div>
      </div>
      <div class="c-panel__input-body u-flex-line-between">
        <input v-model="amountVote" type="text" placeholder="0.00">
        <span class="c-panel__input-currency u-flex-line">
          <img src="../assets/coin.png" alt="coin">
          <span>WBTC</span>
        </span>
      </div>
    </div>
    <div class="c-panel__info">There is a 7-day waiting period after your last vote before you can withdraw your deposit. You won’t be able to withdraw your funds until the waiting period has passed.</div>
    <button @click="unstake" type="button" class="c-panel__button">
      <template v-if="!isLoading">Withdraw</template>
      <loading v-else type="small" theme="dark"/>
    </button>
  </div>
</template>
