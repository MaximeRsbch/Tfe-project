import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";
import axios from "axios";

export const useUsersStore = defineStore("users", {
    state: () => ({
        usersDict: {},
    }),
    getters: {
        getUsers: (state) => Object.values(state.usersDict),
        getUsersById: (state) => Object.values(state.usersDict),
    },
    actions: {
        async loginUser(password, email) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "https://maximerossbach.be/api/login",
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
                url: "https://maximerossbach.be/api/register",
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
                url: "https://maximerossbach.be/api/users",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.usersDict = res.data.data;
            });
        },

        async fetchUsersForComment() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "https://maximerossbach.be/api/users",
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
                url: `https://maximerossbach.be/api/delete/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.fetchUsers();
            });
        },

        async muteUser(id, canComment) {
            const response = await CapacitorHttp.request({
                method: "PUT",
                url: `https://maximerossbach.be/api/mute/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    canComment,
                },
            }).then((res) => {
                this.fetchUsers();
            });
        },

        async fetchOneUser(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `https://maximerossbach.be/api/oneuser/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.usersDict = res.data;
            });
        },

        async updateUser(id, username, email) {
            const response = await CapacitorHttp.request({
                method: "PUT",
                url: `https://maximerossbach.be/api/user/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    username,
                    email,
                },
            }).then((res) => {
                this.fetchUsers();
            });
        },
    },
});
