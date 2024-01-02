<script setup>
import { computed, ref, onMounted } from "vue";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";
import { useParcsStore } from "../../../stores/parcs.js";
import { useUsersStore } from "../../../stores/users.js";
import "../../../style/BulleTexte.css";

const parcsStore = useParcsStore();
const usersStore = useUsersStore();

onMounted(() => {
    parcsStore.fetchParcs();
    usersStore.fetchModoParc();
});

const parcs = computed(() => parcsStore.getParcs);

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const role = tokenDecode.value.role;

const usersModoParc = ref("");

setTimeout(() => {
    const users = computed(() => usersStore.getModoParc);
    for (const user of users.value) {
        usersModoParc.value = user.ref_parc;
    }
}, 300);
</script>
<template>
    <div class="container mx-auto">
        <div v-if="parcs.length === 0" class="text-center text-5xl pt-10">
            <h2>Aucun parc n'a encore été créée !</h2>
            <div class="pt-10">
                <button
                    class="bg-[#344d59] text-white text-2xl px-5 py-2 rounded-xl"
                >
                    <RouterLink :to="{ name: 'parcsform' }"
                        >Ajouter un parc</RouterLink
                    >
                </button>
            </div>
        </div>
        <div v-if="role === 'admin' || role === 'modoParc'">
            <div v-if="parcs.length > 0">
                <h1 class="text-center pt-10 md:text-4xl text-3xl">
                    Gestion des parcs
                </h1>
                <p class="text-center pb-10 text-xl">
                    Ici sont affichés tous les parcs pour les gérer
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
                                                    Nom du parc
                                                </a>
                                            </th>

                                            <th
                                                scope="col"
                                                class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                            >
                                                <a
                                                    class="group inline-flex text-base"
                                                >
                                                    Prix du ticket
                                                </a>
                                            </th>
                                            <th
                                                scope="col"
                                                class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                            >
                                                <a
                                                    class="group inline-flex text-base"
                                                >
                                                    Heures d'ouverture
                                                </a>
                                            </th>
                                            <th
                                                scope="col"
                                                class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                            >
                                                <a
                                                    class="group inline-flex text-base"
                                                >
                                                    Heures de fermeture
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
                                                    Suppression parc
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
                                                    Modifier parc
                                                </a>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody
                                        class="divide-y divide-gray-200 bg-white"
                                    >
                                        <!--Affiche les info de tous les users-->
                                        <tr
                                            v-for="parc in parcs"
                                            :key="parc.id"
                                            class="hover:bg-gray-100"
                                        >
                                            <td
                                                class="whitespace-nowrap py-4 pl-4 pr-3 text-base font-medium text-gray-900 sm:pl-6"
                                            >
                                                {{ parc.id }}
                                            </td>
                                            <div>
                                                <td
                                                    class="whitespace-nowrap px-3 py-4 text-base"
                                                >
                                                    {{ parc.nom }}
                                                </td>
                                            </div>
                                            <td
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                {{ parc.ticketPrice }}
                                            </td>
                                            <td
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                {{ parc.beginHour }}
                                            </td>
                                            <td
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                {{ parc.endHour }}
                                            </td>

                                            <td
                                                v-if="
                                                    role === 'admin' ||
                                                    parc.id === usersModoParc
                                                "
                                                class="whitespace-nowrap py-4 pr-10 text-base"
                                            >
                                                <button type="button">
                                                    <div
                                                        class="image-container"
                                                    >
                                                        <RouterLink
                                                            v-if="
                                                                parc.id !==
                                                                undefined
                                                            "
                                                            v-bind:to="{
                                                                name: 'modifParcs',
                                                                params: {
                                                                    id: parc.id,
                                                                },
                                                            }"
                                                        >
                                                            <img
                                                                class="w-5 md:w-5 lg:w-full"
                                                                src="/assets/img/modif.png"
                                                                alt="modoPImg"
                                                            />
                                                        </RouterLink>

                                                        <div class="tooltip">
                                                            Modifier parc
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
        <div v-if="role == 'user'">
            <h2>
                Bien essayer, vous êtes pas connecter pour accéder à cette page
            </h2>
        </div>
    </div>
</template>
