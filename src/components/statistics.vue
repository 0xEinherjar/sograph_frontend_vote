<script setup>
const props = defineProps(["total", "banned", "reestablished"]);
</script>
<!-- prettier-ignore -->
<template>
  <div class="statistics">
    <h3 class="statistics__title">Voting statistics</h3>
    <div class="statistics__list">
      <div class="statistics__item u-flex-line">
        Total proposals: <span>{{ props.total }}</span>
      </div>
      <div class="statistics__item u-flex-line">
        Total bans: <span>{{ props.banned }}</span>
      </div>
      <div class="statistics__item u-flex-line">
        Total reestablish: <span>{{ props.reestablished }}</span>
      </div>
    </div>
  </div>
</template>
<style>
.statistics {
  background-color: #28292b;
  display: grid;
  padding: 24px;
  width: 400px;
  border-radius: 12px;
  gap: 24px;
}
.statistics__title {
  font-size: 1.9rem;
  line-height: 1;
  padding-bottom: 16px;
  border-bottom: 1px solid #f4f4f466;
}
.statistics__list {
  display: grid;
  gap: 24px;
}
.statistics__item {
  font-size: 1.5rem;
  gap: 4px;
  line-height: 1;
}
.statistics__item span {
  color: #e8eaed;
  opacity: 0.6;
}
</style>
