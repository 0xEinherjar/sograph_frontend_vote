<script setup>
import { watch } from "vue";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/";
import { Loading } from "./";
import { useErrorStore } from "../store/error.js";
const props = defineProps(["id"]);
const event = defineEmits(["executed"]);
const { writeContractAsync, data, error } = useWriteContract();
const errorStore = useErrorStore();

async function execute() {
  isLoading.value = true;
  await writeContractAsync({
    abi: abi.ProfileGovernance,
    address: contract.ProfileGovernance,
    functionName: "finalizeAssessment",
    args: [props.id],
  });
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    event("executed");
    isLoading.value = false;
  }
});
watch(error, (newError) => {
  if (newError) {
    errorStore.setError(newError);
    isLoading.value = false;
  }
});
</script>
<!-- prettier-ignore -->
<template>
<button @click="execute" class="assessment__card-button-execute">
  <template v-if="!isLoading">Execute</template>
  <loading v-else type="small" theme="dark"/>
</button>
</template>
