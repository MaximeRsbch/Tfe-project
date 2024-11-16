<script setup>
import { ref, onMounted, computed } from "vue";
import { useArticlesStore } from "../../stores/articles.js";
import { useParcsStore } from "../../stores/parcs.js";

const articlesStore = useArticlesStore();
const parcsStore = useParcsStore();

onMounted(() => {
    articlesStore.fetchArticles();
});

const articles = computed(() => articlesStore.getArticles);
const parc = ref();

setTimeout(() => {
    for (let i = 0; i < articles.value.length; i++) {
        parc.value = articles.value[i].parc_id;
    }
    console.log(parc.value);
}, 1000);
</script>

<template>
    <div>
        <div className="mx-auto container">
            <div
                v-for="article in articles"
                className="flex justify-center md:px-5 xl:px-40 pt-5"
            >
                {{ parc }}
                <div
                    className="bg-white w-72 inline-block border rounded-md shadow-lg pt-2 pb-2 md:w-full"
                >
                    <h1
                        className="text-center font-semibold mx-6 md:text-start"
                    >
                        {{ article.title }}
                    </h1>
                    <p className="mx-6 text-center md:text-start">
                        {{ article.content }}
                    </p>
                    <div className="grid grid-cols-2">
                        <p className="pl-4 pt-4">Walibi</p>
                        <div className="flex justify-end">
                            <div className="grid grid-cols-2">
                                <img
                                    className="pt-4 w-4"
                                    src="assets/img/mess.png"
                                    alt=""
                                />
                                <span className="pt-3 pl-1">2</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
