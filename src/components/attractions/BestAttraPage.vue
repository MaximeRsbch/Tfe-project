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
const notes = ref("");

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
    //On récup les notes de chaque attraction
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
            <div class="mt-4 flex flex-col container mx-auto">
                <div class="overflow-x-auto">
                    <div
                        class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
                    >
                        <div
                            class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-md"
                        >
                            <table class="min-w-full divide-y divide-gray-300">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            class="py-3.5 pl-2 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                        >
                                            <span
                                                class="group inline-flex text-base"
                                            >
                                                Id de l'attraction
                                                <span
                                                    class="invisible ml-2 flex-none rounded-md text-gray-400 group-hover:visible group-focus:visible"
                                                >
                                                </span>
                                            </span>
                                        </th>
                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Nom de l'attraction
                                            </a>
                                        </th>

                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Descriptions
                                            </a>
                                        </th>
                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Ouverte/fermée
                                            </a>
                                        </th>
                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Note
                                            </a>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    class="divide-y divide-gray-200 bg-white"
                                >
                                    <!--Affiche les info de tous les users-->
                                    <tr
                                        v-for="data in attraction"
                                        :key="data.id"
                                        class="hover:bg-gray-100"
                                    >
                                        <td
                                            class="whitespace-nowrap py-4 px-3 text-base"
                                        >
                                            {{ data.id }}
                                        </td>
                                        <div>
                                            <td
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                {{ data.nom }}
                                            </td>
                                        </div>
                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            {{ data.description }}
                                        </td>
                                        <td
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            {{ data.is_open }}
                                        </td>
                                        <td
                                            v-for="note in data.Reviews"
                                            class="whitespace-nowrap px-3 py-4 text-base"
                                        >
                                            {{ note.rating }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
