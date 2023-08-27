<script setup>
import leaflet from "leaflet";
import { computed, onMounted, ref } from "vue";
import GeoErrorModal from "./GeoErrorModal.vue";
import { Mapbox_API_KEY } from "../common/config.js";
import MapFeatures from "./MapFeatures.vue";
import { useQueueTimeStore } from "../stores/queuetime.js";
import { useImageAttractionStore } from "../stores/imageAttraction.js";
import { BASE_URL } from "../common/config.js";

const queuetime = useQueueTimeStore();

const queuetimeWalibi = computed(() => queuetime.getQueueTimesWalibi);

const queuetimePlopsa = computed(() => queuetime.getQueueTimesPlopsa);

const queuetimeBobbe = computed(() => queuetime.getQueueTimesBobbe);

const queuetimeBellewaerde = computed(() => queuetime.getQueueTimesBellewaerde);

const imageAttraction = useImageAttractionStore();

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
    plotInfo();
    queuetime.fetchQueueTimeWalibi();
    queuetime.fetchQueueTimePlopsa();
    queuetime.fetchQueueTimeBobbe();
    queuetime.fetchQueueTimeBellewaerde();
    imageAttraction.recupAllImageAttraction();
});

const coords = ref(null);
const fetchCoords = ref(null);
const geoMarker = ref(null);
const geoError = ref(null);
const geoErrorMsg = ref(null);

const img = computed(() => imageAttraction.getImagesAttraction);

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

const attractionMarkers = ref(null);
const showModalResults = ref(false);
const showAttractionResults = ref(null);
const showAttractionImage = ref(null);
const showHeightAlone = ref(null);
const showHeightWithAdult = ref(null);
const showTypeAttraction = ref(null);

const plotInfo = () => {
    setTimeout(() => {
        const walibiLocation = [
            [
                "Vampire",
                50.702372411422445,
                4.591857720201637,
                48,
                7,
                130,
                130,
                "Sensation",
            ],
            [
                "Radja",
                50.69985136317578,
                4.593853283618328,
                37,
                3,
                140,
                105,
                "Splash",
            ],
            [
                "Loup",
                50.700759712506,
                4.590341917711024,
                50,
                6,
                120,
                0,
                "Sensation",
            ],
            [
                "Cobra",
                50.70049381391455,
                4.593959463970398,
                11,
                4,
                130,
                0,
                "Sensation",
            ],
            [
                "Pulsar",
                50.69935099850555,
                4.590583087541805,
                36,
                0,
                120,
                0,
                "Splash",
            ],
            [
                "Calamity",
                50.699113379933955,
                4.587394287601669,
                9,
                1,
                120,
                100,
                "Famille",
            ],
            [
                "Dalton",
                50.69883615674339,
                4.588037406936669,
                12,
                2,
                120,
                0,
                "Sensation",
            ],
            [
                "Kondaa",
                50.697218045811205,
                4.5853398787353274,
                25,
                5,
                130,
                130,
                "Sensation",
            ],
        ];

        const plopsaLocation = [
            [
                "anubis",
                51.08195218023082,
                2.5977898050843127,
                1,
                12,
                140,
                125,
                "Sensation",
            ],
            [
                "Le Dragon",
                51.07961827606858,
                2.5976966680273104,
                32,
                11,
                120,
                96,
                "Sensation",
            ],
            [
                "superSplash",
                51.08147105223425,
                2.5987686815206654,
                19,
                9,
                120,
                96,
                "Splash",
            ],

            [
                "the ride of happiness",
                51.0810527386725,
                2.5987687222263482,
                44,
                10,
                130,
                0,
                "Sensation",
            ],
            [
                "DinoSplash",
                51.07939209915142,
                2.5972908303152535,
                7,
                14,
                120,
                100,
                "Splash",
            ],
            [
                "Flyer Garde de Nuit",
                51.081339520702684,
                2.595597911398172,
                12,
                8,
                140,
                120,
                "Sensation",
            ],
            [
                "K3 Roller Skater",
                51.07998264624246,
                2.596500900290202,
                9,
                13,
                120,
                90,
                "Famille",
            ],
        ];

        const bobbeLocation = [
            [
                "Bob express",
                51.201516125046446,
                4.906511646430337,
                0,
                23,
                140,
                120,
                "Sensation",
            ],
            [
                "Les buches",
                51.20125394648134,
                4.9051919996547815,
                11,
                24,
                140,
                100,
                "Splash",
            ],
            [
                "Typhoon",
                51.19985563559918,
                4.905610424242153,
                10,
                25,
                140,
                125,
                "Sensation",
            ],
            [
                "Fury",
                51.20000353587284,
                4.906951528688855,
                2,
                26,
                130,
                0,
                "Sensation",
            ],
            [
                "Speedy bob",
                51.19995131004791,
                4.910451248158973,
                7,
                27,
                140,
                110,
                "Sensation",
            ],
            [
                "El rio",
                51.2002263369215,
                4.9102916418521545,
                1,
                28,
                140,
                120,
                "Splash",
            ],

            [
                "Terra magma",
                51.20198647001226,
                4.908089073910253,
                8,
                29,
                140,
                100,
                "Sensation",
            ],
            [
                "Dream catcher",
                51.201476438381526,
                4.91191164663274,
                9,
                30,
                130,
                110,
                "Sensation",
            ],
        ];

        const belleLocation = [
            [
                "Screaming eagle",
                50.848556918900854,
                2.946218842738849,
                25,
                21,
                140,
                0,
                "Sensation",
            ],
            [
                "Wakala",
                50.84888797995825,
                2.9477643053779836,
                31,
                17,
                120,
                100,
                "Sensation",
            ],
            [
                "Jungle Mission",
                50.84728487699255,
                2.95370341472658,
                17,
                22,
                120,
                120,
                "Sensation",
            ],
            [
                "River splash",
                50.84745331644677,
                2.955037296322738,
                24,
                20,
                120,
                90,
                "Splash",
            ],
            [
                "El volador",
                50.84754044006652,
                2.956591958144248,
                10,
                18,
                120,
                0,
                "Sensation",
            ],
            [
                "Huracan",
                50.84778438533629,
                2.9569783238040315,
                15,
                16,
                120,
                100,
                "Sensation",
            ],
            [
                "Dawson duel",
                50.84856216368863,
                2.9470471551588653,
                8,
                19,
                120,
                100,
                "Sensation",
            ],
            [
                "Bangal rapid river",
                50.848216694041774,
                2.9508988072758235,
                1,
                15,
                140,
                100,
                "Splash",
            ],
        ];

        const customMarker = leaflet.icon({
            iconUrl: "/assets/img/marqueur-de-carte.png",
            iconSize: [32, 32],
        });

        attractionMarkers.value = leaflet
            .marker([50.69977661301508, 4.593864012988636], {
                icon: customMarker,
            })
            .addTo(map);

        const createAttractionMarker = (
            attractions,
            queuetimeArray,
            imageArray
        ) => {
            for (const attraction of attractions) {
                const [
                    name,
                    lat,
                    lng,
                    attractionIndex,
                    imageIndex,
                    heightAlone,
                    heightWithAdult,
                    type,
                ] = attraction;
                leaflet
                    .marker([lat, lng])
                    .addTo(map)
                    .on("click", function (e) {
                        showModalResults.value = true;
                        showAttractionResults.value =
                            queuetimeArray[attractionIndex];
                        showAttractionImage.value = img.value[imageIndex];
                        showHeightAlone.value = heightAlone + "cm";
                        showHeightWithAdult.value = heightWithAdult + "cm";
                        showTypeAttraction.value = type;
                    });
            }
        };

        createAttractionMarker(
            walibiLocation,
            queuetimeWalibi.value,
            img.value
        );
        createAttractionMarker(
            plopsaLocation,
            queuetimePlopsa.value,
            img.value
        );
        createAttractionMarker(bobbeLocation, queuetimeBobbe.value, img.value);
        createAttractionMarker(
            belleLocation,
            queuetimeBellewaerde.value,
            img.value
        );
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
                    <!--Image pour quand c'est Sensation-->
                    <div
                        v-if="showTypeAttraction == 'Sensation'"
                        class="grid grid-cols-2 pb-3"
                    >
                        <div class="flex justify-end">
                            <img
                                class="w-12 h-12"
                                src="/assets/img/sensation.png"
                                alt="taille minimum seul"
                            />
                        </div>
                        <div class="flex justify-start items-center">
                            <p class="text-2xl">
                                {{ showTypeAttraction }}
                            </p>
                        </div>
                    </div>
                    <!--Image pour quand c'est Famille-->
                    <div
                        v-if="showTypeAttraction == 'Famille'"
                        class="pb-3 grid grid-cols-2"
                    >
                        <div class="flex justify-end">
                            <img
                                class="w-12 h-12"
                                src="/assets/img/famille.png"
                                alt="taille minimum seul"
                            />
                        </div>
                        <div class="flex justify-start items-center">
                            <p class="text-2xl">
                                {{ showTypeAttraction }}
                            </p>
                        </div>
                    </div>
                    <!--Image pour quand c'est Splash-->
                    <div
                        v-if="showTypeAttraction == 'Splash'"
                        class="grid grid-cols-2 pb-3"
                    >
                        <div class="flex justify-end">
                            <img
                                class="w-12 h-12"
                                src="/assets/img/goutte-deau.png"
                                alt="taille minimum seul"
                            />
                        </div>
                        <div class="flex justify-start items-center">
                            <p class="text-2xl">
                                {{ showTypeAttraction }}
                            </p>
                        </div>
                    </div>
                </div>
                <!--Image du parc-->
                <div v-if="isConnect" v-for="data in showAttractionImage">
                    <div class="grid grid-cols-2" v-for="attribute in data">
                        <div v-for="info in attribute.data">
                            <img
                                class="sm:w-64 sm:h-40 object-cover rounded-lg w-28 h-28"
                                :src="`${BASE_URL}${info.attributes.url}`"
                                alt="Image"
                            />
                        </div>
                    </div>
                </div>
                <div v-if="isConnect" class="text-center">
                    <h1 class="text-4xl">
                        {{ showAttractionResults.name }}
                    </h1>

                    <p
                        v-if="showAttractionResults.is_open == false"
                        class="text-2xl"
                    >
                        Attraction <span class="text-red-500">Fermée</span>
                    </p>
                    <p v-else class="text-2xl pb-5">
                        Attraction <span class="text-green-500">ouverte</span>
                    </p>
                    <div
                        class="text-2xl pt-3"
                        v-if="showAttractionResults.wait_time >= 50"
                    >
                        <p>
                            Temps d'attente :
                            <span class="text-red-500">{{
                                showAttractionResults.wait_time
                            }}</span>
                            minutes
                        </p>
                    </div>
                    <div
                        class="text-2xl pt-3"
                        v-if="
                            showAttractionResults.wait_time < 50 &&
                            showAttractionResults.wait_time >= 30
                        "
                    >
                        <p>
                            Temps d'attente :
                            <span class="text-orange-400">{{
                                showAttractionResults.wait_time
                            }}</span>
                            minutes
                        </p>
                    </div>
                    <div
                        class="text-2xl pt-3"
                        v-if="showAttractionResults.wait_time < 30"
                    >
                        <p>
                            Temps d'attente :
                            <span class="text-green-500">{{
                                showAttractionResults.wait_time
                            }}</span>
                            minutes
                        </p>
                    </div>
                    <div class="pt-3 grid grid-cols-2">
                        <div class="flex justify-end">
                            <img
                                class="w-20 h-20"
                                src="/assets/img/seul.png"
                                alt="taille minimum seul"
                            />
                        </div>
                        <div class="flex justify-start items-center">
                            <p class="text-2xl">
                                {{ showHeightAlone }}
                            </p>
                        </div>
                    </div>
                    <div class="pt-3 grid grid-cols-2">
                        <div class="flex justify-end">
                            <img
                                class="w-20 h-20"
                                src="/assets/img/accompgne.png"
                                alt="taille minimum seul"
                            />
                        </div>
                        <div class="flex justify-start items-center">
                            <p class="text-2xl">
                                {{ showHeightWithAdult }}
                            </p>
                        </div>
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
