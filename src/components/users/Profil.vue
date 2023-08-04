<script setup>
import { useUsersStore } from "../../stores/users.js";
import { onMounted, computed, ref } from "vue";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";

const usersStore = useUsersStore();

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const id = computed(() => tokenDecode.value.userID);

onMounted(() => {
    usersStore.fetchOneUser(id.value);
});

//Récupère l'utilisateurs connecter
const user = computed(() => usersStore.getUsersById);

// Modification des données de l'utilisateurs

const updateUsers = () => {
    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    Swal.fire({
        title: "Etes vous sure ?",
        text: "Vos informations seront modifiées !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, modifier !",
    }).then((result) => {
        if (result.isConfirmed && id !== 1) {
            Swal.fire(
                "Modifier",
                "Vos informations ont bien été modifiées.",
                "success"
            );
            usersStore.updateUser(id.value, username, email);
        } else {
            Swal.fire(
                "Erreur",
                "Vos informations n'ont pas été modifiées.",
                "error"
            );
        }
    });
};
</script>
<template>
    <div>
        <div class="pt-16">
            <h1 class="text-center text-4xl pb-10">
                Information de votre compte :
            </h1>
            <div v-for="data in user">
                <div v-if="data.id">
                    <div v-if="data.id == id">
                        <div>
                            <h2 class="pb-2 text-center">Username :</h2>
                            <div class="flex justify-center">
                                <input
                                    id="username"
                                    class="block l rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    type="text"
                                    :value="data.username"
                                />
                            </div>
                        </div>
                        <div class="pt-4">
                            <h2 class="text-center pb-2">Email :</h2>
                            <div class="flex justify-center">
                                <input
                                    id="email"
                                    class="block l rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    type="text"
                                    :value="data.email"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-center pt-10">
                <button
                    @click="updateUsers"
                    class="bg-stone-500 text-white text-2xl px-5 py-2 rounded-xl"
                >
                    Sauvegarder
                </button>
            </div>
        </div>
    </div>
</template>
