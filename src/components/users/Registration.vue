<script setup>
import { ref } from "vue";
import { useUsersStore } from "../../stores/users.js";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const usersStore = useUsersStore();

const email = ref("");
const password = ref("");
const username = ref("");

const router = useRouter();

const goToLogin = () => {
    router.push({ name: "login" });
};

//Fonction qui permet de s'inscrire (créé un user)
async function createUsers() {
    let regex =
        /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/;

    if (!regex.test(password.value)) {
        alert(
            "Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
        );
    } else {
        Swal.fire({
            title: "Inscription presque réussie !",
            text: "Vous avez reçu un mail pour valider votre compte !",
            icon: "success",
            confirmButtonText: "Cool !",
        });
        const body = await usersStore.createUser(
            password.value,
            email.value,
            username.value
        );
        setTimeout(() => {
            router.push({ name: "login" });
        }, 300);
    }
}

function checkPasswordValidation() {}
</script>

<template>
    <div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 class="mt-2 text-center text-3xl font-extrabold text-gray-900">
                Inscrivez-vous !
            </h2>
        </div>

        <div class="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
            <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form class="space-y-6" @submit.prevent="createUsers">
                    <div>
                        <label
                            class="input input-bordered flex items-center gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                class="h-4 w-4 opacity-70"
                            >
                                <path
                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
                                />
                            </svg>
                            <input
                                type="text"
                                class="grow"
                                placeholder="Username"
                                v-model="username"
                            />
                        </label>
                    </div>
                    <div>
                        <label
                            class="input input-bordered flex items-center gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                class="h-4 w-4 opacity-70"
                            >
                                <path
                                    d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
                                />
                                <path
                                    d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
                                />
                            </svg>
                            <input
                                type="text"
                                class="grow"
                                placeholder="Email"
                                v-model="email"
                            />
                        </label>
                    </div>

                    <div>
                        <label
                            class="input input-bordered flex items-center gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                class="h-4 w-4 opacity-70"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            <input
                                v-model="password"
                                placeholder="Mot de passe"
                                type="password"
                                class="grow"
                            />
                        </label>
                    </div>

                    <div>
                        <button
                            @click="checkPasswordValidation"
                            type="submit"
                            class="btn w-full sm:btn-sm md:btn-md lg:btn-md"
                        >
                            Inscrivez-vous !
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
                        @click="goToLogin"
                        type="submit"
                        class="btn w-full sm:btn-sm sm:px-10 md:btn-md lg:btn-md"
                    >
                        Connectez-vous !
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
