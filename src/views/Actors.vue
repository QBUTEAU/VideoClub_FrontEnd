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
                <button @click="prevPage" :disabled="currentPage === 1">Précédent</button>
                <span>Page {{ currentPage }} sur {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
            </div>

            <div class="actor__list">
                <ActorCard v-for="actor in paginatedActors" :key="actor.id" :actor="actor" />
            </div>

            <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">Précédent</button>
                <span>Page {{ currentPage }} sur {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">Suivant</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Header from "@/components/Header.vue";
import ActorCard from "@/components/ActorCard.vue";
import AddActor from "@/components/AddActor.vue";

export default {
    components: {
        Header,
        ActorCard,
        AddActor // Enregistrer le composant
    },
    data() {
        return {
            actors: [],
            searchTerm: '',
            currentPage: 1,
            actorsPerPage: 20,
            showAddActorForm: false // Ajout de la variable pour contrôler l'affichage du formulaire
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
            try {
                const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/actors');
                this.actors = response.data['hydra:member'];
            } catch (error) {
                console.error('Erreur lors de la récupération des acteurs :', error);
            }
        },
        handleActorAdded(newActor) {
            this.actors.push(newActor); // Ajouter l'acteur à la liste existante
            this.showAddActorForm = false; // Cacher le formulaire après ajout
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
        }
    }
};
</script>