<script setup>
import { useUsersStore } from "../../stores/users.js";
import { computed, ref, onMounted } from "vue";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";

const usersStore = useUsersStore();

onMounted(() => {
    usersStore.fetchUsers();
});

const users = computed(() => usersStore.getUsers);

const canComment = ref(false);

//Fonction qui permet de supprimer un utilisateur
const deleteUsers = (id) => {
    Swal.fire({
        title: "Etes vous sure ?",
        text: "Cet utilisateur sera définitivement supprimer !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer !",
    }).then((result) => {
        if (result.isConfirmed && id !== 1) {
            Swal.fire(
                "Supprimer",
                "Cet utilisateur a bien été supprimer.",
                "success"
            );
            usersStore.deleteUser(id);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
                "Annulé",
                "Cet utilisateur n'a pas été supprimé :)",
                "error"
            );
        } else if (id === 1) {
            Swal.fire(
                "Erreur",
                "Vous ne pouvez pas supprimer cet utilisateur.",
                "error"
            );
        }
    });
};

//Fonction qui permet de mute un utilisateur
const muteUsers = (id) => {
    Swal.fire({
        title: "Etes vous sure ?",
        text: "Cet utilisateur sera mute !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, mute !",
    }).then((result) => {
        if (result.isConfirmed && id !== 1) {
            Swal.fire("Mute", "Cet utilisateur a bien été mute.", "success");
            usersStore.muteUser(id, canComment.value);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
                "Annulé",
                "Cet utilisateur n'a pas été muter :)",
                "error"
            );
        } else if (id === 1) {
            Swal.fire(
                "Erreur",
                "Vous ne pouvez pas supprimer cet utilisateur.",
                "error"
            );
        }
    });
};

//Fonction qui permet de unmute un utilisateur
const unmuteUsers = (id) => {
    Swal.fire({
        title: "Etes vous sure ?",
        text: "Cet utilisateur sera unmute !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, mute !",
    }).then((result) => {
        if (result.isConfirmed && id !== 1) {
            Swal.fire("Mute", "Cet utilisateur a bien été unmute.", "success");
            usersStore.muteUser(id, !canComment.value);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
                "Annulé",
                "Cet utilisateur n'a pas été démuter :)",
                "error"
            );
        } else if (id === 1) {
            Swal.fire(
                "Erreur",
                "Vous ne pouvez pas supprimer cet utilisateur.",
                "error"
            );
        }
    });
};

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const id = computed(() => tokenDecode.value.userID);
</script>
<template>
    <div class="container mx-auto">
        <div v-if="id === 1">
            <h1 class="text-center pt-10 text-4xl">Admin panel</h1>
            <p class="text-center pb-10 text-2xl">
                Ici sont affichés tous les utilisateurs pour les modérer
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
                                                Nom d'utilisateur
                                            </a>
                                        </th>

                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Email
                                            </a>
                                        </th>
                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Role
                                            </a>
                                        </th>
                                        <th
                                            scope="col"
                                            class="lg:hidden px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Suppression user
                                            </a>
                                        </th>
                                        <th
                                            scope="col"
                                            class="lg:hidden px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Mute User
                                            </a>
                                        </th>
                                        <th
                                            scope="col"
                                            class="lg:hidden px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Unmute User
                                            </a>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    class="divide-y divide-gray-200 bg-white"
                                >
                                    <!--Affiche les info de tous les users-->
                                    <tr
                                        v-for="user in users"
                                        :key="user.id"
                                        class="hover:bg-gray-100"
                                    >
                                        <td
                                            class="whitespace-nowrap py-4 pl-4 pr-3 text-base font-medium text-gray-900 sm:pl-6"
                                        >
                                            {{ user.id }}
                                        </td>
                                        <div>
                                            <td
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                {{ user.username }}
                                            </td>
                                        </div>
                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            {{ user.email }}
                                        </td>
                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            {{ user.role }}
                                        </td>
                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            <button
                                                @click="deleteUsers(user.id)"
                                                type="button"
                                            >
                                                <img
                                                    class="w-5 md:w-5 lg:w-full"
                                                    src="/assets/img/poubelle.png"
                                                    alt="poubelleImg"
                                                />
                                            </button>
                                        </td>
                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            <button
                                                @click="muteUsers(user.id)"
                                                type="button"
                                            >
                                                <img
                                                    class="w-5 md:w-5 lg:w-full"
                                                    src="/assets/img/mute.png"
                                                    alt="muteImg"
                                                />
                                            </button>
                                        </td>
                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            <button
                                                @click="unmuteUsers(user.id)"
                                                type="button"
                                            >
                                                <img
                                                    class="w-5 md:w-5 lg:w-full"
                                                    src="/assets/img/unmute.png"
                                                    alt="unmuteeImg"
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
        <div v-if="id !== 1">
            <h2>
                Bien essayer, vous êtes pas connecter pour accéder à cette page
            </h2>
        </div>
    </div>
</template>
