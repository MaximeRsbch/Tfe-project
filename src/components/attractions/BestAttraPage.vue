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

        attraction.value = attractions.value;
    }, 300);

    //On récup les notes de chaque attraction
};

const averageRatings = computed(() => {
    const result = {};

    // Loop through attractions and calculate average rating for each attraction
    attraction.value.forEach((attraction) => {
        const totalRating = attraction.Reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );
        const averageRating =
            totalRating / Math.max(attraction.Reviews.length, 1); // Prevent division by zero
        result[attraction.id] = averageRating.toFixed(2); // Round to two decimal places
    });

    return result;
});

const sortBy = ref("id");
const sortOrder = ref("asc");

const sortTable = (field) => {
    if (sortBy.value === field) {
        // If clicking on the same field, toggle sort order
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
        // If clicking on a different field, set it as the new sort field
        sortBy.value = field;
        sortOrder.value = "asc";
    }

    // Sort the attractions array based on the chosen field and order
    attraction.value.sort((a, b) => {
        const aValue =
            field === "averageRating" ? averageRatings.value[a.id] : a[field];

        const bValue =
            field === "averageRating" ? averageRatings.value[b.id] : b[field];

        if (sortOrder.value === "asc") {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });
};
</script>
<template>
    <div>
        <div class="pt-10">
            <h1 class="text-center text-4xl">Meilleures attractions</h1>
            <p class="text-center text-lg pt-2">
                Ici se trouve le classement des meilleures attractions de chaque
                parc
            </p>
        </div>
        <div class="pt-10">
            <h2 class="text-center text-lg">Choisissez le parc voulu :</h2>
            <div class="flex justify-center">
                <select
                    v-model="parc"
                    @change="choixParc"
                    id="parc"
                    class="block px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-[#344d59] focus:ring-[#344d59] focus:ring-opacity-40 focus:outline-none focus:ring"
                >
                    <option v-for="data in parcs" :id="data.id">
                        {{ data.nom }}
                    </option>
                </select>
            </div>
        </div>
        <div>
            <div class="container mx-auto">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-300">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-3 py-3.5 text-left font-semibold text-gray-900"
                                >
                                    <a class="group inline-flex"
                                        >Nom de l'attraction</a
                                    >
                                </th>
                                <th
                                    class="px-3 py-3.5 text-left font-semibold text-gray-900"
                                >
                                    <a class="group inline-flex"
                                        >Ouverte/fermée</a
                                    >
                                </th>
                                <th
                                    class="px-3 py-3.5 text-left font-semibold text-gray-900"
                                >
                                    <button
                                        @click="sortTable('averageRating')"
                                        class="group inline-flex"
                                    >
                                        Note Moyenne
                                        <span
                                            v-if="sortBy === 'averageRating'"
                                            >{{
                                                sortOrder === "asc" ? "▲" : "▼"
                                            }}</span
                                        >
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 bg-white">
                            <tr
                                v-for="data in attraction"
                                :key="data.id"
                                class="hover:bg-gray-100"
                            >
                                <td class="px-3 py-4">{{ data.nom }}</td>
                                <td class="px-3 py-4">
                                    {{ data.is_open ? "Ouverte" : "Fermée" }}
                                </td>
                                <td class="px-3 py-4">
                                    {{
                                        averageRatings[data.id] ||
                                        "Pas de note disponible"
                                    }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
