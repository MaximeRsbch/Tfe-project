<script setup>
import { computed, onMounted } from "vue";
import { useArticlesStore } from "../../stores/articles.js";
import { BASE_URL } from "../../common/config.js";
import jwtDecode from "jwt-decode";
import { RouterLink, useRouter } from "vue-router";
import "../../style/BulleTexte.css";

const articlesStore = useArticlesStore();

const router = useRouter();

onMounted(() => {
    articlesStore.fetchArticles();
});

//Récupère toutes les informations des articles
const articles = computed(() => articlesStore.getArticles);

console.log(articles.value);

//Verif si l'user est co ou non
const isConnect = computed(() => localStorage.getItem("savedToken"));

const goToArticleForm = () => {
    router.push({ name: "addArticles" });
};

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const role = tokenDecode.value.role;
</script>

<template>
    <div class="mx-auto container px-4 md:px-10 lg:px-4">
        <div v-if="!isConnect">
            <h1 class="flex justify-center items-center">
                Veuillez vous connecter pour accéder à cette page !
            </h1>
            
        </div>
        <div v-if="isConnect">
            <div class="text-center pt-20" v-if="articles.length == 0">
                <h2 class="text-4xl">Aucun article n'est disponible</h2>
                
                <div v-if="role === 'admin'" class="pt-10">
                    <button
                        class="bg-[#344d59] text-white text-2xl px-5 py-2 rounded-xl"
                    >
                        <RouterLink :to="{ name: 'addArticles' }"
                            >Ajouter un article</RouterLink
                        >
                    </button>
                </div>
            </div>
            <!--Récupère toutes les informations des articles et je les affiche-->
        </div>
    </div>
    <div v-if="articles.length !== 0" class="container px-6 pt-10 mx-auto">
        <div class="text-center">
            <h1
                class="text-2xl font-semibold text-gray-800 capitalize lg:text-3xl"
            >
                Page de nouveautés
            </h1>

            <p class="max-w-lg mx-auto mt-4 text-gray-500">
                Vous pouvez voir ici toutes les nouvelles attractions qui vont
                sortir
            </p>
        </div>

        <div>
            <div v-if="role === 'admin'" class="flex justify-end">
                <button @click="goToArticleForm">
                    <div class="image-container">
                        <img
                            src="/assets/img/addBtn.png"
                            class="w-full md:w-5 lg:w-full"
                            alt=""
                        />
                        <div class="tooltip">Ajouter un article</div>
                    </div>
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-8 md:mt-8 mb-10 lg:grid-cols-2">
            <div v-for="data in articles">
                <img
                    class="relative z-10 object-cover w-full rounded-md h-96"
                    src="https://images.unsplash.com/photo-1644018335954-ab54c83e007f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                    alt=""
                />

                <div
                    class="relative z-20 max-w-lg p-6 mx-auto -mt-20 bg-[#344d59] rounded-md shadow"
                >
                    <a
                        href="#"
                        class="font-semibold text-white hover:underline md:text-xl"
                    >
                        {{ data.title }}
                    </a>

                    <p class="mt-3 text-sm text-white md:text-sm truncate">
                        {{ data.content }}
                    </p>

                    <div class="text-center pt-4 text-blue-300">
                        <!-- Permet d'ouvrir la page d'un article spécifique-->
                        <RouterLink
                            v-if="data.id !== undefined"
                            v-bind:to="{
                                name: 'fullfeature',
                                params: {
                                    id: data.id,
                                },
                            }"
                            ><p class="mt-3 text-sm text-blue-300">
                                Cliquez ici pour voir l'article complet
                            </p></RouterLink
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
