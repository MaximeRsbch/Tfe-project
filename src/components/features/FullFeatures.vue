<script setup>
import { useImageStore } from "../../stores/image.js";
import { onMounted, computed } from "vue";
import { BASE_URL } from "../../common/config.js";
import { useRoute } from "vue-router";

const imageStore = useImageStore();
const route = useRoute();

const id = route.params.id;

//Récupère l'image spécifique à l'article ouvert
const image = computed(() => imageStore.getImageById);

onMounted(() => {
    imageStore.recupImageById(id);
});
</script>

<template>
    <div class="mx-auto container px-4 md:px-10 lg:px-0">
        <!--Récupère et affiche les informations de l'image spécifique-->
        <div v-for="data in image">
            <div v-for="attributes in data">
                <div v-for="images in attributes.images">
                    <img
                        class="lg:w-full h-96 object-cover object-center rounded-lg w-full"
                        :src="`${BASE_URL}${images.attributes.url}`"
                        alt=""
                    />
                </div>
                <div>
                    <h1 class="text-center text-4xl pt-4">
                        {{ attributes.title }}
                    </h1>
                    <div class="flex justify-center">
                        <p class="pt-4 max-w-3xl text-justify pb-5">
                            {{ attributes.FullDescrib }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
