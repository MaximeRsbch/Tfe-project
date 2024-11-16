<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useUsersStore } from "../../stores/users.js";
import Swal from "sweetalert2";

const router = useRouter();
const usersStore = useUsersStore();

onMounted(() => {
    usersStore.fetchUsers();
});

const user = computed(() => usersStore.getUsers);

setTimeout(() => {
    const userVerificationStatus = [];

    for (let i = 0; i < user.value.length; i++) {
        const currentUser = user.value[i];
        userVerificationStatus.push({
            email: currentUser.email,
            isVerified: currentUser.isVerified,
        });
    }
}, 300);

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

    const currentUser = user.value.find((u) => u.email === email.value);

    if (!currentUser) {
        return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Utilisateur non trouvé !",
        });
    }

    setTimeout(() => {
        if (user.value.length === 1) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Mot de passe incorrect !",
            });
        }
    }, 300);

    if (currentUser.isVerified) {
        // L'utilisateur est vérifié, vous pouvez maintenant procéder à la connexion.
        const body = await usersStore.loginUser(password.value, email.value);
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Votre compte n'est pas vérifié !",
        });
    }
}
</script>

<template>
    <div>
        <div
            className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8"
        >
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2
                    className="mt-6 text-center text-3xl font-extrabold text-gray-900"
                >
                    Connectez-vous à votre compte !
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div
                    className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10"
                >
                    <form className="space-y-6" @submit.prevent="recupUser">
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
                                    v-model="email"
                                    type="email"
                                    class="grow"
                                    placeholder="Email"
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
                                type="submit"
                                class="btn w-full sm:btn-sm sm:px-10 md:btn-md lg:btn-md"
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
                            class="btn w-full sm:btn-sm sm:px-10 md:btn-md lg:btn-md"
                        >
                            Inscrivez-vous !
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
