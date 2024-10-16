<template>
    <div class="actor">
        <div class="actor__img" :style="{ backgroundImage: 'url(' + actor.media + ')' }"></div>
        <div class="actor__info">
            <h3>{{ actor.firstname }} {{ actor.lastname }}</h3>
            <p>{{ getBirthText(actor.gender) }} le {{ formatDate(actor.dob) }}</p>
            <p>Pays représentant : {{ actor.nationality }}</p>
            <RouterLink class="read" :to="`/actor/${actor.id}`"><i class="fa-solid fa-eye"></i></RouterLink>
        </div>
    </div>
</template>

<script>
import { RouterLink } from "vue-router";

export default {
    name: 'ActorCard',
    components: { RouterLink },
    props: {
        actor: {
            type: Object,
            required: true
        }
    },
    methods: {
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        },
        getBirthText(gender) {
            return gender === 'F' ? 'Née' : 'Né';
        }
    }
};
</script>