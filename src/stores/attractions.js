import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useAttractionsStore = defineStore("attractions", {
    state: () => ({
        attractionsDict: {},
        imagesDict: {},
        commentsDict: {},
        ratingStarDict: {},
    }),

    getters: {
        getAttractions: (state) => Object.values(state.attractionsDict),
        getImageAttraction: (state) => Object.values(state.imagesDict),
        getCommentAttraction: (state) => Object.values(state.commentsDict),
        getRatingStarAttraction: (state) => Object.values(state.ratingStarDict),
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
            });
        },

        async createImageAttraction(id, img) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: `http://localhost:3000/api/attractions/${id}/img`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
                data: {
                    id,
                    img,
                },
            }).then((res) => {
                this.imagesDict = res.data;
                console.log(res.data);
            });
        },

        async createCommentAttraction(content, ref_user, ref_attraction) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: `http://localhost:3000/api/commentsattr/`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
                data: {
                    content,
                    ref_user,
                    ref_attraction,
                },
            }).then((res) => {
                this.attractionsDict = res.data;
                console.log(res.data);
            });
        },
        async createRatingAttraction(id_user, id_attraction, note) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: `http://localhost:3000/api/reviews/`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
                data: {
                    id_user,
                    id_attraction,
                    note,
                },
            }).then((res) => {
                this.attractionsDict = res.data;
                console.log(res.data);
            });
        },

        async fetchCommentAttraction(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/commentsattr/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.commentsDict = res.data.data;
            });
        },

        async fetchRatingAttraction(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/reviews/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.ratingStarDict = res.data.data;
            });
        },
    },
});
