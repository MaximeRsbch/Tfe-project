import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import FeaturesView from "../views/FeaturesView.vue";
import LoginView from "../views/LoginView.vue";
import RegistrationView from "../views/RegistrationView.vue";
import FullFeatureView from "../views/FullFeaturesView.vue";
import GestionUsersView from "../views/GestionUsersView.vue";
import ProfilView from "../views/ProfilView.vue";
import ParcsFormView from "../views/ParcsFormView.vue";
import AttractionsFormView from "../views/AttractionsFormView.vue";
import GestionParcsView from "../views/GestionParcsView.vue";
import GestionAttractionsView from "../views/GestionAttractionsView.vue";
import ModifParcsView from "../views/ModifParcsView.vue";
import AddArticlesView from "../views/AddArticlesView.vue";
import GestionArticlesView from "../views/GestionArticlesView.vue";
import ModifArticleView from "../views/ModifArticleView.vue";
import BestAttraPageView from "../views/BestAttraPageView.vue";

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
            path: "/features/addArticles",
            name: "addArticles",
            component: AddArticlesView,
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
            path: "/users",
            name: "users",
            component: GestionUsersView,
        },
        {
            path: "/parcs",
            name: "parcs",
            component: GestionParcsView,
        },
        {
            path: "/parcs/:id",
            name: "modifParcs",
            component: ModifParcsView,
        },
        {
            path: "/attractions",
            name: "attractions",
            component: GestionAttractionsView,
        },
        {
            path: "/articles",
            name: "articles",
            component: GestionArticlesView,
        },
        {
            path: "/articles/:id",
            name: "modifArticle",
            component: ModifArticleView,
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
        {
            path: "/bestattractions",
            name: "best",
            component: BestAttraPageView,
        },
    ],
});

export default router;
