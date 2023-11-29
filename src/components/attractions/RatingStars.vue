<script setup>
import { ref } from "vue";

const selectedRating = ref(1);
const emit = defineEmits(["rating-selected"]);

const setRating = (rating) => {
    selectedRating.value = rating;
    emit("rating-selected", rating);
    // Vous pouvez faire quelque chose d'autre avec la valeur sélectionnée si nécessaire
};
</script>

<template>
    <!-- xs -->
    <!-- <div class="rating rating-xs">
        <input
            type="radio"
            name="rating-5"
            class="mask mask-star-2 bg-orange-400"
        />
        <input
            type="radio"
            name="rating-5"
            class="mask mask-star-2 bg-orange-400"
            checked
        />
        <input
            type="radio"
            name="rating-5"
            class="mask mask-star-2 bg-orange-400"
        />
        <input
            type="radio"
            name="rating-5"
            class="mask mask-star-2 bg-orange-400"
        />
        <input
            type="radio"
            name="rating-5"
            class="mask mask-star-2 bg-orange-400"
        />
    </div> -->
    <!-- sm -->
    <!-- <div class="rating rating-sm">
        <input
            type="radio"
            name="rating-6"
            class="mask mask-star-2 bg-orange-400"
        />
        <input
            type="radio"
            name="rating-6"
            class="mask mask-star-2 bg-orange-400"
            checked
        />
        <input
            type="radio"
            name="rating-6"
            class="mask mask-star-2 bg-orange-400"
        />
        <input
            type="radio"
            name="rating-6"
            class="mask mask-star-2 bg-orange-400"
        />
        <input
            type="radio"
            name="rating-6"
            class="mask mask-star-2 bg-orange-400"
        />
    </div> -->
    <!-- md -->
    <!-- <div class="rating rating-md">
        <input
            type="radio"
            name="rating-7"
            class="mask mask-star-2 bg-orange-400"
            checked
        />
        <input
            type="radio"
            name="rating-7"
            class="mask mask-star-2 bg-orange-400"
            
        />
        <input
            type="radio"
            name="rating-7"
            class="mask mask-star-2 bg-orange-400"
        />
        <input
            type="radio"
            name="rating-7"
            class="mask mask-star-2 bg-orange-400"
        />
        <input
            type="radio"
            name="rating-7"
            class="mask mask-star-2 bg-orange-400"
        />
    </div> -->
    <!-- lg -->
    <div class="rating rating-lg" id="starRating">
        <input
            type="radio"
            name="rating-8"
            class="mask mask-star-2 bg-orange-400"
            checked
            @click="setRating(1)"
        />
        <input
            type="radio"
            name="rating-8"
            class="mask mask-star-2 bg-orange-400"
            @click="setRating(2)"
        />
        <input
            type="radio"
            name="rating-8"
            class="mask mask-star-2 bg-orange-400"
            @click="setRating(3)"
        />
        <input
            type="radio"
            name="rating-8"
            class="mask mask-star-2 bg-orange-400"
            @click="setRating(4)"
        />
        <input
            type="radio"
            name="rating-8"
            class="mask mask-star-2 bg-orange-400"
            @click="setRating(5)"
        />
    </div>
</template>
