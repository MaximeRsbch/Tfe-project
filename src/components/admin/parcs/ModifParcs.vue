<script setup>
import { ref, onMounted, computed } from "vue";
import { useParcsStore } from "../../../stores/parcs.js";
import { useRoute } from "vue-router";

const parcsStore = useParcsStore();

const route = useRoute();

const idParc = route.params.id;

onMounted(() => {
    parcsStore.fetchParcById(idParc);
});

const id = ref("");
const nomparc = ref("");
const ticket = ref("");
const ouverture = ref("");
const fermeture = ref("");
const latitude = ref("");
const longitude = ref("");
const legende = ref("");

setTimeout(() => {
    const parc = computed(() => parcsStore.getParcs);

    for (let i = 0; i < parc.value.length; i++) {
        if (parc.value[i].id == idParc) {
            id.value = parc.value[i].id;
            nomparc.value = parc.value[i].nom;
            ticket.value = parc.value[i].ticketPrice;
            ouverture.value = parc.value[i].beginHour;
            fermeture.value = parc.value[i].endHour;
            latitude.value = parc.value[i].latitude;
            longitude.value = parc.value[i].longitude;
        }
    }
}, 500);

async function updateParc() {
    const body = await parcsStore.updateParc(
        id.value,
        nomparc.value,
        ouverture.value,
        fermeture.value,
        latitude.value,
        longitude.value,
        ticket.value
    );
}
</script>

<template>
    <section class="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700">
            Ajout d'un parc d'attraction
        </h2>

        <form @submit.prevent="updateParc">
            <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                <div>
                    <label class="text-gray-700" for="id">Id du parc</label>

                    <input
                        id="id"
                        :value="id"
                        disabled="disabled"
                        type="text"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                </div>

                <div>
                    <label class="text-gray-700" for="nomparc"
                        >Nom du parc</label
                    >

                    <input
                        id="nomparc"
                        v-model="nomparc"
                        disabled="disabled"
                        type="text"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                </div>

                <div>
                    <label class="text-gray-700" for="ticket"
                        >Prix du ticket</label
                    >
                    <input
                        id="ticket"
                        v-model="ticket"
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
                        type="text"
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
                        type="text"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                </div>

                <div>
                    <label class="text-gray-700" for="latitude">Latitude</label>
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
                        @change="test"
                        v-model="longitude"
                        type="text"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                </div>
            </div>

            <div class="flex justify-end mt-6">
                <button
                    type="submit"
                    class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-stone-500 rounded-md hover:stone-600 focus:outline-none focus:stone-500"
                >
                    Modifier le parc
                </button>
            </div>
        </form>
    </section>
</template>
