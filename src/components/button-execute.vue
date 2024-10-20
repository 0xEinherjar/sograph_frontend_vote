<script setup>
import { watch } from "vue";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/Voting.js";
const props = defineProps(["id"]);
const event = defineEmits(["executed"]);
const { writeContractAsync, data } = useWriteContract();

async function execute() {
  try {
    await writeContractAsync({
      abi: abi,
      address: contract,
      functionName: "executeAssessment",
      args: [props.id],
    });
  } catch (error) {
    console.error("Error executing assessment:", error);
  }
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) event("executed");
});
</script>
<!-- prettier-ignore -->
<template>
<button @click="execute" class="assessment__card-button-execute">Execute</button>
</template>
