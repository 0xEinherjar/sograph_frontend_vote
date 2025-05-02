<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { Icon, Loading } from "./";
import { useWaitForTransactionReceipt, useWriteContract } from "@wagmi/vue";
import { abi, contract } from "../contracts/ProfileGovernance.js";
import { useErrorStore } from "../store/error.js";
const errorStore = useErrorStore();
const { writeContractAsync, data, error } = useWriteContract();
const props = defineProps(["profile", "classButton"]);
const show = ref(false);
const isLoading = ref(false);
const form = ref({
  profile: "",
  reason: "",
});

const isFormDisabled = computed(() => {
  return form.value.profile.length === 0 || form.value.reason.length === 0;
});

function togglePlaceholder(event) {
  form.value.reason = String(event.target.innerText).replace(/[\r|\n]/g, " ");
  const placeholder = event.target.parentNode.querySelector(
    ".c-form__textarea-placeholder"
  );
  placeholder.classList.toggle("is-hidden", event.target.innerText.length > 0);
}
async function create() {
  isLoading.value = true;
  await writeContractAsync({
    abi: abi,
    address: contract,
    functionName: "createAssessment",
    args: [form.value.profile, form.value.reason],
  });
}
const { isSuccess } = useWaitForTransactionReceipt({
  hash: data,
});
watch(error, (newError) => {
  if (newError) {
    errorStore.setError(newError);
    isLoading.value = false;
  }
});
watch(isSuccess, async (newIsSuccess) => {
  if (newIsSuccess) {
    form.value.profile = "";
    form.value.reason = "";
    show.value = false;
    isLoading.value = false;
  }
});
onMounted(() => {
  form.value.profile = props.profile || "";
});
</script>
<!-- prettier-ignore -->
<template>
  <Teleport to="body">
    <div v-if="show" class="create-proposal u-flex-line-center">
      <div class="create-proposal__header u-flex-line-between">
        <h3 class="create-proposal__title">Ban Proposal</h3>
        <button class="create-proposal__close" type="button" @click="show = false">
          <svg class="c-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.4">
              <path d="M9.16992 14.8299L14.8299 9.16992" stroke="#F4F4F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M14.8299 14.8299L9.16992 9.16992" stroke="#F4F4F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#F4F4F4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <form class="c-form" @submit.prevent="create">
        <div class="c-form__field">
          <label class="c-form__label" for="name">Profile Address</label>
          <input class="c-form__input--name" type="text" v-model="form.profile" name="address" id="address" placeholder="Profile Address"/>
        </div>
        <div class="c-form__field">
          <label class="c-form__label">Reason</label>
          <div class="c-form__textarea">
            <span class="c-form__textarea-placeholder" :class="{ 'is-hidden': form.reason.length > 0 }" >Brief reason for your profile...</span>
            <div class="c-form__textarea-input" @keyup="togglePlaceholder" id="description" contenteditable="true">
            </div>
          </div>
        </div>
        <div class="c-form__footer u-flex-line">
          <button class="c-form__submit u-flex-line" :disabled="isFormDisabled" type="submit">
            <loading v-if="isLoading" type="small" />
            <template v-else>Save</template>
          </button>
        </div>
      </form>
    </div>
  </Teleport>
  <button @click="show = true" :class="props.classButton" type="button">Create an assessment</button>
  <button class="c-form__open-mobile" @click="show = true" type="button">
    <icon iconClass="c-icon" name="add"/>
  </button>
</template>
<style>
.create-proposal {
  position: fixed;
  inset: 0 0 0 0;
  background-color: var(--bg-color-primary);
  z-index: 1000;
  flex-direction: column;
  gap: 48px;
  padding: 24px;
}
.create-proposal__header {
  width: min(480px, 100%);
}
.create-proposal__title {
  font-size: var(--step-4);
  font-weight: 500;
}
.c-form {
  width: min(480px, 100%);
  display: grid;
  gap: 24px;
}
.c-form__placeholder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background-color: var(--bg-color-tertiary);
}
.c-form__field {
  display: grid;
  gap: 12px;
}
.c-form__group > .c-form__field {
  flex-grow: 1;
}
.c-form__label {
  font-size: 12px;
  line-height: 12px;
  font-size: 12px;
  line-height: 12px;
  font-weight: 500;
  color: var(--text-color-secondary);
}
.c-form__footer {
  height: 80px;
  border-radius: 8px;
  background-color: var(--bg-color-secondary);
  padding-inline: 24px;
  margin-top: 22px;
}
.c-form__submit {
  height: 32px;
  border-radius: 8px;
  padding-inline: 16px;
  font-size: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-left: auto;
  background-color: var(--color-blue);
}
.c-form__submit:disabled {
  cursor: default;
  pointer-events: none;
  background-color: var(--bg-color-tertiary);
}
.c-form__input--name {
  height: 48px;
  background-color: var(--bg-color-secondary);
  color: var(--text-color-secondary);
  border-radius: 8px;
  font-size: var(--step-1);
  font-weight: 500;
  text-align: center;
}
.c-form__textarea {
  position: relative;
}
.c-form__textarea-placeholder {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  z-index: 2;
  min-height: 48px;
  line-height: 48px;
  color: rgba(232, 234, 237, 0.6);
}
.c-form__textarea-input {
  min-height: 48px;
  max-height: 120px;
  position: relative;
  overflow-y: auto;
  z-index: 3;
  outline: none;
  word-break: break-word;
  color: var(--text-color-primary);
  font-size: 16px;
  font-size: 16px;
  border-bottom: 1px solid var(--text-color-secondary);
  padding-block: 12px;
}
.c-form__textarea-input::-webkit-scrollbar-track {
  background: transparent;
}
.c-form__textarea-input::-webkit-scrollbar-thumb {
  background-color: var(--bg-color-secondary);
  border-radius: 10px;
}
.c-form__textarea-input::-webkit-scrollbar {
  width: 6px;
}
.c-form__open-mobile {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  display: none;
  place-items: center;
  background-color: #f4f4f4;
  position: fixed;
  bottom: 24px;
  right: 24px;
}
.c-form__open-mobile svg {
  color: #28292b !important;
}
@media (width < 600px) {
  .create-proposal {
    padding: 24px;
    display: grid !important;
    grid-template-rows: auto 1fr;
    justify-content: normal !important;
    align-items: flex-start !important;
  }
  .c-form__input--name {
    padding-inline: 16px;
    height: 40px;
  }
  .c-form__textarea-input {
    min-height: 40px;
    padding-block: 8px;
  }
  .c-form__textarea-placeholder {
    min-height: 40px;
    line-height: 40px;
  }
  .header__button {
    display: none !important;
  }
  .create-proposal .c-form {
    height: 100%;
    grid-template-rows: max-content 1fr max-content;
    align-items: flex-start;
  }
  .c-form__open-mobile {
    display: grid;
  }
}
</style>
