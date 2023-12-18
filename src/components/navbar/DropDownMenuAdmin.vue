<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import jwtDecode from "jwt-decode";

const router = useRouter();

const goToUsers = () => {
    router.push({
        name: "users",
    });
};

const goToParcs = () => {
    router.push({
        name: "parcs",
    });
};

const goToAttractions = () => {
    router.push({
        name: "attractions",
    });
};

const goToArticles = () => {
    router.push({
        name: "articles",
    });
};

const goToTickets = () => {
    router.push({
        name: "tickets",
    });
};

const isConnect = computed(() => localStorage.getItem("savedToken"));

const role = computed(() => {
    if (isConnect.value) {
        const token = localStorage.getItem("savedToken");
        const decoded = jwtDecode(token);
        return decoded.role;
    }
});
</script>
<template>
    <Menu as="div" class="relative inline-block text-left">
        <div>
            <MenuButton
                class="bg-white text-[#344d59] md:text-lg md:px-5 md:py-2 flex rounded-xl text-2xl px-7 py-2"
            >
                Admin pannel
                <svg
                    class="-mr-1 h-7 w-7 text-[#344d59]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fill-rule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clip-rule="evenodd"
                    />
                </svg>
            </MenuButton>
        </div>

        <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
        >
            <MenuItems
                class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            >
                <div class="py-1">
                    <MenuItem v-slot="{ active }">
                        <button
                            @click="goToUsers"
                            type="button"
                            :class="[
                                active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                'block w-full px-4 py-2 text-left text-sm',
                            ]"
                        >
                            Gestion users
                        </button>
                    </MenuItem>
                    <MenuItem
                        v-slot="{ active }"
                        v-if="role === 'admin' || role === 'modoParc'"
                    >
                        <button
                            @click="goToParcs"
                            type="button"
                            :class="[
                                active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                'block w-full px-4 py-2 text-left text-sm',
                            ]"
                        >
                            Gestion parcs
                        </button>
                    </MenuItem>
                    <MenuItem
                        v-slot="{ active }"
                        v-if="role === 'admin' || role === 'modoParc'"
                    >
                        <button
                            @click="goToAttractions"
                            type="button"
                            :class="[
                                active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                'block w-full px-4 py-2 text-left text-sm',
                            ]"
                        >
                            Gestion attractions
                        </button>
                    </MenuItem>
                    <MenuItem
                        v-slot="{ active }"
                        v-if="role === 'modo' || role === 'admin'"
                    >
                        <button
                            @click="goToArticles"
                            type="button"
                            :class="[
                                active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                'block w-full px-4 py-2 text-left text-sm',
                            ]"
                        >
                            Gestion articles
                        </button>
                    </MenuItem>
                    <MenuItem
                        v-slot="{ active }"
                        v-if="role === 'modo' || role === 'admin'"
                    >
                        <button
                            @click="goToTickets"
                            type="button"
                            :class="[
                                active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                'block w-full px-4 py-2 text-left text-sm',
                            ]"
                        >
                            Gestion tickets
                        </button>
                    </MenuItem>
                </div>
            </MenuItems>
        </transition>
    </Menu>
</template>
