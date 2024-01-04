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
        evenementdict: {},
        calendardict: {},
    }),

    getters: {
        getParcs: (state) => Object.values(state.parcsdict),
        getParcsById: (state) => (id) => state.parcsdict[id],
        getToilettes: (state) => Object.values(state.toilettesdict),
        getMagasins: (state) => Object.values(state.magasinsdict),
        getRestaurants: (state) => Object.values(state.restaurantsdict),
        getRestaurantsById: (state) => (id) => state.restaurantsdict[id],
        getSecours: (state) => Object.values(state.secoursdict),
        getInfos: (state) => Object.values(state.infosdict),
        getEvenements: (state) => Object.values(state.evenementdict),
        getCalendar: (state) => Object.values(state.calendardict),
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
            img,
            legende,
            showWC,
            showResto,
            showMagasins
        ) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "http://localhost:3000/api/parcs",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Type": "multipart/form-data",
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
                    img,
                    legende,
                    showWC,
                    showResto,
                    showMagasins,
                },
            }).then((res) => {
                this.parcsdict = res.data;
                console.log(res.data);
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
            ticketPrice,
            legende,
            showWC,
            showResto,
            showMagasins
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
                    legende,
                    showWC,
                    showResto,
                    showMagasins,
                },
            }).then((res) => {
                this.parcsdict = res.data;
                console.log(res.data);
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
                url: `http://localhost:3000/api/magasins/all/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.magasinsdict = res.data;
            });
        },

        async fetchMagasinsById(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/magasins/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.magasinsdict = res.data;
            });
        },

        async createMagasins(
            name,
            latitude,
            longitude,
            beginHour,
            endHour,
            img,
            description,
            ref_parc
        ) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "http://localhost:3000/api/magasins/",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Type": "multipart/form-data",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },

                data: {
                    name,
                    latitude,
                    longitude,
                    beginHour,
                    endHour,
                    img,
                    description,
                    ref_parc,
                },
            }).then((res) => {
                this.magasinsdict = res.data;
                console.log(res.data);
            });
        },

        async deleteMagasins(id) {
            const response = await CapacitorHttp.request({
                method: "DELETE",
                url: `http://localhost:3000/api/magasins/${id}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
            }).then((res) => {
                this.magasinsdict = res.data;
            });
        },

        async updateMagasins(
            id,
            name,
            latitude,
            longitude,
            beginHour,
            endHour,
            description
        ) {
            const response = await CapacitorHttp.request({
                method: "PUT",
                url: `http://localhost:3000/api/magasins/`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },

                data: {
                    id,
                    name,
                    latitude,
                    longitude,
                    beginHour,
                    endHour,
                    description,
                },
            }).then((res) => {
                this.magasinsdict = res.data;
                console.log(res.data);
            });
        },

        async fetchRestaurants(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/restaurants/all/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.restaurantsdict = res.data;
            });
        },

        async fetchRestaurantsById(id) {
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

        async createRestaurants(
            name,
            latitude,
            longitude,
            beginHour,
            endHour,
            img,
            description,
            url_carte,
            ref_parc
        ) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "http://localhost:3000/api/restaurants/",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Type": "multipart/form-data",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },

                data: {
                    name,
                    latitude,
                    longitude,
                    beginHour,
                    endHour,
                    img,
                    description,
                    url_carte,
                    ref_parc,
                },
            }).then((res) => {
                this.restaurantsdict = res.data;
                console.log(res.data);
            });
        },

        async deleteRestaurants(id) {
            const response = await CapacitorHttp.request({
                method: "DELETE",
                url: `http://localhost:3000/api/restaurants/${id}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
            }).then((res) => {
                this.restaurantsdict = res.data;
            });
        },

        async updateRestaurants(
            id,
            name,
            latitude,
            longitude,
            beginHour,
            endHour,
            description
        ) {
            const response = await CapacitorHttp.request({
                method: "PUT",
                url: `http://localhost:3000/api/restaurants/`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },

                data: {
                    id,
                    name,
                    latitude,
                    longitude,
                    beginHour,
                    endHour,
                    description,
                },
            }).then((res) => {
                this.restaurantsdict = res.data;
                console.log(res.data);
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

        async fetchEvenements(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/evenements/all/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.evenementdict = res.data;
            });
        },

        async fetchCalendar(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://localhost:3000/api/parcs/calendar/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.calendardict = res.data.data;
                console.log(res.data.data);
            });
        },

        async deleteCalendar(id) {
            const response = await CapacitorHttp.request({
                method: "DELETE",
                url: `http://localhost:3000/api/parcs/calendar/${id}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
            }).then((res) => {
                this.calendardict = res.data;
                console.log(res.data);
            });
        },

        async addCalendar(day, beginHour, endHour, ref_parc) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: `http://localhost:3000/api/parcs/calendar`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
                data: {
                    day,
                    beginHour,
                    endHour,
                    ref_parc,
                },
            }).then((res) => {
                this.calendardict = res.data;
                console.log(res.data);
            });
        },
    },
});
