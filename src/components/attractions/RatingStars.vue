<script setup>
import { ref } from "vue";

const selectedRating = ref(1);
const emit = defineEmits(["rating-selected"]);

const setRating = (rating) => {
    selectedRating.value = rating;

    emit("rating-selected", rating);
};
</script>

<template>
    <div class="rating rating-lg rating-half">
        <input type="radio" name="rating-10" class="rating-hidden" />
        <input
            type="radio"
            name="rating-10"
            class="bg-[#344d59] mask mask-star-2 mask-half-1"
            @click="setRating(0.5)"
        />
        <input
            type="radio"
            name="rating-10"
            class="bg-[#344d59] mask mask-star-2 mask-half-2"
            @click="setRating(1)"
        />
        <input
            type="radio"
            name="rating-10"
            class="bg-[#344d59] mask mask-star-2 mask-half-1"
            @click="setRating(1.5)"
        />
        <input
            type="radio"
            name="rating-10"
            class="bg-[#344d59] mask mask-star-2 mask-half-2"
            @click="setRating(2)"
        />
        <input
            type="radio"
            name="rating-10"
            class="bg-[#344d59] mask mask-star-2 mask-half-1"
            @click="setRating(2.5)"
        />
        <input
            type="radio"
            name="rating-10"
            class="bg-[#344d59] mask mask-star-2 mask-half-2"
            @click="setRating(3)"
        />
        <input
            type="radio"
            name="rating-10"
            class="bg-[#344d59] mask mask-star-2 mask-half-1"
            @click="setRating(3.5)"
        />
        <input
            type="radio"
            name="rating-10"
            class="bg-[#344d59] mask mask-star-2 mask-half-2"
            @click="setRating(4)"
        />
        <input
            type="radio"
            name="rating-10"
            class="bg-[#344d59] mask mask-star-2 mask-half-1"
            @click="setRating(4.5)"
        />
        <input
            type="radio"
            name="rating-10"
            class="bg-[#344d59] mask mask-star-2 mask-half-2"
            @click="setRating(5)"
        />
    </div>
</template>
