import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useQueueTimeStore = defineStore("queuetime", {
    state: () => ({
        queueTimeDictWalibi: {},
        queueTimeDictEnergy: {},
        queueTimeDictPlopsa: {},
        queueTimeDictBobbe: {},
        queueTimeDictBellewaerde: {},
    }),
    getters: {
        getQueueTimesWalibi: (state) =>
            Object.values(state.queueTimeDictWalibi),
        getQueueTimesEnergy: (state) =>
            Object.values(state.queueTimeDictEnergy),
        getQueueTimesPlopsa: (state) =>
            Object.values(state.queueTimeDictPlopsa),
        getQueueTimesBobbe: (state) => Object.values(state.queueTimeDictBobbe),
        getQueueTimesBellewaerde: (state) =>
            Object.values(state.queueTimeDictBellewaerde),
    },
    actions: {
        async fetchQueueTimeWalibi() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/queuetime/14",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.queueTimeDictWalibi = res.data.rides;
            });
        },
        async fetchQueueTimeEnergy() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/queuetime/317",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.queueTimeDictEnergy = res.data.rides;
            });
        },
        async fetchQueueTimePlopsa() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/queuetime/54",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.queueTimeDictPlopsa = res.data.rides;
            });
        },
        async fetchQueueTimeBobbe() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/queuetime/311",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.queueTimeDictBobbe = res.data.rides;
            });
        },
        async fetchQueueTimeBellewaerde() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/queuetime/276",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                this.queueTimeDictBellewaerde = res.data.rides;
            });
        },
    },
});
