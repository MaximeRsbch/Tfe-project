<script setup>
import { computed, onMounted } from "vue";
import { useImageStore } from "../../stores/image.js";
import { BASE_URL } from "../../common/config.js";
import { RouterLink } from "vue-router";
import { useRouter } from "vue-router";

const imageStore = useImageStore();

const router = useRouter();

onMounted(() => {
    imageStore.image();
});

const images = computed(() => imageStore.getImages);

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
            <div v-for="data in images" class="pt-10">
                <div v-for="test in data">
                    <div v-for="marche in test">
                        <div v-for="caca in marche.images">
                            <img
                                class="lg:w-full h-96 object-cover object-center rounded-lg w-full"
                                :src="`${BASE_URL}${caca.attributes.url}`"
                                alt=""
                            />
                        </div>

                        <h2 class="text-center text-4xl pt-4">
                            {{ marche.title }}
                        </h2>
                        <div class="flex justify-center">
                            <p class="pt-4 max-w-3xl text-justify">
                                {{ marche.descriptions }}
                            </p>
                        </div>
                    </div>

                    <div class="text-center pt-4 text-blue-500">
                        <RouterLink
                            v-if="test.id !== undefined"
                            v-bind:to="{
                                name: 'fullfeature',
                                params: {
                                    id: test.id,
                                },
                            }"
                            >Cliquez ici pour voir l'article complet</RouterLink
                        >
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
