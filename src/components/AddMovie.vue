<template>
    <div>
        <Header />
        <h2>Ajouter un Film :</h2>
        <form class="form" @submit.prevent="addMovie">
            <button type="button" @click="$emit('cancel')">ANNULER</button>
            <label for="title">Titre :<span>*</span></label>
            <input type="text" v-model="movie.title" placeholder="Titre du film" required />

            <label for="director">Réalisateur :</label>
            <input type="text" v-model="movie.director" placeholder="Réalisateur" />

            <label for="media">Media :</label>
            <input type="text" v-model="movie.media" placeholder="URL de l'image" />

            <label for="releaseDate">Date de sortie :</label>
            <input type="date" v-model="movie.releaseDate" />

            <label for="rating">Note :</label>
            <input type="number" v-model="movie.rating" placeholder="Note" min="0" max="5" step="0.1" />

            <label for="duration">Durée :</label>
            <input type="number" v-model="movie.duration" placeholder="Durée en minutes" min="90" max="195" />

            <label for="description">Synopsis :</label>
            <textarea v-model="movie.description" placeholder="Description du film"></textarea>

            <label for="entries">Nombre d'entrées :</label>
            <input type="number" v-model="movie.entries" placeholder="250000" />


            <!-- Remplacement des checkboxes par des selects -->
            <label for="categories">Catégories :</label>
            <select v-model="selectedCategories" multiple>
                <option v-for="category in allCategories" :key="category.id" :value="category['@id']">
                    {{ category.title }}
                </option>
            </select>

            <label for="actors">Acteurs :</label>
            <select v-model="selectedActors" multiple>
                <option v-for="actor in allActors" :key="actor.id" :value="actor['@id']">
                    {{ actor.firstname }} {{ actor.lastname }}
                </option>
            </select>

            <p>*ces champs doivent à tout prix être remplis</p>

            <div class="form__buttons">
                <button type="submit">Ajouter</button>
                <button type="button" @click="$emit('cancel')">Annuler</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import { RouterLink } from 'vue-router';

export default {
    name: 'AddMovie',
    data() {
        return {
            movie: {
                title: '',
                director: '',
                releaseDate: '',
                media: '',
                rating: null,
                duration: null,
                description: '',
                entries: null
            },
            allCategories: [], // Pour stocker les catégories disponibles
            selectedCategories: [], // Pour les catégories sélectionnées
            allActors: [], // Pour stocker les acteurs disponibles
            selectedActors: [] // Pour les acteurs sélectionnés
        };
    },
    created() {
        this.fetchCategories();
        this.fetchActors();
    },
    methods: {
        async fetchCategories() {
            try {
                const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/categories');
                this.allCategories = response.data['hydra:member'];
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        async fetchActors() {
            try {
                const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/actors');
                this.allActors = response.data['hydra:member'];
            } catch (error) {
                console.error('Error fetching actors:', error);
            }
        },
        async addMovie() {
            // Formatage des données du film
            const movieData = {
                title: this.movie.title.trim(),
                director: this.movie.director.trim(),
                releaseDate: this.movie.releaseDate ? new Date(this.movie.releaseDate).toISOString() : null,
                media: this.movie.media,
                rating: this.movie.rating,
                duration: this.movie.duration,
                description: this.movie.description.trim(),
                entries: this.movie.entries,
                categories: this.selectedCategories, // Catégories sélectionnées
                actors: this.selectedActors // Acteurs sélectionnés
            };

            // Afficher les données du film pour le débogage
            console.log('Movie data being sent:', movieData);

            // Envoi des données
            try {
                const response = await axios.post('http://symfony.mmi-troyes.fr:8319/api/movies', movieData);
                console.log('Movie added successfully:', response.data);

                // Afficher la confirmation
                const confirmation = confirm(`Le film ${movieData.title} a bien été ajouté.\nVoulez-vous continuer ?`);
                if (confirmation) {
                    this.$emit('movie-added', response.data); // Émettre l'événement avec le film ajouté
                    this.resetForm(); // Réinitialiser le formulaire après ajout
                }
            } catch (error) {
                console.error('Error adding movie:', error.response ? error.response.data : error);
                alert(`Une erreur est survenue lors de l'ajout du film. Veuillez réessayer.`);
            }
        },
        resetForm() {
            this.movie = {
                title: '',
                director: '',
                releaseDate: '',
                media: '',
                rating: null,
                duration: null,
                description: '',
                entries: null
            };
            this.selectedCategories = [];
            this.selectedActors = [];
        }
    }
};
</script>
