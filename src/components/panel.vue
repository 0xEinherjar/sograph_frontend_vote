<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUtils } from "../composables/utils.js";
import { useModeratorStore } from "../store/moderator.js";
import { PanelDeposit, PanelWithdraw, PanelReward } from "./";
import { usePanelInfo } from "../composables/usePanelInfo.js";
import { useReadProfileGovernanceContract } from "../composables/useReadProfileGovernanceContract.js";
const { readProfileGovernanceContract } = useReadProfileGovernanceContract();
const moderatorStore = useModeratorStore();
const { moderator } = storeToRefs(moderatorStore);
const { toNumber } = useUtils();
const { getPanelInfo } = usePanelInfo();
const select = ref("Deposit");
const info = ref({
  decimals: 0,
  currency: "",
  minParticipation: 0,
  minParticipationFormated: 0,
});

function stakeEvent(amount) {
  moderatorStore.setData(
    Object.assign(moderator.value, {
      participation:
        moderator.value.participation + amount / 10 ** info.value.decimals,
      active: true,
    })
  );
}

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
    <div class="c-panel__nav u-flex-line">
      <button class="c-panel__nav-button" @click="select = 'Deposit'" :class="{ 'is-active': select == 'Deposit' }">Deposit</button>
      <button class="c-panel__nav-button" @click="select = 'Withdraw'" :class="{ 'is-active': select == 'Withdraw' }">Withdraw</button>
      <button class="c-panel__nav-button" @click="select = 'Reward'" :class="{ 'is-active': select == 'Reward' }">Reward</button>
    </div>
    <panel-deposit v-if="select == 'Deposit'" @stake="stakeEvent" :decimals="info.decimals" :minParticipation="info.minParticipation" :hasFund="moderator.balance < info.minParticipationFormated" :isConnected="moderator.isConnected" :balance="moderator.balance"/>
    <panel-withdraw v-else-if="select == 'Withdraw'" :decimals="info.decimals" :isConnected="moderator.isConnected" :participation="moderator.participation"/>
    <panel-reward v-else-if="select == 'Reward'" @rewardsClaimed="moderator.setReward(0)"/>
  </div>
</template>
<style>
.c-panel__nav {
  gap: 16px;
}
.c-panel__nav-button {
  height: 48px;
  border-radius: 12px;
  background-color: #4e4f51;
  font-size: var(--step--1);
  font-weight: 500;
  color: #f4f4f4;
  padding-inline: 16px;
  flex-grow: 1;
}
.c-panel__nav-button:hover {
  background-color: #bdc1c6;
  color: #28292b;
  font-weight: 500;
}
.c-panel__nav-button.is-active {
  background-color: #f4f4f4;
  color: #28292b;
  font-weight: 500;
}
.c-panel__input {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 16px;
  display: grid;
  gap: 16px;
}
.c-panel__input-header {
  color: var(--text-color-secondary);
}
.c-panel__input-currency {
  font-size: var(--step--2);
  font-weight: 500;
  gap: 6px;
  background-color: #4e4f51;
  border-radius: 8px;
  padding: 6px 8px;
}
.c-panel__input-currency img {
  height: 22px;
  width: 22px;
}
.c-panel__input-currency span {
  line-height: 17px;
}
.c-panel__button {
  height: 48px;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: 600;
}
.c-panel__button-primary {
  background-color: #f4f4f4;
  border-radius: 12px;
  font-weight: 500;
  color: #28292b;
  display: grid;
  place-items: center;
  width: 100%;
}
.c-panel__reward-info {
  display: grid;
  gap: 8px;
}
.c-panel__reward-info-title {
  font-size: 14px;
  font-weight: 500;
}
.c-panel__reward-info-content {
  gap: 8px;
  font-size: 14px;
  color: var(--text-color-secondary);
}
.c-panel__reward-info-content img {
  width: 20px;
  height: 20px;
}
.c-panel__reward-info-content span {
  line-height: 20px;
}
.c-panel__info {
  font-size: 12px;
  color: var(--text-color-secondary);
}
.c-panel {
  background-color: #28292b;
  display: grid;
  gap: 32px;
  padding: 24px;
  width: 480px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
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
