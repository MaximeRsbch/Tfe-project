import { defineStore } from "pinia";
import { CapacitorHttp } from "@capacitor/core";

export const useQueueTimeStore = defineStore("queuetime", {
    state: () => ({
        queueTimeDict: {},
    }),
    getters: {
        getQueueTimes: (state) => Object.values(state.queueTimeDict),
    },
    actions: {
        async fetchQueueTime() {
            const response = await CapacitorHttp.request({
                method: "GET",
                url: "http://localhost:3000/api/queuetime",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => {
                console.log(res.data.rides);
                this.queueTimeDict = res.data.rides;
            });
        },
    },
});
