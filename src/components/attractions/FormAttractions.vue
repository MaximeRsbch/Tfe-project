<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useTypesStore } from "../../stores/types";
import { useAttractionsStore } from "../../stores/attractions";
import { useParcsStore } from "../../stores/parcs";

const typesStore = useTypesStore();
const attractionsStore = useAttractionsStore();
const parcsStore = useParcsStore();

const id = ref("");
onMounted(() => {
    typesStore.fetchTypes();
    parcsStore.fetchParcs();
});

const recuptypes = computed(() => typesStore.getTypes);
const recupparcs = computed(() => parcsStore.getParcs);

const nomattraction = ref("");
const tailminseul = ref("");
const tailminaccomp = ref("");
const latitude = ref("");
const longitude = ref("");
const description = ref("");
const parcs = ref("");
const types = ref("");
const image = ref("");

async function createAttraction() {
    const body = await attractionsStore.createAttraction(
        nomattraction.value,
        tailminseul.value,
        tailminaccomp.value,
        latitude.value,
        longitude.value,
        description.value,
        parcs.value,
        types.value,
        image.value
    );
}
</script>

<template>
    <section class="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700">
            Ajout d'une attraction
        </h2>

        <form @submit.prevent="createAttraction">
            <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                <div class="pt-5">
                    <label class="text-gray-700" for="id">id</label>

                    <input
                        id="id"
                        v-model="id"
                        type="text"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                </div>

                <div class="pt-5">
                    <label class="text-gray-700" for="nomattraction"
                        >Nom de l'attraction</label
                    >

                    <select
                        id="nomattraction"
                        v-model="nomattraction"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    >
                        <option v-for="data in recuptypes">
                            {{ data.name }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="text-gray-700" for="tailminseul"
                        >Taille minimum seul</label
                    >
                    <input
                        id="tailminseul"
                        v-model="tailminseul"
                        type="text"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                </div>

                <div>
                    <label class="text-gray-700" for="tailminaccomp"
                        >Taille minimum accompagné</label
                    >
                    <input
                        id="tailminaaccomp"
                        v-model="tailminaccomp"
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
                        v-model="longitude"
                        type="text"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                </div>

                <div>
                    <label class="text-gray-700" for="types">Types</label>

                    <select
                        id="types"
                        v-model="types"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    >
                        <option v-for="data in recuptypes">
                            {{ data.name }}
                        </option>
                    </select>
                </div>

                <div>
                    <label class="text-gray-700" for="parcs">Parcs</label>

                    <select
                        id="types"
                        v-model="parcs"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    >
                        <option v-for="data in recupparcs">
                            {{ data.nom }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="pt-10">
                <label class="text-gray-700" for="description"
                    >Description</label
                >

                <textarea
                    id="description"
                    v-model="description"
                    rows="5"
                    class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                />
            </div>

            <div class="col-span-full pt-10">
                <label
                    for="cover-photo"
                    class="block text-sm font-medium leading-6 text-gray-900"
                    >Image de l'attraction</label
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
            </div>

            <div class="flex justify-end mt-6">
                <button
                    type="submit"
                    class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-stone-500 rounded-md hover:stone-600 focus:outline-none focus:stone-500"
                >
                    Ajouter l'attraction
                </button>
            </div>
        </form>
    </section>
</template>
