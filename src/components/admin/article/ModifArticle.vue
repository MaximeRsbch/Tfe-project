<script setup>
import { ref, onMounted, computed } from "vue";
import { useArticlesStore } from "../../../stores/articles.js";
import { useRoute } from "vue-router";
import jwtDecode from "jwt-decode";

const articleStore = useArticlesStore();

const route = useRoute();

const idArticle = route.params.id;

onMounted(() => {
    articleStore.fetchArticleById(idArticle);
});

const id = ref("");
const title = ref("");
const content = ref("");
const img = ref("");

setTimeout(() => {
    const article = computed(() => articleStore.getArticles);

    for (let i = 0; i < article.value.length; i++) {
        if (article.value[i].id == idArticle) {
            id.value = article.value[i].id;
            title.value = article.value[i].title;
            content.value = article.value[i].content;
            img.value = article.value[i].img;
        }
    }
}, 500);

const imageInput = ref(null);
const saveImageToConstant = () => {
    // Récupérer l'élément d'entrée de fichier
    const selectedImage = imageInput.value.files[0];

    if (!selectedImage) {
        console.log("Aucun fichier sélectionné");
        return;
    }

    // Créer un objet FormData pour envoyer le fichier
    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("upload_preset", "vue3course");

    // Stocker le fichier dans une constante
    const imageFile = formData.get("file"); // Vous pouvez également utiliser selectedImage directement

    // Ensuite, envoyez imageFile vers le store ou utilisez-le comme nécessaire

    img.value = imageFile;

    // Vous pouvez également réinitialiser l'élément d'entrée de fichier si nécessaire
    imageInput.value = null;
};

async function updateParc() {
    const body = await articleStore.updateArticle(
        id.value,
        title.value,
        content.value,
        img.value
    );
}

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const role = tokenDecode.value.role;
</script>

<template>
    <div>
        <section
            v-if="role !== 'user'"
            class="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md"
        >
            <h2 class="text-lg font-semibold text-gray-700">
                Ajout d'un parc d'attraction
            </h2>

            <form @submit.prevent="updateParc">
                <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                    <div>
                        <label class="text-gray-700" for="id">Id du parc</label>

                        <input
                            id="id"
                            :value="id"
                            disabled="disabled"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>

                    <div>
                        <label class="text-gray-700" for="title"
                            >Titre de l'article</label
                        >

                        <input
                            id="title"
                            v-model="title"
                            disabled="disabled"
                            type="text"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        />
                    </div>
                </div>
                <div class="pt-10">
                    <label class="text-gray-700" for="legende"
                        >Contenu de l'article</label
                    >

                    <textarea
                        id="content"
                        v-model="content"
                        rows="5"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                </div>

                <div class="pt-10">
                    <input
                        id="image"
                        type="file"
                        ref="imageInput"
                        @change="saveImageToConstant"
                        class="block w-full mt-2"
                    />
                </div>

                <div class="flex justify-end mt-6">
                    <button
                        type="submit"
                        class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#344d59] rounded-md hover:stone-600 focus:outline-none focus:[#344d59]"
                    >
                        Modifier l'article
                    </button>
                </div>
            </form>
        </section>
        <div v-if="role === 'user'" class="flex justify-center pt-10">
            <h2 class="text-2xl">
                Vous n'avez pas les droits pour accèder à cette page
            </h2>
        </div>
    </div>
</template>
