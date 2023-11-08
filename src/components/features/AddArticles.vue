<script setup>
import { useArticlesStore } from "../../stores/articles.js";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const articlesStore = useArticlesStore();

const nomarticle = ref("");
const contenu = ref("");
const img = ref("");

const imageInput = ref(null); // Ajoutez cette ligne pour obtenir une référence à l'élément d'entrée de fichier

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

const createArticle = async () => {
    const body = await articlesStore.createArticles(
        nomarticle.value,
        contenu.value,
        img.value
    );
};

const goToFeatures = () => {
    router.push({ name: "features" });
};
</script>

<template>
    <div class="pl-4">
        <button @click="goToFeatures">
            <img
                src="/assets/img/fleche.png"
                alt="Retour aux articles"
                class="w-20 mr-2"
            />
        </button>
    </div>
    <section class="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md">
        <h2 class="text-lg font-semibold text-gray-700">Ajout d'un article</h2>

        <form @submit.prevent="createArticle">
            <div class="grid grid-cols-1 gap-6 mt-4">
                <div>
                    <label class="text-gray-700" for="nomparc"
                        >Titre de l'article</label
                    >

                    <input
                        id="nomarticle"
                        v-model="nomarticle"
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
                    id="contenu"
                    v-model="contenu"
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
                    class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-stone-500 rounded-md hover:stone-600 focus:outline-none focus:stone-500"
                >
                    Ajouter l'article
                </button>
            </div>
        </form>
    </section>
</template>
