<template>
    <div>
        <Header />

        <!-- Formulaire de modification du film -->
        <div v-if="editMode">
            <EditMovie :movie="movie" @submit="submitForm" @cancel="cancelEdit" />
        </div>

        <div v-if="!editMode">
            <h2 class="about">À propos du film :</h2>
            <div class="film" v-if="movie">
                <div class="film__img" :style="{ backgroundImage: 'url(' + movie.media + ')' }">
                </div>
                <div class="film__info">
                    <h3>{{ movie.title }}</h3>
                    <p v-if="movie.director"><strong>Réalisé par</strong> {{ movie.director }}
                        <span v-if="movie.releaseDate">- <strong>Sorti le</strong> {{ formatDate(movie.releaseDate)
                            }}</span>
                    </p>
                    <p v-if="movie.rating"><strong>Note :</strong> {{ movie.rating }} <i class="fa-solid fa-star"></i>
                    </p>
                    <p v-if="movie.description"><strong>Synopsis :</strong> {{ movie.description }}</p>
                    <p v-if="movie.duration"><strong>Durée :</strong> {{ movie.duration }} min</p>
                    <p v-if="movie.entries"><strong>Nb d'entrée :</strong> {{ movie.entries }}</p>
                    <p v-if="categories.length" class="film__categories">
                        <strong>{{ getCategoryText(categories.length) }} :</strong>
                        <span v-for="category in categories" :key="category.id">
                            {{ category.title }}
                        </span>
                    </p>
                    <p style="font-style: italic;">Ajouté le {{ formatDate(movie.createdAt) }}<span
                            v-if="movie.updatedAt"> - Mis à jour le {{ formatDate(movie.updatedAt) }}</span></p>
                    <div class="crud">
                        <i class="fa-solid fa-pen-to-square" @click="toggleEditMode"></i>
                        <!-- Icône de suppression avec confirmation dynamique -->
                        <i class="fa-solid fa-trash" @click="confirmDeleteMovie"></i>
                    </div>
                </div>
            </div>

            <h2 v-if="actors.length">Cast du film :</h2>
            <div v-if="actors.length" class="actor__list">
                <ActorCard v-for="actor in actors" :key="actor.id" :actor="actor" />
            </div>
            <div class="loading" v-else>
                <p>Le cast n'est pas encore connu.</p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Header from '@/components/Header.vue';
import ActorCard from '@/components/ActorCard.vue';
import EditMovie from '@/components/EditMovie.vue'; // Importation du nouveau composant

export default {
    name: 'MovieDetails',
    components: { Header, ActorCard, EditMovie },
    data: () => ({
        movie: null,
        categories: [],
        actors: [],
        editMode: false, // Contrôle du mode d'édition
    }),
    created() {
        this.fetchMovieDetails();
    },
    methods: {
        async fetchMovieDetails() {
            const movieId = this.$route.params.id;
            try {
                const response = await axios.get(`http://symfony.mmi-troyes.fr:8319/api/movies/${movieId}`);
                this.movie = response.data;

                // Fetch categories details
                const categoryPromises = this.movie.categories.map((url) =>
                    axios.get(`http://symfony.mmi-troyes.fr:8319${url}`)
                );
                const categoryResponses = await Promise.all(categoryPromises);
                this.categories = categoryResponses.map((res) => res.data);

                // Fetch actors details
                const actorPromises = this.movie.actors.map((url) =>
                    axios.get(`http://symfony.mmi-troyes.fr:8319${url}`)
                );
                const actorResponses = await Promise.all(actorPromises);
                this.actors = actorResponses.map((res) => res.data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        },
        // Formater la date pour l'affichage
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        },
        getCategoryText(count) {
            return count === 1 ? 'Catégorie' : 'Catégories';
        },
        // Bascule le mode édition
        toggleEditMode() {
            this.editMode = !this.editMode;
        },
        // Génère la date actuelle au format "7 octobre 2024"
        getCurrentDate() {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // Mois sur 2 chiffres
            const dd = String(today.getDate()).padStart(2, '0'); // Jour sur 2 chiffres
            return `${yyyy}-${mm}-${dd}`;
        },
        // Méthode appelée lors de la soumission du formulaire
        async submitForm(updatedMovie) {
            const movieId = this.$route.params.id;
            // Ajouter la date actuelle dans updatedAt
            updatedMovie.updatedAt = this.getCurrentDate();

            try {
                // PUT request pour modifier le film
                await axios.put(`http://symfony.mmi-troyes.fr:8319/api/movies/${movieId}`, updatedMovie);
                alert(`Le film a bien été modifié.`);
                this.editMode = false; // Désactive le mode d'édition
                this.fetchMovieDetails(); // Recharge les détails du film après modification
            } catch (error) {
                console.error('Error updating movie:', error);
                alert('Une erreur est survenue lors de la modification du film.');
            }
        },
        // Annule l'édition et revient aux détails du film
        cancelEdit() {
            this.editMode = false;
            this.fetchMovieDetails(); // Recharge les détails d'origine du film
        },
        // Méthode pour confirmer et supprimer le film
        async confirmDeleteMovie() {
            const isConfirmed = confirm('Êtes-vous sûr de vouloir supprimer ce film ?');
            if (isConfirmed) {
                this.deleteMovie();
            }
        },
        // Méthode pour supprimer le film
        async deleteMovie() {
            const movieId = this.$route.params.id;
            try {
                await axios.delete(`http://symfony.mmi-troyes.fr:8319/api/movies/${movieId}`);
                alert(`Le film a bien été supprimé.`);
                this.$router.push('/movies'); // Redirige vers la page des films après suppression
            } catch (error) {
                console.error('Error deleting movie:', error);
                alert(`Une erreur est survenue lors de la suppression du film. Veuillez réessayer.`);
            }
        },
    },
};
</script>
