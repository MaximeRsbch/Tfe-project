<script setup>
import { useArticlesStore } from "../../stores/articles.js";
import { onMounted, computed } from "vue";
import { BASE_URL } from "../../common/config.js";
import { useRoute, useRouter } from "vue-router";

const articlesStore = useArticlesStore();
const route = useRoute();

const router = useRouter();

const id = route.params.id;

//Récupère l'image spécifique à l'article ouvert
const articles = computed(() => articlesStore.getArticlesById);

onMounted(() => {
    articlesStore.fetchArticleById(id);
});

const goToFeatures = () => {
    router.push({ name: "features" });
};
</script>

<template>
    <div class="mx-auto container px-4 md:px-10 lg:px-0">
        <div class="mt-10 pl-4">
            <button @click="goToFeatures">
                <img
                    src="/assets/img/fleche.png"
                    alt="Retour aux articles"
                    class="w-20 mr-2"
                />
            </button>
        </div>
        <!--Récupère et affiche les informations de l'image spécifique-->
        <div v-for="data in articles">
            <img
                class="lg:w-full h-96 object-cover object-center rounded-lg w-full"
                :src="`${BASE_URL}${data.img_url}`"
                alt=""
            />

            <div>
                <h1 class="text-center text-4xl pt-4">
                    {{ data.title }}
                </h1>
                <div class="flex justify-center">
                    <p class="pt-4 max-w-3xl text-justify pb-5">
                        {{ data.content }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
