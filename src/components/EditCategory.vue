<template>
    <div class="edit-category">
        <h2>Modifier :</h2>
        <form class="form" @submit.prevent="submitForm">
            <label for="title">Titre:</label>
            <input type="text" v-model="category.title" required />
            <div class="form__buttons">
                <button type="submit">Modifier</button>
                <button type="button" @click="$emit('cancel')">Annuler</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'EditCategory',
    props: {
        category: {
            type: Object,
            required: true
        }
    },
    methods: {
        async submitForm() {
            try {
                await axios.put(`http://symfony.mmi-troyes.fr:8319/api/categories/${this.category.id}`, this.category);
                this.$emit('category-updated'); // Émet l'événement pour notifier le parent
                this.category = { title: '' }; // Réinitialiser la catégorie après modification
            } catch (error) {
                console.error('Error updating category:', error);
                alert("Erreur lors de la mise à jour de la catégorie."); // Alerte en cas d'erreur
            }
        }
    }
};
</script>
