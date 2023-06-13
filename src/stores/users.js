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
        async login(password, email) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "http://10.0.2.2:3000/api/login",
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
                if (res.data.data) {
                    window.location.href = "/features";
                }
            });
        },
        async create(password, email, username) {
            const response = await CapacitorHttp.request({
                method: "POST",
                url: "http://10.0.2.2:3000/api/register",
                headers: {
                    "Content-Type": "application/json",
                },
                data: {
                    username,
                    email,
                    password,
                },
            }).then((res) => {
                console.log(res);
                if (res.data.data) {
                    window.location.href = "/login";
                }
            });
        },
        async fetchUsers() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://10.0.2.2:3000/api/users",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.usersDict = res.data.data;
            });
        },
        async fetchUserById(id) {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: `http://10.0.2.2:3000/api/users/${id}`,
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.usersDict = res.data.data;
            });
        },
    },
});
