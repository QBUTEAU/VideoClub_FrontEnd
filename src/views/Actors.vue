<template>
    <div>
        <Header />
        <AddActor v-if="showAddActorForm" @actor-added="handleActorAdded" @cancel="toggleAddActorForm" />

        <div v-if="!showAddActorForm">
            <h2>Voici la liste des acteurs :</h2>
            <div class="search-add">
                <input type="text" v-model="searchTerm" placeholder="Rechercher un acteur..." class="search-bar">
                <button v-if="!showAddActorForm" @click="toggleAddActorForm" class="add-actor">
                    <i class="fa-solid fa-plus" style="margin-right: 10px;"></i>
                    AJOUTER UN ACTEUR
                </button>
            </div>

            <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">Précédente</button>
                <span>Page {{ currentPage }} sur {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">Suivante</button>
            </div>

            <div class="actor__list">
                <ActorCard v-for="actor in paginatedActors" :key="actor.id" :actor="actor" />
            </div>

            <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">Précédente</button>
                <span>Page {{ currentPage }} sur {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">Suivante</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Header from "@/components/Header.vue";
import ActorCard from "@/components/ActorCard.vue";
import AddActor from "@/components/AddActor.vue";
import { useRouter } from 'vue-router';

export default {
    components: {
        Header,
        ActorCard,
        AddActor
    },
    data() {
        return {
            actors: [],
            searchTerm: '',
            currentPage: 1,
            actorsPerPage: 20,
            showAddActorForm: false
        };
    },
    created() {
        this.fetchActors();
    },
    computed: {
        filteredActors() {
            return this.actors.filter(actor =>
                actor.firstname.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                actor.lastname.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        },
        paginatedActors() {
            const start = (this.currentPage - 1) * this.actorsPerPage;
            const end = start + this.actorsPerPage;
            return this.filteredActors.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.filteredActors.length / this.actorsPerPage);
        }
    },
    methods: {
        async fetchActors() {
            const token = localStorage.getItem('jwt_token'); // Récupérer le token depuis le localStorage
            if (!token) {
                this.redirectToLogin(); // Rediriger si pas de token
                return;
            }

            try {
                const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/actors', {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Ajouter le token dans les en-têtes
                        'Content-Type': 'application/json'
                    }
                });
                this.actors = response.data['hydra:member'];
            } catch (error) {
                console.error('Erreur lors de la récupération des acteurs :', error);
                if (error.response && error.response.status === 401) {
                    this.redirectToLogin(); // Rediriger si session expirée (401)
                }
            }
        },
        async handleActorAdded(newActor) {
            const token = localStorage.getItem('jwt_token'); // Récupérer le token depuis le localStorage
            if (!token) {
                this.redirectToLogin(); // Rediriger si pas de token
                return;
            }

            try {
                const response = await axios.post('http://symfony.mmi-troyes.fr:8319/api/actors', newActor, {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Ajouter le token dans les en-têtes
                        'Content-Type': 'application/json'
                    }
                });
                this.actors.push(response.data); // Ajouter l'acteur retourné à la liste existante
                this.showAddActorForm = false; // Masquer le formulaire après l'ajout
            } catch (error) {
                console.error('Erreur lors de l\'ajout de l\'acteur :', error);
                if (error.response && error.response.status === 401) {
                    this.redirectToLogin(); // Rediriger si session expirée (401)
                }
            }
        },
        toggleAddActorForm() {
            this.showAddActorForm = !this.showAddActorForm; // Bascule l'état d'affichage
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                window.scrollTo(0, 0); // Remonter en haut de la page
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                window.scrollTo(0, 0); // Remonter en haut de la page
            }
        },
        redirectToLogin() {
            this.$router.push('/login'); // Redirection vers la page de connexion
        }
    }
};
</script>
