<script setup>
import { ref } from "vue";
import { CapacitorHttp } from "@capacitor/core";
import LoadingSpinner from "../components/LoadingSpinner.vue";
import { useParcsStore } from "../stores/parcs.js";

const props = defineProps({
    coords: Object,
    fetchCoords: Boolean,
    searchResults: Boolean,
});

const emit = defineEmits(["plotResult"], ["removeResult"]);

const searchQuery = ref(null);
const searchData = ref(null);
const queryTimeout = ref(null);
const selectedResult = ref(null);

const search = () => {
    clearTimeout(queryTimeout.value);

    searchData.value = null;
    queryTimeout.value = setTimeout(async () => {
        if (searchQuery.value !== "") {
            const params = new URLSearchParams({
                fuzzyMatch: true,
                language: "fr",
                limit: 10,
                proximity: props.coords
                    ? `${props.coords.lng},${props.coords.lat}`
                    : "0,0",
            });
            const getData = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/parcs/`,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            searchData.value = getData.data.data;
        }
    }, 750);
};

const selectResult = (result) => {
    selectedResult.value = result;
    emit("plotResult", {
        latitude: result.latitude,
        longitude: result.longitude,
    });
};

const removeResults = () => {
    selectedResult.value = null;
    emit("removeResult");
};

const goToPark = () => {
    window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${selectedResult.value.latitude},${selectedResult.value.longitude}`
    );
};
</script>
<template>
    <div
        class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2] flex gap-4 px-6 py-8 md:px-0 md:py-0 bg-transparent"
    >
        <!-- Search-->
        <div class="relative flex-1 md:min-w-[350px]">
            <!-- Input-->
            <div class="pt-10">
                <input
                    v-model="searchQuery"
                    class="pl-9 pr-4 py-3 text-sm focus:outline-none w-full shadow-md rounded-md"
                    type="text"
                    placeholder="Start your search"
                    @input="search"
                    @focus="$emit('toggleSearchResults')"
                />
            </div>
            <!-- search icon-->
            <div
                class="absolute top-0 left-[8px] h-full flex items-center pt-10"
            >
                <i class="fa-solid fa-magnifying-glass"></i>
            </div>
            <!-- Search result-->
            <div class="absolute mt-2 w-full">
                <!--Result-->
                <div
                    v-if="searchQuery && searchResults"
                    class="h-[200px] overflow-scroll bg-white rounded-md"
                >
                    <!-- Loading -->
                    <LoadingSpinner v-if="!searchData" />
                    <div v-else>
                        <div
                            class="px-4 py-2 flex gap-x-2 cursor-pointer hover:bg-slate-600 hover:text-white"
                            v-for="(result, index) in searchData"
                            :key="index"
                            @click="selectResult(result)"
                        >
                            <i class="fa-sharp fa-solid fa-location-dot"></i>
                            <p class="text-xs">{{ result.nom }}</p>
                        </div>
                    </div>
                </div>
                <!-- Selected Search Result -->
                <div
                    v-if="selectedResult"
                    class="mt-2 px-4 py-3 bg-white rounded-md"
                >
                    <i
                        @click="removeResults"
                        class="fa-regular fa-circle-xmark flex justify-end"
                    ></i>

                    <h1 class="text-lg">{{ selectedResult.nom }}</h1>
                    <!-- <div class="flex justify-center">
                        Acheter billets walibi
                        <a
                            v-if="selectedResult"
                            class="text-blue-500"
                            href="https://www.walibi.be/fr"
                            target="_blank"
                        >
                            Achetez vos tickets
                        </a>
                        Acheter billets Plopsa
                        <a
                            v-if="selectedResult"
                            class="text-blue-500"
                            href="https://www.plopsalanddepanne.be/fr/tickets"
                            target="_blank"
                        >
                            Achetez vos tickets
                        </a>
                        Acheter billets Bobbejaanland
                        <a
                            v-if="selectedResult"
                            class="text-blue-500"
                            href="https://www.bobbejaanland.be/tickets"
                            target="_blank"
                        >
                            Achetez vos tickets
                        </a>
                        Acheter billets bellewaerde
                        <a
                            v-if="selectedResult"
                            class="text-blue-500"
                            href="https://www.bellewaerde.be/park/nl/tickets"
                            target="_blank"
                        >
                            Achetez vos tickets
                        </a>
                    </div> -->

                    <p class="text-xs mb-1">
                        {{ selectedResult.beginHour }},
                        {{ selectedResult.endHour }},
                    </p>
                    <p class="text-xs">
                        {{ selectedResult.ticketPrice }}
                    </p>
                    <div class="flex justify-center pt-4">
                        <button
                            class="bg-stone-500 text-white text-lg px-5 py-2 rounded-xl"
                            target="_blank"
                            @click="goToPark"
                        >
                            Démarrer la navigation
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Geolocation-->
        <div class="pt-10">
            <div
                class="px-4 bg-white flex items-center shadow-md rounded-md min-h-[45px]"
                :class="{ 'bg-black': coords }"
            >
                <i
                    class="fas fa-location-arrow text-slate-600 text-[18px]"
                    :class="{
                        'text-salte-600': coords,
                        'animate-pulse': fetchCoords,
                    }"
                    @click="$emit('getGeolocation')"
                ></i>
            </div>
        </div>
    </div>
</template>
