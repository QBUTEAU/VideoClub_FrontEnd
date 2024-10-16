<template>
    <div class="edit-actor">
        <h2>Modifier :</h2>
        <form class="form" @submit.prevent="submitForm">
            <label for="firstname">Prénom :</label>
            <input type="text" v-model="actor.firstname" required />

            <label for="lastname">Nom :<span>*</span></label>
            <input type="text" v-model="actor.lastname" required />

            <label for="media">Media :</label>
            <input type="text" v-model="actor.media" placeholder="URL de l'image" />

            <label for="dob">Date de naissance :<span>*</span></label>
            <input type="date" v-model="actor.dob" required />

            <label for="deathDate">Date de décès :</label>
            <input type="date" v-model="actor.deathDate" />

            <label for="nationality">Pays :<span>*</span></label>
            <input type="text" v-model="actor.nationality" required />

            <label for="gender">Sexe :</label>
            <select v-model="actor.gender" required>
                <option value="M">M</option>
                <option value="F">F</option>
            </select>

            <label for="bio">Biographie :</label>
            <textarea v-model="actor.bio"></textarea>

            <label for="awards">Récompenses :</label>
            <input type="number" v-model="actor.awards" min="0" max="10" />

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
    name: 'EditActor',
    props: {
        actor: {
            type: Object,
            required: true
        }
    },
    methods: {
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
            const actorId = this.actor.id;
            // Ajouter la date actuelle dans updatedAt
            this.actor.updatedAt = this.getCurrentDate();

            try {
                await axios.put(`http://symfony.mmi-troyes.fr:8319/api/actors/${actorId}`, this.actor);
                alert('Les détails de l\'acteur ont été mis à jour avec succès.');
                this.$emit('actor-updated', this.actor); // Émet l'événement pour notifier le parent
            } catch (error) {
                console.error('Erreur lors de la mise à jour de l\'acteur :', error);
                alert('Erreur lors de la mise à jour de l\'acteur.');
            }
        }
    }
};
</script>