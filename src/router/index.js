import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import FeaturesView from "../views/FeaturesView.vue";
import LoginView from "../views/LoginView.vue";
import RegistrationView from "../views/RegistrationView.vue";
import FullFeatureView from "../views/FullFeaturesView.vue";
import AdminView from "../views/AdminView.vue";
import ProfilView from "../views/ProfilView.vue";
import ParcsFormView from "../views/ParcsFormView.vue";
import AttractionsFormView from "../views/AttractionsFormView.vue";

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
            path: "/login",
            name: "login",
            component: LoginView,
        },
        {
            path: "/registration",
            name: "registration",
            component: RegistrationView,
        },
        {
            path: "/admin",
            name: "adminPannel",
            component: AdminView,
        },
        {
            path: "/profil",
            name: "profil",
            component: ProfilView,
        },
        {
            path: "/parcsform",
            name: "parcsform",
            component: ParcsFormView,
        },
        {
            path: "/attractionform",
            name: "attractionform",
            component: AttractionsFormView,
        },
    ],
});

export default router;
