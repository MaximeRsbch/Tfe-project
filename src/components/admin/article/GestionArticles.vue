<script setup>
import { useArticlesStore } from "../../../stores/articles.js";
import { computed, ref, onMounted } from "vue";
import jwtDecode from "jwt-decode";
import "../../../style/BulleTexte.css";

const articlesStore = useArticlesStore();

onMounted(() => {
    articlesStore.fetchArticles();
});

const articles = computed(() => articlesStore.getArticles);

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const role = tokenDecode.value.role;
</script>
<template>
    <div class="container mx-auto">
        <div v-if="role === 'admin' || role === 'modo'">
            <h1 class="text-center pt-10 text-4xl">Gestion des articles</h1>
            <p class="text-center pb-10 text-2xl">
                Ici sont affichés tous les articles pour les gérer
            </p>
            <div class="mt-4 flex flex-col container mx-auto">
                <div class="overflow-x-auto">
                    <div
                        class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
                    >
                        <div
                            class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-md"
                        >
                            <table class="min-w-full divide-y divide-gray-300">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            class="py-3.5 pl-2 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                        >
                                            <span
                                                class="group inline-flex text-base"
                                            >
                                                Id
                                                <span
                                                    class="invisible ml-2 flex-none rounded-md text-gray-400 group-hover:visible group-focus:visible"
                                                >
                                                </span>
                                            </span>
                                        </th>
                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Titre de l'article
                                            </a>
                                        </th>

                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Contenu
                                            </a>
                                        </th>

                                        <th
                                            v-if="role === 'admin'"
                                            scope="col"
                                            class="lg:hidden px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Suppression article
                                            </a>
                                        </th>

                                        <th
                                            v-if="role === 'modo'"
                                            scope="col"
                                            class="lg:hidden px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Supprimer article
                                            </a>
                                        </th>
                                        <th
                                            v-if="role === 'modo'"
                                            scope="col"
                                            class="lg:hidden px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Modifier article
                                            </a>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    class="divide-y divide-gray-200 bg-white"
                                >
                                    <!--Affiche les info de tous les users-->
                                    <tr
                                        v-for="article in articles"
                                        :key="article.id"
                                        class="hover:bg-gray-100"
                                    >
                                        <td
                                            class="whitespace-nowrap py-4 px-3 text-base"
                                        >
                                            {{ article.id }}
                                        </td>
                                        <div>
                                            <td
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                {{ article.title }}
                                            </td>
                                        </div>
                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            <textarea
                                                disabled
                                                rows="3"
                                                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                                                >{{ article.content }}</textarea
                                            >
                                        </td>

                                        <td
                                            v-if="role === 'admin'"
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            <button
                                                @click="deleteUsers(user.id)"
                                                type="button"
                                            >
                                                <div class="image-container">
                                                    <img
                                                        class="w-5 md:w-5 lg:w-full"
                                                        src="/assets/img/poubelle.png"
                                                        alt="poubelleImg"
                                                    />
                                                    <div class="tooltip">
                                                        Supprimer article
                                                    </div>
                                                </div>
                                            </button>
                                        </td>
                                        <td
                                            v-if="role === 'admin'"
                                            class="whitespace-nowrap py-4 pr-10 text-base"
                                        >
                                            <button type="button">
                                                <div class="image-container">
                                                    <img
                                                        class="w-5 md:w-5 lg:w-full"
                                                        src="/assets/img/modif.png"
                                                        alt="modoPImg"
                                                    />

                                                    <div class="tooltip">
                                                        Modifier article
                                                    </div>
                                                </div>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="role !== 'admin'">
            <h2>
                Bien essayer, vous êtes pas connecter pour accéder à cette page
            </h2>
        </div>
    </div>
</template>
