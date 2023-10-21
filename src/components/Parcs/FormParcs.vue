<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useParcsStore } from "../../stores/parcs.js";

const parcsStore = useParcsStore();

onMounted(() => {
    parcsStore.fetchQueuetimeParc();
});

const recupqueuetime = computed(() => parcsStore.getParcs);

const id = ref("");
const nomparc = ref("");
const ticket = ref("");
const ouverture = ref("");
const fermeture = ref("");
const latitude = ref("");
const longitude = ref("");
const legende = ref("");

async function createParc() {
    const body = await parcsStore.createParc(
        (id.value = nomparc.value[0] + nomparc.value[1]),
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

        <form @submit.prevent="createParc">
            <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                <div>
                    <label class="text-gray-700" for="id">Id du parc</label>
                    <input
                        v-if="nomparc == ''"
                        id="id"
                        value="Veuillez choisir un parc"
                        disabled="disabled"
                        type="text"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                    <input
                        v-if="nomparc != ''"
                        id="id"
                        :value="nomparc[0] + nomparc[1]"
                        disabled="disabled"
                        type="text"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                </div>

                <div>
                    <label class="text-gray-700" for="nomparc"
                        >Nom du parc</label
                    >

                    <select
                        id="nomparc"
                        v-model="nomparc"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    >
                        <option v-for="data in recupqueuetime">
                            {{ data.id }}
                            {{ data.name }}
                        </option>
                    </select>
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
                        @change="test"
                        v-model="longitude"
                        type="text"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                </div>
            </div>

            <!-- <div class="pt-10">
                <label class="text-gray-700" for="legende">Légendes</label>

                <textarea
                    id="legende"
                    v-model="legende"
                    rows="5"
                    class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                />
            </div> -->

            <!-- <div class="col-span-full">
                <label
                    for="cover-photo"
                    class="block text-sm font-medium leading-6 text-gray-900"
                    >Image du parc</label
                >
                <div
                    class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                >
                    <div class="text-center">
                        <svg
                            class="mx-auto h-12 w-12 text-gray-300"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <div class="mt-4 flex text-sm leading-6 text-gray-600">
                            <label
                                for="file-upload"
                                class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                            >
                                <span>Upload un fichier</span>
                                <input
                                    id="file-upload"
                                    name="file-upload"
                                    type="file"
                                    class="sr-only"
                                />
                            </label>
                            <p class="pl-1">ou glisser</p>
                        </div>
                        <p class="text-xs leading-5 text-gray-600">
                            PNG, JPG, GIF up to 10MB
                        </p>
                    </div>
                </div>
            </div> -->

            <div class="flex justify-end mt-6">
                <button
                    type="submit"
                    class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-stone-500 rounded-md hover:stone-600 focus:outline-none focus:stone-500"
                >
                    Ajouter le parc
                </button>
            </div>
        </form>
    </section>
</template>
