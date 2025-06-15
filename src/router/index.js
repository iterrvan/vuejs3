
import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '../composables/useStore'

// === IMPORTACIÓN DE COMPONENTES ===
// Views del Cliente
import Home from '../views/Home.vue'
import Products from '../views/Products.vue'
import ProductDetail from '../views/ProductDetail.vue'
import Cart from '../views/Cart.vue'
import Checkout from '../views/Checkout.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'

// Views del Admin Panel
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminProducts from '../views/admin/Products.vue'
import AdminOrders from '../views/admin/Orders.vue'
import AdminUsers from '../views/admin/Users.vue'
import AdminSettings from '../views/admin/Settings.vue'

const routes = [
  // === RUTAS DEL CLIENTE ===
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Inicio - TuTienda' }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: { title: 'Productos - TuTienda' }
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: { title: 'Producto - TuTienda' }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { title: 'Carrito - TuTienda' }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: { title: 'Checkout - TuTienda', requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: 'Iniciar Sesión - TuTienda', guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: 'Registro - TuTienda', guest: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { title: 'Mi Perfil - TuTienda', requiresAuth: true }
  },

  // === RUTAS DEL ADMIN PANEL ===
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { title: 'Dashboard - Admin', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/products',
    name: 'AdminProducts',
    component: AdminProducts,
    meta: { title: 'Productos - Admin', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: AdminOrders,
    meta: { title: 'Pedidos - Admin', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUsers,
    meta: { title: 'Usuarios - Admin', requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: AdminSettings,
    meta: { title: 'Configuración - Admin', requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// === GUARDS DE NAVEGACIÓN ===
// Protección de rutas autenticadas y admin
router.beforeEach((to, from, next) => {
  const store = useStore()
  const isAuthenticated = store.user.value !== null
  const isAdmin = store.user.value?.role === 'admin'

  // Cambiar título de la página
  document.title = to.meta.title || 'TuTienda'

  // Redirigir usuarios autenticados desde páginas de invitado
  if (to.meta.guest && isAuthenticated) {
    next('/')
    return
  }

  // Verificar autenticación requerida
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // Verificar permisos de admin
  if (to.meta.requiresAdmin && !isAdmin) {
    next('/')
    return
  }

  next()
})

export default router
