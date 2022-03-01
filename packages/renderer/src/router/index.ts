import { createRouter, createWebHistory } from "vue-router";
import BuildHW from "/@/views/BuildHW.vue";
import HWSelection from "/@/views/HWSelection.vue";
import AssignIO from "/@/views/AssignIO.vue";
import Logs from "/@/views/Logs.vue";

const routes = [
  {
    path: "/",
    name: "BuildHW",
    component: BuildHW,
  },
  {
    path: "/hw-selection",
    name: "HWSelection",
    component: HWSelection,
  },
  {
    path: "/assign-io",
    name: "AssignIO",
    component: AssignIO,
  },
  {
    path: "/logs",
    name: "Logs",
    component: Logs,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: "active",
});

export default router;
