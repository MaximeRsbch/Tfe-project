<script setup>
import { computed, onMounted, ref } from "vue";
import jwtDecode from "jwt-decode";
import { useTicketsModStore } from "../stores/ticketsmod.js";
import Swal from "sweetalert2";

const ticketsModStore = useTicketsModStore();

//Empecher l'accès à la page si l'utilisateur n'est pas connecté
const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const id = computed(() => tokenDecode.value.id_user);

const title = ref("");
const description = ref("");

const createContact = () => {
    ticketsModStore.createContact(title.value, description.value, id.value);
    Swal.fire({
        icon: "success",
        title: "Votre demande a bien été envoyée",
        showConfirmButton: false,
    });
};
</script>

<template>
    <div class="flex justify-center">
        <div class="mt-8 lg:w-1/2 lg:mx-6">
            <div
                class="w-full px-8 py-10 mx-auto overflow-hidden bg-white shadow-2xl rounded-xl lg:max-w-xl"
            >
                <h1 class="text-xl font-medium text-gray-700">
                    Formulaire de contact
                </h1>

                <p class="mt-1 text-gray-500">
                    Vous pouvez nous contacter en remplissant le formulaire
                    ci-dessous.
                </p>

                <form class="mt-4">
                    <div class="flex-1">
                        <label class="block mb-2 text-sm text-gray-600"
                            >Titre de votre demande</label
                        >
                        <input
                            v-model="title"
                            type="text"
                            class="block w-full px-5 py-3 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div class="w-full mt-6">
                        <label class="block mb-2 text-sm text-gray-600"
                            >Message</label
                        >
                        <textarea
                            v-model="description"
                            minlength="20"
                            maxlength="500"
                            class="block w-full h-32 px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md md:h-48 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                            placeholder="Message"
                        ></textarea>
                    </div>

                    <button
                        @click="createContact()"
                        class="w-full px-6 py-3 mt-6 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#344d59] rounded-md hover:bg-[#344d59] focus:outline-none focus:ring focus:ring-blue-400 focus:ring-opacity-50"
                    >
                        Envoyer votre demande
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>
