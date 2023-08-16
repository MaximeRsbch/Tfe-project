import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useCommentStore = defineStore("comment", {
    state: () => ({
        commentDict: {},
    }),
    getters: {
        getComments: (state) => Object.values(state.commentDict),
    },
    actions: {
        async writeComment(content) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "http://maximerossbach.be/api/comment",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    content,
                },
            }).then((res) => {
                this.commentDict = res.data;
            });
        },
        async recupAllComment() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://maximerossbach.be/api/comments",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.commentDict = res.data.data;
            });
        },

        async deleteComment(id) {
            const response = await CapacitorHttp.request({
                method: "DELETE",
                url: `http://maximerossbach.be/api/deleteComment/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    id,
                },
            }).then((res) => {
                this.commentDict = res.data;
                console.log(res.data);
            });
        },
    },
});
