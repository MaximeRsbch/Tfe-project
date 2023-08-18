<script setup>
import "../scripts/Navbar.js";
import { useRouter } from "vue-router";
import { computed } from "vue";
import DropDownMenu from "./DropDownMenu.vue";
import jwtDecode from "jwt-decode";

const links = [
    { label: "Accueil", href: "/" },
    { label: "Nouveautés", href: "/features" },
];

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const router = useRouter();

const goToLogin = () => {
    router.push({ name: "login" });
};

const goToAdminPannel = () => {
    router.push({ name: "adminPannel" });
};
</script>
<template>
    <header class="bg-stone-500 h-[87px] lg:h-[123px]">
        <div class="px-7 h-full flex flex-col">
            <div
                class="h-full flex items-center justify-between container mx-auto"
            >
                <a href="/" class="h-full flex items-center">
                    <img
                        id="logo"
                        src="/assets/img/logo.png"
                        alt="Logo"
                        class="lg:bg-white lg:rounded-md lg:px-4 lg:py-2 md:w-24 md:h-24 w-20 lg:w-full"
                    />
                </a>
                <nav
                    main-nav
                    class="z-30 bg-stone-500 transition h-screen w-screen pb-16 lg:pb-0 left-0 top-0 fixed scale-x-0 flex flex-col lg:w-auto lg:h-auto origin-right opacity-0 lg:opacity-100 lg:static lg:scale-x-100"
                >
                    <ul
                        class="flex flex-1 justify-start items-center text-4xl md:text-2xl lg:text-sm xl:text-lg max-h-fit px-7 pt-[112px] flex-col lg:p-0 lg:flex-row gap-10 lg:gap-7 text-white lg:flex lg:justify-end lg:items-center lg:w-full lg:font-semibold"
                    >
                        <li v-for="link in links">
                            <RouterLink :to="link.href" active-class="active">{{
                                link.label
                            }}</RouterLink>
                        </li>
                        <button
                            v-if="!isConnect"
                            @click="goToLogin"
                            class="bg-white text-stone-500 text-lg px-5 py-2 rounded-xl hidden lg:flex"
                        >
                            Connexion
                        </button>

                        <DropDownMenu v-if="isConnect" />

                        <div v-if="isConnect">
                            <button
                                @click="goToAdminPannel"
                                v-if="tokenDecode.userID === 1"
                                class="bg-white text-stone-500 text-lg px-5 py-2 rounded-xl hidden lg:flex"
                            >
                                Admin pannel
                            </button>
                        </div>
                    </ul>
                    <div
                        class="flex flex-col justify-center items-center gap-6 px-7 lg:hidden text-white"
                    >
                        <div
                            class="mt-14 flex flex-col gap-2 justify-center items-center lg:hidden md:text-lg"
                        >
                            <div v-if="isConnect">
                                <button
                                    @click="goToAdminPannel"
                                    v-if="tokenDecode.userID === 1"
                                    class="bg-white text-stone-500 text-2xl px-5 py-2 rounded-xl"
                                >
                                    Admin pannel
                                </button>
                            </div>
                            <button
                                v-if="!isConnect"
                                @click="goToLogin"
                                class="bg-white text-stone-500 text-2xl px-5 py-2 rounded-xl"
                            >
                                Connexion
                            </button>
                            <button
                                v-if="isConnect"
                                @click="logout"
                                class="bg-white text-stone-500 text-2xl px-5 py-2 rounded-xl"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </nav>

                <button toggle-nav class="lg:hidden z-40">
                    <div>
                        <div
                            id="hamburger"
                            class="h-8 relative min-h-fit flex gap-2 flex-col justify-center items-end"
                        >
                            <span
                                class="transition w-6 rounded-full h-[1px] bg-white block"
                            >
                            </span>
                            <span
                                class="transition w-4 rounded-full h-[1px] bg-white block"
                            >
                            </span>
                            <span
                                class="transition w-6 rounded-full h-[1px] bg-white block"
                            ></span>
                        </div>
                    </div>

                    <span class="sr-only">Ouvrir le menu</span>
                </button>
            </div>
            <hr id="separator" class="text-white w-full hidden" />
        </div>
    </header>
</template>

<style scoped>
.active {
    border-bottom: 3px solid;
    border-color: #3a445d;
}
</style>
