<template>
    <div>
        <Header />

        <div v-if="editMode">
            <h2>Modifier le Genre</h2>
            <form class="form" @submit.prevent="submitForm">
                <label for="title">Titre :</label>
                <input type="text" v-model="category.title" required />

                <div class="form__buttons">
                    <button type="submit">Modifier</button>
                    <button type="button" @click="cancelEdit">Annuler</button>
                </div>
            </form>
        </div>

        <div v-if="!editMode">
            <h2>À propos du genre</h2>

            <div class="category__details" v-if="category">
                <!-- Affichage des informations de la catégorie -->
                <h3>{{ category.title }}</h3>
                <p style="font-style: italic;">Ajouté le {{ formatDate(category.createdAt) }}<span
                        v-if="category.updatedAt"><br>
                        Mis à jour le {{ formatDate(category.updatedAt) }}</span></p>

                <div class="crud">
                    <!-- Icônes pour modifier ou supprimer la catégorie -->
                    <i class="fa-solid fa-pen-to-square" @click="toggleEditMode"></i>
                    <i class="fa-solid fa-trash" @click="confirmDeleteCategory"></i>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
import Header from '@/components/Header.vue';

export default {
    name: 'CategoryDetails',
    components: { Header },
    data() {
        return {
            category: null, // Détails de la catégorie
            editMode: false, // Contrôle du mode édition
        };
    },
    created() {
        this.fetchCategoryDetails();
    },
    methods: {
        // Récupère les détails de la catégorie
        async fetchCategoryDetails() {
            const categoryId = this.$route.params.id;
            try {
                const response = await axios.get(`http://symfony.mmi-troyes.fr:8319/api/categories/${categoryId}`);
                this.category = response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération des détails de la catégorie :', error);
            }
        },
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        },
        // Confirme la suppression de la catégorie sans vérifier les films liés
        async confirmDeleteCategory() {
            const confirmation = confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?');
            if (confirmation) {
                this.deleteCategory();
            }
        },
        // Supprime la catégorie
        async deleteCategory() {
            const categoryId = this.$route.params.id;
            try {
                // Appel à l'API pour supprimer la catégorie
                await axios.delete(`http://symfony.mmi-troyes.fr:8319/api/categories/${categoryId}`);
                alert('Catégorie supprimée avec succès.');
                this.$router.push('/categories'); // Redirige vers la liste des catégories après suppression
            } catch (error) {
                console.error('Erreur lors de la suppression de la catégorie :', error);
                alert('Une erreur est survenue lors de la suppression.');
            }
        },
        // Bascule le mode édition
        toggleEditMode() {
            this.editMode = !this.editMode;
        },
        // Génère la date actuelle au format yyyy-mm-dd
        getCurrentDate() {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0'); // Mois sur 2 chiffres
            const dd = String(today.getDate()).padStart(2, '0'); // Jour sur 2 chiffres
            return `${yyyy}-${mm}-${dd}`;
        },
        // Soumet le formulaire de modification avec la date du jour dans updatedAt
        async submitForm() {
            const categoryId = this.$route.params.id;
            // Ajouter la date actuelle dans updatedAt
            this.category.updatedAt = this.getCurrentDate();

            try {
                await axios.put(`http://symfony.mmi-troyes.fr:8319/api/categories/${categoryId}`, this.category);
                alert('Le genre a bien été modifié.');
                this.editMode = false; // Sortir du mode édition après la modification
            } catch (error) {
                console.error('Erreur lors de la modification du genre :', error);
                alert('Erreur lors de la modification du genre.');
            }
        },
        // Annule l'édition et revient à l'état initial
        cancelEdit() {
            this.editMode = false; // Désactive le mode édition
            this.fetchCategoryDetails(); // Recharge les détails d'origine du genre
        },
    }
};
</script>
