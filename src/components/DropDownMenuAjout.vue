<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import jwtDecode from "jwt-decode";

const router = useRouter();

const goToAddParc = () => {
    router.push({
        name: "parcsform",
    });
};

const goToAddResto = () => {
    router.push({
        name: "addresto",
    });
};

const goToAddMagasin = () => {
    router.push({
        name: "addmagasin",
    });
};

const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));
const role = computed(() => tokenDecode.value.role);

console.log(role.value);
</script>
<template>
    <Menu
        v-if="role !== 'user'"
        as="div"
        class="relative inline-block text-left"
    >
        <div>
            <MenuButton class="bg-white px-3 py-2 text-white rounded-md">
                <img src="/assets/img/add-icon.png" class="w-full" alt="" />
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
                            @click="goToAddParc"
                            type="button"
                            :class="[
                                active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                'block w-full px-4 py-2 text-left text-sm',
                            ]"
                        >
                            Ajout d'un parc
                        </button>
                    </MenuItem>

                    <MenuItem v-slot="{ active }">
                        <button
                            @click="goToAddResto"
                            type="button"
                            :class="[
                                active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                'block w-full px-4 py-2 text-left text-sm',
                            ]"
                        >
                            Ajout d'un restaurant
                        </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }">
                        <button
                            @click="goToAddMagasin"
                            type="button"
                            :class="[
                                active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                'block w-full px-4 py-2 text-left text-sm',
                            ]"
                        >
                            Ajout d'un magasin
                        </button>
                    </MenuItem>
                </div>
            </MenuItems>
        </transition>
    </Menu>
</template>
