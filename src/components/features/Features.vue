<script setup>
import { computed, onMounted } from "vue";
import { useImageStore } from "../../stores/image.js";
import { BASE_URL } from "../../common/config.js";
import { RouterLink } from "vue-router";
import CommentSection from "./CommentSection.vue";

const imageStore = useImageStore();

onMounted(() => {
    imageStore.recupAllImage();
});

//Récupère toutes les images de strapi
const images = computed(() => imageStore.getImages);

//Verif si l'user est co ou non
const isConnect = computed(() => localStorage.getItem("savedToken"));
</script>

<template>
    <div class="mx-auto container px-4 md:px-10 lg:px-0">
        <div v-if="!isConnect">
            <h1 class="flex justify-center items-center">
                Veuillez vous connecter pour accéder à cette page !
            </h1>
        </div>
        <div v-if="isConnect">
            <!--Récupère toutes les informations des articles et je les affiche-->
            <div v-for="data in images" class="pt-10">
                <div v-for="information in data">
                    <div v-for="attributes in information">
                        <div v-for="attribute in attributes.images">
                            <img
                                class="lg:w-full h-96 object-cover object-center rounded-lg w-full"
                                :src="`${BASE_URL}${attribute.attributes.url}`"
                                alt=""
                            />
                        </div>

                        <h2 class="text-center text-4xl pt-4">
                            {{ attributes.title }}
                        </h2>
                        <div class="flex justify-center">
                            <p class="pt-4 max-w-3xl text-justify">
                                {{ attributes.descriptions }}
                            </p>
                        </div>
                    </div>

                    <div class="text-center pt-4 text-blue-500">
                        <!--Permet d'ouvrir la page d'un article spécifique-->
                        <RouterLink
                            v-if="information.id !== undefined"
                            v-bind:to="{
                                name: 'fullfeature',
                                params: {
                                    id: information.id,
                                },
                            }"
                            >Cliquez ici pour voir l'article complet</RouterLink
                        >
                    </div>
                </div>
            </div>
            <CommentSection />
        </div>
    </div>
</template>
