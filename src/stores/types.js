import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useTypesStore = defineStore("types", {
    state: () => ({
        typesDict: {},
    }),

    getters: {
        getTypes: (state) => Object.values(state.typesDict),
    },

    actions: {
        async fetchTypes() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/typesattr/",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.typesDict = res.data.data;
            });
        },
    },
});
