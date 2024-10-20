<script setup>
import { onMounted, ref } from "vue";
import { Heading, CardReport, CardReportPlaceholder } from "../components/";
import { useReport } from "../composables/useReport";
import { useProfile } from "../composables/useProfile";
const reported = ref([]);
const lengthPag = ref(20);
const cursorPag = ref(0);
const isLoading = ref(false);
const { getReport } = useReport();
const { getProfile } = useProfile();
async function fetchReport(cursorParams) {
  const { success, data, cursor } = await getReport(
    cursorParams,
    lengthPag.value
  );
  if (success) {
    for (const item of data) {
      const { success, data: user } = await getProfile(item.reported);
      if (success) reported.value.push(Object.assign({}, item, user));
    }
  }
}
onMounted(async () => {
  isLoading.value = true;
  await fetchReport(cursorPag.value);
  isLoading.value = false;
});
</script>
<!-- prettier-ignore -->
<template>
  <heading/>
  <section class="l-section">
    <h3 class="l-section__title">Reports</h3>
    <template v-if="isLoading">
      <div class="l-reports">
        <card-report-placeholder/>
        <card-report-placeholder/>
      </div>
    </template>
    <template v-else>
      <template v-if="reported.length > 0">
        <div class="l-reports">
          <template v-for="item of reported">
            <card-report :avatar="item.avatar" :address="item.reported" :name="item.name" :reasons="item.reasons" :link="item.handle || item.reported"/>
          </template>
        </div>
      </template>
      <div v-else class="u-text-center">No reports have been made yet.</div>
    </template>
  </section>
</template>
<style>
.l-reports {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, max-content));
  gap: 40px;
}
</style>
