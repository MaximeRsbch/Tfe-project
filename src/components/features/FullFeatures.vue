<script setup>
import { useImageStore } from "../../stores/image.js";
import { onMounted, computed } from "vue";
import { BASE_URL } from "../../common/config.js";
import { useRoute } from "vue-router";
import { ref } from "vue";
import Swal from "sweetalert2";

const imageStore = useImageStore();
const route = useRoute();

const id = route.params.id;

const image = computed(() => imageStore.getImageById);

onMounted(() => {
    imageStore.imageById(id);
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
    const body = await imageStore.comment(commentContent.value);
    if (body) {
        Swal.fire({
            icon: "success",
            title: "Commentaire ajouté !",
            showConfirmButton: false,
            timer: 1500,
        });
    }
}
</script>

<template>
    <div class="mx-auto container px-4 md:px-10 lg:px-0">
        <div v-for="data in image">
            <div v-for="attributes in data">
                <div v-for="images in attributes.images">
                    <img
                        class="lg:w-full h-96 object-cover object-center rounded-lg w-full"
                        :src="`${BASE_URL}${images.attributes.url}`"
                        alt=""
                    />
                </div>
                <div>
                    <h1 class="text-center text-4xl pt-4">
                        {{ attributes.title }}
                    </h1>
                    <div class="flex justify-center">
                        <p class="pt-4 max-w-3xl text-justify">
                            {{ attributes.descriptions }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>
