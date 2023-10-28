<script setup>
import { computed, onMounted } from "vue";
import { useArticlesStore } from "../../stores/articles.js";
import { BASE_URL } from "../../common/config.js";
import { RouterLink } from "vue-router";
import { useRouter } from "vue-router";
import "../../style/BulleTexte.css";

const articlesStore = useArticlesStore();

const router = useRouter();

onMounted(() => {
    articlesStore.fetchArticles();
});

//Récupère toutes les informations des articles
const articles = computed(() => articlesStore.getArticles);

//Verif si l'user est co ou non
const isConnect = computed(() => localStorage.getItem("savedToken"));

const goToArticleForm = () => {
    router.push({ name: "addArticles" });
};
</script>

<template>
    <div class="mx-auto container px-4 md:px-10 lg:px-4">
        <div v-if="!isConnect">
            <h1 class="flex justify-center items-center">
                Veuillez vous connecter pour accéder à cette page !
            </h1>
        </div>
        <div v-if="isConnect">
            <div class="text-center pt-20" v-if="articles == 0">
                <h2 class="text-4xl">Aucun article n'est disponible</h2>
                <div class="pt-10">
                    <button
                        class="bg-stone-500 text-white text-2xl px-5 py-2 rounded-xl"
                    >
                        <RouterLink :to="{ name: 'addArticles' }"
                            >Ajouter un article</RouterLink
                        >
                    </button>
                </div>
            </div>
            <!--Récupère toutes les informations des articles et je les affiche-->
            <div v-if="articles !== 0">
                <div class="flex justify-end pt-10">
                    <button @click="goToArticleForm">
                        <div class="image-container">
                            <img
                                src="/assets/img/addBtn.png"
                                class="w-5 md:w-5 lg:w-full"
                                alt=""
                            />
                            <div class="tooltip">Ajouter un article</div>
                        </div>
                    </button>
                </div>
                <div v-for="data in articles">
                    <div>
                        <img
                            class="lg:w-full h-96 object-cover object-center rounded-lg w-full"
                            :src="`${BASE_URL}${data.img_url}`"
                            alt=""
                        />

                        <h2 class="text-center text-4xl pt-4">
                            {{ data.title }}
                        </h2>
                        <div class="flex justify-center">
                            <p class="pt-4 max-w-3xl text-justify truncate">
                                {{ data.content }}
                            </p>
                        </div>

                        <div class="text-center pt-4 text-blue-500">
                            <!-- Permet d'ouvrir la page d'un article spécifique-->
                            <RouterLink
                                v-if="data.id !== undefined"
                                v-bind:to="{
                                    name: 'fullfeature',
                                    params: {
                                        id: data.id,
                                    },
                                }"
                                >Cliquez ici pour voir l'article
                                complet</RouterLink
                            >
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
