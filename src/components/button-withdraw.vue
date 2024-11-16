<script setup>
import { ref, watch } from "vue";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/Voting.js";
import { useErrorStore } from "../store/error.js";
import { Loading } from "./";
const props = defineProps(["amount", "decimals"]);
const event = defineEmits(["withdraw"]);
const { writeContractAsync, data, error } = useWriteContract();
const isLoading = ref(false);
const errorStore = useErrorStore();

async function withdraw() {
  isLoading.value = true;
  const amount = props.amount * 10 ** props.decimals;
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "withdraw",
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
  <button @click="withdraw" class="c-panel__button c-panel__button-primary u-flex-line-center">
    <template v-if="!isLoading">Withdraw</template>
    <loading v-else type="small" theme="dark"/>
  </button>
</template>
