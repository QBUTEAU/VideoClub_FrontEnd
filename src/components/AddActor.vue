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

            <div class="dropdown">
                <button class="dropdown-toggle" type="button" @click="toggleDropdown">
                    Sélectionner les films
                </button>
                <div v-if="showDropdown" class="dropdown-menu">
                    <div v-for="movie in films" :key="movie.id" class="dropdown-item">
                        <input type="checkbox" :value="movie.id" :id="'movie-' + movie.id" v-model="selectedFilms" />
                        <label :for="'movie-' + movie.id">{{ movie.title }}</label>
                    </div>
                </div>
            </div>

            <label for="bio">Biographie :</label>
            <textarea v-model="actor.bio" placeholder="Cet acteur est blablabla..."></textarea>

            <label for="awards">Récompense(s) :</label>
            <input type="number" v-model="actor.awards" placeholder="Entre 0 et 10" min="0" max="10">

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

export default {
    name: 'AddActor',
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
            selectedFilms: [],  // Liste des films sélectionnés
            showDropdown: false // Gérer l'affichage de la dropdown
        };
    },
    created() {
        this.fetchFilms();
    },
    methods: {
        async fetchFilms() {
            const token = localStorage.getItem('jwt_token'); // Récupérer le token depuis le localStorage
            if (!token) {
                this.redirectToLogin(); // Rediriger si pas de token
                return;
            }

            try {
                const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/movies', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                this.films = response.data['hydra:member'];
            } catch (error) {
                console.error('Erreur lors de la récupération des films :', error);
                if (error.response && error.response.status === 401) {
                    this.redirectToLogin();
                }
            }
        },

        toggleDropdown() {
            this.showDropdown = !this.showDropdown;
        },

        async addActor() {
            const token = localStorage.getItem('jwt_token'); // Récupérer le token depuis le localStorage
            if (!token) {
                this.redirectToLogin();
                return;
            }

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
                movies: this.selectedFilms.map(id => `/api/movies/${id}`)
            };

            if (!actorData.lastname || !actorData.dob || !actorData.nationality) {
                alert("Veuillez remplir tous les champs obligatoires.");
                return;
            }

            try {
                const response = await axios.post('http://symfony.mmi-troyes.fr:8319/api/actors', actorData, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log('Actor added successfully:', response.data);

                const confirmation = confirm(`L'acteur ${actorData.firstname} ${actorData.lastname} a bien été ajouté.\nVoulez-vous continuer ?`);
                if (confirmation) {
                    this.$emit('actor-added', response.data);
                    window.location.reload();
                }
            } catch (error) {
                console.error('Erreur lors de l\'ajout de l\'acteur :', error.response ? error.response.data : error);
                if (error.response && error.response.status === 401) {
                    this.redirectToLogin();
                } else {
                    alert('Une erreur est survenue lors de l\'ajout de l\'acteur. Veuillez réessayer.');
                }
            }
        },

        redirectToLogin() {
            this.$router.push('/login');
        }
    }
};
</script>
