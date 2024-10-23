<template>
    <div>
        <Header />
        <main class="home__main">
            <h1>Bienvenue dans le vidéo-club MMI !</h1>
        </main>
        <h2>Voici les 4 films les plus récents :</h2>
        <div class="movie__list" v-if="latestMovies.length">
            <MovieCard v-for="movie in latestMovies" :key="movie.id" :movie="movie" />
        </div>
        <div class="loading" v-else>
            <p>Chargement des films...</p>
        </div>
        <h2>Voici les 4 derniers acteurs ajoutés :</h2>
        <div class="actor__list" v-if="latestActors.length">
            <ActorCard v-for="actor in latestActors" :key="actor.id" :actor="actor" />
        </div>
        <div class="loading" v-else>
            <p>Chargement des acteurs...</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { RouterLink } from "vue-router";
import Header from "@/components/Header.vue";
import MovieCard from "@/components/MovieCard.vue";
import ActorCard from "@/components/ActorCard.vue";

export default {
    components: {
        Header,
        RouterLink,
        MovieCard,
        ActorCard
    },
    data() {
        return {
            latestMovies: [],
            latestActors: []
        };
    },
    created() {
        this.fetchLatestMovies();
        this.fetchLatestActors();
    },
    methods: {
        fetchLatestMovies() {
            const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage
            axios.get("http://symfony.mmi-troyes.fr:8319/api/movies", {
                headers: {
                    'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => {
                    this.latestMovies = response.data["hydra:member"]
                        .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
                        .slice(0, 4);
                })
                .catch((error) => {
                    console.error(error);
                    alert('Veuillez-vous connecter afin de voir le contenu de la page.');
                });
        },
        fetchLatestActors() {
            const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage
            axios.get("http://symfony.mmi-troyes.fr:8319/api/actors", {
                headers: {
                    'Authorization': `Bearer ${token}`, // Ajouter le token dans l'en-tête Authorization
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => {
                    this.latestActors = response.data["hydra:member"]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 4);
                })
                .catch((error) => {
                    console.error(error);
                    alert('Veuillez-vous connecter afin de voir le contenu de la page.');
                });
        },
    }
};
</script>
