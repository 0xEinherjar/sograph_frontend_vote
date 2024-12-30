<script setup>
import { onMounted, ref, watch } from "vue";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { storeToRefs } from "pinia";
import { useUtils } from "../composables/utils.js";
import { useModeratorStore } from "../store/moderator.js";
import { abi, contract } from "../contracts/Token.js";
import { ButtonStake, Loading, ButtonWithdraw, ButtonReward } from "./";
import { contract as contractVoting } from "../contracts/ProfileGovernance.js";
import { usePanelInfo } from "../composables/usePanelInfo.js";
import { useReadProfileGovernanceContract } from "../composables/useReadProfileGovernanceContract.js";
const { readProfileGovernanceContract } = useReadProfileGovernanceContract();
const moderatorStore = useModeratorStore();
const { moderator } = storeToRefs(moderatorStore);
const { writeContractAsync, data } = useWriteContract();
const { toNumber, valueDisplay } = useUtils();
const { getPanelInfo } = usePanelInfo();
const select = ref("Stake");
const amountVote = ref();
const amount = ref(0);
const isLoading = ref(false);
const info = ref({
  decimals: 0,
  currency: "",
  minParticipation: 0,
  minParticipationFormated: 0,
});
function panelSelect(param) {
  select.value = param;
}
function max() {
  if (!moderator.value.isConnected) return;
  if (select.value == "Stake") amountVote.value = moderator.value.balance;
  else amountVote.value = moderator.value.participation;
}

function stakeEvent(amount) {
  moderatorStore.setData(
    Object.assign(moderator.value, {
      participation:
        moderator.value.participation + amount / 10 ** info.value.decimals,
      active: true,
    })
  );
}

async function handleAction() {
  if (amountVote.value == 0) return;
  amount.value = amountVote.value * 10 ** info.value.decimals;
  if (amount.value < toNumber(info.value.minParticipation)) return;
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

onMounted(async () => {
  const result = await getPanelInfo();
  if (!result) return;
  Object.assign(info.value, result);
  if (moderator.value.isConnected) {
    const result = await readProfileGovernanceContract(
      "getTotalEarnedRewards",
      [moderator.value.wallet]
    );
    moderatorStore.setReward(toNumber(result));
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-panel">
    <div class="c-panel__header u-flex-line">
      <div class="c-panel__text c-panel__text--fluid">Account balance</div>
      <div class="c-panel__text">
        <template v-if="moderator.isConnected">
          {{ moderator.participation }}
        </template>
        <template v-else>0</template>
        <span class="c-panel__text-secondary">{{ info.currency }}</span>
      </div>
    </div>
    <div class="c-panel__select">
      <div class="c-panel__select-placeholder u-flex-line-between">
        {{ select }}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.6101 9.92251L8.76755 6.13501H4.56006C3.84006 6.13501 3.48006 7.00501 3.99006 7.51501L7.87506 11.4C8.49756 12.0225 9.51006 12.0225 10.1326 11.4L11.6101 9.92251Z" fill="#BDC1C6"/>
          <path d="M13.4401 6.13501H8.76758L11.6101 9.92251L14.0176 7.51501C14.5201 7.00501 14.1601 6.13501 13.4401 6.13501Z" fill="#BDC1C6"/>
        </svg>
      </div>
      <div class="c-panel__select-options">
        <div class="c-panel__select-option" @click="panelSelect('Stake')">Stake</div>
        <div class="c-panel__select-option" @click="panelSelect('Withdraw')">Withdraw</div>
      </div>
    </div>
    <div class="c-panel__field u-flex-line">
      <input v-if="select=='Stake'" class="c-panel__field-input" type="text" v-model="amountVote" :placeholder="`Minimum of ${info.minParticipationFormated} ${info.currency}`">
      <input v-else class="c-panel__field-input" type="text" v-model="amountVote" placeholder="0">
      <button class="c-panel__field-button" type="button" @click="max">Max</button>
    </div> 
    <template v-if="moderator.isConnected">
      <button v-if="moderator.balance < info.minParticipationFormated" class="c-panel__button c-panel__button-primary u-flex-line-center" type="button">
        Not enough balance
      </button>
      <template v-else>
        <template v-if="select == 'Stake'">
          <button v-if="!isSuccess" @click="handleAction" class="c-panel__button c-panel__button-primary u-flex-line-center" type="button">
            <template v-if="!isLoading">Approve</template>
            <loading v-else type="small" theme="dark"/>
          </button>
          <button-stake v-else @stake="stakeEvent" :amount="amount"/>
        </template>
        <button-withdraw v-else :amount="amountVote" :decimals="info.decimals"/>
      </template>
    </template>
    <button v-else class="c-panel__button c-panel__button-primary" type="button">Connect</button>
    <span class="c-panel__line"></span>
    <button-reward/>
    <button v-if="moderator.isActive && moderator.isConnected" class="c-panel__button c-panel__button-active" type="button">Active</button>
    <button v-else class="c-panel__button c-panel__button-no-active" type="button">No active</button>
  </div>
</template>
<style>
.c-panel__select {
  cursor: pointer;
  position: relative;
}
.c-panel__select-options {
  position: absolute;
  top: 100%;
  width: 100%;
  right: 0;
  background-color: #4e4f51;
  border-radius: 12px;
  overflow: hidden;
  display: none;
}
.c-panel__select:hover .c-panel__select-options {
  display: block;
}
.c-panel__select-option {
  padding-inline: 16px;
  height: 48px;
  line-height: 48px;
}
.c-panel__select-option:hover {
  background-color: #bdc1c6;
  color: #28292b;
  font-weight: 500;
}
.c-panel__select-placeholder {
  height: 48px;
  border-radius: 12px;
  background-color: #4e4f51;
  gap: 16px;
  padding-inline: 16px;
  font-size: 1.5rem;
  font-weight: 500;
}
.c-panel__button {
  height: 48px;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: 600;
}
.c-panel__button-primary {
  background-color: #f4f4f4;
  color: #28292b;
}
.c-panel__line {
  height: 1px;
  background-color: #f4f4f4;
  opacity: 0.6;
}
.c-panel__button-no-active {
  background-color: rgba(255, 99, 112, 0.2);
  color: #f4f4f4;
  font-weight: 500;
}
.c-panel__button-active {
  background-color: rgba(1, 119, 251, 0.2);
  color: #f4f4f4;
  font-weight: 500;
}
.c-panel {
  background-color: #28292b;
  display: grid;
  gap: 40px;
  padding: 24px;
  width: 400px;
  border-radius: 12px;
}
.c-panel__header {
  gap: 16px;
}
.c-panel__icon {
  border-radius: 12px;
  height: 48px;
  width: 48px;
  background-color: #f4f4f4;
}
.c-panel__text {
  font-size: 1.5rem;
  color: #f4f4f4;
}
.c-panel__text-secondary {
  /* text-transform: uppercase; */
  color: #e8eaed;
  opacity: 0.6;
  margin-left: 4px;
}
.c-panel__text--fluid {
  flex-grow: 1;
}
.c-panel__field {
  height: 40px;
  border-bottom: 1px solid #f4f4f4;
}
.c-panel__field-input {
  flex-grow: 1;
  height: 100%;
}
</style>
