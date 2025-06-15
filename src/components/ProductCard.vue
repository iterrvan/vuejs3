
<template>
  <!-- === TARJETA DE PRODUCTO REUTILIZABLE === -->
  <!-- Personaliza los estilos según tu marca -->
  <div class="product-card">
    <div class="product-image" @click="goToProduct">
      <img :src="product.image || defaultImage" :alt="product.name" />
      <!-- Badge de descuento si aplica -->
      <div v-if="product.discount" class="discount-badge">
        -{{ product.discount }}%
      </div>
      <!-- Badge de stock bajo -->
      <div v-if="product.stock <= 5" class="stock-badge">
        ¡Últimas {{ product.stock }}!
      </div>
    </div>
    
    <div class="product-info">
      <h3 class="product-name" @click="goToProduct">{{ product.name }}</h3>
      <p class="product-category">{{ formatCategory(product.category) }}</p>
      
      <!-- Rating si está disponible -->
      <div v-if="product.rating" class="product-rating">
        <span class="stars">{{ getStars(product.rating) }}</span>
        <span class="rating-count">({{ product.reviewCount || 0 }})</span>
      </div>
      
      <div class="product-price">
        <span v-if="product.originalPrice" class="original-price">
          ${{ product.originalPrice }}
        </span>
        <span class="current-price">${{ product.price }}</span>
      </div>
      
      <div class="product-actions">
        <button 
          @click="handleAddToCart"
          :disabled="product.stock === 0"
          class="btn btn-primary"
          :class="{ 'btn-disabled': product.stock === 0 }"
        >
          {{ product.stock === 0 ? 'Agotado' : 'Agregar al Carrito' }}
        </button>
        
        <button 
          @click="toggleWishlist" 
          class="btn btn-wishlist"
          :class="{ 'active': isInWishlist }"
        >
          ❤️
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Props
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['add-to-cart', 'toggle-wishlist'])

// Computed properties
const defaultImage = 'https://picsum.photos/300/300?random=' + props.product.id
const isInWishlist = computed(() => {
  // Implementar lógica de wishlist
  return false
})

// Métodos
const goToProduct = () => {
  router.push(`/product/${props.product.id}`)
}

const handleAddToCart = () => {
  if (props.product.stock > 0) {
    emit('add-to-cart', props.product)
  }
}

const toggleWishlist = () => {
  emit('toggle-wishlist', props.product)
}

const formatCategory = (category) => {
  // Personalizar formato de categorías
  const categoryNames = {
    'electronics': 'Electrónicos',
    'clothing': 'Ropa',
    'home': 'Hogar',
    'sports': 'Deportes',
    'books': 'Libros',
    'beauty': 'Belleza'
  }
  return categoryNames[category] || category.charAt(0).toUpperCase() + category.slice(1)
}

const getStars = (rating) => {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5 ? 1 : 0
  const emptyStars = 5 - fullStars - halfStar
  
  return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars)
}
</script>

<style scoped>
/* === ESTILOS DE TARJETA DE PRODUCTO === */
.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.product-image {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-image:hover img {
  transform: scale(1.1);
}

/* === BADGES === */
.discount-badge,
.stock-badge {
  position: absolute;
  top: 10px;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.discount-badge {
  right: 10px;
  background: var(--accent-color);
}

.stock-badge {
  left: 10px;
  background: var(--warning-color);
}

/* === INFORMACIÓN DEL PRODUCTO === */
.product-info {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: color 0.3s;
  line-height: 1.3;
}

.product-name:hover {
  color: var(--primary-color);
}

.product-category {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  text-transform: capitalize;
}

/* === RATING === */
.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.stars {
  color: #ffc107;
  font-size: 1rem;
}

.rating-count {
  color: #666;
  font-size: 0.85rem;
}

/* === PRECIOS === */
.product-price {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 0.9rem;
}

.current-price {
  color: var(--accent-color);
  font-size: 1.25rem;
  font-weight: 700;
}

/* === ACCIONES === */
.product-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: auto;
}

.btn {
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  font-size: 0.9rem;
}

.btn-primary {
  flex: 1;
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(.btn-disabled) {
  background: #2980b9;
  transform: translateY(-1px);
}

.btn-disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-wishlist {
  background: transparent;
  border: 2px solid #ddd;
  padding: 0.6rem;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-wishlist:hover {
  border-color: var(--accent-color);
  background: var(--accent-color);
}

.btn-wishlist.active {
  background: var(--accent-color);
  border-color: var(--accent-color);
}

/* === RESPONSIVE === */
@media (max-width: 480px) {
  .product-info {
    padding: 1rem;
  }
  
  .product-name {
    font-size: 1rem;
  }
  
  .current-price {
    font-size: 1.1rem;
  }
  
  .btn {
    font-size: 0.85rem;
    padding: 0.5rem 0.75rem;
  }
}
</style>
