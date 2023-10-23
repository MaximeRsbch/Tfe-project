<script setup>
import leaflet from "leaflet";
import { computed, onMounted, ref, watch } from "vue";
import GeoErrorModal from "./GeoErrorModal.vue";
import { Mapbox_API_KEY } from "../common/config.js";
import MapFeatures from "./MapFeatures.vue";
import { BASE_URL } from "../common/config.js";
import { useParcsStore } from "../stores/parcs.js";

const parcstore = useParcsStore();

const isConnect = computed(() => localStorage.getItem("savedToken"));

let map;

onMounted(() => {
    //init map
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

    map.on("click", function (e) {
        console.log(e.latlng);
    });

    getGeoLocation();
    parcstore.fetchParcs();
    plotInfoParc();
});

const parcs = computed(() => parcstore.getParcs);

const coords = ref(null);
const fetchCoords = ref(null);
const geoMarker = ref(null);
const geoError = ref(null);
const geoErrorMsg = ref(null);

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

const getLocErro = (err) => {
    fetchCoords.value = null;
    geoError.value = true;
    geoErrorMsg.value = err.message;
};

//Mettre sa propre localisation
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

const closeGeoError = () => {
    geoError.value = null;
    geoErrorMsg.value = null;
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
        .marker([coords.latitude, coords.longitude], {
            icon: customMarker,
        })
        .addTo(map);

    //set map view to the current location
    map.setView([coords.latitude, coords.longitude], 17);

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

const attractionMarkers = ref(null);
const showModalResults = ref(false);
// const showAttractionResults = ref(null);
// const showAttractionImage = ref(null);
// const showHeightAlone = ref(null);
// const showHeightWithAdult = ref(null);
// const showTypeAttraction = ref(null);
const showParcName = ref(null);
const showParcPrice = ref(null);
const showParcBeginHour = ref(null);
const showParcEndHour = ref(null);

const plotInfoParc = () => {
    setTimeout(() => {
        const customMarker = leaflet.icon({
            iconUrl: "../assets/img/map-marker-blue.svg",
            iconSize: [32, 32],
        });

        for (const parc of parcs.value) {
            leaflet
                .marker([parc.latitude, parc.longitude], { icon: customMarker })
                .addTo(map)
                .on("click", function (e) {
                    showModalResults.value = true;
                    showParcName.value = parc.nom;
                    showParcPrice.value = parc.ticketPrice;
                    showParcBeginHour.value = parc.beginHour;
                    showParcEndHour.value = parc.endHour;

                    //Pour attraction
                    // showAttractionResults.value = parc.nomparc;
                    // showAttractionImage.value = parc.url;
                    // showHeightAlone.value = parc.tailleminseul + "cm";
                    // showHeightWithAdult.value = parc.tailleminaccompagne + "cm";
                    // showTypeAttraction.value = parc.type;
                });
        }
    }, 500);
};

const removeAttrResults = () => {
    showModalResults.value = false;
};
</script>

<template>
    <div class="h-screen relative">
        <GeoErrorModal
            @closeGeoError="closeGeoError"
            v-if="geoError"
            :geoErrorMsg="geoErrorMsg"
        />

        <MapFeatures
            @getGeolocation="getGeoLocation"
            @plotResult="plotResult"
            @toggleSearchResults="toggleSearchResults"
            @removeResult="removeResult"
            :coords="coords"
            :fetchCoords="fetchCoords"
            :searchResults="searchResults"
        />

        <div
            v-if="showModalResults"
            class="h-screen w-full absolute z-10 flex justify-center items-start pt-[40px] bg-black/50"
        >
            <div
                class="flex flex-col bg-white w-[80%] sm:w-[450px] px-6 py-4 rounded-md"
            >
                <i
                    @click="removeAttrResults"
                    class="fa-regular fa-circle-xmark flex justify-end"
                ></i>

                <div v-if="isConnect">
                    <!-- Image pour quand c'est Sensation -->
                    <!-- <div class="grid grid-cols-2 pb-3">
                        <div class="flex justify-end">
                            <img
                                class="w-12 h-12"
                                src="/assets/img/sensation.png"
                                alt="taille minimum seul"
                            />
                        </div>
                        <div class="flex justify-start items-center">
                            <p class="text-2xl"></p>
                        </div>
                    </div> -->
                    <!-- Image pour quand c'est Famille -->
                    <!-- <div class="pb-3 grid grid-cols-2">
                        <div class="flex justify-end">
                            <img
                                class="w-12 h-12"
                                src="/assets/img/famille.png"
                                alt="taille minimum seul"
                            />
                        </div>
                        <div class="flex justify-start items-center">
                            <p class="text-2xl"></p>
                        </div>
                    </div> -->
                    <!-- Image pour quand c'est Splash -->
                    <!-- <div class="grid grid-cols-2 pb-3">
                        <div class="flex justify-end">
                            <img
                                class="w-12 h-12"
                                src="/assets/img/goutte-deau.png"
                                alt="taille minimum seul"
                            />
                        </div>
                        <div class="flex justify-start items-center">
                            <p class="text-2xl"></p>
                        </div>
                    </div> -->
                </div>
                <!--Image du parc-->
                <!-- <div>
                    <div class="grid grid-cols-2" v-for="attribute in data">
                        <div>
                            <img
                                class="sm:w-64 sm:h-40 object-cover rounded-lg w-28 h-28"
                                :src="`${BASE_URL}${info.attributes.url}`"
                                alt="Image"
                            />
                        </div>
                    </div>
                </div> -->
                <div v-if="isConnect" class="text-center">
                    <h1 class="text-4xl">{{ showParcName }}</h1>
                    <p class="text-2xl">{{ showParcPrice }}</p>
                    <p class="text-2xl">{{ showParcBeginHour }}</p>
                    <p class="text-2xl">{{ showParcEndHour }}</p>

                    <!-- <p class="text-2xl">
                        Attraction <span class="text-red-500">Fermée</span>
                    </p>
                    <p class="text-2xl pb-5">
                        Attraction <span class="text-green-500">ouverte</span>
                    </p>
                    <div class="text-2xl pt-3">
                        <p>
                            Temps d'attente :
                            <span class="text-red-500"></span>
                            minutes
                        </p>
                    </div> -->
                    <!-- <div class="text-2xl pt-3">
                        <p>
                            Temps d'attente :
                            <span class="text-orange-400"></span>
                            minutes
                        </p>
                    </div>
                    <div class="text-2xl pt-3">
                        <p>
                            Temps d'attente :
                            <span class="text-green-500">{{}}</span>
                            minutes
                        </p>
                    </div> -->
                    <!-- <div class="pt-3 grid grid-cols-2">
                        <div class="flex justify-end">
                            <img
                                class="w-20 h-20"
                                src="/assets/img/seul.png"
                                alt="taille minimum seul"
                            />
                        </div>
                        <div class="flex justify-start items-center">
                            <p class="text-2xl"></p>
                        </div>
                    </div> -->
                    <!-- <div class="pt-3 grid grid-cols-2">
                        <div class="flex justify-end">
                            <img
                                class="w-20 h-20"
                                src="/assets/img/accompgne.png"
                                alt="taille minimum seul"
                            />
                        </div>
                        <div class="flex justify-start items-center">
                            <p class="text-2xl"></p>
                        </div>
                    </div> -->
                </div>

                <div v-if="!isConnect">
                    <h2 class="text-red-600">
                        Connectez vous pour accéder à cette option !
                    </h2>
                </div>
                <p class="text-xs mb-1"></p>
            </div>
        </div>

        <div id="map" class="h-full z-[1]"></div>
    </div>
</template>
