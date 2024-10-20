<script setup>
import { watch } from "vue";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/Voting.js";
const props = defineProps(["amount"]);
const event = defineEmits(["stake"]);
const { writeContractAsync, data } = useWriteContract();

async function stake() {
  try {
    await writeContractAsync({
      abi: abi,
      address: contract,
      functionName: "stake",
      args: [props.amount],
    });
  } catch (error) {
    console.error("Error executing assessment:", error);
  }
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) event("stake", props.amount);
});
</script>
<!-- prettier-ignore -->
<template>
<button @click="stake" class="c-panel__button c-panel__button-primary">Stake</button>
</template>
