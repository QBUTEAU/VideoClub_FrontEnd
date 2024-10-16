<template>
    <div>
        <Header />
        <AddCategory v-if="showAddCategoryForm" @category-added="handleCategoryAdded" @cancel="toggleAddCategoryForm" />

        <h2>Voici la liste des genres :</h2>
        <div class="search-add">
            <input type="text" v-model="searchTerm" placeholder="Rechercher un genre..." class="search-bar" />
            <button @click="toggleAddCategoryForm" class="add-actor">
                <i class="fa-solid fa-plus" style="margin-right: 10px;"></i>AJOUTER UN GENRE
            </button>
        </div>

        <div class="categories">
            <CategoryCard v-for="category in filteredCategories" :key="category.id" :category="category" />
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Header from "@/components/Header.vue";
import CategoryCard from "@/components/CategoryCard.vue";
import AddCategory from "@/components/AddCategory.vue";

export default {
    components: {
        Header,
        CategoryCard,
        AddCategory
    },
    data() {
        return {
            categories: [],
            searchTerm: '',
            showAddCategoryForm: false
        };
    },
    created() {
        this.fetchCategories();
    },
    computed: {
        filteredCategories() {
            return this.categories.filter(category =>
                category.title.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }
    },
    methods: {
        async fetchCategories() {
            try {
                const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/categories?pagination=false');
                this.categories = response.data['hydra:member'];
            } catch (error) {
                console.error('Erreur lors de la récupération des catégories:', error);
            }
        },
        handleCategoryAdded() {
            this.fetchCategories();
            this.showAddCategoryForm = false;
        },
        toggleAddCategoryForm() {
            this.showAddCategoryForm = !this.showAddCategoryForm;
        }
    }
};
</script>
