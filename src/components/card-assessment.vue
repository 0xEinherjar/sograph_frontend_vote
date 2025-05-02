<script setup>
import { Avatar, ButtonExecute } from "./";
import { useUtils } from "../composables/utils.js";
import { computed, onMounted, ref, watch } from "vue";
import { useModeratorStore } from "../store/moderator.js";
import { storeToRefs } from "pinia";
import { useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/ProfileGovernance.js";
import { useErrorStore } from "../store/error.js";

const errorStore = useErrorStore();
const { writeContractAsync, error } = useWriteContract();
const { isAddress, truncateAddress, copyContent } = useUtils();
const moderatorStore = useModeratorStore();
const { moderator } = storeToRefs(moderatorStore);
const executedAssessment = ref(null);
const props = defineProps([
  "reason",
  "proposer",
  "profile",
  "executed",
  "state",
  "id",
  "voteEnd",
  "voteStart",
  "profileAvatar",
  "profileName",
  "profileHandle",
]);

function selectVote(event) {
  document
    .querySelectorAll(".assessment__card-vote-option")
    .forEach((target) => {
      target.classList.remove("is-active");
    });
  event.target.classList.add("is-active");
}

const formatDateCard = computed(() => {
  const voteStartDate = new Date(props.voteStart * 1000);
  const voteEndDate = new Date(props.voteEnd * 1000);
  const now = new Date();
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  if (voteStartDate > now) {
    return `Start at ${voteStartDate.toLocaleString("en-US", options)}`;
  } else if (voteEndDate > now) {
    return `End at ${voteEndDate.toLocaleString("en-US", options)}`;
  } else {
    return `Finish at ${voteEndDate.toLocaleString("en-US", options)}`;
  }
});

const votePeriod = computed(() => {
  const now = Date.now();
  if (props.voteStart * 1000 > now) {
    return 1; // Future
  } else if (props.voteEnd * 1000 > now) {
    return 2; // Ongoing
  } else {
    return 3; // Past
  }
});

async function vote() {
  const selectedOption = document.querySelector(
    ".assessment__card-vote-option.is-active"
  );
  if (!selectedOption) return;
  const voteMap = { For: 1, Against: 2, Abstain: 3 };
  const voteTarget = voteMap[selectedOption.innerText] || 0;
  if (voteTarget !== 0) {
    await writeContractAsync({
      abi: abi,
      address: contract,
      functionName: "castVote",
      args: [props.id, voteTarget],
    });
  }
}

async function executed() {
  executedAssessment.value = true;
}
watch(error, (newError) => {
  if (newError) {
    errorStore.setError(newError);
  }
});
onMounted(() => {
  executedAssessment.value = props.executed;
});
</script>
<!-- prettier-ignore -->
<template>
<div class="assessment__card">
  <header class="assessment__card-header u-flex-line">
    <avatar :avatar="props.profileAvatar" length="52px"/>
    <div v-if="isAddress(props.profileName)" class="assessment__card-name assessment__card-name--address u-flex-line">
      {{ truncateAddress(props.profileName) }}
      <button type="button" @click="copyContent(props.profileName)">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 12.9V17.1C16 20.6 14.6 22 11.1 22H6.9C3.4 22 2 20.6 2 17.1V12.9C2 9.4 3.4 8 6.9 8H11.1C14.6 8 16 9.4 16 12.9Z" fill="#F4F4F4"/>
          <path opacity="0.4" d="M17.1 2H12.9C9.45001 2 8.05001 3.37 8.01001 6.75H11.1C15.3 6.75 17.25 8.7 17.25 12.9V15.99C20.63 15.95 22 14.55 22 11.1V6.9C22 3.4 20.6 2 17.1 2Z" fill="#F4F4F4"/>
        </svg>
      </button>
    </div>
    <div v-else class="assessment__card-name">{{ props.profileName }}</div>
  </header>
  <div class="assessment__card-buttons u-flex-line">
    <a v-if="props.state != 4" target="_blank" :href="`https://sograph.app/#/${props.profileHandle || props.profile}`" class="assessment__card-button u-flex-line-center assessment__card-button--default" type="button">View</a>
    <button v-if="state == 2" class="assessment__card-button u-flex-line-center assessment__card-button--active" type="button">Active</button>
    <button v-if="state == 1" class="assessment__card-button u-flex-line-center assessment__card-button--pending" type="button">Pending</button>
    <button v-if="state == 5" class="assessment__card-button u-flex-line-center assessment__card-button--reestablished" type="button">Reestablished</button>
    <button v-if="state == 4" class="assessment__card-button u-flex-line-center assessment__card-button--banned" type="button">Banned</button>
  </div>
  <div class="assessment__card-content">
    <h5 class="">Reason</h5>
    <p class="assessment__card-paragraph">{{ props.reason }}</p>
  </div>
  <div class="assessment__card-info u-flex-line-between">
    <div class="assessment__card-info-group u-flex-line">
      <span class="assessment__card-info-dot" :class="`assessment__card-info-dot-${votePeriod}`"></span>
      {{ formatDateCard }}
    </div>
    <div class="assessment__card-info-group u-flex-line">
      <span class="assessment__card-info-text-secondary">Proposer:</span>
      <span>{{ truncateAddress(props.proposer) }}</span>
    </div>
  </div>
  <template v-if="moderator.isConnected">
    <div v-if="props.state == 1" class="assessment__card-footer u-flex-line-between">
      <div class="assessment__card-vote-group u-flex-line">
        <button @click="selectVote" class="assessment__card-vote-option" type="button">For</button>
        <button @click="selectVote" class="assessment__card-vote-option" type="button">Against</button>
        <button @click="selectVote" class="assessment__card-vote-option" type="button">Abstain</button>
      </div>
      <button @click="vote" class="assessment__card-vote-action" type="button">Vote</button>
    </div>
    <button-execute :id="props.id" @executed="executed" v-if="props.state != 2 && props.state != 1 && !executedAssessment"/>
  </template>
  <template v-else>
    <div v-if="props.state == 2" class="assessment__card-footer u-flex-line">
      <div class="assessment__card-vote-group u-flex-line-between">
        <button class="assessment__card-vote-option" type="button">For</button>
        <button class="assessment__card-vote-option" type="button">Against</button>
        <button class="assessment__card-vote-option" type="button">Abstain</button>
      </div>
      <button class="assessment__card-vote-action" type="button">Vote</button>
    </div>
    <button v-if="props.state != 2 && props.state != 1 && !executedAssessment" class="assessment__card-button-execute">Execute</button>
  </template>
</div>
</template>
<style>
.assessment__card-button-execute {
  height: 48px;
  border-radius: 12px;
  background-color: #f4f4f4;
  color: #28292b;
  width: 100%;
  font-size: 15px;
  font-weight: 500;
}
.assessment__card {
  padding: 48px;
  border-radius: 12px;
  border: 1px solid #f4f4f4;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background-color: #28292b;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 48px 24px;
}
.assessment__card-footer,
.assessment__card-content,
.assessment__card-button-execute,
.assessment__card-info {
  grid-column: 1 / -1;
}
.assessment__card-buttons,
.assessment__card-header {
  gap: 24px;
}
.assessment__card-name {
  font-size: 24px;
  font-weight: 500;
  flex-grow: 1;
}
.assessment__card-name--address {
  gap: 12px;
}
.assessment__card-button {
  height: 40px;
  padding-inline: 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}
.assessment__card-button--default {
  background-color: #f4f4f4;
  color: var(--bg-color-primary);
}
.assessment__card-button--active {
  background-color: var(--color-green);
  color: var(--text-color-primary);
}
.assessment__card-button--reestablished {
  background-color: var(--color-blue);
  color: var(--text-color-primary);
}
.assessment__card-button--pending {
  background-color: var(--color-yellow);
  color: var(--bg-color-primary);
}
.assessment__card-button--banned {
  background-color: var(--color-red);
  color: var(--text-color-primary);
}
.assessment__card-content {
  display: grid;
  gap: 10px;
}
.assessment__card-paragraph {
  color: var(--text-color-secondary);
}
.assessment__card-info {
  font-size: 14px;
  font-weight: 500;
}
.assessment__card-info-dot {
  height: 8px;
  width: 8px;
  border-radius: 50%;
}
.assessment__card-info-dot-1 {
  background-color: var(--color-yellow);
}
.assessment__card-info-dot-2 {
  background-color: var(--color-green);
}
.assessment__card-info-dot-3 {
  background-color: var(--color-red);
}
.assessment__card-info-group {
  gap: 8px;
}
.assessment__card-info-text-secondary {
  color: #bdc1c6;
}

.assessment__card-vote-group {
  gap: 16px;
}
.assessment__card-vote-option,
.assessment__card-vote-action {
  height: 48px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  padding-inline: 24px;
}
.assessment__card-vote-option {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background-color: #4e4f51;
}
.assessment__card-vote-option:hover {
  background-color: #bdc1c6;
  color: #28292b;
}
.assessment__card-vote-option.is-active,
.assessment__card-vote-action {
  background-color: #f4f4f4;
  color: #28292b;
}
@media (width < 600px) {
  .assessment__card {
    padding: 24px;
    gap: 24px;
    grid-template-columns: 1fr;
  }
  .assessment__card-buttons {
    flex-direction: column;
    grid-row: 4/5;
    gap: 16px;
  }
  .assessment__card-buttons .assessment__card-button {
    width: 100%;
    border-radius: 8px;
  }
  .assessment__card-button {
    border-radius: 8px;
  }
  .assessment__card-info {
    flex-direction: column-reverse;
    align-items: flex-start !important;
    gap: 10px;
  }
  .assessment__card .c-avatar {
    height: 40px !important;
    width: 40px !important;
  }
  .assessment__card-header {
    gap: 16px;
  }
  .assessment__card-name {
    font-size: 20px;
  }
  .assessment__list {
    gap: 40px !important;
  }
  .assessment__card-header-right {
    display: none !important;
  }
  .assessment__card-vote-option,
  .assessment__card-vote-action {
    height: 40px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    padding-inline: 16px;
    border: none;
    font-size: 12px;
  }
  .assessment__card-info-group:nth-child(1) {
    color: #bdc1c6;
  }
}
</style>
