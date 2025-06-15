
<template>
  <div class="home">
    <!-- === SECCIÓN HERO === -->
    <!-- Personaliza las imágenes, textos y call-to-actions según tu negocio -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1>Bienvenido a TuTienda</h1> <!-- CAMBIAR título -->
          <p>Descubre productos increíbles con la mejor calidad y precios.</p> <!-- CAMBIAR descripción -->
          <div class="hero-buttons">
            <router-link to="/products" class="btn btn-primary">
              Ver Productos
            </router-link>
            <router-link to="/register" class="btn btn-secondary">
              Registrarse
            </router-link>
          </div>
        </div>
        <div class="hero-image">
          <!-- CAMBIAR imagen por la de tu negocio -->
          <img src="https://picsum.photos/600/400?random=hero" alt="Hero Image" />
        </div>
      </div>
    </section>

    <!-- === CATEGORÍAS DESTACADAS === -->
    <section class="categories">
      <div class="container">
        <h2>Categorías Populares</h2>
        <div class="categories-grid">
          <!-- PERSONALIZAR categorías según tu inventario -->
          <div class="category-card" @click="goToCategory('electronics')">
            <img src="https://picsum.photos/200/200?random=electronics" alt="Electrónicos" />
            <h3>Electrónicos</h3>
          </div>
          <div class="category-card" @click="goToCategory('clothing')">
            <img src="https://picsum.photos/200/200?random=clothing" alt="Ropa" />
            <h3>Ropa</h3>
          </div>
          <div class="category-card" @click="goToCategory('home')">
            <img src="https://picsum.photos/200/200?random=home" alt="Hogar" />
            <h3>Hogar</h3>
          </div>
          <div class="category-card" @click="goToCategory('sports')">
            <img src="https://picsum.photos/200/200?random=sports" alt="Deportes" />
            <h3>Deportes</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- === PRODUCTOS DESTACADOS === -->
    <section class="featured-products">
      <div class="container">
        <h2>Productos Destacados</h2>
        <div class="products-grid" v-if="!isLoading">
          <ProductCard 
            v-for="product in featuredProducts" 
            :key="product.id"
            :product="product"
            @add-to-cart="handleAddToCart"
          />
        </div>
        <div v-else class="loading">
          <p>Cargando productos...</p>
        </div>
      </div>
    </section>

    <!-- === SECCIÓN DE CARACTERÍSTICAS === -->
    <section class="features">
      <div class="container">
        <h2>¿Por qué elegirnos?</h2>
        <div class="features-grid">
          <!-- PERSONALIZAR características según tu propuesta de valor -->
          <div class="feature">
            <div class="feature-icon">🚚</div>
            <h3>Envío Gratis</h3>
            <p>Envío gratuito en pedidos superiores a $50</p>
          </div>
          <div class="feature">
            <div class="feature-icon">🔒</div>
            <h3>Pago Seguro</h3>
            <p>Tus datos están protegidos con encriptación SSL</p>
          </div>
          <div class="feature">
            <div class="feature-icon">↩️</div>
            <h3>Devoluciones</h3>
            <p>30 días para devoluciones sin complicaciones</p>
          </div>
          <div class="feature">
            <div class="feature-icon">📞</div>
            <h3>Soporte 24/7</h3>
            <p>Atención al cliente disponible siempre</p>
          </div>
        </div>
      </div>
    </section>

    <!-- === NEWSLETTER === -->
    <section class="newsletter">
      <div class="container">
        <div class="newsletter-content">
          <h2>Mantente al día</h2>
          <p>Suscríbete para recibir ofertas exclusivas y novedades</p>
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <input 
              type="email" 
              v-model="newsletterEmail"
              placeholder="Tu email"
              required
            />
            <button type="submit" class="btn btn-primary">Suscribirse</button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../composables/useStore'
import ProductCard from '../components/ProductCard.vue'

const router = useRouter()
const store = useStore()
const newsletterEmail = ref('')

// Computed properties
const isLoading = computed(() => store.isLoading.value)
const featuredProducts = computed(() => store.products.value.slice(0, 8))

// Métodos
const goToCategory = (category) => {
  router.push(`/products?category=${category}`)
}

const handleAddToCart = (product) => {
  store.addToCart(product)
  // Aquí puedes agregar una notificación toast
  alert(`${product.name} agregado al carrito!`)
}

const subscribeNewsletter = async () => {
  try {
    // Llamada a tu API de newsletter
    // await makeRequest('/newsletter/subscribe', {
    //   method: 'POST',
    //   body: JSON.stringify({ email: newsletterEmail.value })
    // })
    
    alert('¡Gracias por suscribirte!')
    newsletterEmail.value = ''
  } catch (error) {
    alert('Error al suscribirse. Inténtalo más tarde.')
  }
}

// Inicializar datos
onMounted(() => {
  store.fetchProducts()
})
</script>

<style scoped>
/* === ESTILOS DE LA PÁGINA HOME === */
.home {
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* === HERO SECTION === */
.hero {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  padding: 4rem 0;
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.hero-text h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-text p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-image img {
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

/* === BOTONES === */
.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: var(--accent-color);
  color: white;
}

.btn-primary:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: var(--primary-color);
}

/* === CATEGORÍAS === */
.categories {
  padding: 4rem 0;
  background: white;
}

.categories h2 {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  color: var(--secondary-color);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.category-card {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s;
  padding: 1rem;
  border-radius: 10px;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.category-card h3 {
  color: var(--secondary-color);
  font-size: 1.2rem;
}

/* === PRODUCTOS DESTACADOS === */
.featured-products {
  padding: 4rem 0;
  background: var(--light-bg);
}

.featured-products h2 {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  color: var(--secondary-color);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: var(--secondary-color);
}

/* === CARACTERÍSTICAS === */
.features {
  padding: 4rem 0;
  background: white;
}

.features h2 {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  color: var(--secondary-color);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature {
  text-align: center;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.feature:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature h3 {
  color: var(--secondary-color);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.feature p {
  color: #666;
  line-height: 1.6;
}

/* === NEWSLETTER === */
.newsletter {
  padding: 4rem 0;
  background: var(--secondary-color);
  color: white;
}

.newsletter-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.newsletter h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.newsletter p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.newsletter-form {
  display: flex;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.newsletter-form input {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
}

.newsletter-form button {
  white-space: nowrap;
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-text h1 {
    font-size: 2rem;
  }
  
  .hero-buttons {
    justify-content: center;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
  
  .categories-grid,
  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>
