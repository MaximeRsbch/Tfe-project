import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useArticlesStore = defineStore("articles", {
    state: () => ({
        articlesDict: {},
    }),
    getters: {
        getArticles: (state) => Object.values(state.articlesDict),
        getArticlesById: (state) => Object.values(state.articlesDict),
    },
    actions: {
        async fetchArticles() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/articles?populate=*",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.articlesDict = res.data.data;
            });
        },

        async fetchArticleById(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/articles/${id}?populate=*`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.articlesDict = res.data.data;
            });
        },
    },
});
