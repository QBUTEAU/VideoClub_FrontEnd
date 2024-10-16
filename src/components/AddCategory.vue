<template>
    <div class="add-category">
        <h2>Ajouter un genre :</h2>
        <form class="form" @submit.prevent="submitForm">
            <label for="title">Titre:</label>
            <input type="text" v-model="category.title" required />
            <div class="form__buttons">
                <button type="submit">Ajouter</button>
                <button type="button" @click="$emit('cancel')">Annuler</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios'; // Assurez-vous d'importer axios

export default {
    name: 'AddCategory',
    data() {
        return {
            category: {
                title: ''
            }
        };
    },
    methods: {
        async submitForm() {
            try {
                await axios.post('http://symfony.mmi-troyes.fr:8319/api/categories', this.category);
                alert("Le genre a bien été ajouté."); // Pop-up de confirmation
                this.$emit('category-added'); // Émet l'événement pour notifier le parent
                this.category.title = ''; // Réinitialiser le champ de saisie
            } catch (error) {
                console.error('Error adding category:', error);
                alert("Erreur lors de l'ajout de la catégorie."); // Alerte en cas d'erreur
            }
        }
    }
};
</script>
