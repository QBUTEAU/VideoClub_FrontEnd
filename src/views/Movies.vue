<template>
    <div>
        <Header />

        <AddMovie v-if="showAddMovieForm" @movie-added="handleMovieAdded" @cancel="toggleAddMovieForm" />

        <div v-if="!showAddMovieForm">
            <h2>Voici la liste des films :</h2>
            <div class="search-add">
                <input type="text" v-model="searchTerm" placeholder="Rechercher un film..." class="search-bar">
                <button v-if="!showAddMovieForm" @click="toggleAddMovieForm" class="add-actor">
                    <i class="fa-solid fa-plus" style="margin-right: 10px;"></i>AJOUTER UN FILM
                </button>
            </div>

            <div class="pagination">
                <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Précédente</button>
                <span>Page {{ currentPage }} sur {{ totalPages }}</span>
                <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">Suivante</button>
            </div>

            <div class="movie__list">
                <MovieCard v-for="movie in paginatedMovies" :key="movie.id" :movie="movie" />
            </div>

            <div class="pagination">
                <button :disabled="currentPage === 1" @click="changePage(currentPage - 1)">Précédente</button>
                <span>Page {{ currentPage }} sur {{ totalPages }}</span>
                <button :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">Suivante</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Header from "@/components/Header.vue";
import MovieCard from "@/components/MovieCard.vue";
import AddMovie from "@/components/AddMovie.vue"; // Importer le composant

export default {
    components: {
        Header,
        MovieCard,
        AddMovie // Enregistrer le composant
    },
    data() {
        return {
            movies: [],
            searchTerm: '',
            showAddMovieForm: false, // Contrôle l'affichage du formulaire d'ajout
            currentPage: 1,
            itemsPerPage: 20 // Nombre de films par page
        };
    },
    created() {
        this.fetchMovies();
    },
    computed: {
        filteredMovies() {
            return this.movies.filter(movie =>
                movie.title.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        },
        paginatedMovies() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredMovies.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredMovies.length / this.itemsPerPage);
        }
    },
    methods: {
        getToken() {
            return localStorage.getItem('jwt_token'); // Récupérer le token depuis le localStorage
        },
        redirectToLogin() {
            this.$router.push('/login'); // Redirection vers la page de login si pas de token
        },
        async fetchMovies() {
            const token = this.getToken();
            if (!token) {
                this.redirectToLogin(); // Redirection si pas de token
                return;
            }

            try {
                const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/movies?pagination=false', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Ajout du token JWT dans les en-têtes
                    }
                });
                this.movies = response.data['hydra:member'];

                // Trier les films par date de création
                this.movies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                console.log('Total movies fetched:', this.movies.length);
            } catch (error) {
                console.error('Error fetching movies:', error);
                if (error.response && error.response.status === 401) {
                    this.redirectToLogin(); // Redirection si l'authentification échoue
                }
            }
        },
        handleMovieAdded(newMovie) {
            this.movies.push(newMovie); // Ajouter le film à la liste existante
            this.showAddMovieForm = false; // Cacher le formulaire après ajout
            this.currentPage = 1; // Réinitialiser la page à 1 après l'ajout
        },
        toggleAddMovieForm() {
            this.showAddMovieForm = !this.showAddMovieForm; // Bascule l'état d'affichage
        },
        changePage(page) {
            this.currentPage = page; // Mettre à jour la page actuelle
            window.scrollTo(0, 0); // Faire défiler vers le haut de la page
        }
    }
};
</script>
