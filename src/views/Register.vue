
<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <h1>Crear Cuenta</h1>
        
        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName">Nombre</label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                required
                :class="{ error: errors.firstName }"
                placeholder="Tu nombre"
              />
              <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
            </div>

            <div class="form-group">
              <label for="lastName">Apellido</label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                required
                :class="{ error: errors.lastName }"
                placeholder="Tu apellido"
              />
              <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
            </div>
          </div>

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
            <label for="phone">Teléfono (opcional)</label>
            <input
              id="phone"
              v-model="formData.phone"
              type="tel"
              :class="{ error: errors.phone }"
              placeholder="+1 234 567 890"
            />
            <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
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
                placeholder="Mínimo 8 caracteres"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            
            <!-- Indicador de fortaleza de contraseña -->
            <div class="password-strength">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  :class="passwordStrength.class"
                  :style="{ width: passwordStrength.width }"
                ></div>
              </div>
              <span class="strength-text">{{ passwordStrength.text }}</span>
            </div>
            
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirmar Contraseña</label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              required
              :class="{ error: errors.confirmPassword }"
              placeholder="Repite tu contraseña"
            />
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          </div>

          <div class="form-group">
            <label for="birthDate">Fecha de Nacimiento</label>
            <input
              id="birthDate"
              v-model="formData.birthDate"
              type="date"
              :class="{ error: errors.birthDate }"
            />
            <span v-if="errors.birthDate" class="error-message">{{ errors.birthDate }}</span>
          </div>

          <div class="form-group">
            <label for="gender">Género (opcional)</label>
            <select id="gender" v-model="formData.gender">
              <option value="">Seleccionar...</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="other">Otro</option>
              <option value="prefer-not-to-say">Prefiero no decir</option>
            </select>
          </div>

          <div class="form-checkboxes">
            <label class="checkbox-label">
              <input v-model="formData.acceptTerms" type="checkbox" required />
              <span>Acepto los 
                <a href="/terms" target="_blank">Términos y Condiciones</a>
              </span>
            </label>

            <label class="checkbox-label">
              <input v-model="formData.acceptNewsletter" type="checkbox" />
              <span>Quiero recibir ofertas y novedades por email</span>
            </label>
          </div>

          <button
            type="submit"
            :disabled="isLoading || !formData.acceptTerms"
            class="submit-btn"
          >
            {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </button>

          <div v-if="errors.general" class="error-message general-error">
            {{ errors.general }}
          </div>
        </form>

        <div class="auth-divider">
          <span>o</span>
        </div>

        <!-- Registro con redes sociales -->
        <div class="social-login">
          <button @click="registerWithGoogle" class="social-btn google">
            <span>🌐</span> Registrarse con Google
          </button>
          <button @click="registerWithFacebook" class="social-btn facebook">
            <span>📘</span> Registrarse con Facebook
          </button>
        </div>

        <div class="auth-footer">
          <p>¿Ya tienes una cuenta? 
            <router-link to="/login">Inicia sesión aquí</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../composables/useStore'

const router = useRouter()
const store = useStore()

// Estados del formulario
const formData = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  birthDate: '',
  gender: '',
  acceptTerms: false,
  acceptNewsletter: false
})

const errors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  birthDate: '',
  general: ''
})

const showPassword = ref(false)
const isLoading = ref(false)

// Fortaleza de contraseña
const passwordStrength = computed(() => {
  const password = formData.password
  let score = 0
  
  if (password.length >= 8) score++
  if (password.match(/[a-z]/)) score++
  if (password.match(/[A-Z]/)) score++
  if (password.match(/[0-9]/)) score++
  if (password.match(/[^a-zA-Z0-9]/)) score++

  switch (score) {
    case 0:
    case 1:
      return { class: 'weak', width: '20%', text: 'Muy débil' }
    case 2:
      return { class: 'weak', width: '40%', text: 'Débil' }
    case 3:
      return { class: 'medium', width: '60%', text: 'Media' }
    case 4:
      return { class: 'strong', width: '80%', text: 'Fuerte' }
    case 5:
      return { class: 'very-strong', width: '100%', text: 'Muy fuerte' }
    default:
      return { class: '', width: '0%', text: '' }
  }
})

// Validación
const validateForm = () => {
  // Limpiar errores
  Object.keys(errors).forEach(key => errors[key] = '')
  
  let isValid = true

  if (!formData.firstName.trim()) {
    errors.firstName = 'El nombre es requerido'
    isValid = false
  }

  if (!formData.lastName.trim()) {
    errors.lastName = 'El apellido es requerido'
    isValid = false
  }

  if (!formData.email) {
    errors.email = 'El email es requerido'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Email inválido'
    isValid = false
  }

  if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
    errors.phone = 'Teléfono inválido'
    isValid = false
  }

  if (!formData.password) {
    errors.password = 'La contraseña es requerida'
    isValid = false
  } else if (formData.password.length < 8) {
    errors.password = 'La contraseña debe tener al menos 8 caracteres'
    isValid = false
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
    isValid = false
  }

  if (formData.birthDate) {
    const today = new Date()
    const birthDate = new Date(formData.birthDate)
    const age = today.getFullYear() - birthDate.getFullYear()
    
    if (age < 13) {
      errors.birthDate = 'Debes tener al menos 13 años'
      isValid = false
    }
  }

  return isValid
}

// Manejo del registro
const handleRegister = async () => {
  if (!validateForm()) return

  try {
    isLoading.value = true
    
    const userData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
      birthDate: formData.birthDate,
      gender: formData.gender,
      acceptNewsletter: formData.acceptNewsletter
    }

    // Llamar al store para hacer registro
    await store.register(userData)

    // Redireccionar después del registro exitoso
    alert('Cuenta creada exitosamente. Ahora puedes iniciar sesión.')
    router.push('/login')
    
  } catch (error) {
    errors.general = error.message || 'Error al crear la cuenta'
  } finally {
    isLoading.value = false
  }
}

// Registro con redes sociales
const registerWithGoogle = () => {
  console.log('Register with Google')
}

const registerWithFacebook = () => {
  console.log('Register with Facebook')
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
  max-width: 500px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
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

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  background: #e1e5e9;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s;
}

.strength-fill.weak { background: #e74c3c; }
.strength-fill.medium { background: #f39c12; }
.strength-fill.strong { background: #f1c40f; }
.strength-fill.very-strong { background: #27ae60; }

.strength-text {
  font-size: 0.8rem;
  color: #666;
}

.form-checkboxes {
  margin-bottom: 1.5rem;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.checkbox-label input[type="checkbox"] {
  margin-top: 0.2rem;
  width: auto;
}

.checkbox-label a {
  color: var(--primary-color);
  text-decoration: none;
}

.checkbox-label a:hover {
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

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
