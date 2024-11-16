<script setup>
import { useAccountEffect } from "@wagmi/vue";
import { useModeratorStore } from "./store/moderator";
import { Toast } from "./components/";
import { storeToRefs } from "pinia";
import { useErrorStore } from "./store/error.js";
import { useParticipantInfo } from "./composables/useParticipantInfo.js";
const errorStore = useErrorStore();
const { error } = storeToRefs(errorStore);
const moderatorStore = useModeratorStore();
const { getParticipantInfo } = useParticipantInfo();
useAccountEffect({
  async onConnect(data) {
    const result = await getParticipantInfo(data.address);
    moderatorStore.setData(Object.assign(result, { wallet: data.address }));
  },
  onDisconnect() {
    moderatorStore.resetModerator();
  },
});
</script>
<!-- prettier-ignore -->
<template>
  <toast v-if="error"/>
  <router-view></router-view>
</template>
<style></style>
