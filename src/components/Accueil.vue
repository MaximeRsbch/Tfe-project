<script setup>
import leaflet from "leaflet";
import { computed, onMounted, ref, watch } from "vue";
import GeoErrorModal from "./GeoErrorModal.vue";
import { Mapbox_API_KEY } from "../common/config.js";
import MapFeatures from "./MapFeatures.vue";
import { BASE_URL } from "../common/config.js";
import { useParcsStore } from "../stores/parcs.js";
import { useAttractionsStore } from "../stores/attractions.js";
import { useRouter } from "vue-router";

const router = useRouter();

const parcstore = useParcsStore();
const attractionstore = useAttractionsStore();

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

    getGeoLocation();
    parcstore.fetchParcs();
    attractionstore.fetchAttractions();
    plotInfoParc();
    plotInfoAttraction();
});

const parcs = computed(() => parcstore.getParcs);
const attractions = computed(() => attractionstore.getAttractions);

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
const showAttractionResults = ref(null);
const showParcResults = ref(null);

const showParcName = ref(null);
const showParcPrice = ref(null);
const showParcBeginHour = ref(null);
const showParcEndHour = ref(null);
const showParcLegende = ref(null);

const showAttractionName = ref(null);
const showHeightAlone = ref(null);
const showHeightWithAdult = ref(null);
const showTypeAttraction = ref(null);
const showWaitTime = ref(null);
const showIsOpen = ref(null);

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
                    showParcResults.value = true;
                    showParcName.value = parc.nom;
                    showParcPrice.value = parc.ticketPrice;
                    showParcBeginHour.value = parc.beginHour;
                    showParcEndHour.value = parc.endHour;
                    showParcLegende.value = parc.legende;
                });
        }
    }, 500);
};

const plotInfoAttraction = () => {
    setTimeout(() => {
        const customMarker = leaflet.icon({
            iconUrl: "../assets/img/map-marker-blue.svg",
            iconSize: [32, 32],
        });

        for (const attraction of attractions.value) {
            leaflet
                .marker([attraction.latitude, attraction.longitude], {
                    icon: customMarker,
                })
                .addTo(map)
                .on("click", function (e) {
                    showModalResults.value = true;
                    showAttractionResults.value = true;
                    showParcResults.value = false;

                    //Pour attraction

                    showAttractionName.value = attraction.nom;
                    showHeightAlone.value = attraction.minHeight;
                    showHeightWithAdult.value = attraction.maxHeight;
                    showTypeAttraction.value = attraction.ref_type;
                    showWaitTime.value = attraction.wait_time;
                    showIsOpen.value = attraction.is_open;
                });
        }
    }, 500);
};

const removeAttrResults = () => {
    showModalResults.value = false;
};

const goToAddParc = () => {
    router.push("/parcsform");
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

        <div class="z-[2] absolute top-10 md:left-[1400px]">
            <div class="">
                <button
                    @click="goToAddParc"
                    class="bg-white px-3 py-2 text-white rounded-md"
                >
                    <img
                        src="/assets/img/add-icon.png"
                        class="w-full lg:w-full"
                        alt=""
                    />
                </button>
            </div>
        </div>

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

                <div v-if="showParcResults">
                    <div v-if="isConnect" class="text-center">
                        <h1 class="text-4xl">{{ showParcName }}</h1>
                        <p class="text-2xl">{{ showParcPrice }}</p>
                        <p class="text-2xl">{{ showParcBeginHour }}</p>
                        <p class="text-2xl">{{ showParcEndHour }}</p>
                        <p class="text-2xl">{{ showParcLegende }}</p>
                    </div>
                </div>
                <div v-if="showAttractionResults">
                    <div>
                        <h2>{{ showAttractionName }}</h2>
                        <p>{{ showHeightAlone }}</p>
                        <p>{{ showHeightWithAdult }}</p>
                        <p>{{ showTypeAttraction }}</p>
                        <p>{{ showWaitTime }}</p>
                        <p>{{ showIsOpen }}</p>
                    </div>
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
