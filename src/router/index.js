import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import FeaturesView from "../views/FeaturesView.vue";
import ContactView from "../views/ContactView.vue";
import LoginView from "../views/LoginView.vue";
import RegistrationView from "../views/RegistrationView.vue";
import FullFeatureView from "../views/FullFeaturesView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/features",
            name: "features",
            component: FeaturesView,
        },
        {
            path: "/features/:id",
            name: "fullfeature",
            component: FullFeatureView,
        },
        {
            path: "/contact",
            name: "contact",
            component: ContactView,
        },
        {
            path: "/login",
            name: "login",
            component: LoginView,
        },
        {
            path: "/registration",
            name: "registration",
            component: RegistrationView,
        },
    ],
});

export default router;
