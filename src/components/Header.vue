<template>
    <header class="header">
        <nav>
            <ul>
                <li><router-link to="/">Accueil</router-link></li>
                <li><router-link to="/actors">Acteurs</router-link></li>
                <li><router-link to="/movies">Films</router-link></li>
                <li><router-link to="/categories">Catégories</router-link></li>
            </ul>
        </nav>
        <div class="burger-icon" @click="toggleMenu">
            <i class="fa fa-bars"></i>
        </div>
        <div class="profil" to="/" @click.prevent="toggleProfilePopup"><i class="fa-solid fa-user"
                style="color: #f1f1f1;"></i></div>
        <div class="burger-menu" v-if="isMenuOpen">
            <ul>
                <li><router-link to="/" @click="toggleMenu">Accueil</router-link></li>
                <li><router-link to="/actors" @click="toggleMenu">Acteurs</router-link></li>
                <li><router-link to="/movies" @click="toggleMenu">Films</router-link></li>
                <li><router-link to="/categories" @click="toggleMenu">Catégories</router-link></li>
            </ul>
        </div>
        <div class="profil-menu" v-if="isProfilePopupOpen">
            <ul>
                <li><router-link to="/edit-profile" @click="toggleProfilePopup">Edit Profil</router-link></li>
                <li><router-link to="/logout" @click="toggleProfilePopup">Log Out</router-link></li>
            </ul>
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
        }
    }
};
</script>