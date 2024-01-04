<script setup>
import leaflet from "leaflet";
import { Mapbox_API_KEY } from "../../common/config.js";
import { ref, onMounted, computed } from "vue";
import { useParcsStore } from "../../stores/parcs.js";
import MapSearchParc from "./MapSearchParc.vue";
import Swal from "sweetalert2";
import { useRouter, useRoute } from "vue-router";

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

    map.zoomControl.remove();

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

const ChangeNomParc = () => {
    var idParc =
        document.getElementById("nomparc").options[
            document.getElementById("nomparc").selectedIndex
        ].id;

    id.value = idParc;
};

const toilettes = ref(false);
const resto = ref(false);
const magasins = ref(false);

const showWC = () => {
    toilettes.value = !toilettes.value;
};

const showResto = () => {
    resto.value = !resto.value;
};

const showMagasins = () => {
    magasins.value = !magasins.value;
};

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

async function createParc() {
    Swal.fire({
        title: "Êtes-vous sûr?",
        text: "Vous êtes sur le point d'ajouter un parc d'attraction",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Oui, ajouter le parc",
        cancelButtonText: "Annuler",
    }).then((result) => {
        if (result.isConfirmed) {
            parcsStore
                .createParc(
                    id.value,
                    nomparc.value,
                    ouverture.value,
                    fermeture.value,
                    latitude.value,
                    longitude.value,
                    ticket.value,
                    img.value,
                    legende.value,
                    toilettes.value,
                    resto.value,
                    magasins.value
                )
                .then(() => {
                    Swal.fire({
                        title: "Parc ajouté",
                        text: "Le parc a bien été ajouté",
                        icon: "success",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: "Ok",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            router.push({ name: "home" });
                        }
                    });
                });
        }
    });
}

const coords = ref(null);
const fetchCoords = ref(null);
const geoMarker = ref(null);

// const img = computed(() => imageAttraction.getImagesAttraction);

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

    latitude.value = coords.coordinates[1];
    longitude.value = coords.coordinates[0];

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

const goBack = () => {
    router.go(-1);
};
</script>

<template>
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
            Ajout d'un parc d'attraction
        </h2>

        <form @submit.prevent="createParc">
            <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                <div class="hidden">
                    <label class="text-gray-700" for="id">Id du parc</label>
                    <input
                        v-if="id == ''"
                        id="id"
                        value="Veuillez choisir un parc"
                        disabled="disabled"
                        type="text"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />

                    <input
                        v-if="id != ''"
                        id="id"
                        v-model="id"
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
                        @change="ChangeNomParc($event.target.value)"
                        id="nomparc"
                        v-model="nomparc"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    >
                        <option v-for="data in recupqueuetime" :id="data.id">
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
                    <div class="form-control">
                        <label class="label cursor-pointer">
                            <span class="label-text">Toilettes</span>
                            <input
                                @change="showWC"
                                type="checkbox"
                                class="checkbox"
                            />
                        </label>
                    </div>
                    <div class="form-control">
                        <label class="label cursor-pointer">
                            <span class="label-text">Restaurants</span>
                            <input
                                @change="showResto"
                                type="checkbox"
                                class="checkbox"
                            />
                        </label>
                    </div>
                    <div class="form-control">
                        <label class="label cursor-pointer">
                            <span class="label-text">Magasins</span>
                            <input
                                @change="showMagasins"
                                type="checkbox"
                                class="checkbox"
                            />
                        </label>
                    </div>
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
            </div>

            <MapSearchParc
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
                <label class="text-gray-700" for="legende">Légendes</label>

                <textarea
                    id="legende"
                    v-model="legende"
                    rows="5"
                    class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                />
            </div>

            <div class="flex justify-end mt-6">
                <button
                    type="submit"
                    class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#344d59] rounded-md hover:stone-600 focus:outline-none focus:bg-[#344d59]"
                >
                    Ajouter le parc
                </button>
            </div>
        </form>
    </section>
</template>
