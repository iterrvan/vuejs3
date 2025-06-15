
<template>
  <div class="products-page">
    <!-- Filtros y búsqueda -->
    <div class="filters-section">
      <div class="search-bar">
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="Buscar productos..." 
          @input="searchProducts"
        />
      </div>
      <div class="filters">
        <select v-model="selectedCategory" @change="filterByCategory">
          <option value="">Todas las categorías</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <select v-model="sortBy" @change="sortProducts">
          <option value="name">Nombre</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
        </select>
      </div>
    </div>

    <!-- Grid de productos -->
    <div class="products-grid" v-if="!isLoading">
      <ProductCard 
        v-for="product in filteredProducts" 
        :key="product.id" 
        :product="product"
        @add-to-cart="addToCart"
      />
    </div>

    <!-- Estado de carga -->
    <div v-if="isLoading" class="loading">
      <p>Cargando productos...</p>
    </div>

    <!-- Paginación -->
    <div class="pagination" v-if="totalPages > 1">
      <button 
        @click="goToPage(currentPage - 1)" 
        :disabled="currentPage === 1"
      >
        Anterior
      </button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button 
        @click="goToPage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from '../composables/useStore'
import ProductCard from '../components/ProductCard.vue'

const store = useStore()

// Estados locales
const searchTerm = ref('')
const selectedCategory = ref('')
const sortBy = ref('name')
const currentPage = ref(1)
const itemsPerPage = 12

// Computed properties
const filteredProducts = computed(() => {
  let filtered = store.products.value

  // Filtrar por búsqueda
  if (searchTerm.value) {
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  // Filtrar por categoría
  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category === selectedCategory.value)
  }

  // Ordenar
  switch (sortBy.value) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price)
      break
    default:
      filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  // Paginación
  const start = (currentPage.value - 1) * itemsPerPage
  return filtered.slice(start, start + itemsPerPage)
})

const categories = computed(() => {
  return [...new Set(store.products.value.map(p => p.category))]
})

const totalPages = computed(() => {
  return Math.ceil(store.products.value.length / itemsPerPage)
})

const isLoading = computed(() => store.isLoading.value)

// Métodos
const searchProducts = () => {
  currentPage.value = 1
}

const filterByCategory = () => {
  currentPage.value = 1
}

const sortProducts = () => {
  currentPage.value = 1
}

const goToPage = (page) => {
  currentPage.value = page
}

const addToCart = (product) => {
  store.addToCart(product)
  // Opcional: mostrar notificación
}

// Cargar productos al montar
onMounted(() => {
  store.fetchProducts()
})
</script>

<style scoped>
.products-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.filters-section {
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.search-bar {
  flex: 1;
  min-width: 300px;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  font-size: 1rem;
}

.filters {
  display: flex;
  gap: 1rem;
}

.filters select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  font-size: 1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--primary-color);
  background: white;
  color: var(--primary-color);
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination button:hover:not(:disabled) {
  background: var(--primary-color);
  color: white;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
  }
  
  .search-bar {
    min-width: 100%;
  }
}
</style>
