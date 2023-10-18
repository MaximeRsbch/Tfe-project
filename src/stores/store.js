import { createStore } from "vuex";

export default createStore({
    state: {
        longitude: "",
        latitude: "",
        nomparc: "",
    },
    mutations: {
        setLongitude(state, longitude) {
            state.longitude = longitude;
        },
        setLatitude(state, latitude) {
            state.latitude = latitude;
        },
        setNomparc(state, nomparc) {
            state.nomparc = nomparc;
        },
    },
    actions: {
        updateLocation({ commit }, { longitude, latitude, nomparc }) {
            commit("setLongitude", longitude);
            commit("setLatitude", latitude);
            commit("setNomparc", nomparc);
        },
    },
});
