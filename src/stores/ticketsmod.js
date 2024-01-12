import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useTicketsModStore = defineStore("ticketsMod", {
    state: () => ({
        ticketsdict: {},
        contactDict: {},
        reportArtDict: {},
        reportAttrDict: {},
    }),

    getters: {
        getTickets: (state) => Object.values(state.ticketsdict),
        getContact: (state) => Object.values(state.contactDict),
        getReportArt: (state) => Object.values(state.reportArtDict),
        getReportAttr: (state) => Object.values(state.reportAttrDict),
        getTicketsById: (state) => (id) => state.ticketsdict[id],
    },

    actions: {
        async fetchContact() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "https://maximerossbach.be/api/contact/",
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
                url: "https://maximerossbach.be/api/contact/",
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
                url: `https://maximerossbach.be/api/contact/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.contactDict = res.data;
            });
        },

        async fetchReportArticle() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "https://maximerossbach.be/api/reportArt/",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.reportArtDict = res.data;
            });
        },

        async createReportArticle(
            title,
            description,
            ref_user,
            ref_commentArticles
        ) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "https://maximerossbach.be/api/reportArt/",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    title,
                    description,
                    ref_user,
                    ref_commentArticles,
                },
            }).then((res) => {
                this.reportArtDict = res.data;
            });
        },

        async deleteReportArticle(id) {
            const response = await CapacitorHttp.request({
                method: "DELETE",
                url: `https://maximerossbach.be/api/reportArt/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.reportArtDict = res.data;
            });
        },

        async fetchReportAttr() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "https://maximerossbach.be/api/reportAttr/",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.reportAttrDict = res.data;
            });
        },

        async createReportAttr(title, description, ref_user, ref_review) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "https://maximerossbach.be/api/reportAttr/",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    title,
                    description,
                    ref_user,
                    ref_review,
                },
            }).then((res) => {
                this.reportAttrDict = res.data;
            });
        },

        async deleteReportAttr(id) {
            const response = await CapacitorHttp.request({
                method: "DELETE",
                url: `https://maximerossbach.be/api/reportAttr/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.reportAttrDict = res.data;
            });
        },
    },
});
