<template>
    <div>
        <h2>Modifier :</h2>
        <form class="form" @submit.prevent="submitForm">
            <label for="title">Titre :<span>*</span></label>
            <input type="text" v-model="localMovie.title" required />

            <label for="director">Réalisateur :</label>
            <input type="text" v-model="localMovie.director" required />

            <label for="releaseDate">Date de sortie :</label>
            <input type="date" v-model="localMovie.releaseDate" />

            <label for="media">Media :</label>
            <input type="text" v-model="localMovie.media" />

            <label for="rating">Note :</label>
            <input type="number" v-model="localMovie.rating" min="0" max="5" step="0.1" />

            <label for="description">Synopsis :</label>
            <textarea v-model="localMovie.description"></textarea>

            <label for="duration">Durée (min) :</label>
            <input type="number" v-model="localMovie.duration" min="90" max="195" />

            <label for="entries">Nombre d'entrées :</label>
            <input type="number" v-model="localMovie.entries" />

            <div class="form__buttons">
                <button type="submit">Modifier</button>
                <button type="button" @click="cancelEdit">Annuler</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    name: 'EditMovie',
    props: {
        movie: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            localMovie: { ...this.movie }, // Faire une copie locale pour l'édition
        };
    },
    methods: {
        submitForm() {
            this.$emit('submit', this.localMovie); // Émettre les données modifiées vers le parent
        },
        cancelEdit() {
            this.$emit('cancel'); // Émettre l'annulation de l'édition
        },
    },
};
</script>
