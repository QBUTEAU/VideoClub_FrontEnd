import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Actors from '@/views/Actors.vue';
import ActorDetails from '@/views/ActorDetails.vue';
import Movies from '@/views/Movies.vue';
import MovieDetails from '@/views/MovieDetails.vue';
import Categories from '@/views/Categories.vue';
import CategoryDetails from '@/views/CategoryDetails.vue';
import Login from '@/components/Login.vue';
import auth from '@/services/auth';

const routes = [
    { path: '/login', component: Login },
    { path: '/', component: Home, meta: { requiresAuth: true } },
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
    if (to.matched.some(record => record.meta.requiresAuth) && !auth.isAuthenticated()) {
        next('/login');
    } else {
        next();
    }
});

export default router;