<script setup>
import { computed, onMounted, ref } from "vue";
import jwtDecode from "jwt-decode";
import { useTicketsModStore } from "../../stores/ticketsmod.js";

const ticketsModStore = useTicketsModStore();

onMounted(() => {
    ticketsModStore.fetchTickets();
});

const tickets = computed(() => ticketsModStore.getTickets);

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const role = tokenDecode.value.role;
</script>
<template>
    <div v-if="role === 'admin' || role === 'modo'">
        <div>
            <h1 class="text-center pt-10 text-4xl">Gestion des tickets</h1>
            <p class="text-center pb-10 text-2xl">
                Ici sont affichés tous les tickets pour les gérer
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
                                            class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Nom de l'attraction
                                            </a>
                                        </th>

                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Description
                                            </a>
                                        </th>
                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Auteur
                                            </a>
                                        </th>
                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Adresse Mail de l'auteur
                                            </a>
                                        </th>
                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Sujet du ticket
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
                                                Suppression attraction
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
                                                Modifier attraction
                                            </a>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    class="divide-y divide-gray-200 bg-white"
                                >
                                    <!--Affiche les info de tous les users-->
                                    <tr
                                        v-for="ticket in tickets"
                                        :key="ticket.id"
                                        class="hover:bg-gray-100"
                                    >
                                        <div>
                                            <td
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                {{ ticket.title }}
                                            </td>
                                        </div>
                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            <textarea
                                                disabled
                                                rows="3"
                                                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                                                >{{
                                                    ticket.description
                                                }}</textarea
                                            >
                                        </td>
                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            {{ ticket.User.username }}
                                        </td>
                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            {{ ticket.User.email }}
                                        </td>
                                        <td
                                            v-if="
                                                ticket.ref_commentArticles ==
                                                    null &&
                                                ticket.ref_commentAttr == null
                                            "
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            Aucun sujet n'a été trouvé
                                        </td>
                                        <td
                                            v-if="
                                                ticket.ref_commentAttr === null
                                            "
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            {{ ticket.CommentArticle.content }}
                                        </td>
                                        <td
                                            v-if="
                                                ticket.ref_commentArticles ===
                                                null
                                            "
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            {{ ticket.CommentAttr }}
                                        </td>

                                        <td
                                            v-if="role === 'admin'"
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            <button @click="" type="button">
                                                <div class="image-container">
                                                    <img
                                                        class="w-5 md:w-5 lg:w-full"
                                                        src="/assets/img/poubelle.png"
                                                        alt="poubelleImg"
                                                    />
                                                    <div class="tooltip">
                                                        Supprimer attractions
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
                                                        Modifier Attractions
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
    </div>
</template>
