<script setup>
import { computed, onMounted, ref } from "vue";
import jwtDecode from "jwt-decode";
import { useParcsStore } from "../../../stores/parcs.js";
import { useAttractionsStore } from "../../../stores/attractions.js";
import { useUsersStore } from "../../../stores/users.js";
import "../../../style/BulleTexte.css";
import Swal from "sweetalert2";

const parcsStore = useParcsStore();
const attractionsStore = useAttractionsStore();
const usersStore = useUsersStore();

onMounted(() => {
    attractionsStore.fetchAttractions();
    parcsStore.fetchParcs();
    usersStore.fetchModoParc();
});

const parc = ref("");
const attraction = ref("");

const parcs = computed(() => parcsStore.getParcs);

const choixParc = () => {
    //On récup l'id du parc choisit dans le select
    const idParc =
        document.getElementById("parc").options[
            document.getElementById("parc").selectedIndex
        ].id;

    console.log(idParc);

    //On récup les attractions du parc choisit
    attractionsStore.fetchAttractionsParc(idParc);

    const attractions = computed(() => attractionsStore.getAttractions);

    setTimeout(() => {
        attraction.value = attractions.value;
        console.log(attraction.value);
    }, 300);

    //On récup les notes de chaque attraction
};

const usersModoParc = ref("");

setTimeout(() => {
    const users = computed(() => usersStore.getModoParc);
    for (const user of users.value) {
        usersModoParc.value = user.ref_parc;
    }
}, 300);

const attractions = computed(() => attractionsStore.getAttractions);

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const role = tokenDecode.value.role;

const deleteAttraction = (id) => {
    if (role === "admin" || role === "modoParc") {
        Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Vous ne pourrez pas revenir en arrière !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, supprimer !",
            cancelButtonText: "Non, annuler !",
        }).then((result) => {
            if (result.isConfirmed) {
                attractionsStore.deleteAttraction(id);

                attractionsStore.fetchAttractions();
                Swal.fire(
                    "Supprimé !",
                    "L'attraction a bien été supprimé.",
                    "success"
                );
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    "Annulé",
                    "L'attraction n'a pas été supprimé :)",
                    "error"
                );
            }
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Vous n'avez pas les droits pour supprimer une attraction",
        });
    }
};
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
        <div v-if="role === 'admin' || role === 'modoParc'">
            <div v-if="attractions.length > 0">
                <h1 class="text-center pt-10 md:text-4xl text-3xl">
                    Gestion des attractions
                </h1>
                <p class="text-center pb-10 md:text-2xl text-xl">
                    Ici sont affichés tous les attractions pour les gérer
                </p>

                <div class="pt-10">
                    <h2 class="text-center text-lg">
                        Choisissez le parc voulu :
                    </h2>
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

                <div
                    v-if="parc !== ''"
                    class="mt-4 flex flex-col container mx-auto"
                >
                    <div
                        v-if="attraction.length === 0"
                        class="text-center text-5xl pt-10"
                    >
                        <h2>Aucune attraction n'a encore été créée !</h2>
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
                    <div v-if="attraction.length !== 0" class="overflow-x-auto">
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
                                                v-if="
                                                    role === 'admin' ||
                                                    role === 'modoParc'
                                                "
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
                                                v-if="
                                                    role === 'admin' ||
                                                    role === 'modoParc'
                                                "
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
                                            v-for="data in attraction"
                                            :key="data.id"
                                            class="hover:bg-gray-100"
                                        >
                                            <div
                                                v-if="
                                                    data.ref_parc !==
                                                    usersModoParc
                                                "
                                            >
                                                Vous ne pouvez pas voir les
                                                informations de ce parc
                                            </div>
                                            <td
                                                v-if="
                                                    data.ref_parc ===
                                                        usersModoParc ||
                                                    role === 'admin'
                                                "
                                                class="whitespace-nowrap py-4 pl-4 pr-3 text-base font-medium text-gray-900 sm:pl-6"
                                            >
                                                {{ data.id }}
                                            </td>
                                            <div>
                                                <td
                                                    v-if="
                                                        data.ref_parc ===
                                                            usersModoParc ||
                                                        role === 'admin'
                                                    "
                                                    class="whitespace-nowrap px-3 py-4 text-base"
                                                >
                                                    {{ data.nom }}
                                                </td>
                                            </div>
                                            <td
                                                v-if="
                                                    data.ref_parc ===
                                                        usersModoParc ||
                                                    role === 'admin'
                                                "
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                <textarea
                                                    disabled
                                                    rows="3"
                                                    class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                                                    >{{
                                                        data.description
                                                    }}</textarea
                                                >
                                            </td>
                                            <td
                                                v-if="
                                                    data.ref_parc ===
                                                        usersModoParc ||
                                                    role === 'admin'
                                                "
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                {{ data.ref_parc }}
                                            </td>

                                            <td
                                                v-if="
                                                    role === 'admin' ||
                                                    data.ref_parc ===
                                                        usersModoParc
                                                "
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                <button
                                                    @click="
                                                        deleteAttraction(
                                                            data.id
                                                        )
                                                    "
                                                    type="button"
                                                >
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
                                                v-if="
                                                    role === 'admin' ||
                                                    data.ref_parc ===
                                                        usersModoParc
                                                "
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
        <div v-if="role === 'user'" class="flex justify-center pt-10">
            <h2 class="text-2xl">
                Vous n'avez pas les droits pour accèder à cette page
            </h2>
        </div>
    </div>
</template>
