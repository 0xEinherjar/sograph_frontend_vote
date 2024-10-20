<script setup>
import { Avatar, CreateProposal } from "./";
const props = defineProps(["avatar", "name", "reasons", "link", "address"]);
</script>
<!-- prettier-ignore -->
<template>
  <div class="c-report">
    <div class="c-report__header u-flex-line">
      <avatar :avatar="props.avatar" length="40px"/>
      <div class="c-report__name">{{ props.name }}</div>
      <a :href="`https://sograph.app/#/${props.link}`" class="c-report__view u-flex-line-center" target="_blank">View</a>
    </div>
    <create-proposal classButton="c-report__create" :profile="props.address"/>
    <div class="c-report__tags">
      <span v-if="reasons.spam" class="c-report__tag u-flex-line-center">Spam ({{ reasons.spam }})</span>
      <span v-if="reasons.violenceSpeech" class="c-report__tag u-flex-line-center">Violence Speech ({{ reasons.violenceSpeech }})</span>
      <span v-if="reasons.childAbuse" class="c-report__tag u-flex-line-center">Child Abuse ({{ reasons.childAbuse }})</span>
      <span v-if="reasons.illegalDrugs" class="c-report__tag u-flex-line-center">Illegal Drugs ({{ reasons.illegalDrugs }})</span>
      <span v-if="reasons.terrorism" class="c-report__tag u-flex-line-center">Terrorism ({{ reasons.terrorism }})</span>
      <span v-if="reasons.other" class="c-report__tag u-flex-line-center">Other ({{ reasons.other }})</span>
    </div>
  </div>
</template>
<style>
.c-report {
  display: grid;
  gap: 32px;
  padding: 24px;
  width: 100%;
  border: 1px solid #f4f4f4;
  border-radius: 12px;
}
.c-report__header {
  gap: 24px;
}
.c-report__name {
  height: 1.9rem;
  font-weight: 500;
  flex-grow: 1;
}
.c-report__view {
  height: 32px;
  border-radius: 8px;
  padding-inline: 12px;
  font-size: 1.2rem;
  font-weight: 500;
  background-color: var(--bg-color-tertiary);
}
.c-report__create {
  background-color: #f4f4f4;
  border-radius: 8px;
  height: 40px;
  width: 100%;
  color: #1a1b1d;
  font-size: 1.2rem;
  font-weight: 600;
}
.c-report__tags {
  display: flex;
  gap: 16px;
  overflow-x: auto;
}
.c-report__tags::-webkit-scrollbar {
  display: none;
}
.c-report__tag {
  font-size: 1.2rem;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid #f4f4f4;
  height: 32px;
  padding-inline: 16px;
  white-space: nowrap;
}
</style>
