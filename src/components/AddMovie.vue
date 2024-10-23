<template>
    <div>
        <Header />
        <h2>Ajouter un Film :</h2>
        <form class="form" @submit.prevent="addMovie">

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

            <div class="dropdown">
                <button class="dropdown-toggle" type="button" @click="toggleActorsDropdown">
                    Sélectionner les acteurs
                </button>
                <div v-if="showActorsDropdown" class="dropdown-menu">
                    <div v-for="actor in allActors" :key="actor.id" class="dropdown-item">
                        <input type="checkbox" :value="actor['@id']" :id="'actor-' + actor.id"
                            v-model="selectedActors" />
                        <label :for="'actor-' + actor.id">{{ actor.firstname }} {{ actor.lastname }}</label>
                    </div>
                </div>
            </div>

            <label for="duration">Durée :</label>
            <input type="number" v-model="movie.duration" placeholder="Durée en minutes" min="90" max="195" />

            <label for="description">Synopsis :</label>
            <textarea v-model="movie.description" placeholder="Description du film"></textarea>

            <div class="dropdown">
                <button class="dropdown-toggle" type="button" @click="toggleCategoriesDropdown">
                    Sélectionner les catégories
                </button>
                <div v-if="showCategoriesDropdown" class="dropdown-menu">
                    <div v-for="category in allCategories" :key="category.id" class="dropdown-item">
                        <input type="checkbox" :value="category['@id']" :id="'category-' + category.id"
                            v-model="selectedCategories" />
                        <label :for="'category-' + category.id">{{ category.title }}</label>
                    </div>
                </div>
            </div>

            <label for="entries">Nombre d'entrées :</label>
            <input type="number" v-model="movie.entries" placeholder="250000" />

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
            allCategories: [],
            selectedCategories: [],
            allActors: [],
            selectedActors: [],
            showCategoriesDropdown: false,
            showActorsDropdown: false
        };
    },
    created() {
        this.fetchCategories();
        this.fetchActors();
    },
    methods: {
        // Récupérer le token depuis localStorage
        getToken() {
            return localStorage.getItem('jwt_token');
        },
        // Rediriger vers la page de connexion si le token n'est pas présent
        redirectToLogin() {
            this.$router.push('/login');
        },
        // Récupérer les catégories depuis l'API
        async fetchCategories() {
            const token = this.getToken();
            if (!token) {
                this.redirectToLogin();
                return;
            }
            try {
                const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/categories', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.allCategories = response.data['hydra:member'];
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        },
        // Récupérer les acteurs depuis l'API
        async fetchActors() {
            const token = this.getToken();
            if (!token) {
                this.redirectToLogin();
                return;
            }
            try {
                const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/actors', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                this.allActors = response.data['hydra:member'];
            } catch (error) {
                console.error('Error fetching actors:', error);
            }
        },
        // Ajouter un film
        async addMovie() {
            const token = this.getToken();
            if (!token) {
                this.redirectToLogin();
                return;
            }

            const movieData = {
                title: this.movie.title.trim(),
                director: this.movie.director.trim(),
                releaseDate: this.movie.releaseDate ? new Date(this.movie.releaseDate).toISOString() : null,
                media: this.movie.media,
                rating: this.movie.rating,
                duration: this.movie.duration,
                description: this.movie.description.trim(),
                entries: this.movie.entries,
                categories: this.selectedCategories,
                actors: this.selectedActors
            };

            try {
                const response = await axios.post('http://symfony.mmi-troyes.fr:8319/api/movies', movieData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Movie added successfully:', response.data);

                const confirmation = confirm(`Le film ${movieData.title} a bien été ajouté.\nVoulez-vous continuer ?`);
                if (confirmation) {
                    this.$emit('movie-added', response.data);
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error adding movie:', error.response ? error.response.data : error);
                alert(`Une erreur est survenue lors de l'ajout du film. Veuillez réessayer.`);
            }
        },
        // Réinitialiser le formulaire
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
        },
        // Bascule pour afficher ou masquer les catégories
        toggleCategoriesDropdown() {
            this.showCategoriesDropdown = !this.showCategoriesDropdown;
        },
        // Bascule pour afficher ou masquer les acteurs
        toggleActorsDropdown() {
            this.showActorsDropdown = !this.showActorsDropdown;
        }
    }
};
</script>
