<template>
  <div class="c-card-report-placeholder">
    <div class="u-flex-line">
      <div class="c-card-report-placeholder__avatar"></div>
      <div class="c-card-report-placeholder__name"></div>
      <div class="c-card-report-placeholder__view"></div>
    </div>
    <div class="c-card-report-placeholder__button"></div>
    <div class="c-card-report-placeholder__tags u-flex-line">
      <div class="c-card-report-placeholder__tag"></div>
      <div class="c-card-report-placeholder__tag"></div>
    </div>
  </div>
</template>
<style>
.c-card-report-placeholder {
  width: min(500px, 100%);
  display: grid;
  gap: 32px;
  padding: 24px;
  width: 100%;
  border: 1px solid var(--bg-color-secondary);
  border-radius: 12px;
}
.c-card-report-placeholder__avatar,
.c-card-report-placeholder__name,
.c-card-report-placeholder__view,
.c-card-report-placeholder__button,
.c-card-report-placeholder__tag {
  background-color: var(--bg-color-secondary);
  position: relative;
  overflow: hidden;
}
.c-card-report-placeholder__avatar::before,
.c-card-report-placeholder__name::before,
.c-card-report-placeholder__view::before,
.c-card-report-placeholder__button::before,
.c-card-report-placeholder__tag::before {
  content: "";
  display: block;
  height: 50vh;
  width: 50vw;
  position: absolute;
  animation: is-passing 0.6s ease-in infinite;
  background: linear-gradient(to right, transparent, #4e4f51 50%, transparent);
  z-index: 5;
}
.c-card-report-placeholder__button {
  height: 4rem;
  border-radius: 8px;
}
.c-card-report-placeholder__tags {
  gap: 16px;
}
.c-card-report-placeholder__tag {
  height: 3.2rem;
  border-radius: 8px;
}
.c-card-report-placeholder__tag:nth-child(1) {
  width: 8rem;
}
.c-card-report-placeholder__tag:nth-child(2) {
  width: 12rem;
}
.c-card-report-placeholder__avatar {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}
.c-card-report-placeholder__name {
  height: 1.6rem;
  width: 70px;
  margin-left: 24px;
  border-radius: 4px;
}
.c-card-report-placeholder__view {
  height: 3.2rem;
  width: 5rem;
  margin-left: auto;
  border-radius: 8px;
}
@keyframes is-passing {
  from {
    transform: translateX(-100%);
  }
}
</style>
