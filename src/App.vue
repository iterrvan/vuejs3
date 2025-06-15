
<template>
  <div id="app">
    <!-- Navigation Bar - Cambia el logo y enlaces según tu marca -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-logo">
          <h2>TuTienda</h2> <!-- Cambia por tu logo -->
        </div>
        <ul class="nav-menu" :class="{ active: isMenuOpen }">
          <li><router-link to="/" @click="closeMenu">Inicio</router-link></li>
          <li><router-link to="/products" @click="closeMenu">Productos</router-link></li>
          <li><router-link to="/cart" @click="closeMenu">Carrito ({{ cartCount }})</router-link></li>
          <li v-if="!isAuthenticated">
            <router-link to="/login" @click="closeMenu">Login</router-link>
          </li>
          <li v-if="!isAuthenticated">
            <router-link to="/register" @click="closeMenu">Registro</router-link>
          </li>
          <li v-if="isAuthenticated && userRole === 'admin'">
            <router-link to="/admin" @click="closeMenu">Admin Panel</router-link>
          </li>
          <li v-if="isAuthenticated">
            <button @click="logout" class="logout-btn">Cerrar Sesión</button>
          </li>
        </ul>
        <div class="hamburger" @click="toggleMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- Footer - Personaliza con tu información -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>TuTienda</h3>
          <p>Tu tienda online de confianza</p>
        </div>
        <div class="footer-section">
          <h4>Enlaces</h4>
          <ul>
            <li><a href="/about">Sobre Nosotros</a></li>
            <li><a href="/contact">Contacto</a></li>
            <li><a href="/terms">Términos</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Contacto</h4>
          <p>Email: info@tutienda.com</p> <!-- Cambia por tu email -->
          <p>Tel: +1 234 567 890</p> <!-- Cambia por tu teléfono -->
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from './composables/useStore'

const router = useRouter()
const store = useStore()
const isMenuOpen = ref(false)

// Computed properties para estado de autenticación
const isAuthenticated = computed(() => store.user.value !== null)
const userRole = computed(() => store.user.value?.role || 'customer')
const cartCount = computed(() => store.cartItems.value.length)

// Funciones de navegación
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const logout = () => {
  store.logout()
  router.push('/')
  closeMenu()
}

// Inicializar datos al montar el componente
onMounted(() => {
  store.initializeAuth()
})
</script>

<style scoped>
/* === ESTILOS GLOBALES - Modifica colores y fuentes según tu marca === */
:root {
  --primary-color: #3498db; /* Color principal - CAMBIAR */
  --secondary-color: #2c3e50; /* Color secundario - CAMBIAR */
  --accent-color: #e74c3c; /* Color de acento - CAMBIAR */
  --text-color: #333;
  --light-bg: #f8f9fa;
  --border-color: #ddd;
  --success-color: #27ae60;
  --warning-color: #f39c12;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: var(--text-color);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* === NAVEGACIÓN === */
.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-logo h2 {
  color: var(--primary-color);
  font-size: 1.8rem;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  align-items: center;
}

.nav-menu a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.3s;
}

.nav-menu a:hover,
.nav-menu a.router-link-active {
  color: var(--primary-color);
}

.logout-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #c0392b;
}

/* === MENÚ HAMBURGUESA === */
.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: var(--text-color);
  margin: 3px 0;
  transition: 0.3s;
}

/* === CONTENIDO PRINCIPAL === */
.main-content {
  flex: 1;
  min-height: calc(100vh - 140px);
}

/* === FOOTER === */
.footer {
  background: var(--secondary-color);
  color: white;
  padding: 2rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.footer-section ul {
  list-style: none;
}

.footer-section ul li {
  margin-bottom: 0.5rem;
}

.footer-section a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: var(--primary-color);
}

/* === RESPONSIVE === */
@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .nav-menu {
    position: fixed;
    left: -100%;
    top: 70px;
    flex-direction: column;
    background-color: white;
    width: 100%;
    text-align: center;
    transition: 0.3s;
    box-shadow: 0 10px 27px rgba(0,0,0,0.05);
    padding: 2rem 0;
  }

  .nav-menu.active {
    left: 0;
  }

  .nav-menu li {
    margin: 1rem 0;
  }
}
</style>
