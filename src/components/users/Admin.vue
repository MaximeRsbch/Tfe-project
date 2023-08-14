<script setup>
import { useUsersStore } from "../../stores/users.js";
import { computed, ref, onMounted } from "vue";
import Swal from "sweetalert2";
import { BASE_URL } from "../../common/config.js";
import { useImageAttractionStore } from "../../stores/imageAttraction.js";

const usersStore = useUsersStore();
const imageAttractionStore = useImageAttractionStore();

onMounted(() => {
    usersStore.fetchUsers();
    imageAttractionStore.recupAllImageAttraction();
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
                "Votre commentaire n'a pas été supprimé :)",
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
                "Votre commentaire n'a pas été supprimé :)",
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
</script>
<template>
    <div class="container mx-auto">
        <h1 class="text-center pt-10 text-4xl">Admin panel</h1>
        <p class="text-center pb-10 text-2xl">
            Ici sont afficher tout les utilisateurs pour les modérer
        </p>
        <div class="mt-4 flex flex-col container mx-auto">
            <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
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
                                        <a class="group inline-flex text-base">
                                            Username
                                        </a>
                                    </th>

                                    <th
                                        scope="col"
                                        class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                    >
                                        <a class="group inline-flex text-base">
                                            Email
                                        </a>
                                    </th>
                                    <th
                                        scope="col"
                                        class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                    >
                                        <a class="group inline-flex text-base">
                                            Role
                                        </a>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
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
                                                src="assets/img/poubelle.png"
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
                                                src="assets/img/mute.png"
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
</template>
