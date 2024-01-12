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
                url: "https://maximerossbach.be/api/articles",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.articlesDict = res.data.data;
            });
        },

        async fetchAllArticles(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `https://maximerossbach.be/api/articles/all/${id}`,
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
                url: `https://maximerossbach.be/api/articles/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.articlesDict = res.data;
            });
        },

        async createArticles(title, content, img, showCommentaires, ref_parc) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: `https://maximerossbach.be/api/articles/`,
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
                    showCommentaires,
                    ref_parc,
                },
            }).then((res) => {
                this.articlesDict = res.data;
            });
        },

        async fetchArticleComments(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `https://maximerossbach.be/api/commentsart/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.commentsDict = res.data.data;
            });
        },

        async createArticleComments(content, ref_user, ref_article) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: `https://maximerossbach.be/api/commentsart/`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
                data: {
                    content,
                    ref_user,
                    ref_article,
                },
            }).then((res) => {
                this.commentsDict = res.data;
            });
        },

        async deleteArticleComments(id) {
            const response = await CapacitorHttp.request({
                method: "DELETE",
                url: `https://maximerossbach.be/api/commentsart/${id}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
            }).then((res) => {
                this.commentsDict = res.data;
            });
        },

        async deleteArticle(id) {
            const response = await CapacitorHttp.request({
                method: "DELETE",
                url: `https://maximerossbach.be/api/articles/${id}`,
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
                url: `https://maximerossbach.be/api/articles/${id}`,
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
            });
        },
    },
});
