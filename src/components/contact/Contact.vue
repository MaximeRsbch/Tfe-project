<script setup>
import { computed } from "vue";
import Faq from "./Faq.vue";

const isConnect = computed(() => localStorage.getItem("savedToken"));
</script>
<template>
    <div class="mx-auto container">
        <div v-if="!isConnect">
            <h2 class="flex justify-center items-center">
                Veuillez vous connecter pour accéder à cette page !
            </h2>
        </div>
        <div v-if="isConnect">
            <h1 class="text-center items-center pt-7 text-2xl">
                Vous souhaitez nous contacter ? Remplissez ce formulaire
            </h1>
            <div class="pt-10">
                <label
                    class="flex md:justify-center justify-start pl-4 md:pl-0 pb-2 text-lg"
                    >Nom</label
                >
                <div class="grid md:grid-cols-2 gap-10">
                    <div class="flex md:justify-end justify-center">
                        <input
                            class="rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                            placeholder="Nom"
                            type="text"
                        />
                    </div>
                    <div class="flex justify-center">
                        <input
                            class="rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
                            placeholder="Prénom"
                            type="text"
                        />
                    </div>
                </div>
            </div>
            <div class="pt-10">
                <label
                    class="flex md:justify-center justify-start pl-4 md:pl-0 pb-2 text-lg"
                    >Email</label
                >
                <div class="flex justify-center px-3">
                    <input
                        class="rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 w-full max-w-xl"
                        placeholder="Email"
                        type="text"
                    />
                </div>
            </div>
            <div class="pt-10">
                <label
                    class="flex md:justify-center justify-start pl-4 md:pl-0 pb-2 text-lg"
                    >Mot de passe</label
                >
                <div class="flex justify-center px-3">
                    <input
                        class="rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 w-full max-w-xl"
                        placeholder="Mot de passe"
                        type="text"
                    />
                </div>
            </div>
            <div class="pt-10">
                <Faq />
            </div>
        </div>
    </div>
</template>
