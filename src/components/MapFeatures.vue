<script setup>
import { ref } from "vue";
import { CapacitorHttp } from "@capacitor/core";
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
            const getData = await CapacitorHttp.request({
                method: "GET",
                url: `https://maximerossbach.be/api/mapbox/${searchQuery.value}?${params}`,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            searchData.value = getData.data.features;
        }
    }, 750);
    searchQuery.value = searchQuery.value.replace(/[^a-zA-Z]/g, "");
};

const selectResult = (result) => {
    selectedResult.value = result;
    emit("plotResult", result.geometry);
};
</script>
<template>
    <div
        class="w-full md:w-auto absolute md:left-[10px] md:-top-6 z-[2] flex gap-4 px-6 py-8 md:px-0 md:py-0 bg-transparent"
    >
        <!-- Search-->
        <div class="relative flex-1 md:min-w-[350px]">
            <!-- Input-->
            <div class="pt-10">
                <input
                    v-model="searchQuery"
                    class="pl-9 pr-4 py-3 text-sm focus:outline-none w-full shadow-md rounded-lg"
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
                        <div v-for="(result, index) in searchData">
                            <div
                                v-if="
                                    result.properties.category ===
                                    'amusement park, theme park, tourism'
                                "
                                class="px-4 py-2 flex gap-x-2 cursor-pointer hover:bg-slate-600 hover:text-white"
                                :key="index"
                                @click="selectResult(result)"
                            >
                                <i
                                    class="fa-sharp fa-solid fa-location-dot"
                                ></i>
                                <p class="text-xs">
                                    {{ result.text_fr }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- C'est ici que la modal vide s'affiche  -->
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
