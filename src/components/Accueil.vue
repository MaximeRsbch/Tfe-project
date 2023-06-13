<script setup>
import leaflet from "leaflet";
import { computed, onMounted, ref } from "vue";
import GeoErrorModal from "./GeoErrorModal.vue";
import { Mapbox_API_KEY } from "../common/config.js";
import MapFeatures from "./MapFeatures.vue";
import { useQueueTimeStore } from "../stores/queuetime.js";

const queuetime = useQueueTimeStore();

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
    plotInfo();
    queuetime.fetchQueueTimeWalibi();
    queuetime.fetchQueueTimeEnergy();
});

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

const plotGeolocation = (coords) => {
    // create custom marker
    const customMarker = leaflet.icon({
        iconUrl: "../assets/map-marker-red.svg",
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
        iconUrl: "../assets/map-marker-blue.svg",
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

const queuetimeWalibi = computed(() => queuetime.getQueueTimesWalibi);

const queuetimeEnergy = computed(() => queuetime.getQueueTimesEnergy);

const walibiLocation = [
    [
        "Vampire",
        50.69977661301508,
        4.593864012988636,
        queuetimeWalibi.value[48],
    ],
    ["Radja", 50.70230283921515, 4.591885596073698, queuetimeWalibi.value[37]],
    ["Loup", 50.700759712506, 4.590341917711024, queuetimeWalibi.value[50]],
    ["Cobra", 50.70049381391455, 4.593959463970398, queuetimeWalibi.value[11]],
    ["Pulsar", 50.69935099850555, 4.590583087541805, queuetimeWalibi.value[36]],
    [
        "Calamity",
        50.699113379933955,
        4.587394287601669,
        queuetimeWalibi.value[9],
    ],
    ["Dalton", 50.69883615674339, 4.588037406936669, queuetimeWalibi.value[12]],
    [
        "Kondaa",
        50.697218045811205,
        4.5853398787353274,
        queuetimeWalibi.value[25],
    ],
];

const energyLocation = [
    [
        "hyperion",
        50.00047086880883,
        19.411556348514026,
        queuetimeEnergy.value[19],
    ],
    ["atlantis", 50.0011398047901, 19.40886341052339, queuetimeEnergy.value[7]],
    [
        "anakonda",
        50.001236351500275,
        19.405644759612045,
        queuetimeEnergy.value[12],
    ],
    [
        "zadra",
        50.001850108083175,
        19.404046162956252,
        queuetimeEnergy.value[51],
    ],
    [
        "frida",
        50.002201807760045,
        19.401203021441635,
        queuetimeEnergy.value[16],
    ],
    ["mayan", 50.001794939282796, 19.40606318423004, queuetimeEnergy.value[30]],
    [
        "boomerange",
        50.001567367270106,
        19.40847717246866,
        queuetimeEnergy.value[9],
    ],
];

const attractionMarkers = ref(null);
const showModalResults = ref(false);
const showAttractionResults = ref(null);

const plotInfo = () => {
    // create custom marker
    const customMarker = leaflet.icon({
        iconUrl: "../assets/img/marqueur-de-carte.png",
        iconSize: [35, 35],
    });

    // create a marker with coords and custom icon
    attractionMarkers.value = leaflet
        .marker([50.69977661301508, 4.593864012988636], {
            icon: customMarker,
        })
        .addTo(map);

    for (var i = 0; i < walibiLocation.length; i++) {
        leaflet
            .marker([walibiLocation[i][1], walibiLocation[i][2]])
            .addTo(map)
            .on("click", function (e) {
                showModalResults.value = true;
                if (
                    e.latlng.lat == 50.69977661301508 &&
                    e.latlng.lng == 4.593864012988636
                ) {
                    showAttractionResults.value = queuetimeWalibi.value[48];
                }
                if (
                    e.latlng.lat == 50.70230283921515 &&
                    e.latlng.lng == 4.591885596073698
                ) {
                    showAttractionResults.value = queuetimeWalibi.value[37];
                }
                if (
                    e.latlng.lat == 50.700759712506 &&
                    e.latlng.lng == 4.590341917711024
                ) {
                    showAttractionResults.value = queuetimeWalibi.value[50];
                }
                if (
                    e.latlng.lat == 50.70049381391455 &&
                    e.latlng.lng == 4.593959463970398
                ) {
                    showAttractionResults.value = queuetimeWalibi.value[11];
                }
                if (
                    e.latlng.lat == 50.69935099850555 &&
                    e.latlng.lng == 4.590583087541805
                ) {
                    showAttractionResults.value = queuetimeWalibi.value[36];
                }
                if (
                    e.latlng.lat == 50.699113379933955 &&
                    e.latlng.lng == 4.587394287601669
                ) {
                    showAttractionResults.value = queuetimeWalibi.value[9];
                }
                if (
                    e.latlng.lat == 50.69883615674339 &&
                    e.latlng.lng == 4.588037406936669
                ) {
                    showAttractionResults.value = queuetimeWalibi.value[12];
                }
                if (
                    e.latlng.lat == 50.697218045811205 &&
                    e.latlng.lng == 4.5853398787353274
                ) {
                    showAttractionResults.value = queuetimeWalibi.value[25];
                }
            });
    }

    for (var i = 0; i < energyLocation.length; i++) {
        leaflet
            .marker([energyLocation[i][1], energyLocation[i][2]])
            .addTo(map)
            .on("click", function (e) {
                showModalResults.value = true;
                if (
                    e.latlng.lat == 50.00047086880883 &&
                    e.latlng.lng == 19.411556348514026
                ) {
                    showAttractionResults.value = queuetimeEnergy.value[19];
                }
                if (
                    e.latlng.lat == 50.0011398047901 &&
                    e.latlng.lng == 19.40886341052339
                ) {
                    showAttractionResults.value = queuetimeEnergy.value[7];
                }
                if (
                    e.latlng.lat == 50.001236351500275 &&
                    e.latlng.lng == 19.405644759612045
                ) {
                    showAttractionResults.value = queuetimeEnergy.value[12];
                }
                if (
                    e.latlng.lat == 50.001850108083175 &&
                    e.latlng.lng == 19.404046162956252
                ) {
                    showAttractionResults.value = queuetimeEnergy.value[51];
                }
                if (
                    e.latlng.lat == 50.002201807760045 &&
                    e.latlng.lng == 19.401203021441635
                ) {
                    showAttractionResults.value = queuetimeEnergy.value[16];
                }
                if (
                    e.latlng.lat == 50.001794939282796 &&
                    e.latlng.lng == 19.40606318423004
                ) {
                    showAttractionResults.value = queuetimeEnergy.value[30];
                }
                if (
                    e.latlng.lat == 50.001567367270106 &&
                    e.latlng.lng == 19.40847717246866
                ) {
                    showAttractionResults.value = queuetimeEnergy.value[9];
                }
            });
    }
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
            class="h-screen w-full absolute z-10 flex justify-center items-start pt-[125px] bg-black/50"
        >
            <div
                class="flex flex-col bg-white w-[80%] sm:w-[450px] px-6 py-4 rounded-md"
            >
                <i
                    @click="removeAttrResults"
                    class="fa-regular fa-circle-xmark flex justify-end"
                ></i>
                <!-- Ici faudra mettre les images du parc, avis, étoiles et bondée ou pas -->
                <div>
                    <h1>
                        Nom de l'attraction : {{ showAttractionResults.name }}
                    </h1>
                    <p v-if="showAttractionResults.is_open == false">
                        Attraction Fermer
                    </p>
                    <p v-else>Attraction ouverte</p>
                    <p>
                        Temps d'attente :
                        {{ showAttractionResults.wait_time }} minutes
                    </p>
                </div>
                <p class="text-xs mb-1"></p>
            </div>
        </div>

        <div id="map" class="h-full z-[1]"></div>
    </div>
</template>
