<template>
    <div class="category">
        <span class="category__card">{{ category.title }}</span>
        <RouterLink class="read" :to="`/category/${category.id}`"><i class="fa-solid fa-eye"></i></RouterLink>
    </div>
</template>

<script>
export default {
    name: 'CategoryCard',
    props: {
        category: {
            type: Object,
            required: true
        }
    }
};
</script>
