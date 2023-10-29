<script setup>
import { useArticlesStore } from "../../stores/articles.js";
import { useUsersStore } from "../../stores/users.js";
import { onMounted, computed, ref } from "vue";
import { BASE_URL } from "../../common/config.js";
import { useRoute, useRouter } from "vue-router";

const articlesStore = useArticlesStore();
const usersStore = useUsersStore();
const route = useRoute();

const router = useRouter();

const id = route.params.id;

//Récupère l'image spécifique à l'article ouvert

const articleCom = ref("");

setTimeout(() => {
    const articleCommentaire = computed(() => articlesStore.getArticleComments);

    for (let i = 0; i < articleCommentaire.value.length; i++) {
        if (articleCommentaire.value[i].id == id) {
            articleCom.value = articleCommentaire.value[i];
        }
    }
}, 200);
const articles = ref("");

setTimeout(() => {
    const article = computed(() => articlesStore.getArticlesById);

    for (let i = 0; i < article.value.length; i++) {
        if (article.value[i].id == id) {
            articles.value = article.value[i];
        }
    }
}, 200);

onMounted(() => {
    articlesStore.fetchArticleComments(id);
    articlesStore.fetchArticleById(id);
    usersStore.fetchOneUser(articleCom.value);
});

const user = computed(() => usersStore.getUsers);

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

        <!-- Récupère et affiche les informations de l'image spécifique-->
        <div>
            <img
                class="lg:w-full h-96 object-cover object-center rounded-lg w-full"
                :src="`${BASE_URL}${articles.img_url}`"
                alt=""
            />

            <div>
                <h1 class="text-center text-4xl pt-4">
                    {{ articles.title }}
                </h1>
                <div class="flex justify-center">
                    <p class="pt-4 max-w-5xl text-center pb-5">
                        {{ articles.content }}
                    </p>
                </div>
            </div>
        </div>

        <div>
            <div>
                <h2>Espace commentaire</h2>
            </div>
            <div>
                {{ articleCom.content }}

                <div v-for="data in user">
                    <div v-for="users in data">
                        {{ users.username }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
