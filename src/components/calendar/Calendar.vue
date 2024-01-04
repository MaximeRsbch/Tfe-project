<script setup>
import dayjs from "dayjs";
import { defineAsyncComponent, ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useParcsStore } from "../../stores/parcs.js";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";

const parcsStore = useParcsStore();

const route = useRoute();

const idParc = route.params.id;

onMounted(() => {
    parcsStore.fetchCalendar(idParc);
});

const calendar = computed(() => parcsStore.getCalendar);

const Year = defineAsyncComponent(() => import("./Year.vue"));
const Month = defineAsyncComponent(() => import("./Month.vue"));
const Dates = defineAsyncComponent(() => import("./Dates.vue"));

const selectedDateValue = ref(dayjs().date());

// Ajoutez ceci dans la section <script setup>
const currentDayName = computed(() => dayjs().format("dddd"));

const selectedValues = reactive({
    month: dayjs().month(),
    year: dayjs().year(),
});

function changeMonth(v) {
    selectedDateValue.value = 0;

    if (v < 12) {
        // Si le mois est inférieur à zéro, passe à l'année précédente
        selectedValues.month = 11; // Décembre
        changeYear(selectedValues.year - 1);
    } else {
        selectedValues.month = v;

        // Si le mois dépasse décembre, passe à l'année suivante
        if (selectedValues.month == 12) {
            selectedValues.month = 0;
            changeYear(selectedValues.year + 1);
        }
    }
}

const calendarYear = ref(selectedValues.year);
function changeYear(v) {
    selectedDateValue.value = 0;
    selectedValues.year = v;
    calendarYear.value = v;
}
function changeDate(v) {
    selectedDateValue.value = v;
}

const selectedDayName = computed(() =>
    dayjs().date(selectedDateValue.value).format("dddd")
);

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const role = tokenDecode.value.role;

const deleteSelectedDate = (id) => {
    Swal.fire({
        title: "Êtes-vous sûr de vouloir supprimer cette date ?",
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer !",
    })
        .then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Supprimé !", "La date a été supprimée.", "success");
                parcsStore.deleteCalendar(idParc);
                calendar.value = calendar.value.filter(
                    (item) => item.idParc !== idParc
                );

                parcsStore.fetchCalendar(idParc);
            }
        })
        .catch((error) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Une erreur est survenue !",
            });
            console.log(error);
        });
};

const modalAddDate = ref(false);

const showModalAddDate = () => {
    modalAddDate.value = !modalAddDate.value;
};

const day = ref("");
const ouverture = ref("");
const fermeture = ref("");

const addDate = () => {
    const formattedDate = dayjs(day.value).format("DD-MM-YYYY");
    Swal.fire({
        title: "Êtes-vous sûr de vouloir supprimer cette date ?",
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimer !",
    })
        .then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Supprimé !", "La date a été supprimée.", "success");
                parcsStore.addCalendar(
                    formattedDate,
                    ouverture.value,
                    fermeture.value,
                    idParc
                );
                calendar.value = calendar.value.filter(
                    (item) => item.idParc !== idParc
                );

                modalAddDate.value = false;
                parcsStore.fetchCalendar(idParc);
            }
        })
        .catch((error) => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Une erreur est survenue !",
            });
            console.log(error);
        });
};
</script>

<template>
    <div class="flex space-x-5 pl-2 pt-2" v-bind="$attrs">
        <div class="flex flex-col flex-grow">
            <Year @selected="changeYear" :calendarYear="calendarYear" />
            <Month @selected="changeMonth" />
            <Dates
                :selectedValues="selectedValues"
                :selectedDate="selectedDateValue"
                @selected="changeDate"
            />
        </div>

        <div class="w-1/2 font-semibold">
            <div v-if="calendar.length !== 0">
                <template
                    v-if="
                        calendar.some(
                            (data) =>
                                `${selectedDateValue
                                    .toString()
                                    .padStart(2, '0')}-${(
                                    selectedValues.month + 1
                                )
                                    .toString()
                                    .padStart(2, '0')}-${
                                    selectedValues.year
                                }` === data.day
                        )
                    "
                >
                    <!-- Display park information when the selected date matches -->
                    <div v-for="data in calendar" :key="data.id">
                        <div
                            v-if="
                                `${selectedDateValue
                                    .toString()
                                    .padStart(2, '0')}-${(
                                    selectedValues.month + 1
                                )
                                    .toString()
                                    .padStart(2, '0')}-${
                                    selectedValues.year
                                }` === data.day
                            "
                        >
                            <h1 class="text-center pt-4 pb-4">
                                {{ selectedDayName }}
                                {{
                                    selectedDateValue
                                        .toString()
                                        .padStart(2, "0")
                                }}-{{
                                    (selectedValues.month + 1)
                                        .toString()
                                        .padStart(2, "0")
                                }}-
                                <span v-if="selectedValues.month === 11"
                                    >Novembre</span
                                >
                                <span>{{ selectedValues.year }}</span>
                            </h1>
                            <div class="flex justify-center">
                                <hr class="w-96" />
                            </div>
                            <div class="flex justify-center pt-4">
                                <p>
                                    Parc
                                    <span class="text-green-500">ouvert</span>
                                </p>
                            </div>

                            <div class="flex justify-center pt-4">
                                <p class="">
                                    Heures d'ouverture :
                                    <span class="text-red-500 text-sm"
                                        >{{ data.beginHour }} H à
                                        {{ data.endHour }} H</span
                                    >
                                </p>
                            </div>
                            <div class="flex justify-center pt-4">
                                <button @click="deleteSelectedDate(data.id)">
                                    Supprimer la date
                                </button>
                            </div>
                        </div>
                    </div>
                </template>

                <div v-else class="pt-10">
                    <div class="flex justify-center">
                        <span class="text-2xl"
                            >Le parc est fermé à cette date</span
                        >
                    </div>

                    <div class="pt-10 flex justify-center">
                        <button
                            v-if="role === 'admin'"
                            class=""
                            @click="showModalAddDate"
                        >
                            Ajouter une date d'ouverture
                        </button>
                    </div>
                </div>
            </div>

            <div v-else>
                <span>Aucune information disponible</span>
            </div>
        </div>
    </div>
    <div class="flex md:justify-center items-center scroll-auto">
        <div
            v-if="modalAddDate"
            class="h-screen w-full -top-1 absolute z-30 flex justify-center items-center bg-black/50"
        >
            <div class="bg-white w-[80%] sm:w-[450px] px-6 py-4 rounded-md">
                <i
                    @click="showModalAddDate"
                    class="fa-regular fa-circle-xmark flex justify-end"
                ></i>

                <div class="flex justify-center pb-4">
                    <h2 class="text-2xl">Ajout d'une date d'ouverture</h2>
                </div>

                <div>
                    <label class="text-gray-700" for="day"
                        >Date choisit :</label
                    >
                    <input
                        id="day"
                        v-model="day"
                        type="date"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                </div>

                <div class="pt-4 grid grid-cols-2">
                    <div class="pr-4">
                        <label class="text-gray-700" for="ouverture"
                            >Heure ouverture :</label
                        >
                        <input
                            id="ouverture"
                            v-model="ouverture"
                            type="time"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div class="pl-4">
                        <label class="text-gray-700" for="fermeture"
                            >Heure fermeture :</label
                        >
                        <input
                            id="fermeture"
                            v-model="fermeture"
                            type="time"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>
                </div>

                <div class="flex justify-end pt-4">
                    <button
                        @click="addDate"
                        type="button"
                        class="px-4 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#344d59] rounded-md hover:stone-600 focus:outline-none focus:stone-500"
                    >
                        Ajouter
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
