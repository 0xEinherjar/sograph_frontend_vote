<script setup>
import { onBeforeMount, ref } from "vue";
import { CardAssessment, Panel, Heading, Loading } from "../components/";
import { useAssessment } from "../composables/useAssessment.js";
const { getAssessment } = useAssessment();
const isLoading = ref(false);
const assessment = ref([]);

onBeforeMount(async () => {
  isLoading.value = true;
  const { data, success } = await getAssessment();
  if (success) assessment.value.push(...data);
  isLoading.value = false;
});
</script>
<!-- prettier-ignore -->
<template>
  <heading/>
  <section class="l-section">
    <h3 class="l-section__title">Ban Proposals</h3>
    <div class="assessment__content">
      <aside class="assessment__aside">
        <panel/>
      </aside>
      <div class="assessment__list">
        <template v-if="isLoading">
          <loading type="medium"/>
        </template>
        <template v-else>
          <template v-if="assessment.length > 0">
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
          </template>
          <div v-else class="u-text-center">No assessment has been created yet.</div>
        </template>
      </div>
    </div>
  </section>
</template>
<style>
.header__submenu--vote {
  top: 39px;
}
.assessment__header {
  margin-block: 22px 48px;
}
.assessment__header-title {
  font-size: 24px;
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
