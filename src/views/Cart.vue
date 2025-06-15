
<template>
  <div class="cart-page">
    <div class="cart-container">
      <h1>Carrito de Compras</h1>

      <!-- Carrito con productos -->
      <div v-if="cartItems.length > 0" class="cart-content">
        <!-- Lista de productos -->
        <div class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <div class="item-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              <p class="item-description">{{ item.description }}</p>
              
              <!-- Variantes seleccionadas -->
              <div v-if="item.selectedVariants" class="selected-variants">
                <span v-for="(value, key) in item.selectedVariants" :key="key" class="variant">
                  {{ key }}: {{ value }}
                </span>
              </div>
            </div>

            <div class="item-quantity">
              <button @click="decreaseQuantity(item)" :disabled="item.quantity <= 1">-</button>
              <input 
                v-model.number="item.quantity" 
                type="number" 
                min="1" 
                :max="item.stock"
                @change="updateQuantity(item)"
              />
              <button @click="increaseQuantity(item)" :disabled="item.quantity >= item.stock">+</button>
            </div>

            <div class="item-price">
              <span class="unit-price">${{ item.price }} c/u</span>
              <span class="total-price">${{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>

            <div class="item-actions">
              <button @click="removeItem(item)" class="remove-btn">
                <span>🗑️</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Resumen del carrito -->
        <div class="cart-summary">
          <div class="summary-card">
            <h2>Resumen del Pedido</h2>
            
            <div class="summary-line">
              <span>Subtotal:</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            
            <div class="summary-line">
              <span>Envío:</span>
              <span>${{ shipping.toFixed(2) }}</span>
            </div>
            
            <div class="summary-line">
              <span>Impuestos:</span>
              <span>${{ taxes.toFixed(2) }}</span>
            </div>
            
            <div class="summary-line total">
              <span>Total:</span>
              <span>${{ cartTotal.toFixed(2) }}</span>
            </div>

            <!-- Cupón de descuento -->
            <div class="coupon-section">
              <div class="coupon-input">
                <input 
                  v-model="couponCode" 
                  type="text" 
                  placeholder="Código de cupón"
                />
                <button @click="applyCoupon" :disabled="!couponCode">Aplicar</button>
              </div>
              <div v-if="appliedCoupon" class="applied-coupon">
                <span>Cupón aplicado: {{ appliedCoupon.code }}</span>
                <span>-${{ appliedCoupon.discount.toFixed(2) }}</span>
              </div>
            </div>

            <div class="checkout-actions">
              <router-link to="/products" class="continue-shopping">
                Continuar Comprando
              </router-link>
              <button @click="proceedToCheckout" class="checkout-btn">
                Proceder al Pago
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Carrito vacío -->
      <div v-else class="empty-cart">
        <div class="empty-cart-content">
          <h2>Tu carrito está vacío</h2>
          <p>¡Agrega algunos productos y comienza a comprar!</p>
          <router-link to="/products" class="shop-now-btn">
            Comprar Ahora
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../composables/useStore'

const router = useRouter()
const store = useStore()

// Estados locales
const couponCode = ref('')
const appliedCoupon = ref(null)

// Computed properties
const cartItems = computed(() => store.cartItems.value)
const subtotal = computed(() => store.cartTotal.value)
const shipping = computed(() => subtotal.value > 50 ? 0 : 10) // Envío gratis > $50
const taxes = computed(() => subtotal.value * 0.1) // 10% impuestos
const cartTotal = computed(() => {
  let total = subtotal.value + shipping.value + taxes.value
  if (appliedCoupon.value) {
    total -= appliedCoupon.value.discount
  }
  return total
})

// Métodos
const updateQuantity = (item) => {
  if (item.quantity > 0 && item.quantity <= item.stock) {
    store.updateCartQuantity(item.id, item.quantity)
  }
}

const increaseQuantity = (item) => {
  if (item.quantity < item.stock) {
    store.updateCartQuantity(item.id, item.quantity + 1)
  }
}

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    store.updateCartQuantity(item.id, item.quantity - 1)
  }
}

const removeItem = (item) => {
  if (confirm(`¿Estás seguro de que quieres eliminar ${item.name} del carrito?`)) {
    store.removeFromCart(item.id)
  }
}

const applyCoupon = () => {
  // Simulación de cupones - implementar con API real
  const coupons = {
    'DESCUENTO10': { code: 'DESCUENTO10', discount: subtotal.value * 0.1 },
    'ENVIO_GRATIS': { code: 'ENVIO_GRATIS', discount: shipping.value },
    'BIENVENIDO': { code: 'BIENVENIDO', discount: 5 }
  }

  if (coupons[couponCode.value.toUpperCase()]) {
    appliedCoupon.value = coupons[couponCode.value.toUpperCase()]
    couponCode.value = ''
    alert('¡Cupón aplicado exitosamente!')
  } else {
    alert('Código de cupón inválido')
  }
}

const proceedToCheckout = () => {
  // Verificar autenticación
  if (!store.user.value) {
    if (confirm('Necesitas iniciar sesión para continuar. ¿Quieres ir al login?')) {
      router.push('/login')
    }
    return
  }
  
  router.push('/checkout')
}
</script>

<style scoped>
.cart-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.cart-container h1 {
  margin-bottom: 2rem;
  text-align: center;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr 120px 120px 50px;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: white;
}

.item-image img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
}

.item-details h3 {
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.item-description {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.selected-variants {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.variant {
  background: var(--light-bg);
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.8rem;
  color: var(--text-color);
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-quantity button {
  width: 30px;
  height: 30px;
  border: 1px solid var(--border-color);
  background: white;
  cursor: pointer;
  border-radius: 3px;
}

.item-quantity input {
  width: 60px;
  height: 30px;
  text-align: center;
  border: 1px solid var(--border-color);
  border-radius: 3px;
}

.item-price {
  display: flex;
  flex-direction: column;
  align-items: end;
}

.unit-price {
  font-size: 0.9rem;
  color: #666;
}

.total-price {
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--primary-color);
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--accent-color);
  padding: 0.5rem;
  border-radius: 3px;
  transition: background-color 0.3s;
}

.remove-btn:hover {
  background: #ffe6e6;
}

.cart-summary {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.summary-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 1.5rem;
}

.summary-card h2 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.summary-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.5rem 0;
}

.summary-line.total {
  border-top: 1px solid var(--border-color);
  margin-top: 1rem;
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--primary-color);
}

.coupon-section {
  margin: 1.5rem 0;
  padding: 1rem 0;
  border-top: 1px solid #eee;
}

.coupon-input {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.coupon-input input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 5px;
}

.coupon-input button {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.applied-coupon {
  display: flex;
  justify-content: space-between;
  color: var(--success-color);
  font-size: 0.9rem;
}

.checkout-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.continue-shopping {
  text-align: center;
  color: var(--primary-color);
  text-decoration: none;
  padding: 0.75rem;
  border: 1px solid var(--primary-color);
  border-radius: 5px;
  transition: all 0.3s;
}

.continue-shopping:hover {
  background: var(--primary-color);
  color: white;
}

.checkout-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-btn:hover {
  background: #c0392b;
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-cart-content h2 {
  margin-bottom: 1rem;
  color: var(--text-color);
}

.empty-cart-content p {
  margin-bottom: 2rem;
  color: #666;
}

.shop-now-btn {
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s;
}

.shop-now-btn:hover {
  background: #2980b9;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-item {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .item-quantity {
    justify-content: center;
  }
  
  .item-price {
    align-items: center;
  }
}
</style>
