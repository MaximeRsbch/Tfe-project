<script setup>
import leaflet from "leaflet";
import jwtDecode from "jwt-decode";
import { computed, onMounted, ref } from "vue";
import GeoErrorModal from "./GeoErrorModal.vue";
import MapFeatures from "./MapFeatures.vue";
import RatingStars from "./attractions/RatingStars.vue";
import { Mapbox_API_KEY } from "../common/config.js";
import { useParcsStore } from "../stores/parcs.js";
import { useAttractionsStore } from "../stores/attractions.js";
import { useUsersStore } from "../stores/users.js";
import { useRouter } from "vue-router";

const router = useRouter();

const parcstore = useParcsStore();
const attractionstore = useAttractionsStore();
const usersStore = useUsersStore();

const isConnect = computed(() => localStorage.getItem("savedToken"));

let map;

const tokenDecode = computed(() => jwtDecode(isConnect.value));
const id = computed(() => tokenDecode.value.id_user);

const showAttractionId = ref(null);

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
    usersStore.fetchOneUser(id.value);
});

const parcs = computed(() => parcstore.getParcs);
const attractions = computed(() => attractionstore.getAttractions);

const user = computed(() => usersStore.getUsersById);

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
const showModalRating = ref(false);
const showAttractionResults = ref(null);
const showParcResults = ref(null);
const showModalResto = ref(null);

const showParcName = ref(null);
const showParcPrice = ref(null);
const showParcBeginHour = ref(null);
const showParcEndHour = ref(null);
const showParcLegende = ref(null);
const showpeople = ref(null);

const showAttractionName = ref(null);
const showHeightAlone = ref(null);
const showHeightWithAdult = ref(null);
const showTypeAttraction = ref(null);
const showWaitTime = ref(null);
const showIsOpen = ref(null);
const showRatingAttraction = ref(null);
const showCommentAttraction = ref(null);
const showWC = ref(null); // Jdois encore faire que le gars est pas obliger de mettre un wc

const showResto = ref(null);
const showRestoName = ref(null);
const showRestoOpen = ref(null);
const showRestoClose = ref(null);
const showRestoDesc = ref(null);

const plotInfoParc = () => {
    setTimeout(() => {
        const customMarker = leaflet.icon({
            iconUrl: "../assets/img/map-marker-blue.svg",
            iconSize: [32, 32],
        });

        const toiletteMarker = leaflet.icon({
            iconUrl: "../assets/img/toilette.png",
            iconSize: [32, 32],
        });

        const restoMarker = leaflet.icon({
            iconUrl: "../assets/img/resto.png",
            iconSize: [32, 32],
        });

        for (const parc of parcs.value) {
            parcstore.fetchToilettes(parc.id);
            setTimeout(() => {
                const toilettes = computed(() => parcstore.getToilettes);
                for (const toilette of toilettes.value) {
                    leaflet
                        .marker([toilette.latitude, toilette.longitude], {
                            icon: toiletteMarker,
                        })
                        .addTo(map);
                }
            }, 300);
            parcstore.fetchRestaurants(parc.id);
            setTimeout(() => {
                const restaurants = computed(() => parcstore.getRestaurants);

                for (const restaurant of restaurants.value) {
                    leaflet
                        .marker([restaurant.latitude, restaurant.longitude], {
                            icon: restoMarker,
                        })
                        .addTo(map)
                        .on("click", function (e) {
                            showModalResto.value = true;

                            showRestoName.value = restaurant.name;
                            showRestoOpen.value = restaurant.beginHour;
                            showRestoClose.value = restaurant.endHour;
                            showRestoDesc.value = restaurant.description;
                        });
                }
            }, 300);
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

                    const averageWaitTime = calculateAverageWaitTime(
                        parc.Attractions
                    );
                    showpeople.value = averageWaitTime;
                });
        }
    }, 500);
};

const plotInfoAttraction = () => {
    setTimeout(() => {
        let customMarker;

        if (showIsOpen.value == true) {
            const customMarkerOpen = leaflet.icon({
                iconUrl: "../assets/img/map-marker-blue.svg",
                iconSize: [32, 32],
            });
            customMarker = customMarkerOpen;
        } else {
            const customMarkerClose = leaflet.icon({
                iconUrl: "../assets/img/map-marker-red.svg",
                iconSize: [32, 32],
            });
            customMarker = customMarkerClose;
        }

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

                    showAttractionId.value = attraction.id;
                    showAttractionName.value = attraction.nom;
                    showHeightAlone.value = attraction.minHeight;
                    showHeightWithAdult.value = attraction.maxHeight;
                    showTypeAttraction.value = attraction.ref_type;
                    showWaitTime.value = attraction.wait_time;
                    showIsOpen.value = attraction.is_open;

                    attractionstore.fetchCommentAttraction(attraction.id);
                    attractionstore.fetchRatingAttraction(attraction.id);

                    setTimeout(() => {
                        const commentAttr = computed(
                            () => attractionstore.getCommentAttraction
                        );
                        const ratingAttr = computed(
                            () => attractionstore.getRatingStarAttraction
                        );

                        showRatingAttraction.value = ratingAttr.value;
                        showCommentAttraction.value = commentAttr.value;
                    }, 300);
                });
        }
    }, 500);
};

const removeAttrResults = () => {
    showModalResults.value = false;
};

const removeRatingResults = () => {
    showModalRating.value = false;
};
const removeRestoResults = () => {
    showModalResto.value = false;
};

const goToAddParc = () => {
    router.push("/parcsform");
};

const showRatingModal = () => {
    showModalRating.value = true;
};

const content = ref("");
const etoile = ref("");

const handleRatingSelected = (rating) => {
    etoile.value = rating;
};

async function AddRating() {
    attractionstore.createCommentAttraction(
        content.value,
        id.value,
        showAttractionId.value
    );
    attractionstore.createRatingAttraction(
        id.value,
        showAttractionId.value,
        etoile.value
    );
}

const calculateAverageWaitTime = (attractions) => {
    // Vérifiez si des attractions existent
    if (attractions && attractions.length > 0) {
        // Calculez la somme des temps d'attente
        const totalWaitTime = attractions.reduce((sum, attraction) => {
            return sum + attraction.wait_time;
        }, 0);

        // Calculez la moyenne en divisant la somme par le nombre d'attractions
        const averageWaitTime = totalWaitTime / attractions.length;

        return averageWaitTime;
    }

    return "Aucune attraction disponible"; // Retournez 0 si aucune attraction n'est disponible
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
            class="h-full absolute z-10 flex justify-start items-start pt-32"
        >
            <div
                class="flex flex-col bg-white w-[80%] sm:w-[450px] px-6 py-4 rounded-md"
            >
                <i
                    @click="removeAttrResults"
                    class="fa-regular fa-circle-xmark flex justify-end"
                ></i>

                <div v-if="showParcResults">
                    <div v-if="isConnect">
                        <div>
                            <img src="assets/img/walibi.jpg" alt="" />
                        </div>
                        <div class="pt-4">
                            <h1 class="text-2xl">{{ showParcName }}</h1>
                        </div>
                        <div class="pt-40">
                            <h2 class="text-2xl">Entrée</h2>
                            <div class="grid grid-cols-2 pt-6">
                                <p class="text-xl">{{ showParcName }}</p>
                                <div class="flex justify-end pr-5">
                                    <p class="text-xl">{{ showParcPrice }}</p>
                                </div>
                            </div>
                        </div>
                        <p class="text-2xl">{{ showParcBeginHour }}</p>
                        <p class="text-2xl">{{ showParcEndHour }}</p>
                        <p class="text-2xl">{{ showParcLegende }}</p>
                        <p class="text-2xl">
                            {{ showpeople }} d'attente en moyenne
                        </p>
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
                        <div v-for="data in showRatingAttraction">
                            {{ data.rating }}
                        </div>
                        <div v-for="data in showCommentAttraction">
                            {{ data.content }}
                        </div>
                    </div>
                    <button @click="showRatingModal">Rédiger un avis</button>
                </div>

                <div v-if="!isConnect">
                    <h2 class="text-red-600">
                        Connectez vous pour accéder à cette option !
                    </h2>
                </div>
                <p class="text-xs mb-1"></p>
            </div>
        </div>

        <div
            v-if="showModalRating"
            class="h-full w-full absolute z-10 flex justify-center items-start pt-32 bg-black/50"
        >
            <div
                class="flex flex-col bg-white w-[80%] sm:w-[450px] px-6 py-4 rounded-md"
            >
                <i
                    @click="removeRatingResults"
                    class="fa-regular fa-circle-xmark flex justify-end"
                ></i>

                <div class="flex justify-center pb-5">
                    <h2 class="text-2xl">{{ showAttractionName }}</h2>
                </div>
                <div>
                    <div v-for="data in user">
                        <h2 class="text-xl">{{ data.username }}</h2>
                    </div>
                    <div>
                        <p class="text-sm">
                            Poste Public <i class="fa-solid fa-circle-info"></i>
                        </p>
                    </div>
                </div>
                <div class="flex justify-center pt-5 pb-5">
                    <RatingStars @rating-selected="handleRatingSelected" />
                </div>

                <div class="mx-auto container max-w-xl pb-10">
                    <textarea
                        v-model="content"
                        id="content"
                        placeholder="Donner votre avis sur cet attraction ;)"
                        minlength="10"
                        maxlength="500"
                        rows="5"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                </div>

                <div class="flex justify-end">
                    <button
                        @click="AddRating"
                        type="button"
                        class="px-4 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#344d59] rounded-md hover:stone-600 focus:outline-none focus:stone-500"
                    >
                        Publier
                    </button>
                </div>

                <div v-if="!isConnect">
                    <h2 class="text-red-600">
                        Connectez vous pour accéder à cette option !
                    </h2>
                </div>
                <p class="text-xs mb-1"></p>
            </div>
        </div>
        <div
            v-if="showModalResto"
            class="h-full w-full absolute z-10 flex justify-start items-start pt-32 bg-black/50"
        >
            <div
                class="flex flex-col bg-white w-[80%] sm:w-[450px] px-6 py-4 rounded-md"
            >
                <i
                    @click="removeRestoResults"
                    class="fa-regular fa-circle-xmark flex justify-end"
                ></i>

                <div class="flex justify-center pb-5">
                    <h2 class="text-2xl">{{ showRestoName }}</h2>
                </div>
                <div>
                    <p class="text-sm">
                        {{ showRestoDesc }}
                    </p>
                </div>
                <div>
                    <p>{{ showRestoOpen }}</p>
                </div>
                <div>
                    <p>{{ showRestoClose }}</p>
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
