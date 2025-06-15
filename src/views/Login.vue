
<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <h1>Iniciar Sesión</h1>
        
        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              :class="{ error: errors.email }"
              placeholder="tu@email.com"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="password-input">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                :class="{ error: errors.password }"
                placeholder="Tu contraseña"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <div class="form-options">
            <label class="checkbox-label">
              <input v-model="formData.rememberMe" type="checkbox" />
              <span>Recordarme</span>
            </label>
            <a href="#" @click.prevent="showForgotPassword = true" class="forgot-link">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="submit-btn"
          >
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>

          <div v-if="errors.general" class="error-message general-error">
            {{ errors.general }}
          </div>
        </form>

        <div class="auth-divider">
          <span>o</span>
        </div>

        <!-- Login con redes sociales - opcional -->
        <div class="social-login">
          <button @click="loginWithGoogle" class="social-btn google">
            <span>🌐</span> Continuar con Google
          </button>
          <button @click="loginWithFacebook" class="social-btn facebook">
            <span>📘</span> Continuar con Facebook
          </button>
        </div>

        <div class="auth-footer">
          <p>¿No tienes una cuenta? 
            <router-link to="/register">Regístrate aquí</router-link>
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de recuperación de contraseña -->
    <div v-if="showForgotPassword" class="modal-overlay" @click="showForgotPassword = false">
      <div class="modal-content" @click.stop>
        <h2>Recuperar Contraseña</h2>
        <form @submit.prevent="handleForgotPassword">
          <div class="form-group">
            <label for="forgot-email">Email</label>
            <input
              id="forgot-email"
              v-model="forgotEmail"
              type="email"
              required
              placeholder="tu@email.com"
            />
          </div>
          <div class="modal-actions">
            <button type="button" @click="showForgotPassword = false">Cancelar</button>
            <button type="submit" :disabled="isLoading">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../composables/useStore'

const router = useRouter()
const store = useStore()

// Estados del formulario
const formData = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const errors = reactive({
  email: '',
  password: '',
  general: ''
})

const showPassword = ref(false)
const isLoading = ref(false)
const showForgotPassword = ref(false)
const forgotEmail = ref('')

// Validación
const validateForm = () => {
  // Limpiar errores
  Object.keys(errors).forEach(key => errors[key] = '')
  
  let isValid = true

  if (!formData.email) {
    errors.email = 'El email es requerido'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Email inválido'
    isValid = false
  }

  if (!formData.password) {
    errors.password = 'La contraseña es requerida'
    isValid = false
  } else if (formData.password.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres'
    isValid = false
  }

  return isValid
}

// Manejo del login
const handleLogin = async () => {
  if (!validateForm()) return

  try {
    isLoading.value = true
    
    // Llamar al store para hacer login
    await store.login({
      email: formData.email,
      password: formData.password,
      rememberMe: formData.rememberMe
    })

    // Redireccionar después del login exitoso
    const redirectTo = router.currentRoute.value.query.redirect || '/'
    router.push(redirectTo)
    
  } catch (error) {
    errors.general = error.message || 'Error al iniciar sesión'
  } finally {
    isLoading.value = false
  }
}

// Login con redes sociales (implementar según necesidades)
const loginWithGoogle = () => {
  // Implementar OAuth con Google
  console.log('Login with Google')
}

const loginWithFacebook = () => {
  // Implementar OAuth con Facebook
  console.log('Login with Facebook')
}

// Recuperación de contraseña
const handleForgotPassword = async () => {
  try {
    isLoading.value = true
    
    // Aquí harías la llamada a tu API para recuperación de contraseña
    // await store.forgotPassword(forgotEmail.value)
    
    alert('Se ha enviado un email con instrucciones para recuperar tu contraseña')
    showForgotPassword.value = false
    forgotEmail.value = ''
    
  } catch (error) {
    alert('Error al enviar email de recuperación')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.auth-container {
  width: 100%;
  max-width: 400px;
}

.auth-card {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.auth-card h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-color);
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-group input.error {
  border-color: var(--accent-color);
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.forgot-link {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-link:hover {
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 1rem;
}

.submit-btn:hover:not(:disabled) {
  background: #2980b9;
}

.submit-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.error-message {
  color: var(--accent-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.general-error {
  text-align: center;
  margin-top: 1rem;
}

.auth-divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.auth-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e1e5e9;
}

.auth-divider span {
  background: white;
  padding: 0 1rem;
  color: #666;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.social-btn:hover {
  border-color: var(--primary-color);
  background: #f8f9fa;
}

.auth-footer {
  text-align: center;
  color: #666;
}

.auth-footer a {
  color: var(--primary-color);
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
}

.modal-content h2 {
  margin-bottom: 1rem;
  text-align: center;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.modal-actions button {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  cursor: pointer;
}

.modal-actions button[type="submit"] {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}
</style>
