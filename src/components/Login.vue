<template>
    <div class="login">
        <h2>Connexion</h2>
        <form class="form" @submit.prevent="login">
            <label for="email">Email :</label>
            <input type="email" v-model="email" placeholder="qbuteau@mmi.fr" required />

            <label for="password">Mot de passe :</label>
            <input type="password" v-model="password" placeholder="WR505D" required />

            <button type="submit">Se connecter</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            email: '',
            password: '',
            successMessage: false
        };
    },
    methods: {
        async login() {
            try {
                const response = await axios.post('http://symfony.mmi-troyes.fr:8319/auth', {
                    email: this.email,
                    password: this.password
                });

                const data = response.data;

                if (response.status === 200) {
                    // Supposons que le token est dans data.token
                    const token = data.token;

                    // Stocker le token dans le localStorage avec une expiration d'une heure
                    const expirationTime = new Date().getTime() + 3600 * 1000; // 1 heure en millisecondes
                    localStorage.setItem('jwt_token', token);
                    localStorage.setItem('tokenExpiration', expirationTime);

                    // Afficher la boîte de dialogue de confirmation
                    const confirmed = confirm('Connexion réussie ! Voulez-vous continuer ?');
                    if (confirmed) {
                        this.$router.push('/');
                    }
                } else {
                    // Gérer les erreurs de connexion
                    alert(data.message || 'Échec de la connexion');
                }
            } catch (error) {
                console.error('Erreur lors de la connexion', error);
                alert('Erreur de connexion');
            }
        }
    }
};
</script>

<style scoped>
.login {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 85vh;
}
</style>