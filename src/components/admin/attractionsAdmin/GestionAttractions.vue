<script setup>
import { computed, onMounted, ref } from "vue";
import jwtDecode from "jwt-decode";
import { useParcsStore } from "../../../stores/parcs.js";
import { useAttractionsStore } from "../../../stores/attractions.js";
import { useUsersStore } from "../../../stores/users.js";
import "../../../style/BulleTexte.css";

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

    //On récup les attractions du parc choisit
    attractionsStore.fetchAttractionsParc(idParc);

    const attractions = computed(() => attractionsStore.getAttractions);

    attraction.value = attractions.value;

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
                                            v-for="data in attraction"
                                            :key="data.id"
                                            class="hover:bg-gray-100"
                                        >
                                            <td
                                                v-if="
                                                    data.ref_parc ===
                                                    usersModoParc
                                                "
                                                class="whitespace-nowrap py-4 pl-4 pr-3 text-base font-medium text-gray-900 sm:pl-6"
                                            >
                                                {{ data.id }}
                                            </td>
                                            <div>
                                                <td
                                                    v-if="
                                                        data.ref_parc ===
                                                        usersModoParc
                                                    "
                                                    class="whitespace-nowrap px-3 py-4 text-base"
                                                >
                                                    {{ data.nom }}
                                                </td>
                                            </div>
                                            <td
                                                v-if="
                                                    data.ref_parc ===
                                                    usersModoParc
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
                                                    usersModoParc
                                                "
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                {{ data.ref_parc }}
                                            </td>

                                            <td
                                                v-if="
                                                    role === 'admin' &&
                                                    data.ref_parc ===
                                                        usersModoParc
                                                "
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
                                                v-if="
                                                    role === 'admin' &&
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
        <div v-if="role !== 'admin'">
            <h2>
                Bien essayer, vous êtes pas connecter pour accéder à cette page
            </h2>
        </div>
    </div>
</template>
