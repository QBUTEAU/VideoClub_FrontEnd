<template>
    <div>
        <h2>Modifier :</h2>
        <form class="form" @submit.prevent="submitForm">
            <label for="title">Titre :<span>*</span></label>
            <input type="text" v-model="localMovie.title" required />

            <label for="director">Réalisateur :</label>
            <input type="text" v-model="localMovie.director" required />

            <label for="releaseDate">Date de sortie :</label>
            <input type="date" v-model="localMovie.releaseDate" />

            <label for="media">Media :</label>
            <input type="text" v-model="localMovie.media" />

            <label for="rating">Note :</label>
            <input type="number" v-model="localMovie.rating" min="0" max="5" step="0.1" />

            <label for="description">Synopsis :</label>
            <textarea v-model="localMovie.description"></textarea>

            <label for="duration">Durée (min) :</label>
            <input type="number" v-model="localMovie.duration" min="90" max="195" />

            <label for="entries">Nombre d'entrées :</label>
            <input type="number" v-model="localMovie.entries" />

            <div class="form__buttons">
                <button type="submit">Modifier</button>
                <button type="button" @click="cancelEdit">Annuler</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'EditMovie',
    props: {
        movie: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            localMovie: { ...this.movie }, // Faire une copie locale pour l'édition
        };
    },
    methods: {
        async submitForm() {
            const token = this.getToken(); // Get the JWT token

            if (!token) {
                this.redirectToLogin(); // Redirect to login if no token
                return;
            }

            try {
                await axios.put(`http://symfony.mmi-troyes.fr:8319/api/movies/${this.movie.id}`, this.localMovie, {
                    headers: { 'Authorization': `Bearer ${token}` } // Include the token in the request headers
                });
                this.$emit('submit', this.localMovie); // Emit the modified data to the parent
            } catch (error) {
                console.error('Error updating movie:', error);
                alert('Une erreur est survenue lors de la modification du film.');
            }
        },
        cancelEdit() {
            this.$emit('cancel'); // Emit the cancel event to the parent
        },
        getToken() {
            return localStorage.getItem('jwt_token'); // Retrieve the JWT token from localStorage
        },
        redirectToLogin() {
            this.$router.push('/login'); // Redirect to login if the token is not present
        },
    },
};
</script>
