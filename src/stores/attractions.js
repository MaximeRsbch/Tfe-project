import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useAttractionsStore = defineStore("attractions", {
    state: () => ({
        attractionsDict: {},
        imagesDict: {},
    }),

    getters: {
        getAttractions: (state) => Object.values(state.attractionsDict),
        getImageAttraction: (state) => Object.values(state.imagesDict),
    },

    actions: {
        async createAttraction(
            id,
            name,
            minHeight,
            maxHeight,
            latitude,
            longitude,
            description,
            type,
            parc
        ) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "http://localhost:3000/api/attractions/",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },

                data: {
                    id,
                    name,
                    minHeight,
                    maxHeight,
                    latitude,
                    longitude,
                    description,
                    type,
                    parc,
                },
            }).then((res) => {
                this.attractionsDict = res.data;
                console.log(res);
            });
        },

        async fetchAttractions() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/attractions/",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.attractionsDict = res.data;
                console.log(res.data);
            });
        },

        async fetchAttractionsQueuetimes(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/attractions/${id}/queuetime`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.attractionsDict = res.data;
                console.log(res.data);
            });
        },

        async createImageAttraction(id, url_img) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: `http://localhost:3000/api/attractions/${id}/img`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
                data: {
                    url_img,
                },
            }).then((res) => {
                this.imagesDict = res.data;
            });
        },
    },
});
