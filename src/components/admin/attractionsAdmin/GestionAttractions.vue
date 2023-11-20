<script setup>
import { computed, ref, onMounted } from "vue";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";
import { useAttractionsStore } from "../../../stores/attractions.js";
import "../../../style/BulleTexte.css";

const attractionsStore = useAttractionsStore();

onMounted(() => {
    attractionsStore.fetchAttractions();
});

const attractions = computed(() => attractionsStore.getAttractions);

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const role = tokenDecode.value.role;
</script>
<template>
    <div class="container mx-auto">
        <div v-if="attractions.length === 0" class="text-center text-5xl pt-10">
            <h2>Aucune attractions n'a encore été créée !</h2>
            <div class="pt-10">
                <button
                    class="bg-[#344d59] text-white text-2xl px-5 py-2 rounded-xl"
                >
                    <RouterLink :to="{ name: 'attractionform' }"
                        >Ajouter une attraction</RouterLink
                    >
                </button>
            </div>
        </div>
        <div v-if="role === 'admin' || role === 'modo'">
            <div v-if="attractions.length > 0">
                <h1 class="text-center pt-10 text-4xl">
                    Gestion des attractions
                </h1>
                <p class="text-center pb-10 text-2xl">
                    Ici sont affichés tous les attractions pour les gérer
                </p>

                <div class="mt-4 flex flex-col container mx-auto">
                    <div class="overflow-x-auto">
                        <div
                            class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
                        >
                            <div
                                class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-md"
                            >
                                <table
                                    class="min-w-full divide-y divide-gray-300"
                                >
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
                                                    Parcs de référence
                                                </a>
                                            </th>
                                            <th
                                                scope="col"
                                                class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                            >
                                                <a
                                                    class="group inline-flex text-base"
                                                >
                                                    Type de référence
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
                                            v-for="attraction in attractions"
                                            :key="attraction.id"
                                            class="hover:bg-gray-100"
                                        >
                                            <td
                                                class="whitespace-nowrap py-4 pl-4 pr-3 text-base font-medium text-gray-900 sm:pl-6"
                                            >
                                                {{ attraction.id }}
                                            </td>
                                            <div>
                                                <td
                                                    class="whitespace-nowrap px-3 py-4 text-base"
                                                >
                                                    {{ attraction.nom }}
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
                                                        attraction.description
                                                    }}</textarea
                                                >
                                            </td>
                                            <td
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                {{ attraction.ref_parc }}
                                            </td>
                                            <td
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                {{ attraction.ref_type }}
                                            </td>
                                            <td
                                                v-if="role === 'admin'"
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                <button @click="" type="button">
                                                    <div
                                                        class="image-container"
                                                    >
                                                        <img
                                                            class="w-5 md:w-5 lg:w-full"
                                                            src="/assets/img/poubelle.png"
                                                            alt="poubelleImg"
                                                        />
                                                        <div class="tooltip">
                                                            Supprimer
                                                            attractions
                                                        </div>
                                                    </div>
                                                </button>
                                            </td>
                                            <td
                                                v-if="role === 'admin'"
                                                class="whitespace-nowrap py-4 pr-10 text-base"
                                            >
                                                <button type="button">
                                                    <div
                                                        class="image-container"
                                                    >
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
        <div v-if="role !== 'admin'">
            <h2>
                Bien essayer, vous êtes pas connecter pour accéder à cette page
            </h2>
        </div>
    </div>
</template>
