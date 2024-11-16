<script setup>
import { useUsersStore } from "../../stores/users.js";
import { onMounted, computed } from "vue";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";

const usersStore = useUsersStore();

//Empecher l'accès à la page si l'utilisateur n'est pas connecté
const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const id = computed(() => tokenDecode.value.id_user);

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
        <div v-if="isConnect" class="pt-16">
            <img
                src="/assets/img/image.jpg"
                alt="profil"
                class="mx-auto rounded-full w-36"
            />
            <div v-for="data in user">
                <div v-if="data.id">
                    <div v-if="data.id == id">
                        <div>
                            <div class="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="Enter name"
                                    class="pr-4 pl-14 py-3 text-sm text-black rounded bg-white border border-gray-400 w-full outline-[#333]"
                                />

                                <div class="absolute left-4">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22px"
                                        height="22px"
                                        fill="#bbb"
                                        viewBox="0 0 512 512"
                                    >
                                        <path
                                            d="M437.02 74.981C388.667 26.629 324.38 0 256 0S123.333 26.629 74.98 74.981C26.629 123.333 0 187.62 0 256s26.629 132.667 74.98 181.019C123.333 485.371 187.62 512 256 512s132.667-26.629 181.02-74.981C485.371 388.667 512 324.38 512 256s-26.629-132.667-74.98-181.019zM256 482c-66.869 0-127.037-29.202-168.452-75.511C113.223 338.422 178.948 290 256 290c-49.706 0-90-40.294-90-90s40.294-90 90-90 90 40.294 90 90-40.294 90-90 90c77.052 0 142.777 48.422 168.452 116.489C383.037 452.798 322.869 482 256 482z"
                                            data-original="#000000"
                                        ></path>
                                    </svg>
                                </div>
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
                    class="bg-[#344d59] text-white text-2xl px-5 py-2 rounded-xl"
                >
                    Sauvegarder
                </button>
            </div>
        </div>
        <div v-if="!isConnect">
            <h2>Veuillez-vous connecter pour accéder à cette page</h2>
        </div>
    </div>
</template>
