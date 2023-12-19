<script setup>
import { computed, onMounted, ref } from "vue";
import jwtDecode from "jwt-decode";
import { useTicketsModStore } from "../../stores/ticketsmod.js";
import Swal from "sweetalert2";

const ticketsModStore = useTicketsModStore();

const contact = computed(() => ticketsModStore.getContact);

const report = computed(() => ticketsModStore.getReport);

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const role = tokenDecode.value.role;

const typeTicket = ref("");

const typeContact = ref(false);
const typeReport = ref(false);

const choixTicket = () => {
    if (typeTicket.value === "Ticket de contact") {
        ticketsModStore.fetchContact();
        typeContact.value = true;
        typeReport.value = false;
    } else if (typeTicket.value === "Ticket de report") {
        ticketsModStore.fetchReport();
        typeReport.value = true;
        typeContact.value = false;
    }
};

const deleteContact = (id) => {
    Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer !",
        cancelButtonText: "Non, annuler !",
    }).then((result) => {
        if (result.isConfirmed) {
            ticketsModStore.deleteContact(id);
            Swal.fire(
                "Supprimé !",
                "Le ticket a bien été supprimé.",
                "success"
            );
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire("Annulé", "Le ticket n'a pas été supprimé :)", "error");
        }
    });
};

const deleteReport = (id) => {
    Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer !",
        cancelButtonText: "Non, annuler !",
    }).then((result) => {
        if (result.isConfirmed) {
            ticketsModStore.deleteReport(id);

            Swal.fire(
                "Supprimé !",
                "Le ticket a bien été supprimé.",
                "success"
            );
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire("Annulé", "Le ticket n'a pas été supprimé :)", "error");
        }
    });
};
</script>
<template>
    <div v-if="role === 'admin' || role === 'modo'">
        <div>
            <h1 class="text-center pt-10 text-4xl">Gestion des tickets</h1>
            <p class="text-center pb-10 text-2xl">
                Ici sont affichés tous les tickets pour les gérer
            </p>

            <div class="flex justify-center">
                <select
                    v-model="typeTicket"
                    @change="choixTicket"
                    id="parc"
                    class="block px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-[#344d59] focus:ring-[#344d59] focus:ring-opacity-40 focus:outline-none focus:ring"
                >
                    <option>Ticket de contact</option>
                    <option>Ticket de report</option>
                </select>
            </div>

            <div class="mt-4 flex flex-col container mx-auto">
                <div class="overflow-x-auto">
                    <div
                        class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
                    >
                        <div
                            v-if="typeContact"
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
                                                Titre du ticket
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
                                        v-for="data in contact"
                                        :key="data.id"
                                        class="hover:bg-gray-100"
                                    >
                                        <div>
                                            <td
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                {{ data.title }}
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
                                                    data.description
                                                }}</textarea
                                            >
                                        </td>
                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            {{ data.User.username }}
                                        </td>
                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            {{ data.User.email }}
                                        </td>

                                        <td
                                            v-if="role === 'admin'"
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            <button
                                                @click="deleteContact(data.id)"
                                                type="button"
                                            >
                                                <img
                                                    class="w-5 md:w-5 lg:w-full"
                                                    src="/assets/img/poubelle.png"
                                                    alt="poubelleImg"
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div
                            v-if="typeReport"
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
                                                Titre du ticket
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
                                                Type de commentaire
                                            </a>
                                        </th>

                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Commentaire signaler
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
                                                Suppression ticket
                                            </a>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    class="divide-y divide-gray-200 bg-white"
                                >
                                    <!--Affiche les info de tous les users-->
                                    <tr
                                        v-for="data in report"
                                        :key="data.id"
                                        class="hover:bg-gray-100"
                                    >
                                        <div>
                                            <td
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                {{ data.title }}
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
                                                    data.description
                                                }}</textarea
                                            >
                                        </td>

                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            {{ data.User.email }}
                                        </td>
                                        <td
                                            v-if="data.ref_commentAttr == null"
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            Article
                                        </td>
                                        <td
                                            v-if="
                                                data.ref_commentArticles == null
                                            "
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            Attraction
                                        </td>

                                        <td
                                            v-if="
                                                data.ref_commentArticles == null
                                            "
                                        >
                                            <textarea
                                                disabled
                                                rows="3"
                                                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                                                >{{
                                                    data.CommentAttraction
                                                        .content
                                                }}</textarea
                                            >
                                        </td>
                                        <td v-if="data.ref_commentAttr == null">
                                            <textarea
                                                disabled
                                                rows="3"
                                                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                                                >{{
                                                    data.CommentArticle.content
                                                }}</textarea
                                            >
                                        </td>

                                        <td
                                            v-if="role === 'admin'"
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            <button
                                                @click="deleteReport(data.id)"
                                                type="button"
                                            >
                                                <img
                                                    class="w-10 md:w-10 lg:w-full"
                                                    src="/assets/img/poubelle.png"
                                                    alt="poubelleImg"
                                                />
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
