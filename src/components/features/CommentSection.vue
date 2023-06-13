<script setup>
import { useCommentStore } from "../../stores/comment.js";
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";

const commentStore = useCommentStore();

onMounted(() => {
    commentStore.recupComment();
});

const commentContent = ref("");

async function createComment() {
    if (!commentContent.value) {
        return Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Veuillez renseigner un commentaire !",
        });
    }

    const body = await commentStore.comment(commentContent.value);

    if (commentContent.value) {
        window.location.reload();
    }
}

const comment = computed(() => commentStore.getComments);
</script>
<template>
    <div class="container mx-auto">
        <div class="pt-20">
            <div class="flex justify-center">
                <div>
                    <table class="">
                        <div v-for="data in comment">
                            <div v-for="getcomment in data">
                                <tr class="border border-stone-500 rounded-xl">
                                    {{
                                        getcomment.content
                                    }}
                                </tr>
                            </div>
                        </div>
                    </table>
                </div>
            </div>
            <div class="flex justify-center pt-10 pb-10">
                <textarea
                    class="w-full h-40 border border-stone-500 pl-4"
                    v-model="commentContent"
                    placeholder="Enter your comment"
                ></textarea>
            </div>
            <div class="flex justify-center pb-20">
                <button
                    class="bg-stone-500 text-white text-lg px-5 py-2 rounded-xl hidden lg:flex"
                    @click="createComment"
                >
                    Créer un commentaire
                </button>
            </div>
        </div>
    </div>
</template>
