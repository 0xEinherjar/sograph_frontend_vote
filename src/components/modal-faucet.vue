<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { Icon, Loading } from "./";
import { useModeratorStore } from "../store/moderator.js";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/";
const { writeContractAsync, data } = useWriteContract();
const { isSuccess } = useWaitForTransactionReceipt({ hash: data });
const props = defineProps(["className"]);
const moderatorStore = useModeratorStore();
const { moderator } = storeToRefs(moderatorStore);
const open = ref(false);
const isLoading = ref(false);

watch(isSuccess, async (success) => {
  if (success) {
    isLoading.value = false;
    open.value = false;
  }
});

async function claim() {
  isLoading.value = true;
  await writeContractAsync({
    abi: abi.Token,
    address: contract.Token,
    functionName: "mint",
    args: [1000],
  });
}
</script>
<!-- prettier-ignore -->
<template>
  <teleport to="body">
    <div v-if="open" class="c-modal--backdrop u-flex-line-center">
      <div class="c-modal">
        <div class=" c-modal__content">
          <div class="u-flex-line-between">
            <div class="c-modal__title u-flex-line">
              <icon iconClass="c-icon" name="wallet"/>
              <h3>Faucet</h3>
            </div>
            <icon @click="open = false" iconClass="c-icon u-pointer" name="close"/>
          </div>
          <p class="c-modal__paragraph">Claim your 1,000 test Wrapped Bitcoin (WBTC) tokens to your wallet.</p>
        </div>
        <div class="c-modal__footer">
          <button v-if="moderator.isConnected" class="c-button c-button--extra-large u-fluid u-flex-line-center" @click="claim" type="button">
            <loading v-if="isLoading" theme="dark" type="small"/>
            <template v-else>Claim</template>
          </button>
          <button v-else class="c-button c-button--extra-large u-fluid u-flex-line-center" type="button">
            Wallet not connected
          </button>
        </div>
      </div>
    </div> 
  </teleport>
  <div :class="props.className" @click="open = true">
    <slot></slot>
  </div>
</template>
<style>
@media (width < 600px) {
}
</style>
