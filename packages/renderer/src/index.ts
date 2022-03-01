import { createApp } from "vue";
import App from "/@/App.vue";
import router from "/@/router/index";
import { store, key } from "/@/store/index";
import "virtual:windi.css";
import "flowbite";

createApp(App).use(store, key).use(router).mount("#app");
