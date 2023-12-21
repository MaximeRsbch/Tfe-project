import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useAttractionsStore = defineStore("attractions", {
    state: () => ({
        attractionsDict: {},
        commentsDict: {},
        ratingStarDict: {},
        favoriteDict: {},
    }),

    getters: {
        getAttractions: (state) => Object.values(state.attractionsDict),
        getCommentAttraction: (state) => Object.values(state.commentsDict),
        getRatingStarAttraction: (state) => Object.values(state.ratingStarDict),
        getFavoriteAttraction: (state) => Object.values(state.favoriteDict),
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
            });
        },

        async deleteAttraction(id) {
            const response = await CapacitorHttp.request({
                method: "DELETE",
                url: `http://localhost:3000/api/attractions/${id}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
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
            });
        },
        async fetchAttractionsParc(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/attractions/${id}/all`,
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

        async createImageAttraction(img, ref_attraction) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: `http://localhost:3000/api/attractions/img`,
                headers: {
                    "Content-Type": "application/json",
                    "Content-Type": "multipart/form-data",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
                data: {
                    img,
                    ref_attraction,
                },
            }).then((res) => {
                this.attractionsDict = res.data;
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
            });
        },
        async createRatingAttraction(id_user, id_attraction, note, content) {
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
                    content,
                },
            }).then((res) => {
                this.attractionsDict = res.data;
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
                url: `http://localhost:3000/api/reviews/${id}?`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.ratingStarDict = res.data.data;
            });
        },

        async createFavoriteAttraction(ref_user, ref_attraction, isFavorite) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: `http://localhost:3000/api/favoris/`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    ref_user,
                    ref_attraction,
                    isFavorite,
                },
            }).then((res) => {
                this.favoriteDict = res.data;
            });
        },

        async fetchFavoriteAttraction(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/favoris/all/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.favoriteDict = res.data.data;
            });
        },

        async deleteFavoriteAttraction(id) {
            const response = await CapacitorHttp.request({
                method: "DELETE",
                url: `http://localhost:3000/api/favoris/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.favoriteDict = res.data;
            });
        },
    },
});
