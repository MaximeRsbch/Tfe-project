<script setup>
import { useCommentStore } from "../../stores/comment.js";
import { useUsersStore } from "../../stores/users.js";
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import jwtDecode from "jwt-decode";

const commentStore = useCommentStore();
const usersStore = useUsersStore();

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const idUser = computed(() => tokenDecode.value.userID);

onMounted(() => {
    commentStore.recupAllComment();
    usersStore.fetchOneUser(idUser.value);
});

const commentContent = ref("");

//fonction qui permet de créer un commentaire
async function createComment() {
    if (!commentContent.value) {
        return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Veuillez renseigner un commentaire !",
        });
    }

    const body = await commentStore.writeComment(commentContent.value);

    if (commentContent.value) {
        window.location.reload();
    }
}

//Récupère tout les commentaires
const comment = computed(() => commentStore.getComments);

const user = computed(() => usersStore.getUsersById);

//fonction qui permet de supprimer un commentaire
const deleteComment = (id) => {
    Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, supprimer !",
        cancelButtonText: "Non, annuler !",
    }).then((result) => {
        if (result.isConfirmed) {
            commentStore.deleteComment(id);
            Swal.fire(
                "Supprimé !",
                "Votre commentaire a bien été supprimé.",
                "success"
            );
            setTimeout(function () {
                window.location.reload();
            }, 1000);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
                "Annulé",
                "Votre commentaire n'a pas été supprimé :)",
                "error"
            );
        }
    });
};
</script>
<template>
    <div class="container mx-auto">
        <div class="">
            <!-- Show all comment -->
            <div class="mt-4 flex flex-col container mx-auto">
                <div class="-my-2 overflow-x-auto sm:-mx-2">
                    <div
                        class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
                    >
                        <div
                            class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-md"
                        >
                            <table class="min-w-full divide-y divide-gray-300">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-base font-semibold text-gray-900 md:hidden"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Commentaire
                                            </a>
                                        </th>

                                        <th
                                            scope="col"
                                            class="px-3 py-3.5 text-left text-base font-semibold text-gray-900 md:hidden"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Auteur
                                            </a>
                                        </th>

                                        <th
                                            scope="col"
                                            class="lg:hidden px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                                        >
                                            <a
                                                class="group inline-flex text-base"
                                            >
                                                Suppression commentaire
                                            </a>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody
                                    class="divide-y divide-gray-200 bg-white"
                                >
                                    <tr
                                        v-for="data in comment"
                                        class="hover:bg-gray-100"
                                    >
                                        <!--Récupère tout les commentaires et les affiches-->
                                        <td
                                            class="whitespace-nowrap py-4 pl-4 pr-3 text-base font-medium text-gray-900 sm:pl-6"
                                        >
                                            <textarea
                                                class="resize-none"
                                                disabled
                                                name=""
                                                id=""
                                                cols="50"
                                                rows="3"
                                                >{{ data.content }}</textarea
                                            >
                                        </td>
                                        <td>
                                            Commentaire créé par :
                                            <span class="">Anonyme</span>
                                        </td>

                                        <!--Vérif si c'est l'admin qui est bien connecter si c'est le cas il peut supprimer-->
                                        <div v-if="tokenDecode.userID === 1">
                                            <td
                                                class="whitespace-nowrap px-3 py-4 text-base"
                                            >
                                                <button
                                                    @click="
                                                        deleteComment(data.id)
                                                    "
                                                    type="button"
                                                >
                                                    <img
                                                        class="w-5 md:w-5 lg:w-full"
                                                        src="/assets/img/poubelle.png"
                                                        alt="poubelleImg"
                                                    />
                                                </button>
                                            </td>
                                        </div>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Peut commenter si il est pas mute -->
            <div v-for="data in user">
                <div v-if="data.canComment == true">
                    <div class="flex justify-center pt-10 pb-10">
                        <textarea
                            class="w-full h-40 border border-stone-500 pl-4"
                            v-model="commentContent"
                            placeholder="Enter your comment"
                        ></textarea>
                    </div>
                    <div class="flex justify-center pb-20">
                        <button
                            class="bg-stone-500 text-white text-lg px-5 py-2 rounded-xl"
                            @click="createComment"
                        >
                            Créer un commentaire
                        </button>
                    </div>
                </div>
                <div v-if="data.canComment == false">
                    <h2 class="text-center pt-10 pb-10 text-red-600">
                        Vous n'êtes pas en mesure de commenter. Contactez
                        l'administrateur pour plus d'informations
                    </h2>
                </div>
            </div>
        </div>
    </div>
</template>
