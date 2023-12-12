import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useParcsStore = defineStore("parcs", {
    state: () => ({
        parcsdict: {},
        toilettesdict: {},
        magasinsdict: {},
        restaurantsdict: {},
        secoursdict: {},
        infosdict: {},
    }),

    getters: {
        getParcs: (state) => Object.values(state.parcsdict),
        getParcsById: (state) => (id) => state.parcsdict[id],
        getToilettes: (state) => Object.values(state.toilettesdict),
        getMagasins: (state) => Object.values(state.magasinsdict),
        getRestaurants: (state) => Object.values(state.restaurantsdict),
        getSecours: (state) => Object.values(state.secoursdict),
        getInfos: (state) => Object.values(state.infosdict),
    },

    actions: {
        async fetchParcs() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/parcs/all",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.parcsdict = res.data;
            });
        },

        async fetchParcById(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/parcs/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.parcsdict = res.data;
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

        async createParc(
            id,
            nom,
            beginHour,
            endHour,
            latitude,
            longitude,
            ticketPrice,
            legende
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
                    legende,
                },
            }).then((res) => {
                this.parcsdict = res.data;
                console.log(this.parcsdict);
            });
        },

        async deleteParc(id) {
            const response = await CapacitorHttp.request({
                method: "DELETE",
                url: `http://localhost:3000/api/parcs/${id}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
            }).then((res) => {
                this.parcsdict = res.data;
            });
        },

        async updateParc(
            id,
            nom,
            beginHour,
            endHour,
            latitude,
            longitude,
            ticketPrice
        ) {
            const response = await CapacitorHttp.request({
                method: "PUT",
                url: `http://localhost:3000/api/parcs/`,
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
            });
        },

        async fetchToilettes(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/toilettes/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.toilettesdict = res.data;
            });
        },

        async fetchMagasins(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/magasins/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.magasinsdict = res.data;
                console.log(res.data);
            });
        },

        async fetchRestaurants(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/restaurants/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.restaurantsdict = res.data;
            });
        },

        async fetchSecours(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/secours/all/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.secoursdict = res.data;
            });
        },
        async fetchInfos(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/info/all/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.infosdict = res.data;
            });
        },
    },
});
