<script setup>
import { ref, onMounted, computed } from "vue";
import { useParcsStore } from "../../../stores/parcs.js";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";
import jwtDecode from "jwt-decode";

const parcsStore = useParcsStore();

const route = useRoute();
const router = useRouter();

const idParc = route.params.id;

onMounted(() => {
    parcsStore.fetchParcById(idParc);
});

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const role = tokenDecode.value.role;

const id = ref("");
const nomparc = ref("");
const ticket = ref("");
const ouverture = ref("");
const fermeture = ref("");
const latitude = ref("");
const longitude = ref("");

const legende = ref("");

const toilettes = ref(false);
const resto = ref(false);
const magasins = ref(false);
const commentArticle = ref(false);

const showWC = () => {
    toilettes.value = !toilettes.value;
};

const showResto = () => {
    resto.value = !resto.value;
};

const showMagasins = () => {
    magasins.value = !magasins.value;
};

setTimeout(() => {
    const parc = computed(() => parcsStore.getParcs);

    for (let i = 0; i < parc.value.length; i++) {
        if (parc.value[i].id == idParc) {
            id.value = parc.value[i].id;
            nomparc.value = parc.value[i].nom;
            ticket.value = parc.value[i].ticketPrice;
            ouverture.value = parc.value[i].beginHour;
            fermeture.value = parc.value[i].endHour;
            latitude.value = parc.value[i].latitude;
            longitude.value = parc.value[i].longitude;
            legende.value = parc.value[i].legende;
        }
    }
}, 500);

async function updateParc() {
    Swal.fire({
        title: "Êtes-vous sûr de vouloir modifier ce parc ?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Modifier`,
        denyButtonText: `Ne pas modifier`,
    }).then((result) => {
        if (result.isConfirmed) {
            parcsStore.updateParc(
                id.value,
                nomparc.value,
                ouverture.value,
                fermeture.value,
                latitude.value,
                longitude.value,
                ticket.value,
                legende.value,
                toilettes.value,
                resto.value,
                magasins.value
            );

            Swal.fire("Modifié !", "", "success");
        } else if (result.isDenied) {
            Swal.fire("Modifications non effectuées", "", "info");
        }
    });
}

const goBack = () => {
    router.go(-1);
};
</script>

<template>
    <div class="py-10">
        <section
            v-if="role !== 'user'"
            class="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md"
        >
            <button @click="goBack" class="text-blue-500 hover:underline">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    class="inline-block w-4 h-4 mr-2"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                </svg>
                Retour
            </button>
            <h2 class="text-lg font-semibold text-gray-700 pt-4">
                Modification d'un parc d'attraction
            </h2>

            <form @submit.prevent="updateParc">
                <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                    <div class="hidden">
                        <label class="text-gray-700" for="id">Id du parc</label>

                        <input
                            id="id"
                            :value="id"
                            disabled="disabled"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label class="text-gray-700" for="nomparc"
                            >Nom du parc</label
                        >

                        <input
                            id="nomparc"
                            v-model="nomparc"
                            disabled="disabled"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label class="text-gray-700" for="ticket"
                            >Prix du ticket</label
                        >
                        <input
                            id="ticket"
                            v-model="ticket"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label class="text-gray-700" for="ouverture"
                            >Heures d'ouverture</label
                        >
                        <input
                            id="ouverture"
                            v-model="ouverture"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label class="text-gray-700" for="fermeture"
                            >Heures de fermeture</label
                        >
                        <input
                            id="fermeture"
                            v-model="fermeture"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label class="text-gray-700" for="latitude"
                            >Latitude</label
                        >
                        <input
                            id="latitude"
                            disabled="disabled"
                            v-model="latitude"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label class="text-gray-700" for="longitude"
                            >Longitude</label
                        >
                        <input
                            id="longitude"
                            disabled="disabled"
                            v-model="longitude"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Toilettes</span>
                                <input
                                    @change="showWC"
                                    type="checkbox"
                                    class="checkbox"
                                />
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Restaurants</span>
                                <input
                                    @change="showResto"
                                    type="checkbox"
                                    class="checkbox"
                                />
                            </label>
                        </div>
                        <div class="form-control">
                            <label class="label cursor-pointer">
                                <span class="label-text">Magasins</span>
                                <input
                                    @change="showMagasins"
                                    type="checkbox"
                                    class="checkbox"
                                />
                            </label>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end mt-6">
                    <button
                        type="submit"
                        class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#344d59] rounded-md hover:stone-600 focus:outline-none focus:bg-[#344d59]"
                    >
                        Modifier le parc
                    </button>
                </div>
            </form>
        </section>
        <div v-if="role === 'user'" class="flex justify-center pt-10">
            <h2 class="text-2xl">
                Vous n'avez pas les droits pour accèder à cette page
            </h2>
        </div>
    </div>
</template>
