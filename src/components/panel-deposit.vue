<script setup>
import { ref, watch } from "vue";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { useUtils } from "../composables/utils.js";
import { abi, contract } from "../contracts/Token.js";
import { PanelDepositButton, Loading } from "./";
import { contract as contractVoting } from "../contracts/ProfileGovernance.js";
const props = defineProps([
  "balance",
  "isConnected",
  "hasFund",
  "decimals",
  "minParticipation",
]);
const { writeContractAsync, data } = useWriteContract();
const { toNumber } = useUtils();
const amountVote = ref(0);
const amount = ref(0);
const isLoading = ref(false);
function max() {
  if (!props.isConnected) return;
  amountVote.value = props.balance;
}

async function handleAction() {
  if (amountVote.value == 0) return;
  amount.value = amountVote.value * 10 ** props.decimals;
  if (amount.value < toNumber(props.minParticipation)) return;
  isLoading.value = true;
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "approve",
    args: [contractVoting, amount.value],
  });
}

const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});

watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) isLoading.value = false;
});
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-panel__body">
    <div class="c-panel__input">
      <div class="c-panel__input-header u-flex-line-between">
        <div @click="max" class="u-cursor-pointer">Balance: {{ props.balance }}</div>
      </div>
      <div class="c-panel__input-body u-flex-line-between">
        <input type="text" placeholder="0.00" v-model="amountVote">
        <span class="c-panel__input-currency u-flex-line">
          <img src="../assets/coin.png" alt="coin">
          <span>WBTC</span>
        </span>
      </div>
    </div>
    <div class="c-panel__reward-info">
      <div class="c-panel__reward-info-title">Reward</div>
      <div class="c-panel__reward-info-content u-flex-line">
        <img src="../assets/coin.png">
        <span>Wrapped Bitcoin</span>
      </div>
    </div>
    <div class="c-panel__info">There is a 7-day waiting period after your last vote before you can withdraw your deposit. You won’t be able to withdraw your funds until the waiting period has passed.</div>
    <template v-if="props.isConnected">
      <button v-if="props.hasFund" class="c-panel__button" type="button">Not enough balance</button>
      <template v-else>
        <button v-if="!isSuccess" @click="handleAction" class="c-panel__button" type="button">
            <template v-if="!isLoading">Approve</template>
            <loading v-else type="small" theme="dark"/>
         </button>
        <panel-deposit-button v-else @stake="$emit('stake', amount)" :amount="amount"/>
      </template>
    </template>
    <button v-else class="c-panel__button" type="button">Deposit</button>
  </div>
</template>
