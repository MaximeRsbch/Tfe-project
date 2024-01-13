<script setup>
import leaflet from "leaflet";
import { Mapbox_API_KEY } from "../../common/config.js";
import { ref, onMounted, computed } from "vue";
import { useParcsStore } from "../../stores/parcs.js";
import MapSearchResto from "./MapSearchResto.vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import jwtDecode from "jwt-decode";

const parcsStore = useParcsStore();
const router = useRouter();

let map;

onMounted(() => {
    map = leaflet.map("map").setView([50.7001368, 4.5873087], 10);

    //add tile layer
    leaflet
        .tileLayer(
            `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${Mapbox_API_KEY}`,

            {
                maxZoom: 19,
                attribution:
                    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                id: "mapbox/streets-v11",
                tileSize: 512,
                zoomOffset: -1,
            }
        )
        .addTo(map);
    map.on("click", (e) => {
        latitude.value = e.latlng.lat;
        longitude.value = e.latlng.lng;
    });

    map.zoomControl.remove();

    parcsStore.fetchParcs();
});

const recupparcs = computed(() => parcsStore.getParcs);

const name = ref("");
const latitude = ref("");
const longitude = ref("");
const ouverture = ref("");
const fermeture = ref("");
const description = ref("");
const carte = ref("");
const ref_parcs = ref("");

const id_parc = ref("");

function changeParcValue() {
    //recup l'id du choix du parc
    const idParc =
        document.getElementById("ref_parc").options[
            document.getElementById("ref_parc").selectedIndex
        ].id;
    id_parc.value = idParc;
}

const img = ref("");
const imageInput = ref(null); // Ajoutez cette ligne pour obtenir une référence à l'élément d'entrée de fichier

const saveImageToConstant = () => {
    // Récupérer l'élément d'entrée de fichier
    const selectedImage = imageInput.value.files[0];

    // Créer un objet FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("upload_preset", "vue3course");

    // Stocker le fichier dans une constante
    const imageFile = formData.get("file"); // Vous pouvez également utiliser selectedImage directement

    // Ensuite, envoyez imageFile vers le store ou utilisez-le comme nécessaire

    img.value = imageFile;

    // Vous pouvez également réinitialiser l'élément d'entrée de fichier si nécessaire
    imageInput.value = null;
};

const coords = ref(null);
const fetchCoords = ref(null);

const resultMarker = ref(null);
const plotResult = (coords) => {
    // check to see if resultMarker has value
    if (resultMarker.value) {
        map.removeLayer(resultMarker.value);
    }

    // create custom marker
    const customMarker = leaflet.icon({
        iconUrl: "/assets/img/map-marker-blue.svg",
        iconSize: [35, 35],
    });

    // create a marker with coords and custom icon
    resultMarker.value = leaflet
        .marker([coords.coordinates[1], coords.coordinates[0]], {
            icon: customMarker,
        })
        .addTo(map);

    //set map view to the current location
    map.setView([coords.coordinates[1], coords.coordinates[0]], 17);

    closeSearchResults();
};

const searchResults = ref(null);
const toggleSearchResults = () => {
    searchResults.value = !searchResults.value;
};
const closeSearchResults = () => {
    searchResults.value = null;
};

const removeResult = () => {
    map.removeLayer(resultMarker.value);
};

async function createResto() {
    Swal.fire({
        title: "Êtes-vous sûr?",
        text: "Vous êtes sur le point d'ajouter un magasin",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, ajouter le magasin!",
    }).then((result) => {
        if (result.isConfirmed) {
            parcsStore.createRestaurants(
                name.value,
                latitude.value,
                longitude.value,
                ouverture.value,
                fermeture.value,
                img.value,
                description.value,
                carte.value,
                id_parc.value
            );
        }
        router.push({ name: "home" });
    });
}

const goBack = () => {
    router.go(-1);
};

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const role = tokenDecode.value.role;
</script>

<template>
    <div class="pt-10 pb-10">
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
                Ajout d'un restaurant
            </h2>

            <form @submit.prevent="createResto">
                <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                    <div>
                        <label class="text-gray-700" for="ref_parc"
                            >Parcs</label
                        >

                        <select
                            @change="changeParcValue"
                            name="selectParcs"
                            id="ref_parc"
                            v-model="ref_parcs"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        >
                            <option
                                v-for="dataParc in recupparcs"
                                :id="dataParc.id"
                            >
                                {{ dataParc.nom }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <label class="text-gray-700" for="nomRestaurant"
                            >Nom du restaurant</label
                        >

                        <input
                            id="nomRestaurant"
                            v-model="name"
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

                <MapSearchResto
                    @plotResult="plotResult"
                    @toggleSearchResults="toggleSearchResults"
                    @removeResult="removeResult"
                    :coords="coords"
                    :fetchCoords="fetchCoords"
                    :searchResults="searchResults"
                />

                <div class="pt-10">
                    <div id="map" class="h-96 w-full z-[1]"></div>
                </div>

                <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                    <div>
                        <label class="text-gray-700" for="latitude"
                            >Latitude</label
                        >
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
                </div>

                <div class="pt-4">
                    <label class="text-gray-700" for="carte"
                        >Url de la carte</label
                    >
                    <input
                        id="carte"
                        v-model="carte"
                        type="text"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                </div>

                <div class="pt-10">
                    <input
                        id="image"
                        type="file"
                        ref="imageInput"
                        @change="saveImageToConstant"
                        class="block w-full mt-2"
                    />
                </div>

                <div class="flex justify-end mt-6">
                    <button
                        type="submit"
                        class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#344d59] rounded-md hover:stone-600 focus:outline-none focus:[#344d59]"
                    >
                        Ajouter le restaurant
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
