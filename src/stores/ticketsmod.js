import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useTicketsModStore = defineStore("ticketsMod", {
    state: () => ({
        ticketsdict: {},
    }),

    getters: {
        getTickets: (state) => Object.values(state.ticketsdict),
        getTicketsById: (state) => (id) => state.ticketsdict[id],
    },

    actions: {
        async fetchTickets() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/ticketsmod/",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.ticketsdict = res.data;
            });
        },

        async createTickets(
            title,
            description,
            ref_user,
            ref_commentArticles,
            ref_commentAttr
        ) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "http://localhost:3000/api/ticketsmod/",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    title,
                    description,
                    ref_user,
                    ref_commentArticles,
                    ref_commentAttr,
                },
            }).then((res) => {
                this.ticketsdict = res.data;
            });
        },
    },
});
