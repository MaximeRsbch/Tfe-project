<script setup>
import { ref, onMounted, computed } from "vue";
import { useArticlesStore } from "../../stores/articles.js";
import { useParcsStore } from "../../stores/parcs.js";

const articlesStore = useArticlesStore();

onMounted(() => {
    articlesStore.getAllArticles();
});

const articles = computed(() => articlesStore.getArticles);
</script>

<template>
    <div>
        <div class="mx-auto container">
            <div
                v-for="article in articles"
                class="flex justify-center px-4 md:px-5 xl:px-40 pt-5"
            >
                <div
                    class="bg-white w-full inline-block border rounded-md shadow-lg pt-2 pb-2 md:w-full max-w-4xl"
                >
                    <h1 class="text-center font-semibold mx-6 md:text-start">
                        {{ article.title }}
                    </h1>
                    <div class="">
                        <p
                            class="text-center md:text-start break-words mx-6 pt-4"
                        >
                            {{ article.content }}
                        </p>
                    </div>
                    <div class="grid grid-cols-2">
                        <p class="pl-4 pt-4">Walibi</p>
                        <div class="flex justify-end">
                            <div class="grid grid-cols-2">
                                <img
                                    class="pt-4 w-4"
                                    src="assets/img/mess.png"
                                    alt=""
                                />
                                <span class="pt-3 pl-1">{{
                                    article.CommentArticles.length
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
