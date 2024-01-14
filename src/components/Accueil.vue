<script setup>
import leaflet from "leaflet";
import jwtDecode from "jwt-decode";
import { computed, onMounted, ref } from "vue";
import GeoErrorModal from "./GeoErrorModal.vue";
import MapFeatures from "./MapFeatures.vue";
import RatingStars from "./attractions/RatingStars.vue";
import DropDownMenuAjout from "./DropDownMenuAjout.vue";
import Swal from "sweetalert2";
import { Mapbox_API_KEY } from "../common/config.js";
import { useParcsStore } from "../stores/parcs.js";
import { useAttractionsStore } from "../stores/attractions.js";
import { useTicketsModStore } from "../stores/ticketsmod.js";
import { useUsersStore } from "../stores/users.js";
import { useRouter } from "vue-router";
import { BASE_URL } from "../common/config.js";

const router = useRouter();

const parcstore = useParcsStore();
const attractionstore = useAttractionsStore();
const usersStore = useUsersStore();
const ticketsStore = useTicketsModStore();

const isConnect = computed(() => localStorage.getItem("savedToken"));

if (!isConnect.value) {
    Swal.fire({
        title: "Oups...",
        text: "Vous êtes pas connecter",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Je veux me connecter",
        cancelButtonText: "Je ne veux pas me connecter",
    }).then((result) => {
        if (result.isConfirmed) {
            router.push("/login");
            setTimeout(() => {
                window.location.reload();
            }, 300);
        } else {
            window.location.reload();
        }
    });
}

let map;

const tokenDecode = computed(() => jwtDecode(isConnect.value));
const id = computed(() => tokenDecode.value.id_user);
const role = computed(() => tokenDecode.value.role);

const showAttractionId = ref(null);

onMounted(() => {
    //init map
    map = leaflet.map("map").setView([50.7001368, 4.5873087], 10);

    const ids = [
        "mapbox/satellite-streets-v12",
        "mapbox/dark-v11",
        "mapbox/outdoors-v12",
    ];
    const baselayers = {};

    ids.forEach(
        (id) =>
            (baselayers[id] = leaflet.tileLayer(
                `https://api.mapbox.com/styles/v1/${id}/tiles/{z}/{x}/{y}?access_token=${Mapbox_API_KEY}`,
                {
                    maxZoom: 19,
                    attribution:
                        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',

                    tileSize: 512,
                    zoomOffset: -1,
                }
            ))
    );

    // Set the default layer when you open the map
    baselayers["mapbox/outdoors-v12"].addTo(map);
    // Associating each style name to its tile layer
    leaflet.control.layers(baselayers).addTo(map);

    map.zoomControl.remove();

    getGeoLocation();
    parcstore.fetchParcs();
    attractionstore.fetchAttractions();
    plotInfoParc();
    plotInfoAttraction();
    usersStore.fetchOneUser(id.value);
    attractionstore.fetchFavoriteAttraction(id.value);
});

const parcs = computed(() => parcstore.getParcs);
const attractions = computed(() => attractionstore.getAttractions);

const user = computed(() => usersStore.getUsersById);

const coords = ref(null);
const fetchCoords = ref(null);
const geoMarker = ref(null);
const geoError = ref(null);
const geoErrorMsg = ref(null);

const getGeoLocation = () => {
    if (coords.value) {
        coords.value = null;
        sessionStorage.removeItem("coords");
        map.removeLayer(geoMarker.value);
        return;
    }
    // check session storage for coords
    if (sessionStorage.getItem("coords")) {
        coords.value = JSON.parse(sessionStorage.getItem("coords"));
        plotGeolocation(coords.value);
        return;
    }

    fetchCoords.value = true;
    navigator.geolocation.getCurrentPosition(setCoords, getLocErro);
};

const setCoords = (pos) => {
    // stop fetching coords
    fetchCoords.value = null;

    // set coords in session storage
    const setSessionCoords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
    };

    sessionStorage.setItem("coords", JSON.stringify(setSessionCoords));

    //set ref coords value
    coords.value = setSessionCoords;

    plotGeolocation(coords.value);
};

const getLocErro = (err) => {
    fetchCoords.value = null;
    geoError.value = true;
    geoErrorMsg.value = err.message;
};

//Mettre sa propre localisation
const plotGeolocation = (coords) => {
    // create custom marker
    const customMarker = leaflet.icon({
        iconUrl: "/assets/img/map-marker-black.svg",
        iconSize: [35, 35],
    });

    // create a marker with coords and custom icon
    geoMarker.value = leaflet
        .marker([coords.lat, coords.lng], { icon: customMarker })
        .addTo(map);

    //set map view to the current location
    map.setView([coords.lat, coords.lng], 10);
};

const closeGeoError = () => {
    geoError.value = null;
    geoErrorMsg.value = null;
};

const resultMarker = ref(null);
const plotResult = (coords) => {
    // check to see if resultMarker has value
    if (resultMarker.value) {
        map.removeLayer(resultMarker.value);
    }

    // create custom marker

    // create a marker with coords and custom icon

    //set map view to the current location
    map.setView([coords.coordinates[1], coords.coordinates[0]], 17);

    closeSearchResults();
};

const searchResults = ref(null);
const toggleSearchResults = () => {
    searchResults.value = !searchResults.value;
};
const closeSearchResults = () => {
    searchResults.value = null;
};

const removeResult = () => {
    map.removeLayer(resultMarker.value);
};

const showModalResults = ref(false);
const showModalRating = ref(false);
const showAttractionResults = ref(null);
const showParcResults = ref(null);
const showModalResto = ref(null);

const showParcName = ref(null);
const showParcPrice = ref(null);
const showParcBeginHour = ref(null);
const showParcEndHour = ref(null);
const showParcImage = ref(null);
const showParcLegende = ref(null);
const showpeople = ref(null);
const latitude = ref(null);
const longitude = ref(null);

const showAttractionName = ref(null);
const showHeightAlone = ref(null);
const showHeightWithAdult = ref(null);
const showTypeAttraction = ref(null);
const showDescription = ref(null);
const showWaitTime = ref(null);
const showIsOpen = ref(null);
const showAverageRating = ref(null);
const showRatingAttraction = ref(null);
const showCalendarDay = ref(null);
const showOpenCalendar = ref(null);
const showCloseCalendar = ref(null);
const showRatingid = ref(null);
const showFavorite = ref(null);
const showImageAttraction = ref(null);
const modoRefParc = ref(null);

const showRestoName = ref(null);
const showRestoOpen = ref(null);
const showRestoClose = ref(null);
const showRestoDesc = ref(null);
const showRestoImg = ref(null);
const showCarteUrl = ref(null);
const showComm = ref(null);

const showModalMagasin = ref(null);
const showMagasinName = ref(null);
const showMagasinOpen = ref(null);
const showMagasinClose = ref(null);
const showMagasinDesc = ref(null);
const showMagasinImg = ref(null);

const parcid = ref(null);
const attractionid = ref(null);
const parcIdInAttraction = ref(null);

const plotInfoParc = () => {
    setTimeout(() => {
        const customMarker = leaflet.icon({
            iconUrl: "../assets/img/map-marker-blue.svg",
            iconSize: [32, 32],
        });

        const toiletteMarker = leaflet.icon({
            iconUrl: "../assets/img/toilette.png",
            iconSize: [32, 32],
        });

        const restoMarker = leaflet.icon({
            iconUrl: "../assets/img/resto.png",
            iconSize: [32, 32],
        });

        const InfoMarker = leaflet.icon({
            iconUrl: "../assets/img/info.png",
            iconSize: [32, 32],
        });

        const SecoursMarker = leaflet.icon({
            iconUrl: "../assets/img/secours.png",
            iconSize: [32, 32],
        });

        const MagasinsMarker = leaflet.icon({
            iconUrl: "../assets/img/shop.png",
            iconSize: [32, 32],
        });

        for (const parc of parcs.value) {
            if (parc.showWC == true) {
                for (const toilette of parc.Toilettes) {
                    leaflet
                        .marker([toilette.latitude, toilette.longitude], {
                            icon: toiletteMarker,
                        })
                        .addTo(map);
                }
            }
            for (const secours of parc.Secours) {
                leaflet
                    .marker([secours.latitude, secours.longitude], {
                        icon: SecoursMarker,
                    })
                    .addTo(map);
            }

            if (parc.showResto === true) {
                for (const Resto of parc.Restaurants) {
                    leaflet
                        .marker([Resto.latitude, Resto.longitude], {
                            icon: restoMarker,
                        })
                        .addTo(map)
                        .on("click", function (e) {
                            showModalResto.value = true;
                            showModalMagasin.value = false;
                            showModalResults.value = false;
                            showParcResults.value = false;
                            showAttractionResults.value = false;

                            showRestoName.value = Resto.name;
                            showRestoOpen.value = Resto.beginHour;
                            showRestoClose.value = Resto.endHour;
                            showRestoDesc.value = Resto.description;
                            showRestoImg.value = Resto.carte_img;
                            showCarteUrl.value = Resto.url_carte;
                        });
                }
            }

            parcstore.fetchInfos(parc.id);
            setTimeout(() => {
                const infos = computed(() => parcstore.getInfos);

                for (const info of infos.value) {
                    leaflet
                        .marker([info.latitude, info.longitude], {
                            icon: InfoMarker,
                        })
                        .addTo(map);
                }
            }, 300);
            if (parc.showMagasins) {
                for (const Magasin of parc.Magasins) {
                    leaflet
                        .marker([Magasin.latitude, Magasin.longitude], {
                            icon: MagasinsMarker,
                        })
                        .addTo(map)
                        .on("click", function (e) {
                            showModalMagasin.value = true;
                            showModalResto.value = false;
                            showModalResults.value = false;
                            showParcResults.value = false;
                            showAttractionResults.value = false;

                            showMagasinName.value = Magasin.name;
                            showMagasinOpen.value = Magasin.beginHour;
                            showMagasinClose.value = Magasin.endHour;
                            showMagasinDesc.value = Magasin.description;
                            showMagasinImg.value = Magasin.img_url;
                        });
                }
            }

            leaflet
                .marker([parc.latitude, parc.longitude], { icon: customMarker })
                .addTo(map)
                .on("click", function (e) {
                    showModalResults.value = true;
                    showParcResults.value = true;
                    showAttractionResults.value = false;
                    showModalMagasin.value = false;
                    showModalResto.value = false;

                    showParcName.value = parc.nom;
                    showParcPrice.value = parc.ticketPrice;
                    showParcBeginHour.value = parc.beginHour;
                    showParcEndHour.value = parc.endHour;
                    showParcImage.value = parc.img_url;
                    showParcLegende.value = parc.legende;
                    latitude.value = parc.latitude;
                    longitude.value = parc.longitude;
                    parcid.value = parc.id;

                    parcstore.fetchCalendar(parc.id);

                    const recupcalendar = computed(() => parcstore.getCalendar);

                    setTimeout(() => {
                        for (const calendar of recupcalendar.value) {
                            showCalendarDay.value = calendar.day;
                            showOpenCalendar.value = calendar.beginHour;
                            showCloseCalendar.value = calendar.endHour;
                        }
                    }, 300);

                    const averageWaitTime = calculateAverageWaitTime(
                        parc.Attractions
                    );

                    showpeople.value = averageWaitTime;
                });
        }
    }, 200);
};

const calculateAverageRating = (attraction) => {
    const ratings = attraction.Reviews;

    if (ratings && ratings.length > 0) {
        const totalRating = ratings.reduce(
            (sum, review) => sum + review.rating,
            0
        );

        const averageRating = totalRating / ratings.length;

        // Utilisez toFixed(2) pour limiter à deux chiffres après la virgule
        const roundedAverageRating = averageRating.toFixed(2);

        // Convertissez la chaîne en nombre si nécessaire
        return parseFloat(roundedAverageRating);
    }

    return 0;
};

const plotInfoAttraction = () => {
    setTimeout(() => {
        for (const attraction of attractions.value) {
            let customMarker;

            if (attraction.is_open === true) {
                customMarker = leaflet.icon({
                    iconUrl: "../assets/img/map-marker-green.svg",
                    iconSize: [32, 32],
                });
            } else if (attraction.is_open === false) {
                customMarker = leaflet.icon({
                    iconUrl: "../assets/img/map-marker-red.svg",
                    iconSize: [32, 32],
                });
            } else {
                customMarker = leaflet.icon({
                    iconUrl: "../assets/img/map-marker-black.svg",
                    iconSize: [32, 32],
                });
            }

            const averageRating = calculateAverageRating(attraction);
            leaflet
                .marker([attraction.latitude, attraction.longitude], {
                    icon: customMarker,
                })
                .addTo(map)
                .on("click", function (e) {
                    showModalResults.value = true;
                    showAttractionResults.value = true;
                    showParcResults.value = false;
                    showModalMagasin.value = false;
                    showModalResto.value = false;

                    //Pour attraction

                    showAverageRating.value = averageRating;
                    showAttractionId.value = attraction.id;
                    showAttractionName.value = attraction.nom;
                    showHeightAlone.value = attraction.minHeight;
                    showHeightWithAdult.value = attraction.maxHeight;
                    showTypeAttraction.value = attraction.ref_type;
                    showWaitTime.value = attraction.wait_time;
                    showIsOpen.value = attraction.is_open;
                    showDescription.value = attraction.description;
                    showFavorite.value = attraction.Favoris;
                    showImageAttraction.value = attraction.ImageAttractions;
                    showComm.value = attraction.showCommentaires;
                    parcIdInAttraction.value = attraction.Parc.id;
                    attractionid.value = attraction.id;

                    attractionstore.fetchRatingAttraction(attractionid.value);
                    usersStore.fetchModoById(parcIdInAttraction.value);

                    setTimeout(() => {
                        const ratingAttr = computed(
                            () => attractionstore.getRatingStarAttraction
                        );

                        const modo = computed(() => usersStore.getModo);

                        setTimeout(() => {
                            for (let i = 0; i < modo.value.length; i++) {
                                modoRefParc.value = modo.value[i].ref_parc;
                            }
                        }, 300);

                        showRatingAttraction.value = ratingAttr.value;
                    }, 300);
                });
        }
    }, 200);
};

const removeAttrResults = () => {
    showModalResults.value = false;
};

const removeRatingResults = () => {
    showModalRating.value = false;
};
const removeRestoResults = () => {
    showModalResto.value = false;
};

const removeMagasinResults = () => {
    showModalMagasin.value = false;
};

const showRatingModal = () => {
    showModalRating.value = true;
};

const content = ref("");
const etoile = ref("");

const handleRatingSelected = (rating) => {
    etoile.value = rating;
};

async function AddRating() {
    Swal.fire({
        title: "Êtes-vous sûr de vouloir ajouter cette note ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Annuler",
        confirmButtonText: "Oui, ajouter",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire("Ajouté !", "Votre note a bien été ajoutée.", "success");
            attractionstore.createRatingAttraction(
                id.value,
                attractionid.value,
                etoile.value,
                content.value
            );
            setTimeout(() => {
                window.location.reload();
            }, 300);
        }
    });
}

const calculateAverageWaitTime = (attractions) => {
    // Vérifiez si des attractions existent
    if (attractions && attractions.length > 0) {
        // Calculez la somme des temps d'attente
        const totalWaitTime = attractions.reduce((sum, attraction) => {
            return sum + attraction.wait_time;
        }, 0);

        // Calculez la moyenne en divisant la somme par le nombre d'attractions
        const averageWaitTime = totalWaitTime / attractions.length;

        return averageWaitTime;
    }

    return "Aucune attraction disponible"; // Retournez 0 si aucune attraction n'est disponible
};

const maintenant = new Date();
const options = { hour: "2-digit", minute: "2-digit" };

const heureLocale = ref(maintenant.toLocaleTimeString("fr-FR", options));

const isAttractionFavorite = ref(false);

// Function to toggle favorite status
const toggleFavorite = async () => {
    if (isConnect.value) {
        if (isAttractionFavorite.value) {
            // Remove from favorites
            await attractionstore.deleteFavoriteAttraction(favorisId.value);
        } else {
            // Add to favorites
            await attractionstore.createFavoriteAttraction(
                id.value,
                showAttractionId.value
            );
        }

        // Toggle the reactive data property
        isAttractionFavorite.value = !isAttractionFavorite.value;

        Swal.fire({
            title: isAttractionFavorite.value
                ? "Attraction ajoutée aux favoris"
                : "Attraction supprimée des favoris",
            icon: "success",
            confirmButtonText: "Ok",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });
    } else {
        Swal.fire({
            title: "Vous devez être connecté pour gérer les favoris",
            icon: "error",
            confirmButtonText: "Ok",
        }).then((result) => {
            if (result.isConfirmed) {
                // Handle the user not being logged in
            }
        });
    }
};

const favorisId = ref(null);

setTimeout(() => {
    const favoris = computed(() => attractionstore.getFavoriteAttraction);
    for (const fav of favoris.value) {
        favorisId.value = fav.id;
    }
}, 300);
const RemoveFav = async () => {
    if (isConnect.value) {
        await attractionstore.deleteFavoriteAttraction(favorisId.value);
        isAttractionFavorite.value = false;

        Swal.fire({
            title: "Attraction supprimée des favoris",
            icon: "success",
            confirmButtonText: "Ok",
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });
    } else {
        Swal.fire({
            title: "Vous devez être connecté pour supprimer une attraction des favoris",
            icon: "error",
            confirmButtonText: "Ok",
        }).then((result) => {
            if (result.isConfirmed) {
                // Handle the user not being logged in
            }
        });
    }
};

const isPresentationSelected = ref(true);
const isAvisSelected = ref(false);

const showPresOrNot = () => {
    isPresentationSelected.value = true;
    isAvisSelected.value = false;
};

const showAvisOrNot = () => {
    isPresentationSelected.value = false;
    isAvisSelected.value = true;
};

const goToPark = () => {
    window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${latitude.value},${longitude.value}`
    );
};

const title = ref("");
const contentReport = ref("");

const ModalReport = ref(false);

const openModalReport = (id) => {
    ModalReport.value = true;

    showRatingid.value = id;
};

const removeModalReport = () => {
    document.body.style.overflow = "auto";
    ModalReport.value = false;
};

const reportComment = () => {
    if (title.value == "") {
        alert("Vous devez écrire un titre");
        return;
    }
    if (contentReport.value == "") {
        alert("Vous devez écrire un commentaire");
        return;
    } else {
        ticketsStore.createReportAttr(
            title.value,
            contentReport.value,
            id.value,
            showRatingid.value
        );
    }
};

const userFavorite = ref(null);

setTimeout(() => {
    for (const users in user.value) {
        userFavorite.value = user.value[users].Favoris;
    }
}, 300);

const deleteCommentAttraction = (id) => {
    Swal.fire({
        title: "Êtes-vous sûr de vouloir supprimer ce commentaire ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Annuler",
        confirmButtonText: "Oui, supprimer",
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire(
                "Supprimé !",
                "Votre commentaire a bien été supprimé.",
                "success"
            );
            attractionstore.deleteCommentAttraction(id);

            showRatingAttraction.value = showRatingAttraction.value.filter(
                (item) => item.id !== id
            );
        }
    });
};

const carteResto = () => {
    window.open(showCarteUrl.value);
};

function formaterDate(date) {
    var jour = date.getDate();
    var mois = date.getMonth() + 1; // Les mois commencent à 0, donc ajoutez 1
    var annee = date.getFullYear();

    // Ajouter un zéro devant le jour si nécessaire
    jour = jour < 10 ? "0" + jour : jour;

    // Ajouter un zéro devant le mois si nécessaire
    mois = mois < 10 ? "0" + mois : mois;

    // Retourner la date formatée
    return jour + "-" + mois + "-" + annee;
}

// Utilisation de la fonction avec la date actuelle
var aujourdHui = new Date();
var dateFormatee = formaterDate(aujourdHui);

const toolTipAlone = ref(false);
const toolTipAcc = ref(false);

const showToolHeightAlone = () => {
    toolTipAlone.value = !toolTipAlone.value;
    toolTipAcc.value = false;
};

const showToolHeightAcc = () => {
    toolTipAcc.value = !toolTipAcc.value;
    toolTipAlone.value = false;
};
</script>

<template>
    <div class="relative overflow-x-hidden">
        <GeoErrorModal
            @closeGeoError="closeGeoError"
            v-if="geoError"
            :geoErrorMsg="geoErrorMsg"
        />

        <MapFeatures
            @getGeolocation="getGeoLocation"
            @plotResult="plotResult"
            @toggleSearchResults="toggleSearchResults"
            @removeResult="removeResult"
            :coords="coords"
            :fetchCoords="fetchCoords"
            :searchResults="searchResults"
        />

        <div
            class="z-[2] absolute top-4 left-[250px] md:top-20 md:left-[700px] lg:top-20 lg:left-[950px] xl:top-20 xl:left-[1350px]"
        >
            <DropDownMenuAjout />
        </div>

        <div
            v-if="showModalResults"
            id="modal"
            class="h-full absolute z-10 flex justify-start items-start pt-32 md:pt-16 pl-6 md:pl-2"
        >
            <div
                class="flex flex-col bg-white w-[280px] sm:w-[400px] rounded-md max-h-[66vh] md:max-h-[74vh] overflow-y-auto"
            >
                <div class="relative z-10 flex justify-end top-6 right-2">
                    <i
                        @click="removeAttrResults"
                        class="fa-solid fa-xmark fa-2xl text-gray-200 hover:text-[#344d59] fixed"
                    ></i>
                </div>

                <div v-if="showParcResults">
                    <div>
                        <div>
                            <img
                                v-if="showParcImage"
                                :src="`${BASE_URL}/${showParcImage.replace(
                                    /\\/g,
                                    '/'
                                )}`"
                                alt="Image parc"
                                class="w-[408px] h-[272px]]"
                            />
                        </div>

                        <div class="flex justify-center">
                            <RouterLink
                                v-if="parcid !== undefined"
                                v-bind:to="{
                                    name: 'calendar',
                                    params: {
                                        id: parcid,
                                    },
                                }"
                            >
                                <p
                                    class="mt-3 text-md text-black hover:text-blue-500"
                                >
                                    Cliquez ici pour voir le calendrier du parc
                                </p>
                            </RouterLink>
                        </div>

                        <div class="pt-4 pl-4">
                            <h1 class="text-2xl">{{ showParcName }}</h1>
                        </div>
                        <div
                            v-if="role !== 'user'"
                            class="flex justify-end pr-4"
                        >
                            <div
                                class="absolute z-10 top-36 md:top-20 left-8 md:left-4"
                            >
                                <button
                                    class="bg-[#344d59] text-white px-4 py-2 rounded-lg"
                                >
                                    <RouterLink
                                        v-if="parcid !== undefined"
                                        v-bind:to="{
                                            name: 'attractionform',
                                            params: {
                                                id: parcid,
                                            },
                                        }"
                                    >
                                        Ajouter une attraction
                                    </RouterLink>
                                </button>
                            </div>
                        </div>
                        <div class="pb-4 flex justify-center pt-4">
                            <button
                                @click="goToPark"
                                class="hover:text-blue-500"
                            >
                                Démarrer la navigation
                            </button>
                        </div>
                        <hr />

                        <div class="px-10 flex justify-center">
                            <p class="text-sm text-justify pb-4 pt-4">
                                {{ showParcLegende }}
                            </p>
                        </div>

                        <hr />
                        <div class="pt-4 pb-4">
                            <h2 class="text-lg pl-4">Entrée</h2>
                            <p class="text-sm pl-4">
                                Votre entrée pour ce parc
                            </p>
                            <div class="grid grid-cols-2 pt-6">
                                <p class="text-lg pl-4">{{ showParcName }}</p>
                                <div class="flex justify-end pr-5">
                                    <p class="text-lg">{{ showParcPrice }} €</p>
                                </div>
                            </div>
                        </div>
                        <hr />

                        <div class="pt-4 pl-4 pb-4">
                            <h2 class="text-lg pb-4">Horaires d'aujourd'hui</h2>
                            <div v-if="showCalendarDay === dateFormatee">
                                <div v-if="heureLocale < showOpenCalendar">
                                    <span class="text-red-700">Fermé</span> -
                                    Ouverture à
                                    {{ showOpenCalendar }}
                                </div>
                                <div v-if="heureLocale > showCloseCalendar">
                                    <span class="text-red-700">Fermé</span> -
                                    Ouverture à
                                    {{ showOpenCalendar }}
                                </div>
                                <div
                                    v-if="
                                        heureLocale > showOpenCalendar &&
                                        heureLocale < showCloseCalendar
                                    "
                                >
                                    <span class="text-green-500">Ouvert</span> -
                                    Fermeture à
                                    {{ showCloseCalendar }}
                                </div>
                            </div>
                            <div v-else>
                                <p>
                                    Aucun horaire n'est disponible pour ce parc
                                </p>
                            </div>
                        </div>

                        <hr />

                        <p class="text-2xl pl-4 pt-4 pb-4">
                            <span
                                v-if="showpeople > 50"
                                class="text-red-500 pr-2"
                            >
                                {{ showpeople }}
                            </span>
                            <span
                                v-if="showpeople < 50 && showpeople > 20"
                                class="text-orange-500 pr-2"
                            >
                                {{ showpeople }}
                            </span>
                            <span
                                v-if="showpeople < 20 && showpeople !== 0"
                                class="text-green-500 pr-2"
                            >
                                {{ showpeople }}
                            </span>
                            <span
                                v-if="
                                    showpeople !==
                                        'Aucune attraction disponible' &&
                                    showpeople !== 0
                                "
                                class="text-sm"
                                >min d'attente en moyenne</span
                            >
                            <span v-if="showpeople === 0" class="text-base"
                                >Aucune minute d'attente</span
                            >
                        </p>
                    </div>
                </div>
                <div v-if="showAttractionResults">
                    <div>
                        <div v-for="data in showImageAttraction">
                            <img
                                v-if="data.img_url"
                                :src="`${BASE_URL}/${data.img_url.replace(
                                    /\\/g,
                                    '/'
                                )}`"
                                alt="Image attraction"
                                class="w-[408px] h-[272px]]"
                            />
                        </div>
                        <div class="grid grid-cols-2">
                            <h2 class="text-2xl pl-4 pt-4">
                                {{ showAttractionName }}
                            </h2>
                            <div class="flex justify-end pr-4">
                                <div
                                    class="absolute z-10 top-36 md:top-20 left-8"
                                    v-for="data in showFavorite"
                                >
                                    <div v-if="data.ref_user !== id">
                                        <button @click="toggleFavorite">
                                            <i
                                                :class="{
                                                    'fa-solid fa-heart fa-2xl text-orange-500':
                                                        isAttractionFavorite,
                                                    'fa-regular fa-heart fa-2xl text-orange-500':
                                                        !isAttractionFavorite,
                                                }"
                                            ></i>
                                        </button>
                                    </div>
                                </div>

                                <div
                                    class="absolute z-10 top-36 md:top-20 left-8"
                                    v-if="showFavorite.length === 0"
                                >
                                    <button @click="toggleFavorite">
                                        <i
                                            :class="{
                                                'fa-solid fa-heart fa-2xl text-orange-500':
                                                    isAttractionFavorite,
                                                'fa-regular fa-heart fa-2xl text-orange-500':
                                                    !isAttractionFavorite,
                                            }"
                                        ></i>
                                    </button>
                                </div>

                                <div
                                    class="absolute z-10 top-20 left-8"
                                    v-if="showFavorite.length !== 0"
                                    v-for="data in showFavorite"
                                >
                                    <div v-if="data.ref_user === id">
                                        <button @click="RemoveFav">
                                            <i
                                                class="fa-solid fa-heart fa-2xl text-orange-500"
                                            ></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p
                            v-if="showAverageRating === 0"
                            class="text-sm pl-4 font-bold"
                        >
                            Aucune note n'a été donnée à cette attraction
                        </p>
                        <p v-if="showAverageRating !== 0" class="text-sm pl-4">
                            {{ showAverageRating }}/5
                        </p>
                        <p class="text-sm pl-4" v-if="showTypeAttraction === 1">
                            Sensation
                        </p>
                        <p class="text-sm pl-4" v-if="showTypeAttraction === 2">
                            Aquatique
                        </p>
                        <p class="text-sm pl-4" v-if="showTypeAttraction === 3">
                            Famille
                        </p>
                        <div class="grid grid-cols-2 pt-6">
                            <button
                                @click="showPresOrNot"
                                :class="{ selected: isPresentationSelected }"
                                id="pres"
                                class="flex justify-center"
                            >
                                Présentation
                            </button>

                            <button
                                @click="showAvisOrNot"
                                :class="{ selected: isAvisSelected }"
                                id="avis"
                                class="flex justify-center"
                            >
                                Avis
                            </button>
                        </div>
                        <div v-if="isPresentationSelected" class="pt-8">
                            <hr class="pt-4" />
                            <p
                                class="text-sm flex justify-center text-justify pb-4 px-10"
                            >
                                {{ showDescription }}
                            </p>
                            <hr />
                            <div class="grid grid-cols-2 pt-4">
                                <div class="flex justify-end">
                                    <button @click="showToolHeightAlone">
                                        <img
                                            class="h-16 w-16"
                                            src="/assets/img/seul.png"
                                            alt=""
                                            id="imageAlone"
                                        />
                                    </button>
                                    <div v-if="toolTipAlone" class="relative">
                                        <span class="tooltipSeultext"
                                            >Taille seule</span
                                        >
                                    </div>
                                </div>
                                <p class="pt-3">{{ showHeightAlone }} cm</p>
                            </div>
                            <div class="grid grid-cols-2 pt-4 pb-4">
                                <div class="flex justify-end">
                                    <button @click="showToolHeightAcc">
                                        <img
                                            class="h-16 w-16"
                                            src="/assets/img/accompgne.png"
                                            alt=""
                                            id="imageWithAdult"
                                        />
                                    </button>
                                    <div v-if="toolTipAcc" class="relative">
                                        <span class="tooltipAcctext"
                                            >Taille accompagné</span
                                        >
                                    </div>
                                </div>
                                <p class="pt-3">{{ showHeightWithAdult }} cm</p>
                            </div>
                            <hr />

                            <div class="pt-4 pb-4 pl-4">
                                <p v-if="showWaitTime === 0">
                                    Temps d'attente inconnu
                                </p>
                                <p v-if="showWaitTime !== 0" class="text-md">
                                    Temps d'attente moyen dans cet attraction :
                                    <span
                                        class="text-green-500"
                                        v-if="showWaitTime < 20"
                                        >{{ showWaitTime }}</span
                                    >
                                    <span
                                        class="text-orange-500"
                                        v-if="
                                            showWaitTime < 50 &&
                                            showWaitTime > 20
                                        "
                                        >{{ showWaitTime }}</span
                                    >
                                    <span
                                        class="text-red-500"
                                        v-if="showWaitTime > 50"
                                        >{{ showWaitTime }}</span
                                    >
                                </p>
                            </div>
                            <hr />
                            <div class="pl-4 pt-4 pb-4">
                                <p v-if="showIsOpen === false">
                                    Attraction
                                    <span class="text-red-500">fermée</span>
                                </p>
                                <p v-if="showIsOpen === true">
                                    Attraction
                                    <span class="text-green-500">ouverte</span>
                                </p>
                            </div>
                        </div>
                        <div v-if="isAvisSelected">
                            <div v-if="showComm === true" class="pl-4">
                                <div
                                    class="pt-6"
                                    v-for="data in showRatingAttraction"
                                >
                                    <p>{{ data.User.username }}</p>
                                    <p class="text-sm">{{ data.rating }}/5</p>
                                    <p>{{ data.content }}</p>

                                    <div class="flex justify-end pr-2">
                                        <button
                                            v-if="
                                                data.User.id === id ||
                                                modoRefParc ===
                                                    parcIdInAttraction
                                            "
                                            @click="
                                                deleteCommentAttraction(data.id)
                                            "
                                            class="bg-[#344D59] text-white rounded-md px-4 py-1"
                                        >
                                            Delete
                                        </button>

                                        <button
                                            @click="openModalReport(data.id)"
                                            class="ml-4 font-bold"
                                            title="Signaler un commentaire inapproprié"
                                        >
                                            Report
                                        </button>
                                    </div>
                                    <div class="relative pt-6">
                                        <div
                                            class="absolute inset-0 flex items-center"
                                            aria-hidden="true"
                                        >
                                            <div
                                                class="w-full border-t border-gray-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                v-if="showComm === true"
                                class="flex justify-center pt-4"
                            >
                                <button
                                    class="px-4 py-2 border hover:bg-gray-200 text-black rounded-full"
                                    @click="showRatingModal"
                                >
                                    Rédiger un avis
                                </button>
                            </div>
                            <div
                                class="pt-4 pb-4 pl-4"
                                v-if="showComm === false"
                            >
                                Les avis ont été désactivés pour cette
                                attraction.
                            </div>
                        </div>
                    </div>
                </div>

                <p class="text-xs mb-1"></p>
            </div>
        </div>

        <div
            v-if="ModalReport"
            class="h-screen w-full absolute z-10 flex justify-center items-center bg-black/50"
        >
            <div class="bg-white w-[80%] sm:w-[450px] px-6 py-4 rounded-md">
                <i
                    @click="removeModalReport"
                    class="fa-regular fa-circle-xmark flex justify-end"
                ></i>

                <div class="flex justify-center pb-5">
                    <h2 class="text-2xl">Signaler</h2>
                </div>

                <div class="mx-auto container max-w-xl pb-10">
                    <input
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                        v-model="title"
                        placeholder="Raison du signalement"
                        type="text"
                    />
                </div>

                <div class="mx-auto container max-w-xl pb-10">
                    <textarea
                        id="content"
                        v-model="contentReport"
                        placeholder="Donner votre avis sur cet attraction ;)"
                        minlength="10"
                        maxlength="500"
                        rows="5"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                </div>

                <div class="flex justify-end">
                    <button
                        @click="reportComment"
                        type="button"
                        class="px-4 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#344d59] rounded-md hover:stone-600 focus:outline-none focus:[#344d59]"
                    >
                        Report
                    </button>
                </div>
            </div>
        </div>

        <div
            v-if="showModalRating"
            class="h-full w-full absolute z-10 flex justify-center items-start pt-32 bg-black/50"
        >
            <div
                class="flex flex-col bg-white w-[80%] sm:w-[450px] px-6 py-4 rounded-md"
            >
                <i
                    @click="removeRatingResults"
                    class="fa-regular fa-circle-xmark flex justify-end"
                ></i>

                <div class="flex justify-center pb-5">
                    <h2 class="text-2xl">{{ showAttractionName }}</h2>
                </div>
                <div>
                    <div v-for="data in user">
                        <h2 class="text-xl">{{ data.username }}</h2>
                    </div>
                    <div>
                        <p class="text-sm">
                            Poste Public <i class="fa-solid fa-circle-info"></i>
                        </p>
                    </div>
                </div>
                <div class="flex justify-center pt-5 pb-5">
                    <RatingStars @rating-selected="handleRatingSelected" />
                </div>

                <div class="mx-auto container max-w-xl pb-10">
                    <textarea
                        v-model="content"
                        id="content"
                        placeholder="Donner votre avis sur cet attraction ;)"
                        minlength="10"
                        maxlength="500"
                        rows="5"
                        class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
                    />
                </div>

                <div class="flex justify-end">
                    <button
                        @click="AddRating"
                        type="button"
                        class="px-4 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-[#344d59] rounded-md hover:stone-600 focus:outline-none focus:[#344d59]"
                    >
                        Publier
                    </button>
                </div>

                <p class="text-xs mb-1"></p>
            </div>
        </div>

        <div
            v-if="showModalResto"
            class="h-full absolute z-10 flex justify-start items-start pt-16 pl-2"
        >
            <div
                class="flex flex-col bg-white w-[80%] sm:w-[400px] rounded-md max-h-[74vh] overflow-y-auto"
            >
                <div class="relative z-10 flex justify-end top-6 right-2">
                    <i
                        @click="removeRestoResults"
                        class="fa-solid fa-xmark fa-2xl text-gray-200 hover:text-[#344d59] fixed"
                    ></i>
                </div>
                <div>
                    <div>
                        <h2 class="text-2xl pl-4 pt-4 pb-4">
                            {{ showRestoName }}
                        </h2>
                        <hr />
                    </div>

                    <div class="pt-8">
                        <p
                            class="text-sm flex justify-center text-justify pb-4 px-10"
                        >
                            {{ showRestoDesc }}
                        </p>
                        <hr />

                        <div class="pt-5">
                            <h2 class="pl-4 pb-4">Carte du restaurant :</h2>
                            <img
                                v-if="showRestoImg"
                                :src="`${BASE_URL}/${showRestoImg.replace(
                                    /\\/g,
                                    '/'
                                )}`"
                                alt="Image attraction"
                                class="w-[408px] h-[272px]]"
                            />
                        </div>

                        <div class="pl-4 pt-4 pb-4">
                            <p>
                                Lien de la carte complète :
                                <button
                                    class="text-blue-500 underline"
                                    @click="carteResto"
                                >
                                    Ici
                                </button>
                            </p>
                        </div>

                        <hr />

                        <div class="pt-5 pb-5 pl-4">
                            <div v-if="heureLocale < '10'">
                                <span class="text-red-700">Fermé</span> -
                                Ouverture à
                                {{ showRestoOpen }}
                            </div>
                            <div v-if="heureLocale > '18'">
                                <span class="text-red-700">Fermé</span> -
                                Ouverture à
                                {{ showRestoOpen }}
                            </div>
                            <div
                                v-if="heureLocale < '18' && heureLocale > '10'"
                            >
                                <span class="text-green-500">Ouvert</span> -
                                Fermeture à
                                {{ showRestoClose }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-if="showModalMagasin"
            class="h-full absolute z-10 flex justify-start items-start pt-16 pl-2"
        >
            <div
                class="flex flex-col bg-white w-[80%] sm:w-[400px] rounded-md max-h-[74vh] overflow-y-auto"
            >
                <div class="relative z-10 flex justify-end top-6 right-2">
                    <i
                        @click="removeMagasinResults"
                        class="fa-solid fa-xmark fa-2xl text-gray-200 hover:text-[#344d59] fixed"
                    ></i>
                </div>
                <div>
                    <img
                        v-if="showMagasinImg"
                        :src="`${BASE_URL}/${showMagasinImg.replace(
                            /\\/g,
                            '/'
                        )}`"
                        alt="Image attraction"
                        class="w-[408px] h-[272px]]"
                    />

                    <div>
                        <h2 class="text-2xl pl-4 pt-4 pb-4">
                            {{ showMagasinName }}
                        </h2>
                        <hr />
                    </div>

                    <div class="pt-8">
                        <p
                            class="text-sm flex justify-center text-justify pb-4 px-10"
                        >
                            {{ showMagasinDesc }}
                        </p>
                        <hr />

                        <div class="pt-5 pb-5">
                            <div v-if="heureLocale < '10'">
                                <span class="text-red-700">Fermé</span> -
                                Ouverture à
                                {{ showMagasinOpen }}
                            </div>
                            <div v-if="heureLocale > '18'">
                                <span class="text-red-700">Fermé</span> -
                                Ouverture à
                                {{ showMagasinOpen }}
                            </div>
                            <div
                                v-if="heureLocale < '18' && heureLocale > '10'"
                            >
                                <span class="text-green-500">Ouvert</span> -
                                Fermeture à
                                {{ showMagasinClose }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="map" class="h-[555px] lg:h-[606px] z-[1]"></div>
    </div>
</template>

<style scoped>
.selected {
    border-bottom: 2px solid blue;
}
.tooltipSeultext {
    visibility: visible;
    width: 120px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 10;
    bottom: 120%;
    left: 41%;
    margin-left: -90px;
    opacity: 1;
    transition: opacity 0.3s;
}
.tooltipSeultext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
}

.tooltipAcctext {
    visibility: visible;
    width: 120px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 10;
    bottom: 130%;
    left: 41%;
    margin-left: -90px;
    opacity: 1;
    transition: opacity 0.3s;
}
.tooltipAcctext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
}
</style>
