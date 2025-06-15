
import { ref, reactive, computed } from 'vue'

// === ESTADO GLOBAL DE LA APLICACIÓN ===
// Estado del usuario
const user = ref(null)
const isLoading = ref(false)

// Estado del carrito
const cartItems = ref([])

// Estado de productos
const products = ref([])
const categories = ref([])

// Estado de pedidos
const orders = ref([])

// === CONFIGURACIÓN DE API ===
// URL de tu API Laravel - CAMBIAR POR TU DOMINIO
const API_BASE_URL = 'http://localhost:8000/api' // Laravel API URL

// === FUNCIONES DE UTILIDAD ===
const makeRequest = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('token')
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// === FUNCIONES DE AUTENTICACIÓN ===
const login = async (credentials) => {
  try {
    isLoading.value = true
    // Llamada a tu API de login
    const response = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })

    // Guardar token y usuario
    localStorage.setItem('token', response.token)
    user.value = response.user
    
    return response
  } catch (error) {
    throw error
  } finally {
    isLoading.value = false
  }
}

const register = async (userData) => {
  try {
    isLoading.value = true
    // Llamada a tu API de registro
    const response = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })

    return response
  } catch (error) {
    throw error
  } finally {
    isLoading.value = false
  }
}

const logout = () => {
  localStorage.removeItem('token')
  user.value = null
  cartItems.value = []
}

const initializeAuth = () => {
  const token = localStorage.getItem('token')
  if (token) {
    // Verificar token con el backend y obtener datos del usuario
    // makeRequest('/auth/me').then(response => {
    //   user.value = response.user
    // }).catch(() => {
    //   logout()
    // })
    
    // Simulación temporal - reemplazar con llamada real
    user.value = {
      id: 1,
      name: 'Usuario Demo',
      email: 'demo@ejemplo.com',
      role: 'customer' // o 'admin'
    }
  }
}

// === FUNCIONES DE PRODUCTOS ===
const fetchProducts = async (filters = {}) => {
  try {
    isLoading.value = true
    // Construir query string para filtros
    const queryString = new URLSearchParams(filters).toString()
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`
    
    const response = await makeRequest(endpoint)
    products.value = response.products || response
    
    return response
  } catch (error) {
    // Datos de demostración - reemplazar con llamada real
    products.value = [
      {
        id: 1,
        name: 'Producto Demo 1',
        price: 29.99,
        image: 'https://picsum.photos/300/300?random=1',
        description: 'Descripción del producto demo',
        category: 'electronics',
        stock: 10
      },
      {
        id: 2,
        name: 'Producto Demo 2',
        price: 49.99,
        image: 'https://picsum.photos/300/300?random=2',
        description: 'Descripción del producto demo 2',
        category: 'clothing',
        stock: 5
      }
    ]
    console.warn('Using demo data. Replace with real API call.')
  } finally {
    isLoading.value = false
  }
}

const getProductById = async (id) => {
  try {
    const response = await makeRequest(`/products/${id}`)
    return response
  } catch (error) {
    // Simulación - reemplazar con llamada real
    return products.value.find(p => p.id === parseInt(id))
  }
}

// === FUNCIONES DE CARRITO ===
const addToCart = (product, quantity = 1) => {
  const existingItem = cartItems.value.find(item => item.id === product.id)
  
  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cartItems.value.push({
      ...product,
      quantity
    })
  }
  
  // Persistir en localStorage
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

const removeFromCart = (productId) => {
  cartItems.value = cartItems.value.filter(item => item.id !== productId)
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

const updateCartQuantity = (productId, quantity) => {
  const item = cartItems.value.find(item => item.id === productId)
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = quantity
      localStorage.setItem('cart', JSON.stringify(cartItems.value))
    }
  }
}

const clearCart = () => {
  cartItems.value = []
  localStorage.removeItem('cart')
}

const initializeCart = () => {
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    cartItems.value = JSON.parse(savedCart)
  }
}

// Computed properties para el carrito
const cartTotal = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

const cartItemCount = computed(() => {
  return cartItems.value.reduce((count, item) => count + item.quantity, 0)
})

// === FUNCIONES DE PEDIDOS ===
const createOrder = async (orderData) => {
  try {
    isLoading.value = true
    const response = await makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({
        items: cartItems.value,
        total: cartTotal.value,
        ...orderData
      })
    })
    
    // Limpiar carrito después de pedido exitoso
    clearCart()
    
    return response
  } catch (error) {
    throw error
  } finally {
    isLoading.value = false
  }
}

const fetchOrders = async () => {
  try {
    const response = await makeRequest('/orders')
    orders.value = response.orders || response
    return response
  } catch (error) {
    console.warn('Using demo orders. Replace with real API call.')
    orders.value = []
  }
}

// === FUNCIONES ADMIN ===
const createProduct = async (productData) => {
  try {
    const response = await makeRequest('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    })
    
    // Actualizar lista local
    products.value.unshift(response.product || response)
    
    return response
  } catch (error) {
    throw error
  }
}

const updateProduct = async (id, productData) => {
  try {
    const response = await makeRequest(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    })
    
    // Actualizar lista local
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index] = response.product || response
    }
    
    return response
  } catch (error) {
    throw error
  }
}

const deleteProduct = async (id) => {
  try {
    await makeRequest(`/admin/products/${id}`, {
      method: 'DELETE'
    })
    
    // Remover de lista local
    products.value = products.value.filter(p => p.id !== id)
  } catch (error) {
    throw error
  }
}

// === EXPORTAR COMPOSABLE ===
export const useStore = () => {
  // Inicializar datos al usar el store
  if (cartItems.value.length === 0) {
    initializeCart()
  }
  
  return {
    // Estado
    user,
    isLoading,
    cartItems,
    products,
    categories,
    orders,
    
    // Computed
    cartTotal,
    cartItemCount,
    
    // Autenticación
    login,
    register,
    logout,
    initializeAuth,
    
    // Productos
    fetchProducts,
    getProductById,
    
    // Carrito
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    
    // Pedidos
    createOrder,
    fetchOrders,
    
    // Admin
    createProduct,
    updateProduct,
    deleteProduct
  }
}
