import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useTicketsModStore = defineStore("ticketsMod", {
    state: () => ({
        ticketsdict: {},
        contactDict: {},
        reportDict: {},
    }),

    getters: {
        getTickets: (state) => Object.values(state.ticketsdict),
        getContact: (state) => Object.values(state.contactDict),
        getReport: (state) => Object.values(state.reportDict),
        getTicketsById: (state) => (id) => state.ticketsdict[id],
    },

    actions: {
        async fetchContact() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/contact/",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.contactDict = res.data;
            });
        },

        async createContact(title, description, ref_user) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "http://localhost:3000/api/contact/",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    title,
                    description,
                    ref_user,
                },
            }).then((res) => {
                this.contactDict = res.data;
            });
        },

        async deleteContact(id) {
            const response = await CapacitorHttp.request({
                method: "DELETE",
                url: `http://localhost:3000/api/contact/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.contactDict = res.data;
            });
        },

        async fetchReport() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/report/",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.reportDict = res.data;
            });
        },

        async createReport(
            title,
            description,
            ref_user,
            ref_commentArticles,
            ref_commentAttr
        ) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "http://localhost:3000/api/report/",
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
                this.reportDict = res.data;
            });
        },

        async deleteReport(id) {
            const response = await CapacitorHttp.request({
                method: "DELETE",
                url: `http://localhost:3000/api/report/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.reportDict = res.data;
            });
        },
    },
});
