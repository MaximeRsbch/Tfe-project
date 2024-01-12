<script setup>
import { useArticlesStore } from "../../stores/articles.js";
import { useUsersStore } from "../../stores/users.js";
import { useTicketsModStore } from "../../stores/ticketsmod.js";
import { onMounted, computed, ref } from "vue";
import { BASE_URL } from "../../common/config.js";
import jwtDecode from "jwt-decode";
import { useRoute, useRouter } from "vue-router";
import Swal from "sweetalert2";

const articlesStore = useArticlesStore();
const usersStore = useUsersStore();
const ticketsStore = useTicketsModStore();
const route = useRoute();

const router = useRouter();

const id = route.params.id;

//Récupère l'image spécifique à l'article ouvert

onMounted(() => {
    articlesStore.fetchArticleComments(id);
    articlesStore.fetchArticleById(id);
    usersStore.fetchOneUser(articleCom.value);
});

const articleCom = ref("");

const articleCommentaire = computed(() => articlesStore.getArticleComments);

setTimeout(() => {
    const articleCommentaire = computed(() => articlesStore.getArticleComments);
    for (let i = 0; i < articleCommentaire.value.length; i++) {
        if (articleCommentaire.value[i].ref_article == id) {
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

const user = computed(() => usersStore.getUsersById);

const title = ref("");
const content = ref("");
const ref_user = ref("");
const ref_article = ref("");

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const idUser = tokenDecode.value.id_user;

const role = tokenDecode.value.role;

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
        Swal.fire({
            icon: "success",
            title: "Votre commentaire a bien été ajouté",
            showConfirmButton: true,
        });
        articlesStore.fetchArticleComments(id);
    }
}

async function deleteComment(idComment) {
    Swal.fire({
        title: "Êtes-vous sûr de vouloir supprimer ce commentaire ?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Oui`,
        denyButtonText: `Non`,
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Supprimé !", "", "success");
            articlesStore.deleteArticleComments(idComment);
            setTimeout(() => {
                articleCommentaire.value = articleCommentaire.value.filter(
                    (item) => item.id !== id
                );
                articlesStore.fetchArticleComments(id);
            }, 200);
        } else if (result.isDenied) {
            Swal.fire("Annulé", "", "info");
        }
    });
}

const ModalReport = ref(false);

const openModalReport = () => {
    ModalReport.value = true;
    setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
        document.body.style.overflow = "hidden";
    }, 100);
};

const removeModalReport = () => {
    document.body.style.overflow = "auto";
    ModalReport.value = false;
};

const contentReport = ref("");

const reportComment = () => {
    if (title.value == "") {
        alert("Vous devez écrire un titre");
        return;
    }
    if (contentReport.value == "") {
        alert("Vous devez écrire un commentaire");
        return;
    } else {
        Swal.fire({
            title: "Êtes-vous sûr de vouloir signaler ce commentaire ?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `Oui`,
            denyButtonText: `Non`,
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("Signalé !", "", "success");
                ticketsStore.createReportArticle(
                    title.value,
                    contentReport.value,
                    idUser,
                    articleCom.value.id
                );
                ModalReport.value = false;
                document.body.style.overflow = "auto";
            } else if (result.isDenied) {
                Swal.fire("Annulé", "", "info");
            }
        });
    }
};

function formatCreatedAt(createdAt) {
    const date = new Date(createdAt);
    // Format the date as per your requirement
    const formattedDate = date.toLocaleString(); // Adjust the format as needed
    return formattedDate;
}

const goBack = () => {
    router.go(-1);
};
</script>

<template>
    <button
        @click="goBack"
        class="text-blue-500 pt-10 pl-4 text-xl hover:underline"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="inline-block w-4 h-4 mr-2"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
        </svg>
        Retour
    </button>

    <div class="flex justify-center">
        <img
            v-if="articles.img_url"
            :src="`${BASE_URL}/${articles.img_url.replace(/\\/g, '/')}`"
            alt="Article Image"
            class="mt-4 w-11/12 md:w-3/4 lg:w-1/2"
        />
    </div>
    <!-- Récupère et affiche les informations de l'image spécifique-->
    <div class="mx-auto container max-w-4xl">
        <div>
            <h1 class="text-center md:text-4xl text-3xl pt-4">
                {{ articles.title }}
                {{ articles.showCommentaires }}
            </h1>
            <div class="flex justify-center">
                <p class="pt-4 max-w-5xl text-center pb-5">
                    {{ articles.content }}
                </p>
            </div>
        </div>
    </div>
    <div
        v-if="articles.showCommentaires === true"
        class="flex justify-center pt-20"
    >
        <h2 class="md:text-4xl text-2xl">Espace commentaire</h2>
    </div>
    <div v-if="articles.showCommentaires === true" class="pt-10">
        <div
            class="mx-auto container max-w-xl"
            v-for="test in articleCommentaire"
        >
            <div v-for="data in user">
                <div v-for="donne in data">
                    <h3
                        v-if="donne.id == test.ref_user"
                        class="text-l font-semibold pl-4 md:pl-0"
                    >
                        {{ donne.username }}
                    </h3>
                </div>
            </div>
            <div class="flex justify-start mt-2 max-w-lg md:max-w-3xl">
                {{ test.content }}
            </div>
            <div class="grid grid-cols-2 mt-5">
                <div class="text-sm pl-4 md:pl-0">
                    {{ formatCreatedAt(test.createdAt) }}
                </div>
                <div>
                    <button
                        v-if="test.ref_user == idUser || role === 'admin'"
                        @click="deleteComment(test.id)"
                        class="bg-[#344D59] text-white rounded-md px-4 py-1"
                    >
                        Delete
                    </button>

                    <button @click="openModalReport" class="ml-4 font-bold">
                        Report
                    </button>
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
        <div class="flex justify-center items-center scroll-auto">
            <div
                v-if="ModalReport"
                class="h-screen w-full absolute z-10 flex justify-center items-center bg-black/50"
            >
                <div class="bg-white w-[80%] sm:w-[450px] px-6 py-4 rounded-md">
                    <i
                        @click="removeModalReport"
                        class="fa-regular fa-circle-xmark flex justify-end"
                    ></i>

                    <div class="flex justify-center pb-5">
                        <h2 class="text-2xl">Signaler</h2>
                    </div>

                    <div class="mx-auto container max-w-xl pb-10">
                        <input
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                            v-model="title"
                            placeholder="Raison du signalement"
                            type="text"
                        />
                    </div>

                    <div class="mx-auto container max-w-xl pb-10">
                        <textarea
                            id="content"
                            v-model="contentReport"
                            placeholder="Donner votre avis sur cet attraction ;)"
                            minlength="10"
                            maxlength="500"
                            rows="5"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div class="flex justify-end">
                        <button
                            @click="reportComment"
                            type="button"
                            class="px-4 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#344d59] rounded-md hover:stone-600 focus:outline-none focus:[#344d59]"
                        >
                            Report
                        </button>
                    </div>
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
                    class="px-4 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#344D59] rounded-md hover:stone-600 focus:outline-none focus:bg-[#344D59]"
                >
                    Ajouter
                </button>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="flex justify-center pt-10">
            <h2 class="md:text-4xl text-2xl">
                Les commentaires sont désactivés
            </h2>
        </div>
    </div>
</template>
