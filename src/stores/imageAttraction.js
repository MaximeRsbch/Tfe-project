import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";
export const useImageAttractionStore = defineStore("imageAttraction", {
    state: () => ({
        imageAttractionDict: {},
    }),
    getters: {
        getImagesAttraction: (state) =>
            Object.values(state.imageAttractionDict),
    },
    actions: {
        async recupAllImageAttraction() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:7064/api/attractions?populate=*",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.imageAttractionDict = res.data.data;
            });
        },
    },
});
