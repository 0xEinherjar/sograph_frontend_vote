<script setup>
import { ref } from "vue";
const props = defineProps([
  "amountToken",
  "balance",
  "valueMinParticipation",
  "isActive",
  "isConnected",
]);

const select = ref("Stake");
const amountVote = ref();

const participant = ref({
  isActive: false,
  balance: 0,
  amountToken: 0,
});
function panelSelect(param) {
  select.value = param;
}

function max() {
  if (!props.isConnected) return;
  if (select.value == "Stake") {
    amountVote.value = props.amountToken;
  } else {
    amountVote.value = props.balance;
  }
}
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-panel">
    <div class="c-panel__header u-flex-line">
      <div class="c-panel__text c-panel__text--fluid">Account balance</div>
      <div class="c-panel__text">
        <template v-if="props.isConnected">
          {{ props.balance }}
        </template>
        <template v-else>0</template>
        <span class="c-panel__text-secondary"> Graph</span>
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
      <input v-if="select=='Stake'" class="c-panel__field-input" type="text" v-model="amountVote" :placeholder="`Minimum of ${props.valueMinParticipation} Graph`">
      <input v-else class="c-panel__field-input" type="text" v-model="amountVote" placeholder="0">
      <button class="c-panel__field-button" type="button" @click="max">Max</button>
    </div>
    <button v-if="props.isConnected" @click="$emit('handleAction', { amountVote: amountVote, select: select })" class="c-panel__button c-panel__button-primary" type="button">Confirm</button>
    <button v-else class="c-panel__button c-panel__button-primary" type="button">Connect</button>
    <span class="c-panel__line"></span>
    <button class="c-panel__button c-panel__button-primary c-soon" type="button">Claim Rewards</button>
    <button v-if="props.isActive && props.isConnected" class="c-panel__button c-panel__button-active" type="button">Active</button>
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
.c-panel__button-primary.c-soon::before {
  top: 10px;
  right: 29%;
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
  text-transform: uppercase;
  color: #e8eaed;
  opacity: 0.6;
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
