<template>
    <div class="login">
        <h2>Connexion</h2>
        <form class="form" @submit.prevent="login">
            <label for="username">Nom d'utilisateur :</label>
            <input type="text" v-model="username" required />

            <label for="password">Mot de passe :</label>
            <input type="password" v-model="password" required />

            <button type="submit">Se connecter</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: '',
            password: ''
        };
    },
    methods: {
        login() {
            if (this.username === 'admin' && this.password === 'wr505d') {
                localStorage.setItem('isAuthenticated', 'true');
                this.$router.push('/');
            } else {
                alert('Le nom d\'utilisateur ou le mot de passe est incorrect.');
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