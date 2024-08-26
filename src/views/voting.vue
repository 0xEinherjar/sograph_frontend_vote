<script setup>
import { onBeforeMount, ref } from "vue";
import { storeToRefs } from "pinia";
import Avatar from "../components/avatar.vue";
import CreateProposal from "../components/create-proposal.vue";
import CardAssessment from "../components/card-assessment.vue";
import Logo from "../components/logo.vue";
import Panel from "../components/panel.vue";
import { useModeratorStore } from "../store/moderator.js";
import { useMetamask } from "../composables/metamask.js";
import Vote from "../infra/vote.js";
import Token from "../infra/token.js";

const moderatorStore = useModeratorStore();
const { moderator } = storeToRefs(moderatorStore);
const { connect } = useMetamask();
const valueMinParticipation = ref(0);
const participant = ref({
  isActive: false,
  balance: 0,
  amountToken: 0,
});
const stats = ref({
  banned: 0,
  reestablished: 0,
  total: 0,
});
const assessment = ref([]);
async function handleConnect() {
  const address = await connect();
  if (!address) return;
  moderatorStore.setWallet(address);
  moderatorStore.setConnected();
  await getParticipant();
  await balanceOfParticipant();
}
async function handleAction({ amountVote, select }) {
  if (!amountVote) return;
  const vote = new Vote();
  const token = new Token();
  const { data: decimals } = await token.decimals();
  const amount = amountVote * 10 ** decimals;
  if (select == "Stake") {
    if (amountVote < valueMinParticipation.value) return;
    await token.approve({ address: Vote.address, amount: amount });
    const { success } = await vote.stake({ amount: amount });
    if (success) {
      await getParticipant();
      await balanceOfParticipant();
    }
  } else {
    const { success } = await vote.withdraw({ amount: amount });
    if (success) {
      await getParticipant();
      await balanceOfParticipant();
    }
  }
}
async function getParticipant() {
  const vote = new Vote();
  const { data, success } = await vote.getParticipant();
  const token = new Token();
  const tokenResult = await token.decimals();
  if (success) {
    participant.value.balance = data.balance / 10 ** tokenResult.data;
    participant.value.isActive = data.isActive;
  }
}
async function balanceOfParticipant() {
  const token = new Token();
  const tokenResult = await token.balanceOfParticipant();
  if (tokenResult.success) {
    participant.value.amountToken = tokenResult.data;
  }
}
async function minParticipation() {
  const vote = new Vote();
  const resultVote = await vote.getMinParticipation();
  const token = new Token();
  const resultToken = await token.decimals();
  valueMinParticipation.value = resultVote.data / 10 ** resultToken.data;
}
onBeforeMount(async () => {
  if (moderator.value.isConnected) {
    await getParticipant();
    await balanceOfParticipant();
  }
  await minParticipation();
  const vote = new Vote();
  const { success, data } = await vote.getAssessments();
  if (success) {
    assessment.value.push(...data);
    for (const item of data) {
      if (item.executed) {
        if (item.state == 4) stats.value.banned += 1;
        if (item.state == 5) stats.value.reestablished += 1;
      }
    }
    stats.value.total = data.length;
  }
});
</script>
<!-- prettier-ignore -->
<template>
  <div class="assessment">
    <header class="header u-flex-line">
      <router-link to="/">
        <logo/>
      </router-link>
      <div class="header__right u-flex-line">
        <button @click="handleConnect" v-if="!moderator.isConnected" type="button" class="header__button u-flex-line u-flex-line-center">Connect</button>
        <CreateProposal v-if="moderator.isConnected && participant.isActive"/>
        <div v-if="moderator.isConnected" class="header__dropdown u-flex-line">
          <button class="header__user u-flex-line" type="button">
            <avatar length="40px"/>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5999 7.45825L11.1666 12.8916C10.5249 13.5333 9.4749 13.5333 8.83324 12.8916L3.3999 7.45825" stroke="#F4F4F4" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="header__submenu header__submenu--vote">
            <ul class="header__submenu-list">
              <li class="header__submenu-item">
                <button @click="moderatorStore.resetModerator()" type="button">Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
    <div class="assessment__header u-flex-line-between">
      <div class="assessment__header-title">Ban Proposals</div>
    </div>
    <div class="assessment__content">
      <aside class="assessment__aside">
        <panel
          @handleAction="handleAction"
          :amountToken="participant.amountToken"
          :balance="participant.balance"
          :valueMinParticipation="valueMinParticipation"
          :isConnected="moderator.isConnected"
          :isActive="participant.isActive"
        />
      </aside>
      <div class="assessment__list">
        <template v-for="item of assessment">
          <card-assessment 
            :reason="item.reason" 
            :proposer="item.proposer"
            :profile="item.profile"
            :executed="item.executed"
            :state="item.state"
            :id="item.id"
            :voteEnd="item.voteEnd"
            :voteStart="item.voteStart"
            :profileAvatar="item.profileAvatar"
            :profileName="item.profileName"
            :profileHandle="item.profileHandle"
          /> 
        </template>
      </div>
    </div>
  </div>
</template>
<style>
.assessment {
  grid-column: sidebar-start / main-end;
  padding-inline: 4rem;
}
.header__submenu--vote {
  top: 39px;
}
.assessment__header {
  margin-block: 22px 48px;
}
.assessment__header-title {
  font-size: 2.4rem;
  font-weight: 500;
}
.assessment__content {
  display: flex;
  gap: 48px;
  margin-bottom: 40px;
  align-items: flex-start;
}
.assessment__aside {
  flex-shrink: 0;
  display: grid;
  gap: 48px;
}
.assessment__list {
  display: grid;
  gap: 48px;
  width: 100%;
}
</style>
