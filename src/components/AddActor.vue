<template>
    <div>
        <h2>Ajouter un acteur :</h2>
        <form class="form" @submit.prevent="addActor">
            <button type="button" @click="$emit('cancel')">Annuler</button>
            <label for="prenom">Prénom :</label>
            <input type="text" v-model="actor.firstname" placeholder="Prénom" />

            <label for="nom">Nom :<span>*</span></label>
            <input type="text" v-model="actor.lastname" placeholder="Nom" required />

            <label for="media">Media :</label>
            <input type="text" v-model="actor.media" placeholder="URL de l'image" />

            <label for="dob">Date de naissance :<span>*</span></label>
            <input type="date" v-model="actor.dob" placeholder="Date de naissance" required />

            <label for="deathDate">Date de décès :</label>
            <input type="date" v-model="actor.deathDate" placeholder="Date de décès" />

            <label for="nationality">Pays :<span>*</span></label>
            <input type="text" v-model="actor.nationality" placeholder="France = FR" required />

            <label for="sexe">Sexe :<span>*</span></label>
            <select v-model="actor.gender">
                <option value="" disabled>Sexe</option>
                <option value="M">M</option>
                <option value="F">F</option>
            </select>

            <label for="bio">Biographie :</label>
            <textarea v-model="actor.bio" placeholder="Cet acteur est blablabla..."></textarea>

            <label for="awards">Récompense(s) :</label>
            <input type="number" v-model="actor.awards" placeholder="Entre 0 et 10" min="0" max="10">

            <label class="links-label" for="movies">Films :</label>
            <select v-model="selectedFilms" multiple size="5">
                <option v-for="movie in films" :key="movie.id" :value="movie.id">
                    {{ movie.title }}
                </option>
            </select>

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
import Header from '@/components/Header.vue';

export default {
    name: 'AddActor',
    components: { Header },
    data() {
        return {
            actor: {
                firstname: '',
                lastname: '',
                media: '',
                dob: '',
                deathDate: '',
                nationality: '',
                gender: '',
                bio: '',
                awards: 0
            },
            films: [],  // Liste des films disponibles
            selectedFilms: []  // Liste des films sélectionnés
        };
    },
    created() {
        this.fetchFilms();
    },
    methods: {
        async fetchFilms() {
            try {
                const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/movies');
                this.films = response.data['hydra:member'];
            } catch (error) {
                console.error('Error fetching films:', error);
            }
        },

        async addActor() {
            const actorData = {
                firstname: this.actor.firstname.trim(),
                lastname: this.actor.lastname.trim(),
                media: this.actor.media.trim(),
                dob: this.actor.dob ? new Date(this.actor.dob).toISOString().split('T')[0] : '',
                deathDate: this.actor.deathDate ? new Date(this.actor.deathDate).toISOString().split('T')[0] : null,
                nationality: this.actor.nationality.trim(),
                gender: this.actor.gender,
                bio: this.actor.bio.trim(),
                awards: this.actor.awards || 0,
                movies: this.selectedFilms.map(id => `/api/movies/${id}`)  // Convertir en IRI
            };

            if (!actorData.lastname || !actorData.dob || !actorData.nationality) {
                alert("Veuillez remplir tous les champs obligatoires.");
                return;
            }

            try {
                const response = await axios.post('http://symfony.mmi-troyes.fr:8319/api/actors', actorData);
                console.log('Actor added successfully:', response.data);

                // Afficher la confirmation
                const confirmation = confirm(`L'acteur ${actorData.firstname} ${actorData.lastname} a bien été ajouté.\nVoulez-vous continuer ?`);
                if (confirmation) {
                    this.$emit('actor-added', response.data); // Émettre l'événement avec l'acteur ajouté
                    this.resetForm(); // Réinitialiser le formulaire après ajout
                }
            } catch (error) {
                console.error('Error adding actor:', error.response ? error.response.data : error);
                alert(`Une erreur est survenue lors de l'ajout de l'acteur. Veuillez réessayer.`);
            }
        },

        resetForm() {
            this.actor = {
                firstname: '',
                lastname: '',
                media: '',
                dob: '',
                deathDate: '',
                nationality: '',
                gender: '',
                bio: '',
                awards: 0
            };
            this.selectedFilms = [];
        }
    }
};
</script>
