import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { autosavePlugin } from "./plugins/autosave";

const pinia = createPinia();
pinia.use(autosavePlugin);

const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount("#app");
