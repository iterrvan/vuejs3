
<template>
  <div class="product-detail" v-if="product">
    <div class="product-container">
      <!-- Galería de imágenes -->
      <div class="product-gallery">
        <div class="main-image">
          <img :src="selectedImage" :alt="product.name" />
        </div>
        <div class="thumbnail-list" v-if="product.images && product.images.length > 1">
          <img 
            v-for="(image, index) in product.images" 
            :key="index"
            :src="image"
            :alt="`${product.name} ${index + 1}`"
            @click="selectedImage = image"
            :class="{ active: selectedImage === image }"
          />
        </div>
      </div>

      <!-- Información del producto -->
      <div class="product-info">
        <h1>{{ product.name }}</h1>
        <div class="price">
          <span class="current-price">${{ product.price }}</span>
          <span v-if="product.originalPrice" class="original-price">
            ${{ product.originalPrice }}
          </span>
        </div>

        <div class="rating" v-if="product.rating">
          <div class="stars">
            <span v-for="i in 5" :key="i" :class="{ filled: i <= product.rating }">★</span>
          </div>
          <span class="reviews">({{ product.reviewCount || 0 }} reseñas)</span>
        </div>

        <div class="description">
          <p>{{ product.description }}</p>
        </div>

        <!-- Especificaciones -->
        <div class="specifications" v-if="product.specifications">
          <h3>Especificaciones</h3>
          <ul>
            <li v-for="(value, key) in product.specifications" :key="key">
              <strong>{{ key }}:</strong> {{ value }}
            </li>
          </ul>
        </div>

        <!-- Variantes (color, talla, etc.) -->
        <div class="variants" v-if="product.variants">
          <div v-for="(options, variant) in product.variants" :key="variant" class="variant-group">
            <label>{{ variant }}:</label>
            <select v-model="selectedVariants[variant]">
              <option v-for="option in options" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
        </div>

        <!-- Cantidad y agregar al carrito -->
        <div class="purchase-section">
          <div class="quantity-selector">
            <label>Cantidad:</label>
            <div class="quantity-controls">
              <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
              <input v-model.number="quantity" type="number" min="1" :max="product.stock" />
              <button @click="increaseQuantity" :disabled="quantity >= product.stock">+</button>
            </div>
          </div>

          <div class="stock-info">
            <span v-if="product.stock > 0" class="in-stock">
              {{ product.stock }} disponibles
            </span>
            <span v-else class="out-of-stock">Agotado</span>
          </div>

          <div class="action-buttons">
            <button 
              @click="addToCart" 
              :disabled="product.stock === 0"
              class="add-to-cart-btn"
            >
              Agregar al Carrito - ${{ (product.price * quantity).toFixed(2) }}
            </button>
            <button @click="buyNow" class="buy-now-btn">
              Comprar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Productos relacionados -->
    <div class="related-products" v-if="relatedProducts.length > 0">
      <h2>Productos Relacionados</h2>
      <div class="products-grid">
        <ProductCard 
          v-for="relatedProduct in relatedProducts" 
          :key="relatedProduct.id"
          :product="relatedProduct"
          @add-to-cart="store.addToCart"
        />
      </div>
    </div>
  </div>

  <!-- Estado de carga -->
  <div v-else-if="isLoading" class="loading">
    <p>Cargando producto...</p>
  </div>

  <!-- Producto no encontrado -->
  <div v-else class="not-found">
    <h2>Producto no encontrado</h2>
    <router-link to="/products">Volver a productos</router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '../composables/useStore'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()

// Estados locales
const product = ref(null)
const selectedImage = ref('')
const selectedVariants = ref({})
const quantity = ref(1)

// Computed properties
const isLoading = computed(() => store.isLoading.value)
const relatedProducts = computed(() => {
  if (!product.value) return []
  return store.products.value
    .filter(p => p.id !== product.value.id && p.category === product.value.category)
    .slice(0, 4)
})

// Métodos
const loadProduct = async () => {
  try {
    const productData = await store.getProductById(route.params.id)
    if (productData) {
      product.value = productData
      selectedImage.value = productData.image || productData.images?.[0] || ''
      
      // Inicializar variantes seleccionadas
      if (productData.variants) {
        Object.keys(productData.variants).forEach(variant => {
          selectedVariants.value[variant] = productData.variants[variant][0]
        })
      }
    }
  } catch (error) {
    console.error('Error loading product:', error)
  }
}

const increaseQuantity = () => {
  if (quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  const productToAdd = {
    ...product.value,
    selectedVariants: { ...selectedVariants.value }
  }
  store.addToCart(productToAdd, quantity.value)
  
  // Opcional: mostrar notificación o modal de confirmación
  alert(`${quantity.value} ${product.value.name} agregado(s) al carrito`)
}

const buyNow = () => {
  addToCart()
  router.push('/cart')
}

// Cargar producto al montar y cuando cambie la ruta
onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.product-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}

.thumbnail-list {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
}

.thumbnail-list img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: border-color 0.3s;
}

.thumbnail-list img.active,
.thumbnail-list img:hover {
  border-color: var(--primary-color);
}

.product-info h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.price {
  margin-bottom: 1rem;
}

.current-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.original-price {
  font-size: 1.2rem;
  text-decoration: line-through;
  color: #666;
  margin-left: 0.5rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars span {
  color: #ddd;
  font-size: 1.2rem;
}

.stars span.filled {
  color: #ffd700;
}

.description {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.specifications {
  margin-bottom: 1.5rem;
}

.specifications ul {
  list-style: none;
  padding: 0;
}

.specifications li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.variants {
  margin-bottom: 1.5rem;
}

.variant-group {
  margin-bottom: 1rem;
}

.variant-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.variant-group select {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  width: 200px;
}

.purchase-section {
  margin-top: 2rem;
}

.quantity-selector {
  margin-bottom: 1rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.quantity-controls button {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-color);
  background: white;
  cursor: pointer;
  border-radius: 5px;
}

.quantity-controls input {
  width: 80px;
  height: 40px;
  text-align: center;
  border: 1px solid var(--border-color);
  border-radius: 5px;
}

.stock-info {
  margin-bottom: 1rem;
}

.in-stock {
  color: var(--success-color);
}

.out-of-stock {
  color: var(--accent-color);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add-to-cart-btn,
.buy-now-btn {
  padding: 1rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-cart-btn {
  background: var(--primary-color);
  color: white;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #2980b9;
}

.add-to-cart-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.buy-now-btn {
  background: var(--accent-color);
  color: white;
}

.buy-now-btn:hover {
  background: #c0392b;
}

.related-products {
  border-top: 1px solid var(--border-color);
  padding-top: 3rem;
}

.related-products h2 {
  margin-bottom: 2rem;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.loading,
.not-found {
  text-align: center;
  padding: 3rem;
}

@media (max-width: 768px) {
  .product-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
