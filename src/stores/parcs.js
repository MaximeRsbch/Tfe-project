import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useParcsStore = defineStore("parcs", {
    state: () => ({
        parcsdict: {},
    }),

    getters: {
        getParcs: (state) => Object.values(state.parcsdict),
        getParcsById: (state) => Object.values(state.parcsdict),
    },

    actions: {
        async fetchParcs() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/parcs/",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.parcsdict = res.data;
            });
        },

        async createParc(
            id,
            nom,
            beginHour,
            endHour,
            latitude,
            longitude,
            ticketPrice
        ) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "http://localhost:3000/api/parcs",
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },

                data: {
                    id,
                    nom,
                    beginHour,
                    endHour,
                    latitude,
                    longitude,
                    ticketPrice,
                },
            }).then((res) => {
                this.parcsdict = res.data;
                console.log(res.data);
                console.log(localStorage.getItem("savedToken"));
            });
        },

        async fetchQueuetimeParc() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/parcs/all/queuetime",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.parcsdict = res.data;
            });
        },
    },
});
