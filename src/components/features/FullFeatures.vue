<script setup>
import { useArticlesStore } from "../../stores/articles.js";
import { useUsersStore } from "../../stores/users.js";
import { onMounted, computed, ref } from "vue";
import { BASE_URL } from "../../common/config.js";
import jwtDecode from "jwt-decode";
import { useRoute, useRouter } from "vue-router";

const articlesStore = useArticlesStore();
const usersStore = useUsersStore();
const route = useRoute();

const router = useRouter();

const id = route.params.id;

//Récupère l'image spécifique à l'article ouvert

const articleCom = ref("");

const articleCommentaire = computed(() => articlesStore.getArticleComments);

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

const user = computed(() => usersStore.getUsersById);

const goToFeatures = () => {
    router.push({ name: "features" });
};

const content = ref("");
const ref_user = ref("");
const ref_article = ref("");

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const idUser = tokenDecode.value.id_user;

async function addComment() {
    if (isConnect.value == null) {
        alert("Vous devez être connecté pour ajouter un commentaire");
        return;
    }
    if (content.value == "") {
        alert("Vous devez écrire un commentaire");
        return;
    }
    ref_user.value = idUser;
    ref_article.value = id;

    const body = await articlesStore.createArticleComments(
        content.value,
        ref_user.value,
        ref_article.value
    );
    if (body === undefined) {
        alert("Votre commentaire a bien été ajouté");
        router.go();
    }
}

async function deleteComment(id) {
    const body = await articlesStore.deleteArticleComments(id);
}
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
        <div class="mx-auto container max-w-4xl">
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

        <div class="pt-20">
            <div class="flex justify-center">
                <h2 class="text-4xl">Espace commentaire</h2>
            </div>
            <div class="pt-10">
                <div
                    class="mx-auto container max-w-xl"
                    v-for="test in articleCommentaire"
                >
                    <div v-for="data in user">
                        <div v-for="donne in data">
                            <h3
                                v-if="donne.id == test.ref_user"
                                class="text-l font-semibold"
                            >
                                {{ donne.username }}
                            </h3>
                        </div>
                    </div>
                    <div class="flex justify-start mt-2">
                        {{ test.content }}
                    </div>
                    <div class="grid grid-cols-2 mt-5">
                        <div>
                            {{ test.createdAt }}
                        </div>
                        <div>
                            <button
                                @click="deleteComment(test.id)"
                                class="bg-[#344D59] text-white rounded-md px-4 py-1"
                            >
                                Delete
                            </button>

                            <button class="ml-4">Report</button>
                        </div>
                    </div>
                    <div class="relative pt-10">
                        <div
                            class="absolute inset-0 flex items-center"
                            aria-hidden="true"
                        >
                            <div class="w-full border-t border-gray-300" />
                        </div>
                    </div>
                </div>
                <div class="pt-10 mx-auto container max-w-xl pb-20">
                    <textarea
                        id="content"
                        placeholder="Donner votre avis sur cet article ;)"
                        minlength="10"
                        v-model="content"
                        rows="5"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                    <div class="flex justify-end pt-4">
                        <button
                            @click="addComment"
                            type="button"
                            class="px-4 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-stone-500 rounded-md hover:stone-600 focus:outline-none focus:stone-500"
                        >
                            Ajouter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
