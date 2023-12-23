<script setup>
import dayjs from "dayjs";
import { defineAsyncComponent, ref, reactive, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useParcsStore } from "../../stores/parcs.js";

const parcsStore = useParcsStore();

const route = useRoute();

const id = route.params.id;

onMounted(() => {
    parcsStore.fetchCalendar(id);
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
            <div v-for="data in calendar">
                <div v-for="calendrier in data">
                    <div
                        v-if="
                            `${selectedDateValue}-${selectedValues.month + 1}-${
                                selectedValues.year
                            }` === calendrier.day
                        "
                    >
                        <h1 class="text-center pt-4 pb-4">
                            {{ currentDayName }} {{ selectedDateValue }}
                            <span v-if="selectedValues.month === 11"
                                >Novembre</span
                            >
                            <span class="pl-1">{{ selectedValues.year }}</span>
                        </h1>
                        <div class="flex justify-center">
                            <hr class="w-96" />
                        </div>
                        <div class="flex justify-center pt-4">
                            <p>
                                Parc <span class="text-green-500">ouvert</span>
                            </p>
                        </div>

                        <div class="flex justify-center pt-4">
                            <p class="">
                                Heures d'ouverture :
                                <span class="text-red-500 text-sm"
                                    >{{ calendrier.beginHour }} H à
                                    {{ calendrier.endHour }} H</span
                                >
                            </p>
                        </div>
                    </div>

                    <div>
                        <span v-if="calendar.length === 0">
                            Aucune information pour cette date
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
