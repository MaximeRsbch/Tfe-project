import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";
import axios from "axios";

export const useUsersStore = defineStore("users", {
    state: () => ({
        usersDict: {},
        modoPDict: {},
        modoDict: {},
    }),
    getters: {
        getUsers: (state) => Object.values(state.usersDict),
        getUsersById: (state) => Object.values(state.usersDict),
        getModoParc: (state) => Object.values(state.modoPDict),
        getModo: (state) => Object.values(state.modoDict),
    },
    actions: {
        async loginUser(password, email) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "http://192.168.0.205:3000/api/auth/login",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    email,
                    password,
                },
            }).then((res) => {
                const token = res.data.token;

                localStorage.setItem("savedToken", token);
                axios.defaults.headers.common["Authorization"] = token;
                this.usersDict = res.data;
                if (res.data.data) {
                    window.location.href = "/features";
                }
            });
        },
        async createUser(password, email, username) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "http://192.168.0.205:3000/api/auth/register",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    username,
                    email,
                    password,
                },
            }).then((res) => {
                if (res.data.data) {
                    window.location.href = "/login";
                }
            });
        },

        async fetchUsers() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://192.168.0.205:3000/api/users",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.usersDict = res.data.data;
            });
        },

        async deleteUser(id) {
            const response = await CapacitorHttp.request({
                method: "DELETE",
                url: `http://192.168.0.205:3000/api/users/${id}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
            }).then((res) => {
                this.fetchUsers();
                console.log(res);
            });
        },

        async updateUser(id, username, email) {
            const response = await CapacitorHttp.request({
                method: "PUT",
                url: `http://192.168.0.205:3000/api/users/${id}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
                data: {
                    username,
                    email,
                },
            }).then((res) => {
                this.fetchUsers();
            });
        },

        async fetchOneUser(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://192.168.0.205:3000/api/users/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.usersDict = res.data;
            });
        },

        async muteUser(id, canComment) {
            const response = await CapacitorHttp.request({
                method: "PUT",
                url: `http://192.168.0.205:3000/api/users/mute/${id}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
                data: {
                    canComment,
                },
            }).then((res) => {
                this.fetchUsers();
            });
        },

        async giveRoleModoParc(username, email, ref_user, ref_parc) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: `http://192.168.0.205:3000/api/modoparc/`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
                data: {
                    username,
                    email,
                    ref_user,
                    ref_parc,
                },
            }).then((res) => {});
        },

        async giveRoleModo(username, email, ref_user, ref_parc) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: `http://192.168.0.205:3000/api/modo/`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
                data: {
                    username,
                    email,
                    ref_user,
                    ref_parc,
                },
            }).then((res) => {});
        },

        async changeUserRole(id, role) {
            const response = await CapacitorHttp.request({
                method: "PUT",
                url: `http://192.168.0.205:3000/api/users/role/${id}`,
                headers: {
                    "Content-Type": "application/json",
                    Authorization:
                        "Bearer " + localStorage.getItem("savedToken"),
                },
                data: {
                    role,
                },
            }).then((res) => {
                this.fetchUsers();
            });
        },

        async fetchModoParc() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://192.168.0.205:3000/api/modoparc/`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.modoPDict = res.data.data;
            });
        },

        async fetchModoParcById(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://192.168.0.205:3000/api/modoparc/all/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.modoPDict = res.data.data;
            });
        },

        async fetchModo() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://192.168.0.205:3000/api/modo/`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.modoDict = res.data.data;
            });
        },

        async fetchModoById(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://192.168.0.205:3000/api/modo/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.modoDict = res.data.data;
            });
        },
    },
});
