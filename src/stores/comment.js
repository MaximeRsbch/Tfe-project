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
        async comment(content) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "http://localhost:3000/api/comment",
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
        async recupComment() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/comments",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.commentDict = res.data;
            });
        },
    },
});
