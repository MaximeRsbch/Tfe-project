import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useAttractionsStore = defineStore("attractions", {
    state: () => ({
        attractionsDict: {},
    }),

    getters: {
        getAttractions: (state) => Object.values(state.attractionsDict),
    },

    actions: {
        async createAttraction(
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
                },

                data: {
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
    },
});
