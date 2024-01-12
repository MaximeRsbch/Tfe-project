<script setup>
import { ref, onMounted, computed } from "vue";
import { useParcsStore } from "../../stores/parcs.js";
import { useAttractionsStore } from "../../stores/attractions.js";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import jwtDecode from "jwt-decode";

const attractionsStore = useAttractionsStore();

const route = useRoute();
const router = useRouter();

const idAttraction = route.params.id;

onMounted(() => {
    attractionsStore.fetchAttraction(idAttraction);
});

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const role = tokenDecode.value.role;

const id = ref("");
const nom = ref("");
const minHeight = ref("");
const maxHeight = ref("");
const latitude = ref("");
const longitude = ref("");
const description = ref("");

const commentaires = ref(false);

const showCommentaire = () => {
    commentaires.value = !commentaires.value;
};

setTimeout(() => {
    const attraction = computed(() => attractionsStore.getAttractions);

    for (let i = 0; i < attraction.value.length; i++) {
        if (attraction.value[i].id == idAttraction) {
            id.value = attraction.value[i].id;
            nom.value = attraction.value[i].nom;
            minHeight.value = attraction.value[i].minHeight;
            maxHeight.value = attraction.value[i].maxHeight;
            latitude.value = attraction.value[i].latitude;
            longitude.value = attraction.value[i].longitude;
            description.value = attraction.value[i].description;
        }
    }
}, 500);

async function updateAttractions() {
    Swal.fire({
        title: "Êtes-vous sûr de vouloir modifier ce parc ?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Modifier`,
        denyButtonText: `Ne pas modifier`,
    }).then((result) => {
        if (result.isConfirmed) {
            attractionsStore.updateAttraction(
                id.value,
                nom.value,
                minHeight.value,
                maxHeight.value,
                latitude.value,
                longitude.value,
                description.value,
                commentaires.value
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
        <section
            v-if="role !== 'user'"
            class="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md"
        >
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
                Modification d'une attraction
            </h2>

            <form @submit.prevent="updateAttractions">
                <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                    <div class="hidden">
                        <label class="text-gray-700" for="id"
                            >Id de l'attraction</label
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
                        <label class="text-gray-700" for="nom"
                            >Nom du parc</label
                        >

                        <input
                            id="nom"
                            v-model="nom"
                            disabled="disabled"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label class="text-gray-700" for="minHeight"
                            >Taille minimum seul</label
                        >
                        <input
                            id="minHeight"
                            v-model="minHeight"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label class="text-gray-700" for="maxHeight"
                            >Taille minimum accompagné</label
                        >
                        <input
                            id="maxHeight"
                            v-model="maxHeight"
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
                        <label class="text-gray-700" for="description"
                            >Description</label
                        >
                        <textarea
                            id="description"
                            v-model="description"
                            rows="3"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring resize-none"
                        ></textarea>
                    </div>

                    <div>
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Commentaires</span>
                                <input
                                    @change="showCommentaire"
                                    type="checkbox"
                                    class="checkbox"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end mt-6">
                    <button
                        type="submit"
                        class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#344d59] rounded-md hover:stone-600 focus:outline-none focus:bg-[#344d59]"
                    >
                        Modifier le parc
                    </button>
                </div>
            </form>
        </section>
        <div v-if="role === 'user'" class="flex justify-center pt-10">
            <h2 class="text-2xl">
                Vous n'avez pas les droits pour accèder à cette page
            </h2>
        </div>
    </div>
</template>
