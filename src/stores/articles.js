import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useArticlesStore = defineStore("articles", {
    state: () => ({
        articlesDict: {},
        commentsDict: {},
    }),
    getters: {
        getArticles: (state) => Object.values(state.articlesDict),
        getArticlesById: (state) => Object.values(state.articlesDict),
        getArticleComments: (state) => Object.values(state.commentsDict),
    },
    actions: {
        async fetchArticles() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/articles",
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
                url: `http://localhost:3000/api/articles/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.articlesDict = res.data;
            });
        },

        async createArticles(title, content, img) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: `http://localhost:3000/api/articles/`,
                headers: {
                    "Content-Type": "application/json",
                    "Content-Type": "multipart/form-data",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
                data: {
                    title,
                    content,
                    img,
                },
            }).then((res) => {
                this.articlesDict = res.data;
                console.log(this.articlesDict);
            });
        },

        async fetchArticleComments(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/commentsart/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.commentsDict = res.data.data;
                console.log(this.commentsDict);
            });
        },

        async deleteArticle(id) {
            const response = await CapacitorHttp.request({
                method: "DELETE",
                url: `http://localhost:3000/api/articles/${id}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
            }).then((res) => {
                this.articlesDict = res.data;
            });
        },

        async updateArticle(id, title, content, img_url) {
            const response = await CapacitorHttp.request({
                method: "PUT",
                url: `http://localhost:3000/api/articles/${id}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
                data: {
                    title,
                    content,
                    img_url,
                },
            }).then((res) => {
                this.articlesDict = res.data;
                console.log(this.articlesDict);
            });
        },
    },
});
