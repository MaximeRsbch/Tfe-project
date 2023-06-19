import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useQueueTimeStore = defineStore("queuetime", {
    state: () => ({
        queueTimeDictWalibi: {},
        queueTimeDictEnergy: {},
    }),
    getters: {
        getQueueTimesWalibi: (state) =>
            Object.values(state.queueTimeDictWalibi),
        getQueueTimesEnergy: (state) =>
            Object.values(state.queueTimeDictEnergy),
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
    },
});
