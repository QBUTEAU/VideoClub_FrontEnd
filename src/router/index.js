import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Actors from '@/views/Actors.vue';
import ActorDetails from '@/views/ActorDetails.vue';
// import EditActor from '@/components/EditActor.vue';
// import AddActor from '@/components/AddActor.vue';
import Movies from '@/views/Movies.vue';
import MovieDetails from '@/views/MovieDetails.vue';
// import EditMovie from '@/views/EditMovie.vue';
// import AddMovie from '@/views/AddMovie.vue';
import Categories from '@/views/Categories.vue';
import CategoryDetails from '@/views/CategoryDetails.vue';
// import EditCategory from '@/components/EditCategory.vue';
// import AddCategory from '@/components/AddCategory.vue';

const routes = [
    { path: '/', component: Home },
    { path: '/actors', component: Actors },
    { path: '/actor/:id', component: ActorDetails },
    // { path: '/add-actor', component: AddActor },
    // { path: '/edit-actor/:id', component: EditActor },
    { path: '/movies', component: Movies },
    { path: '/movie/:id', component: MovieDetails },
    // { path: '/add-movie', component: AddMovie },
    // { path: '/edit-movie/:id', component: EditMovie },
    { path: '/categories', component: Categories },
    { path: '/category/:id', component: CategoryDetails },
    // { path: '/add-category', component: AddCategory },
    // { path: '/edit-category/:id', component: EditCategory },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;