<script setup>
import { storeToRefs } from "pinia";
import { useModeratorStore } from "../store/moderator.js";
import { useAccount, useDisconnect } from "@wagmi/vue";
import { Avatar, Logo, CreateProposal, ModalConnect } from "./";
const moderatorStore = useModeratorStore();
const { moderator } = storeToRefs(moderatorStore);

const { isConnected } = useAccount();
const { disconnect } = useDisconnect();
function logout() {
  disconnect();
  moderatorStore.resetModerator();
}
</script>
<!-- prettier-ignore -->
<template>
  <header class="header u-flex-line">
    <router-link to="/" class="header__logo">
      <logo/>
    </router-link>
    <nav class="header__nav u-flex-line">
      <router-link to="/" class="header__nav-item">Home</router-link>
      <router-link v-if="isConnected && moderator.isActive" to="/report" class="header__nav-item">Reports</router-link>
    </nav>
    <div class="header__right u-flex-line">
      <create-proposal classButton="header__button u-flex-line-center" v-if="isConnected && moderator.isActive"/>
      <div v-if="isConnected" class="header__dropdown u-flex-line">
        <button class="header__user u-flex-line" type="button">
          <avatar length="40px"/>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5999 7.45825L11.1666 12.8916C10.5249 13.5333 9.4749 13.5333 8.83324 12.8916L3.3999 7.45825" stroke="#F4F4F4" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="header__submenu header__submenu--vote">
          <ul class="header__submenu-list">
            <li class="header__submenu-item">
              <button @click="logout" type="button">Logout</button>
            </li>
          </ul>
        </div>
      </div>
      <modal-connect v-else/>
    </div>
  </header>
</template>
