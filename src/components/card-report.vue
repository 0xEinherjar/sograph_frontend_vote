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
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background-color: var(--bg-color-secondary);
}
.c-report__header {
  gap: 24px;
}
.c-report__name {
  height: 19px;
  font-weight: 500;
  flex-grow: 1;
}
.c-report__view {
  height: 32px;
  border-radius: 8px;
  padding-inline: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: var(--bg-color-tertiary);
}
.c-report__create {
  background-color: #f4f4f4;
  border-radius: 12px;
  height: 54px;
  width: 100%;
  color: #28292b;
  font-size: 15px;
  font-weight: 500;
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
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  height: 40px;
  padding-inline: 16px;
  white-space: nowrap;
}
@media (width < 600px) {
  .c-report {
    gap: 24px;
  }
  .c-report__create {
    height: 40px;
    font-size: 14px;
    border-radius: 10px;
  }
  .c-report__tag {
    height: 32px;
    padding-inline: 12px;
  }
  .c-report__header {
    gap: 16px;
  }
}
</style>
