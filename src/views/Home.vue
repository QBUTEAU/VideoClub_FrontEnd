<template>
    <div>
        <Header />
        <main class="home__main">
            <h1>Bienvenue dans mon vidéo-club !</h1>
            <p>Je suis Quentin et je vous propose de découvrir quelques films,
                des acteurs et des genres cinématographiques (tout est fictif, merci FakerProvider).
            </p>
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
        async fetchLatestMovies() {
            try {
                const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/movies');
                const movies = response.data['hydra:member'];
                movies.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
                this.latestMovies = movies.slice(0, 4);
            } catch (error) {
                console.error('Derniers FILMS : Error :', error);
            }
        },
        async fetchLatestActors() {
            try {
                const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/actors');
                const actors = response.data['hydra:member'];
                actors.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                this.latestActors = actors.slice(0, 4);
            } catch (error) {
                console.error('Dernier ACTEURS : Error :', error);
            }
        }
    }
};
</script>