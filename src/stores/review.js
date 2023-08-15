import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useReviewStore = defineStore("review", {
    state: () => ({
        reviewDict: {},
    }),
    getters: {
        getReviews: (state) => Object.values(state.reviewDict),
    },
    actions: {
        async writeReview(rating, comment, userId) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "http://maximerossbach.be/api/review",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    rating,
                    comment,
                    userId,
                },
            }).then((res) => {
                this.reviewDict = res.data;
            });
        },
    },
});
