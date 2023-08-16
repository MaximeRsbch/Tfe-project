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
        async recupAllImage() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://maximerossbach.be:7064/api/articles?populate=*",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.imageDict = res.data;
            });
        },
        async recupImageById(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://maximerossbach.be:7064/api/articles/${id}?populate=*`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.imageDict = res.data;
            });
        },
    },
});
