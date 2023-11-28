<script setup>

document.addEventListener("DOMContentLoaded", function() {
        // Récupérez tous les inputs radio avec le nom 'rating-8'
        var radioInputs = document.getElementsByName("rating-8");

        // Ajoutez un écouteur d'événements de changement à chaque input radio
        radioInputs.forEach(function(input, index) {
            input.addEventListener("change", function() {
                // Récupérez l'index de l'input radio sélectionné et ajoutez 1 pour obtenir le nombre d'étoiles
                var rating = index + 1;
                console.log(rating);
                
            });
        });
    });
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
    <div class="rating rating-lg">
        <input
            type="radio"
            name="rating-8"
            class="mask mask-star-2 bg-orange-400"
            checked
        />
        <input
            type="radio"
            name="rating-8"
            class="mask mask-star-2 bg-orange-400"
            
        />
        <input
            type="radio"
            name="rating-8"
            class="mask mask-star-2 bg-orange-400"
        />
        <input
            type="radio"
            name="rating-8"
            class="mask mask-star-2 bg-orange-400"
        />
        <input
            type="radio"
            name="rating-8"
            class="mask mask-star-2 bg-orange-400"
        />
    </div>
</template>
