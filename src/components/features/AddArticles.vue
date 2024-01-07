<script setup>
import { useArticlesStore } from "../../stores/articles.js";
import { useParcsStore } from "../../stores/parcs.js";
import { useUsersStore } from "../../stores/users.js";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";

const router = useRouter();

const articlesStore = useArticlesStore();
const parcsStore = useParcsStore();
const usersStore = useUsersStore();

onMounted(() => {
    parcsStore.fetchParcs();
    usersStore.fetchModoParc();
    usersStore.fetchModo();
});

const modoParc = ref("");
const modo = ref("");

setTimeout(() => {
    const userModoParcs = computed(() => usersStore.getModoParc);
    for (const data of userModoParcs.value) {
        modoParc.value = data.ref_parc;
    }

    const userModo = computed(() => usersStore.getModo);
    for (const data of userModo.value) {
        modo.value = data.ref_parc;
    }
}, 300);

const nomarticle = ref("");
const contenu = ref("");
const img = ref("");

const parcs = computed(() => parcsStore.getParcs);

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

    console.log(img.value);
};

const comment = ref(false);

const showComment = () => {
    comment.value = !comment.value;
};

const id = ref("");
const nomparc = ref("");

const ChangeNomParc = () => {
    var idParc =
        document.getElementById("nomparc").options[
            document.getElementById("nomparc").selectedIndex
        ].id;

    id.value = idParc;
};

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const role = tokenDecode.value.role;

const createArticle = async () => {
    if (
        modoParc.value === id.value ||
        modo.value == id.value ||
        role == "admin"
    ) {
        const body = await articlesStore.createArticles(
            nomarticle.value,
            contenu.value,
            img.value,
            comment.value,
            id.value
        );
        Swal.fire({
            icon: "success",
            title: "Votre article a bien été ajouté",
            showConfirmButton: true,
        });
    } else {
        Swal.fire({
            icon: "error",
            title: "Vous n'avez pas les droits pour ajouter un article",
            showConfirmButton: true,
        });
    }
};

const goBack = () => {
    router.go(-1);
};
</script>

<template>
    <div>
        <div v-if="role !== 'user'">
            <button
                @click="goBack"
                class="text-blue-500 hover:underline pl-24 pb-4"
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
            <div class="pb-10">
                <section
                    class="max-w-4xl p-6 mx-auto bg-white rounded-md shadow-md"
                >
                    <h2 class="text-lg font-semibold text-gray-700">
                        Ajout d'un article
                    </h2>

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

                        <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                            <div class="form-control">
                                <label class="label cursor-pointer">
                                    <span class="label-text">Commentaires</span>
                                    <input
                                        @change="showComment"
                                        type="checkbox"
                                        class="checkbox"
                                    />
                                </label>
                            </div>

                            <div>
                                <label class="text-gray-700" for="nomparc"
                                    >Nom du parc</label
                                >

                                <select
                                    @change="ChangeNomParc"
                                    id="nomparc"
                                    v-model="nomparc"
                                    class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                                >
                                    <option v-for="data in parcs" :id="data.id">
                                        {{ data.nom }}
                                    </option>
                                </select>
                            </div>
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
                                class="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#344d59] rounded-md hover:stone-600 focus:outline-none focus:bg-[#344d59]"
                            >
                                Ajouter l'article
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </div>
        <div v-else class="flex justify-center">
            <h2 class="text-2xl">
                Vous n'avez pas les droits pour accèder à cette page
            </h2>
        </div>
    </div>
</template>
