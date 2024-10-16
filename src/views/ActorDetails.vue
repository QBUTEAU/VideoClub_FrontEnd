<template>
    <div>
        <Header />

        <div v-if="isEditing">
            <EditActor :actor="actor" @actor-updated="onActorUpdated" @cancel="cancelEdit" />
        </div>

        <div v-else>
            <h2 class="about" v-if="actor">{{ getActorTitle(actor.gender) }} :</h2>
            <div class="actor__details" v-if="actor">
                <div class="actor-details__img" :style="{ backgroundImage: 'url(' + actor.media + ')' }"></div>
                <div class="actor-details__info">
                    <h3>{{ actor.firstname }} {{ actor.lastname }}</h3>
                    <p><strong>{{ getBirthText(actor.gender) }} le</strong> {{ formatDate(actor.dob) }}</p>
                    <p v-if="actor.deathDate"><strong>{{ getDeathText(actor.gender) }} le</strong> {{
                        formatDate(actor.deathDate) }}</p>
                    <p><strong>Pays représentant :</strong> {{ actor.nationality }}</p>
                    <p><strong>Sexe :</strong> {{ actor.gender }}</p>
                    <p v-if="actor.bio"><strong>Biographie :</strong> {{ actor.bio }}</p>
                    <p v-if="actor.awards"><strong>Récompenses :</strong> {{ actor.awards }}</p>
                    <p style="font-style: italic;">
                        Ajouté le {{ formatDate(actor.createdAt) }}
                        <span v-if="actor.updatedAt">
                            - Mis à jour le {{ formatDate(actor.updatedAt) }}
                        </span>
                    </p>
                    <div class="crud">
                        <i class="fa-solid fa-pen-to-square" @click="editActor"></i>
                        <i class="fa-solid fa-trash" @click="confirmDeleteActor"></i>
                    </div>
                </div>
            </div>
        </div>

        <h2 v-if="movies.length">{{ getMoviesTitle(movies.length) }}</h2>
        <div class="movie__list" v-if="movies.length">
            <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
        </div>
        <div class="loading" v-else>
            <p>Aucun film notable.</p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Header from '@/components/Header.vue';
import MovieCard from '@/components/MovieCard.vue';
import EditActor from '@/components/EditActor.vue';

export default {
    name: 'ActorDetails',
    components: { Header, MovieCard, EditActor },
    data() {
        return {
            actor: null,
            movies: [],
            isEditing: false
        };
    },
    created() {
        this.fetchActorDetails();
    },
    methods: {
        async fetchActorDetails() {
            const actorId = this.$route.params.id;
            try {
                const response = await axios.get(`http://symfony.mmi-troyes.fr:8319/api/actors/${actorId}`);
                this.actor = response.data;
                this.fetchMovies(); // Récupérer les films de l'acteur
            } catch (error) {
                console.error('Error fetching actor details:', error);
            }
        },
        async fetchMovies() {
            if (this.actor.movies && this.actor.movies.length > 0) {
                const moviePromises = this.actor.movies.map(url => axios.get(`http://symfony.mmi-troyes.fr:8319${url}`));
                const movieResponses = await Promise.all(moviePromises);
                this.movies = movieResponses
                    .map(res => res.data)
                    .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)); // Tri par date de sortie
            } else {
                this.movies = [];
            }
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
        getBirthText(gender) {
            return gender === 'F' ? 'Née' : 'Né';
        },
        getDeathText(gender) {
            return gender === 'F' ? 'Décédée' : 'Décédé';
        },
        getMoviesTitle(count) {
            return count === 1 ? 'Film notable :' : 'Films notables :';
        },
        getActorTitle(gender) {
            return gender === 'F' ? 'À propos de l\'actrice' : 'À propos de l\'acteur';
        },
        editActor() {
            this.isEditing = true;
        },
        cancelEdit() {
            this.isEditing = false;
        },
        onActorUpdated(updatedActor) {
            this.actor = updatedActor; // Met à jour l'acteur avec les nouvelles données
            this.isEditing = false; // Désactiver le mode édition
        },
        async confirmDeleteActor() {
            const confirmation = confirm("Êtes-vous sûr de vouloir supprimer cet acteur ?");
            if (confirmation) {
                await this.deleteActor();
            }
        },
        async deleteActor() {
            try {
                await axios.delete(`http://symfony.mmi-troyes.fr:8319/api/actors/${this.actor.id}`);
                alert(`L'acteur a bien été supprimé.`);
                this.$router.push('/actors'); // Redirection vers la liste des acteurs
            } catch (error) {
                console.error("Erreur lors de la suppression de l'acteur:", error);
                alert("Une erreur s'est produite lors de la suppression de l'acteur.");
            }
        }
    }
};
</script>