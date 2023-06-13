<script setup>
import { useUsersStore } from "../../stores/users.js";
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";

const usersStore = useUsersStore();
</script>
<template>
    <div>
        <div class="pt-16">
            <div>
                <button class="bg-stone-500 text-white rounded-lg px-5 py-3">
                    Admin panel
                </button>
            </div>
            <div class="">
                <h2 class="pb-2 text-center">Username :</h2>
                <div class="flex justify-center">
                    <input
                        class="block l rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="text"
                        value="caca"
                    />
                </div>
            </div>
            <div class="pt-4">
                <h2 class="text-center">Email :</h2>
                <div class="flex justify-center">
                    <input
                        class="block l rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="text"
                        value="caca"
                    />
                </div>
            </div>
            <div class="pt-4">
                <h2 class="text-center">Role :</h2>
                <div class="flex justify-center">
                    <input
                        class="block l rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        type="text"
                        value="caca"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
