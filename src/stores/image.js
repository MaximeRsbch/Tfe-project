import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useImageStore = defineStore("image", {
    state: () => ({
        imageDict: {},
    }),
    getters: {
        getImages: (state) => Object.values(state.imageDict),
        getImageById: (state) => Object.values(state.imageDict),
    },
    actions: {
        async image() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:7064/api/articles?populate=*",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.imageDict = res.data;
            });
        },
        async imageById(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:7064/api/articles/${id}?populate=*`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.imageDict = res.data;
            });
        },
    },
});
