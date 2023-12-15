<script setup>
import { computed, onMounted, ref } from "vue";
import { useArticlesStore } from "../../stores/articles.js";
import { useParcsStore } from "../../stores/parcs.js";
import { BASE_URL } from "../../common/config.js";
import jwtDecode from "jwt-decode";
import { RouterLink, useRouter } from "vue-router";
import "../../style/BulleTexte.css";

const articlesStore = useArticlesStore();
const parcsStore = useParcsStore();

onMounted(() => {
    parcsStore.fetchParcs();
});

const router = useRouter();

//Verif si l'user est co ou non
const isConnect = computed(() => localStorage.getItem("savedToken"));

const goToArticleForm = () => {
    router.push({ name: "addArticles" });
};

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const role = tokenDecode.value.role;

const parc = ref("");
const article = ref("");

const parcs = computed(() => parcsStore.getParcs);

const choixParc = () => {
    //On récup l'id du parc choisit dans le select
    const idParc =
        document.getElementById("parc").options[
            document.getElementById("parc").selectedIndex
        ].id;

    //On récup les attractions du parc choisit
    articlesStore.fetchAllArticles(idParc);
    setTimeout(() => {
        const articles = computed(() => articlesStore.getArticles);

        article.value = articles.value;
    }, 300);

    //On récup les notes de chaque attraction
};
</script>

<template>
    <div class="mx-auto container px-4 md:px-10 lg:px-4">
        <div v-if="!isConnect">
            <h1 class="flex justify-center items-center">
                Veuillez vous connecter pour accéder à cette page !
            </h1>
        </div>
    </div>
    <div class="container px-6 pt-10 mx-auto">
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

        <div class="pt-10">
            <h2 class="text-center text-lg">Choisissez le parc voulu :</h2>
            <div class="flex justify-center">
                <select
                    v-model="parc"
                    @change="choixParc"
                    id="parc"
                    class="block px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-[#344d59] focus:ring-[#344d59] focus:ring-opacity-40 focus:outline-none focus:ring"
                >
                    <option v-for="data in parcs" :id="data.id">
                        {{ data.nom }}
                    </option>
                </select>
            </div>
        </div>

        <div v-if="isConnect">
            <div class="text-center pt-20" v-if="article.length == 0">
                <h2 class="text-2xl">
                    Aucun article n'est disponible pour ce parc
                </h2>

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
        </div>

        <div v-if="article.length > 0">
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
            <div v-for="data in article">
                <img
                    class="relative z-10 object-cover w-full rounded-md h-96"
                    v-if="data.img_url"
                    :src="`${BASE_URL}/${data.img_url.replace(/\\/g, '/')}`"
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
