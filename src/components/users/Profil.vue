<script setup>
import { useUsersStore } from "../../stores/users.js";
import { onMounted, computed, ref } from "vue";
import jwtDecode from "jwt-decode";

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

const username = ref();
const email = ref();

//A mieux réflechir parce que ça marche aps
const modifUser = () => {
    for (let i = 0; i < user.value.length; i++) {
        if (user.value[i].id === id.value) {
            username.value = user.value[i].username;
            email.value = user.value[i].email;
            usersStore.modifyUser(id.value, username.value, email.value);
        }
    }
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
                    <div class="">
                        <h2 class="pb-2 text-center">Username :</h2>
                        <div class="flex justify-center">
                            <input
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
                                class="block l rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                type="text"
                                :value="data.email"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <button @click="modifUser">Sauvegarder</button>
            </div>
        </div>
    </div>
</template>
