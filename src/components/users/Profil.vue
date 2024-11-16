<script setup>
import { useUsersStore } from "../../stores/users.js";
import { useAttractionsStore } from "../../stores/attractions.js";
import { onMounted, computed, ref } from "vue";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";

const usersStore = useUsersStore();
const attractionStore = useAttractionsStore();

//Empecher l'accès à la page si l'utilisateur n'est pas connecté
const isConnect = computed(() => localStorage.getItem("savedToken"));

const tokenDecode = computed(() => jwtDecode(isConnect.value));

const id = computed(() => tokenDecode.value.id_user);

onMounted(() => {
    usersStore.fetchOneUser(id.value);
    attractionStore.fetchRatingAttraction(id.value);
});

//Récupère l'utilisateurs connecter
const user = computed(() => usersStore.getUsersById);

//Récupère les commentaires de l'utilisateur
const comments = computed(() => attractionStore.getComments);

// Modification des données de l'utilisateurs

const updateUsers = () => {
    const username = document.querySelector("#username").value;
    const email = document.querySelector("#email").value;
    Swal.fire({
        title: "Etes vous sure ?",
        text: "Vos informations seront modifiées !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, modifier !",
    }).then((result) => {
        if (result.isConfirmed && id !== 1) {
            Swal.fire(
                "Modifier",
                "Vos informations ont bien été modifiées.",
                "success"
            );
            usersStore.updateUser(id.value, username, email);
        } else {
            Swal.fire(
                "Erreur",
                "Vos informations n'ont pas été modifiées.",
                "error"
            );
        }
    });
};

const showAbout = ref(false);
const showPost = ref(false);

//const token = useRef(localStorage.getItem("token"));
//const tokenDecode = jwtDecode(token.current);

/* useEffect(() => {
        dispatch(fetchUser(tokenDecode.id_user));
        dispatch(fetchComments(tokenDecode.id_user));
    }, []); */

const showAboutOrNot = () => {
    showAbout.value = true;
    showPost.value = false;
    document.getElementById("about").style.fontWeight = "bold";
    document.getElementById("post").style.fontWeight = "normal";
};

const showPostOrNot = () => {
    showPost.value = true;
    showAbout.value = false;
    document.getElementById("post").style.fontWeight = "bold";
    document.getElementById("about").style.fontWeight = "normal";
};
</script>
<template>
    <div className="mx-auto container">
        <img
            className="md:w-full md:h-48 hidden md:flex"
            src="assets/img/background.jpg"
            alt=""
        />
        <div className="md:grid md:grid-cols-2">
            <div className="flex justify-center">
                <div
                    className="bg-white w-64 h-80 shadow-xl md:absolute md:bottom-40 xl:bottom-56"
                >
                    <div>
                        <div className="flex justify-center pt-10">
                            <img
                                className="rounded-full w-40"
                                src="https://tecdn.b-cdn.net/img/new/avatars/2.jpg"
                            />
                            <div
                                className="absolute top-56 left-52 md:top-36 md:left-44 bg-gray-400 rounded-full w-10 h-10 flex justify-center items-center"
                            >
                                <button>
                                    <img
                                        className="w-5 h-5 mx-auto"
                                        src="assets/img/crayon.png"
                                        alt=""
                                    />
                                </button>
                            </div>
                        </div>
                        <div v-for="data in user">
                            <p className="text-center pt-4 text-xl font-bold">
                                {{ data.username }}
                            </p>
                            <p className="text-center pt-2">{{ data.email }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div
                    className="flex justify-center xl:justify-start pt-8 md:pr-40"
                >
                    <div className="grid grid-cols-2">
                        <button
                            id="about"
                            @click="showAboutOrNot"
                            className="pr-8 text-lg"
                        >
                            Profil
                        </button>
                        <button
                            id="post"
                            @click="showPostOrNot"
                            className="pl-8 text-lg"
                        >
                            Avis
                        </button>
                    </div>
                </div>

                <div
                    v-if="showAbout"
                    className="flex justify-center xl:justify-start pt-8 pb-8"
                >
                    <div
                        className="bg-white w-52 inline-block shadow-xl pb-2 md:w-[360px] md:inline-block xl:w-full xl:max-w-2xl"
                    >
                        <form id="aboutForm">
                            <p className="pl-2 pt-4 font-semibold">
                                <label htmlFor="aboutInput"> A propos : </label>
                            </p>
                            <p className="text-center pt-4 mx-4">
                                <textarea
                                    id="aboutInput"
                                    className="w-full"
                                    rows="4"
                                    placeholder="Saisissez votre texte ici..."
                                ></textarea>
                            </p>
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-4"
                            >
                                Enregistrer
                            </button>
                        </form>
                    </div>
                </div>

                <div
                    v-if="showPost"
                    class="post-container max-h-[500px] overflow-y-auto"
                >
                    <div
                        key="{post.id}"
                        className="flex justify-center pt-8 pb-8 xl:pr-10"
                    >
                        <div
                            className="bg-white w-52  inline-block shadow-xl md:w-80 xl:w-full"
                        >
                            <p className="pt-4 pl-4 font-bold">
                                Maxime Rossbach
                                {{ comments }}
                            </p>
                            <p className="pl-4 pt-1 italic">Konda - Walibi</p>
                            <p className="pl-4 pt-4">3/5</p>
                            <p className="pl-4 pt-2 pr-4 max-w-sm xl:max-w-3xl">
                                Moyen cette attraction, je ne la recommande pas
                            </p>

                            <p className="pt-4 pl-4">23/01/23</p>
                            <div className="flex justify-end pr-2 pt-4 pb-2">
                                <button>
                                    <img
                                        className="w-7 h-7 mx-auto"
                                        src="assets/img/delete.png"
                                        alt=""
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
