import { createRouter, createWebHashHistory } from "vue-router";
import Vote from "../views/voting.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{ path: "/", component: Vote, meta: { auth: false } }],
});
export default router;
