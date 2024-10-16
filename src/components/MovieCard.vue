<template>
    <div class="movie">
        <div class="movie__img" :style="{ backgroundImage: 'url(' + movie.media + ')' }"></div>
        <div class="movie__info">
            <h3>{{ movie.title }}</h3>
            <!-- <p>Note : {{ movie.rating }} <i class="fa-solid fa-star rating"></i></p> -->
            <p>Réalisé par {{ movie.director }}</p>
            <p>Sorti le {{ formatDate(movie.releaseDate) }}</p>
            <RouterLink class="read" :to="`/movie/${movie.id}`"><i class="fa-solid fa-eye"></i></RouterLink>
        </div>
    </div>
</template>

<script>
import { RouterLink } from 'vue-router';

export default {
    name: 'MovieCard',
    components: { RouterLink },
    props: {
        movie: {
            type: Object,
            required: true
        }
    },
    methods: {
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        }
    }
};
</script>
