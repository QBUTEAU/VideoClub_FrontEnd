import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Actors from '@/views/Actors.vue';
import ActorDetails from '@/views/ActorDetails.vue';
import Movies from '@/views/Movies.vue';
import MovieDetails from '@/views/MovieDetails.vue';
import Categories from '@/views/Categories.vue';
import CategoryDetails from '@/views/CategoryDetails.vue';
import Login from '@/components/Login.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/actors', component: Actors },
    { path: '/actor/:id', component: ActorDetails },
    { path: '/movies', component: Movies },
    { path: '/movie/:id', component: MovieDetails },
    { path: '/categories', component: Categories },
    { path: '/category/:id', component: CategoryDetails },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('jwt_token'); // Vérifie si le token existe

    // Redirigez vers /login si l'utilisateur n'est pas authentifié et essaie d'accéder à une route protégée
    if (!isAuthenticated && to.path !== '/login') {
        next('/login');
    } else {
        next(); // Continuez vers la route demandée
    }
});

export default router;