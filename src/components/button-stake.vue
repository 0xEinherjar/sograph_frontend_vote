<script setup>
import { ref, watch } from "vue";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/ProfileGovernance.js";
import { useErrorStore } from "../store/error.js";
import { Loading } from "./";
const props = defineProps(["amount"]);
const event = defineEmits(["stake"]);
const { writeContractAsync, data, error } = useWriteContract();
const isLoading = ref(false);
const errorStore = useErrorStore();

async function stake() {
  isLoading.value = true;
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "stake",
    args: [props.amount],
  });
}
const { isSuccess, isError } = useWaitForTransactionReceipt({
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
    event("stake", props.amount);
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <button @click="stake" class="c-panel__button c-panel__button-primary u-flex-line-center">
    <template v-if="!isLoading">Stake</template>
    <loading v-else type="small" theme="dark"/>
  </button>
</template>
