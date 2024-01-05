<script setup>
import { useUsersStore } from "../../stores/users.js";
import { useParcsStore } from "../../stores/parcs.js";
import { computed, ref, onMounted } from "vue";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";
import "../../style/BulleTexte.css";

const usersStore = useUsersStore();
const parcsStore = useParcsStore();

onMounted(() => {
    usersStore.fetchUsers();
    parcsStore.fetchParcs();
});

const users = computed(() => usersStore.getUsers);

const canComment = ref(false);

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const role = tokenDecode.value.role;
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
        if ((result.isConfirmed && role !== "admin") || role !== "modo") {
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

const modalModoP = ref(false);
const modalModo = ref(false);
const usersId = ref("");
const email = ref("");
const username = ref("");
const roleUser = ref("");

const showModalModoP = (Id) => {
    setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
        document.body.style.overflow = "hidden";
        for (const user of users.value) {
            if (Id == user.id) {
                usersId.value = user.id;
                email.value = user.email;
                username.value = user.username;
                roleUser.value = user.role;
            }
        }
    }, 100);
    modalModoP.value = !modalModoP.value;
};

const showModalModo = (Id) => {
    setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
        document.body.style.overflow = "hidden";
        for (const user of users.value) {
            if (Id == user.id) {
                usersId.value = user.id;
                email.value = user.email;
                username.value = user.username;
                roleUser.value = user.role;
            }
        }
    }, 100);
    modalModo.value = !modalModo.value;
};

const parcs = computed(() => parcsStore.getParcs);
const ref_parc = ref("");
const id_parc = ref("");

const changeParcValue = (e) => {
    const idParc =
        document.getElementById("ref_parc").options[
            document.getElementById("ref_parc").selectedIndex
        ].id;
    id_parc.value = idParc;
};

const giveRoleModoParc = (Id, username, email, roleUser) => {
    if (roleUser === "modo" || roleUser === "admin") {
        Swal.fire(
            "Erreur",
            "Vous ne pouvez pas donner ce role à un modo ou un admin.",
            "error"
        );
    } else {
        usersStore.giveRoleModoParc(username, email, Id, id_parc.value);
        usersStore.changeUserRole(
            Id,
            role === "modoParc" ? "user" : "modoParc"
        );
        Swal.fire(
            "ModoParc",
            "Cet utilisateur a bien été modoParc.",
            "success"
        ).then(() => {
            modalModoP.value = !modalModoP.value;
            usersStore.fetchUsers();
        });
    }
};

const giveRoleModo = (Id, username, email, roleUser) => {
    if (roleUser === "modo" || roleUser === "admin") {
        Swal.fire(
            "Erreur",
            "Vous ne pouvez pas donner ce role à un modo ou un admin.",
            "error"
        );
    } else {
        usersStore.giveRoleModo(username, email, Id, id_parc.value);
        usersStore.changeUserRole(Id, role === "modo" ? "user" : "modo");
        Swal.fire("Modo", "Cet utilisateur a bien été modo.", "success").then(
            () => {
                modalModo.value = !modalModo.value;
            }
        );
    }
};
</script>
<template>
    <div class="container mx-auto">
        <div v-if="role === 'admin' || role === 'modo' || role === 'modoParc'">
            <h1 class="text-center pt-10 text-4xl">Gestion des utilisateurs</h1>
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
                                            v-if="role === 'admin'"
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
                                            v-if="role === 'admin'"
                                            scope="col"
                                            class="lg:hidden px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Donner le role Modo
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
                                                Donner le role ModoParc
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
                                                Mute User
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
                                            class="whitespace-nowrap py-4 px-3 text-base"
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
                                                        Supprimer utilisateurs
                                                    </div>
                                                </div>
                                            </button>
                                        </td>

                                        <td
                                            v-if="
                                                role === 'admin' ||
                                                role === 'modoParc'
                                            "
                                            class="whitespace-nowrap py-4 pr-5 text-base"
                                        >
                                            <button
                                                @click="showModalModo(user.id)"
                                                type="button"
                                            >
                                                <div class="image-container">
                                                    <img
                                                        class="w-5 md:w-5 lg:w-full"
                                                        src="/assets/img/modoP.png"
                                                        alt="modoPImg"
                                                    />
                                                    <div class="tooltip">
                                                        Donner role Modo
                                                    </div>
                                                </div>
                                            </button>
                                        </td>

                                        <td
                                            v-if="role === 'admin'"
                                            class="whitespace-nowrap py-4 pr-5 text-base"
                                        >
                                            <button
                                                @click="showModalModoP(user.id)"
                                                type="button"
                                            >
                                                <div class="image-container">
                                                    <img
                                                        class="w-5 md:w-5 lg:w-full"
                                                        src="/assets/img/modoP.png"
                                                        alt="modoPImg"
                                                    />
                                                    <div class="tooltip">
                                                        Donner role ModoP
                                                    </div>
                                                </div>
                                            </button>
                                        </td>

                                        <td
                                            v-if="role === 'modo'"
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
                                            v-if="role === 'modo'"
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
                        <div
                            class="flex md:justify-center items-center scroll-auto"
                        >
                            <div
                                v-if="modalModo"
                                class="h-screen w-full absolute z-30 flex justify-center items-center bg-black/50"
                            >
                                <div
                                    class="bg-white w-[80%] sm:w-[450px] px-6 py-4 rounded-md"
                                >
                                    <i
                                        @click="showModalModo"
                                        class="fa-regular fa-circle-xmark flex justify-end"
                                    ></i>

                                    <div class="flex justify-center pb-4">
                                        <h2 class="text-2xl">Promotion</h2>
                                    </div>

                                    <div class="pb-4">
                                        <p>
                                            Veuiller selectionner un parc pour
                                            lequel l'utilisateur sera
                                            modérateur.
                                        </p>
                                    </div>

                                    <div class="grid grid-cols-2">
                                        <p>
                                            id de l'user :
                                            <span>{{ usersId }}</span>
                                        </p>
                                        <p>
                                            Pseudo :
                                            <span>{{ username }}</span>
                                        </p>
                                    </div>

                                    <div class="grid grid-cols-2 pt-4 pb-4">
                                        <p>
                                            Email : <span>{{ email }}</span>
                                        </p>
                                        <p>
                                            Role : <span>{{ roleUser }}</span>
                                        </p>
                                    </div>

                                    <p>A quel parc voulez-vous le relier ?</p>
                                    <select
                                        @change="changeParcValue"
                                        id="ref_parc"
                                        v-model="ref_parc"
                                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                                    >
                                        <option
                                            v-for="dataParc in parcs"
                                            :id="dataParc.id"
                                        >
                                            {{ dataParc.nom }}
                                        </option>
                                    </select>

                                    <div class="flex justify-end pt-2">
                                        <button
                                            @click="
                                                giveRoleModo(
                                                    usersId,
                                                    username,
                                                    email,
                                                    roleUser
                                                )
                                            "
                                            type="button"
                                            class="px-4 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#344d59] rounded-md hover:stone-600 focus:outline-none focus:stone-500"
                                        >
                                            Ajouter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="flex md:justify-center items-center scroll-auto"
                        >
                            <div
                                v-if="modalModoP"
                                class="h-screen w-full absolute z-30 flex justify-center items-center bg-black/50"
                            >
                                <div
                                    class="bg-white w-[80%] sm:w-[450px] px-6 py-4 rounded-md"
                                >
                                    <i
                                        @click="showModalModoP"
                                        class="fa-regular fa-circle-xmark flex justify-end"
                                    ></i>

                                    <div class="flex justify-center pb-4">
                                        <h2 class="text-2xl">Promotion</h2>
                                    </div>

                                    <div class="pb-4">
                                        <p>
                                            Veuiller selectionner un parc pour
                                            lequel l'utilisateur sera modérateur
                                            de Parc
                                        </p>
                                    </div>

                                    <div class="grid grid-cols-2">
                                        <p>
                                            id de l'user :
                                            <span>{{ usersId }}</span>
                                        </p>
                                        <p>
                                            Pseudo :
                                            <span>{{ username }}</span>
                                        </p>
                                    </div>

                                    <div class="grid grid-cols-2 pt-4 pb-4">
                                        <p>
                                            Email : <span>{{ email }}</span>
                                        </p>
                                        <p>
                                            Role : <span>{{ roleUser }}</span>
                                        </p>
                                    </div>

                                    <p>A quel parc voulez-vous le relier ?</p>
                                    <select
                                        @change="changeParcValue"
                                        id="ref_parc"
                                        v-model="ref_parc"
                                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                                    >
                                        <option
                                            v-for="dataParc in parcs"
                                            :id="dataParc.id"
                                        >
                                            {{ dataParc.nom }}
                                        </option>
                                    </select>

                                    <div class="flex justify-end pt-4">
                                        <button
                                            @click="
                                                giveRoleModoParc(
                                                    usersId,
                                                    username,
                                                    email,
                                                    roleUser
                                                )
                                            "
                                            type="button"
                                            class="px-4 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#344d59] rounded-md hover:stone-600 focus:outline-none focus:stone-500"
                                        >
                                            Ajouter
                                        </button>
                                    </div>
                                </div>
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
