<script setup>
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useUsersStore } from "../../stores/users.js";
import Swal from "sweetalert2";

const router = useRouter();
const usersStore = useUsersStore();

const goToRegistration = () => {
    router.push({ name: "registration" });
};

const email = ref("");
const password = ref("");

//Fonction qui permet de se connecter en recherchant l'user dans la bdd
async function recupUser() {
    if (!password.value || !email.value) {
        return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Veuillez renseigner un mot de passe ou une adresse mail valide !",
        });
    }

    const body = await usersStore.loginUser(password.value, email.value);
}
</script>

<template>
    <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Connectez-vous à votre compte !
            </h2>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form
                    class="space-y-6"
                    @submit.prevent="recupUser"
                    action="#"
                    method="POST"
                >
                    <div>
                        <label
                            for="email"
                            class="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <div class="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autocomplete="email"
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-zinc-200"
                                v-model="email"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            for="password"
                            class="block text-sm font-medium text-gray-700"
                        >
                            Mot de passe
                        </label>
                        <div class="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autocomplete="current-password"
                                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black bg-zinc-200"
                                v-model="password"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#344d59] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Connectez-vous !
                        </button>
                    </div>
                </form>

                <div class="mt-6">
                    <div class="relative">
                        <div class="absolute inset-0 flex items-center">
                            <div class="w-full border-t border-gray-300" />
                        </div>
                        <div class="relative flex justify-center text-base">
                            <span class="px-2 bg-white text-gray-500">
                                Ou
                            </span>
                        </div>
                    </div>
                </div>
                <div class="pt-5">
                    <button
                        @click="goToRegistration"
                        type="button"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#344d59] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Inscrivez-vous !
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
