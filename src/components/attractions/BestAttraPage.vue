<script setup>
import { ref, computed, onMounted } from "vue";
import { useParcsStore } from "../../stores/parcs.js";
import { useAttractionsStore } from "../../stores/attractions.js";

const parcsStore = useParcsStore();
const attractionsStore = useAttractionsStore();

onMounted(() => {
    parcsStore.fetchParcs();
});

const parc = ref("");
const attraction = ref("");

const parcs = computed(() => parcsStore.getParcs);

const choixParc = () => {
    //On récup l'id du parc choisit dans le select
    const idParc =
        document.getElementById("parc").options[
            document.getElementById("parc").selectedIndex
        ].id;

    //On récup les attractions du parc choisit
    attractionsStore.fetchAttractionsParc(idParc);
    setTimeout(() => {
        const attractions = computed(() => attractionsStore.getAttractions);
        console.log(attractions.value);
        attraction.value = attractions.value;
    }, 300);
};
</script>
<template>
    <div>
        <div>
            <h1 class="text-center">Best Attractions</h1>
            <p class="text-center">
                Here are the best attractions in the world. Click on the
                attraction to see more details.
            </p>
        </div>
        <div class="pt-10">
            <h2 class="text-center">Choisissez le parc voulu :</h2>
            <div class="flex justify-center">
                <select
                    v-model="parc"
                    @change="choixParc"
                    id="parc"
                    class="block px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                >
                    <option v-for="data in parcs" :id="data.id">
                        {{ data.nom }}
                    </option>
                </select>
            </div>
        </div>
        <div>
            <div v-for="data in attraction">
                <h2>{{ data.nom }}</h2>
                <p>{{ data.description }}</p>
                <p>{{ data.is_open }}</p>
            </div>
        </div>
    </div>
</template>
