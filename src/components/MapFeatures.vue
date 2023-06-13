<script setup>
import { ref } from "vue";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner.vue";

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
            const getData = await axios.get(
                `http://localhost:3000/api/search/${searchQuery.value}?${params}`
            );
            searchData.value = getData.data.features;
            console.log(searchData.value);
        }
    }, 750);
};

const selectResult = (result) => {
    selectedResult.value = result;
    emit("plotResult", result.geometry);
};

const removeResults = () => {
    selectedResult.value = null;
    emit("removeResult");
};
</script>
<template>
    <div
        class="w-full md:w-auto absolute md:top-[40px] md:left-[60px] z-[2] flex gap-4 px-6 py-8 md:px-0 md:py-0 bg-transparent"
    >
        <!-- Search-->
        <div class="relative flex-1 md:min-w-[350px]">
            <!-- Input-->
            <input
                v-model="searchQuery"
                class="pl-9 pr-4 py-3 text-sm focus:outline-none w-full shadow-md rounded-md"
                type="text"
                placeholder="Start your search"
                @input="search"
                @focus="$emit('toggleSearchResults')"
            />
            <!-- search icon-->
            <div class="absolute top-0 left-[8px] h-full flex items-center">
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
                            <p class="text-xs">{{ result.place_name_fr }}</p>
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
                    <!-- Ici faudra mettre les images du parc, avis, étoiles et bondée ou pas -->
                    <h1 class="text-lg">{{ selectedResult.text }}</h1>

                    <div class="flex justify-center pt-3">
                        <button
                            class="px-5 py-2 bg-stone-500 rounded-lg text-white"
                        >
                            Démarrer navigation
                        </button>
                    </div>
                    <div class="flex justify-center pt-3">
                        <button
                            class="px-5 py-2 bg-stone-500 rounded-lg text-white"
                        >
                            Afficher la carte complète du parc
                        </button>
                    </div>
                    <p class="text-xs mb-1">
                        {{ selectedResult.properties.address }},
                        {{ selectedResult.city }}, {{ selectedResult.state }}
                    </p>
                    <p class="text-xs">
                        {{ selectedResult.properties.category }}
                    </p>
                </div>
            </div>
        </div>
        <!-- Geolocation-->
        <div
            class="px-4 bg-white flex items-center shadow-md rounded-md min-h-[45px]"
            :class="{ 'bg-slate-600': coords }"
        >
            <i
                class="fas fa-location-arrow text-slate-600 text-[18px]"
                :class="{ 'text-white': coords, 'animate-pulse': fetchCoords }"
                @click="$emit('getGeolocation')"
            ></i>
        </div>
    </div>
</template>