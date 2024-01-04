<script setup>
import { ref, onMounted, computed } from "vue";
import { useParcsStore } from "../../../stores/parcs.js";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

const parcsStore = useParcsStore();

const route = useRoute();
const router = useRouter();

const idMagasin = route.params.id;

onMounted(() => {
    parcsStore.fetchMagasinsById(idMagasin);
});

const id = ref("");
const name = ref("");
const latitude = ref("");
const longitude = ref("");
const ouverture = ref("");
const fermeture = ref("");
const description = ref("");

setTimeout(() => {
    const magasin = computed(() => parcsStore.getMagasins);

    for (let i = 0; i < magasin.value.length; i++) {
        id.value = magasin.value[i].id;
        name.value = magasin.value[i].name;
        latitude.value = magasin.value[i].latitude;
        longitude.value = magasin.value[i].longitude;
        ouverture.value = magasin.value[i].beginHour;
        fermeture.value = magasin.value[i].endHour;
        description.value = magasin.value[i].description;
    }
}, 500);

async function updateMagasin() {
    Swal.fire({
        title: "Êtes-vous sûr de vouloir modifier ce parc ?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Modifier`,
        denyButtonText: `Ne pas modifier`,
    }).then((result) => {
        if (result.isConfirmed) {
            parcsStore.updateMagasins(
                id.value,
                name.value,
                latitude.value,
                longitude.value,
                ouverture.value,
                fermeture.value,
                description.value
            );
            Swal.fire("Modifié !", "", "success");
        } else if (result.isDenied) {
            Swal.fire("Modifications non effectuées", "", "info");
        }
    });
}

const goBack = () => {
    router.go(-1);
};
</script>

<template>
    <div class="py-10">
        <section class="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
            <button @click="goBack" class="text-blue-500 hover:underline">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="inline-block w-4 h-4 mr-2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                </svg>
                Retour
            </button>
            <h2 class="text-lg font-semibold text-gray-700 pt-4">
                Modification d'un magasin
            </h2>

            <form @submit.prevent="updateMagasin">
                <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                    <div class="hidden">
                        <label class="text-gray-700" for="id"
                            >Id du magasin</label
                        >

                        <input
                            id="id"
                            :value="id"
                            disabled="disabled"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label class="text-gray-700" for="nomMagasin"
                            >Nom du magasin</label
                        >

                        <input
                            id="nomMagasin"
                            v-model="name"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label class="text-gray-700" for="latitude"
                            >Latitude</label
                        >
                        <input
                            id="latitude"
                            disabled="disabled"
                            v-model="latitude"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label class="text-gray-700" for="longitude"
                            >Longitude</label
                        >
                        <input
                            id="longitude"
                            disabled="disabled"
                            v-model="longitude"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label class="text-gray-700" for="ouverture"
                            >Heures d'ouverture</label
                        >
                        <input
                            id="ouverture"
                            v-model="ouverture"
                            type="time"
                            min="09:00"
                            max="20:00"
                            required
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label class="text-gray-700" for="fermeture"
                            >Heures de fermeture</label
                        >
                        <input
                            id="fermeture"
                            v-model="fermeture"
                            type="time"
                            min="09:00"
                            max="20:00"
                            required
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>
                    <div>
                        <label class="text-gray-700" for="description"
                            >Description</label
                        >
                        <input
                            id="description"
                            v-model="description"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>
                </div>

                <div class="flex justify-end mt-6">
                    <button
                        type="submit"
                        class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#344d59] rounded-md hover:stone-600 focus:outline-none focus:bg-[#344d59]"
                    >
                        Modifier Magasin
                    </button>
                </div>
            </form>
        </section>
    </div>
</template>
