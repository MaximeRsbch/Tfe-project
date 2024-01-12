<script setup>
import { ref } from "vue";
import { CapacitorHttp } from "@capacitor/core";
import LoadingSpinner from "../LoadingSpinner.vue";

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
};

const selectResult = (result) => {
    selectedResult.value = result;

    emit("plotResult", result.geometry);
};
</script>
<template>
    <div
        class="w-full md:w-auto absolute md:top-[570px] md:left-[200px] lg:top-[600px] lg:left-[330px] xl:top-[685px] xl:left-[530px] z-[2] flex gap-4 px-6 py-8 md:px-0 md:py-0 bg-transparent"
    >
        <!-- Search-->
        <div class="relative flex-1 md:min-w-[400px]">
            <!-- Input-->
            <div class="pt-10">
                <input
                    v-model="searchQuery"
                    class="pl-9 pr-4 py-3 text-sm focus:outline-none w-[240px] sm:w-full shadow-md rounded-md"
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
                            <p class="text-xs">{{ result.place_name_fr }}</p>
                        </div>
                    </div>
                </div>
                <!-- Selected Search Result -->
                <!-- <div
                    v-if="selectedResult"
                    class="mt-2 px-4 py-3 bg-white rounded-md"
                >
                    <i
                        @click="removeResults"
                        class="fa-regular fa-circle-xmark flex justify-end"
                    ></i>
                </div> -->
            </div>
        </div>
    </div>
</template>
