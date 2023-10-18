import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import store from "./stores/store";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(store);

app.mount("#app");
