<template>
    <div>
        <Header />
        <AddCategory v-if="showAddCategoryForm" @category-added="handleCategoryAdded" @cancel="toggleAddCategoryForm" />

        <div v-else>
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
                const token = localStorage.getItem('jwt_token'); // Retrieve the token from local storage
                const response = await axios.get('http://symfony.mmi-troyes.fr:8319/api/categories?pagination=false', {
                    headers: {
                        Authorization: `Bearer ${token}` // Set the Authorization header with the token
                    }
                });
                this.categories = response.data['hydra:member'];
            } catch (error) {
                console.error('Erreur lors de la récupération des catégories:', error);
                // Handle token expiration or invalidation if necessary
                if (error.response && error.response.status === 401) {
                    alert('Votre session a expiré. Veuillez vous reconnecter.');
                    this.$router.push('/login'); // Redirect to login if unauthorized
                }
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
