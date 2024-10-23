<template>
    <header class="header">
        <nav>
            <ul>
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/actors">Actors</router-link></li>
                <li><router-link to="/movies">Movies</router-link></li>
                <li><router-link to="/categories">Categories</router-link></li>
            </ul>
        </nav>
        <div class="burger-icon" @click="toggleMenu">
            <i class="fa fa-bars"></i>
        </div>
        <div class="profil" to="/" @click.prevent="toggleProfilePopup">
            <i class="fa-solid fa-user" style="color: #f1f1f1;"></i>
        </div>
        <div class="burger-menu" v-if="isMenuOpen">
            <ul>
                <li><router-link to="/" @click="toggleMenu">Accueil</router-link></li>
                <li><router-link to="/actors" @click="toggleMenu">Acteurs</router-link></li>
                <li><router-link to="/movies" @click="toggleMenu">Films</router-link></li>
                <li><router-link to="/categories" @click="toggleMenu">Catégories</router-link></li>
            </ul>
        </div>
        <div class="profil-menu" v-if="isProfilePopupOpen">
            <a href="#" @click="logout">Log Out</a>
        </div>
    </header>
    <router-view></router-view>
</template>

<script>
export default {
    data() {
        return {
            isMenuOpen: false,
            isProfilePopupOpen: false
        };
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        toggleProfilePopup() {
            this.isProfilePopupOpen = !this.isProfilePopupOpen;
        },
        logout() {
            localStorage.removeItem('jwt_token'); // Remove the JWT token from local storage
            this.$router.push('/login'); // Redirect to the login page
        },
    }
};
</script>