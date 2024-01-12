<script setup>
import leaflet from "leaflet";
import { Mapbox_API_KEY } from "../../common/config.js";
import { computed, onMounted, ref } from "vue";
import { useTypesStore } from "../../stores/types";
import { useParcsStore } from "../../stores/parcs";
import { useAttractionsStore } from "../../stores/attractions";
import { useUsersStore } from "../../stores/users";
import MapSearchAttraction from "./MapSearchAttraction.vue";
import Swal from "sweetalert2";
import { useRouter, useRoute } from "vue-router";
import jwtDecode from "jwt-decode";

const typesStore = useTypesStore();
const parcsStore = useParcsStore();
const attractionsStore = useAttractionsStore();
const usersStore = useUsersStore();

const router = useRouter();
const route = useRoute();

const idParc = route.params.id;

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

    typesStore.fetchTypes();
    parcsStore.fetchParcs();
    attractionsStore.fetchAttractionsQueuetimes(idParc);
    usersStore.fetchModoParc();
});

const recuptypes = computed(() => typesStore.getTypes);

const getAttractions = computed(() => attractionsStore.getAttractions);

const id = ref("");
const nom = ref("");
const minHeight = ref("");
const maxHeight = ref("");
const latitude = ref("");
const longitude = ref("");
const description = ref("");
const id_type = ref("");
const ref_type = ref("");

const coords = ref(null);
const fetchCoords = ref(null);
const geoMarker = ref(null);

const usersModoParc = ref("");

setTimeout(() => {
    const users = computed(() => usersStore.getModoParc);

    for (const user of users.value) {
        usersModoParc.value = user.ref_parc;
    }
}, 300);

const getGeoLocation = () => {
    if (coords.value) {
        coords.value = null;
        sessionStorage.removeItem("coords");
        map.removeLayer(geoMarker.value);
        return;
    }
    // check session storage for coords
    if (sessionStorage.getItem("coords")) {
        coords.value = JSON.parse(sessionStorage.getItem("coords"));
        plotGeolocation(coords.value);
        return;
    }

    fetchCoords.value = true;
    navigator.geolocation.getCurrentPosition(setCoords, getLocErro);
};

const setCoords = (pos) => {
    // stop fetching coords
    fetchCoords.value = null;

    // set coords in session storage
    const setSessionCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
    };

    sessionStorage.setItem("coords", JSON.stringify(setSessionCoords));

    //set ref coords value
    coords.value = setSessionCoords;

    plotGeolocation(coords.value);
};

const plotGeolocation = (coords) => {
    // create custom marker
    const customMarker = leaflet.icon({
        iconUrl: "/assets/img/map-marker-red.svg",
        iconSize: [35, 35],
    });

    // create a marker with coords and custom icon
    geoMarker.value = leaflet
        .marker([coords.lat, coords.lng], { icon: customMarker })
        .addTo(map);

    //set map view to the current location
    map.setView([coords.lat, coords.lng], 10);
};

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

function changeTypeValue() {
    const idType =
        document.getElementById("ref_type").options[
            document.getElementById("ref_type").selectedIndex
        ].id;
    id_type.value = idType;
}

function changeAttractionValue() {
    const idAttraction =
        document.getElementById("nom").options[
            document.getElementById("nom").selectedIndex
        ].id;

    id.value = idAttraction;
}

const img = ref("");
const imageInput = ref(null); // Ajoutez cette ligne pour obtenir une référence à l'élément d'entrée de fichier

const saveImageToConstant = () => {
    // Récupérer l'élément d'entrée de fichier
    const selectedImage = imageInput.value.files[0];

    if (!selectedImage) {
        console.log("Aucun fichier sélectionné");
        return;
    }

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

const comment = ref(false);
const isFavorite = ref(false);

const showComment = () => {
    comment.value = !comment.value;
};

const createAttraction = () => {
    Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Vous êtes sur le point d'ajouter une attraction",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, ajouter l'attraction",
        cancelButtonText: "Non, annuler",
    }).then((result) => {
        if (result.isConfirmed) {
            attractionsStore.createAttraction(
                id.value,
                nom.value,
                minHeight.value,
                maxHeight.value,
                latitude.value,
                longitude.value,
                description.value,
                id_type.value,
                idParc,
                isFavorite.value,
                comment.value
            );

            setTimeout(() => {
                attractionsStore.createImageAttraction(img.value, id.value);
            }, 500);
            Swal.fire(
                "Attraction ajoutée !",
                "L'attraction a bien été ajoutée",
                "success"
            );
            setTimeout(() => {
                router.push({
                    name: "home",
                });
            }, 1000);
        } else {
            Swal.fire("Annulé", "L'attraction n'a pas été ajoutée", "error");
        }
    });
};

const goBack = () => {
    router.go(-1);
};

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const role = tokenDecode.value.role;
</script>

<template>
    <div v-if="idParc === usersModoParc || role === 'admin'">
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
                Ajout d'une attraction
            </h2>

            <form @submit.prevent="createAttraction">
                <div class="pt-5">
                    <label class="text-gray-700" for="nom"
                        >Nom de l'attraction</label
                    >

                    <select
                        @change="changeAttractionValue"
                        name="selectAttraction"
                        v-model="nom"
                        id="nom"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    >
                        <option v-for="data in getAttractions" :id="data.id">
                            {{ data.name }}
                        </option>
                    </select>
                </div>

                <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
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
                            id="tailminaaccomp"
                            v-model="maxHeight"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label class="text-gray-700" for="ref_type"
                            >Types</label
                        >

                        <select
                            @change="changeTypeValue"
                            name="selectTypes"
                            id="ref_type"
                            v-model="ref_type"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        >
                            <option
                                v-for="dataType in recuptypes"
                                :id="dataType.id"
                            >
                                {{ dataType.name }}
                            </option>
                        </select>
                    </div>

                    <div class="form-control">
                        <label class="label cursor-pointer">
                            <span class="label-text">Commentaires</span>
                            <input
                                @change="showComment"
                                type="checkbox"
                                class="checkbox"
                            />
                        </label>
                    </div>
                </div>

                <MapSearchAttraction
                    @getGeolocation="getGeoLocation"
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

                <div class="pt-10">
                    <input
                        id="image"
                        type="file"
                        ref="imageInput"
                        @change="saveImageToConstant"
                        class="block w-full mt-2"
                    />
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

                <div class="flex justify-end mt-6">
                    <button
                        type="submit"
                        class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#344d59] rounded-md hover:stone-600 focus:outline-none focus:[#344d59]"
                    >
                        Ajouter l'attraction
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
    <div v-if="usersModoParc !== idParc || role !== 'admin'">
        <div class="flex justify-center pt-10">
            <h2 class="text-2xl">Vous n'êtes pas modérateur de ce parc</h2>
        </div>
    </div>
</template>
