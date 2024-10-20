import { createRouter, createWebHashHistory } from "vue-router";
import { Vote, Report } from "../views/";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", name: "home", component: Vote, meta: { auth: false } },
    { path: "/report", name: "report", component: Report },
  ],
});
export default router;
