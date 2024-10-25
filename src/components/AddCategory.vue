<template>
    <div class="add-category">
        <h2>Ajouter un genre :</h2>
        <form class="form" @submit.prevent="submitForm">
            <label for="title">Titre :<span>*</span></label>
            <input type="text" v-model="category.title" required />

            <p>*ce champs doit à tout prix être rempli</p>

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
            const token = localStorage.getItem('jwt_token'); // Récupérer le token du localStorage
            if (!token) {
                alert('Vous devez être connecté pour ajouter une catégorie.');
                this.$router.push('/login'); // Rediriger vers la page de login si le token est absent
                return;
            }

            try {
                await axios.post('http://symfony.mmi-troyes.fr:8319/api/categories', this.category, {
                    headers: {
                        Authorization: `Bearer ${token}` // Ajouter le header Authorization avec le token
                    }
                });
                alert("Le genre a bien été ajouté."); // Pop-up de confirmation
                this.$emit('category-added'); // Émet l'événement pour notifier le parent
                this.category.title = ''; // Réinitialiser le champ de saisie
            } catch (error) {
                console.error('Error adding category:', error);
                if (error.response && error.response.status === 401) {
                    alert('Votre session a expiré. Veuillez vous reconnecter.');
                    this.$router.push('/login'); // Rediriger vers la page de login en cas d'erreur d'authentification
                } else {
                    alert("Erreur lors de l'ajout de la catégorie."); // Alerte en cas d'erreur
                }
            }
        }
    }
};
</script>
