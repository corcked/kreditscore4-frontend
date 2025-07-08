import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Создаем экземпляр axios с базовой конфигурацией
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Интерцептор для добавления токена к запросам
api.interceptors.request.use((config) => {
  const token = Cookies.get('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Удаляем токены при ошибке авторизации
      Cookies.remove('access_token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// Типы данных
export interface User {
  id: number
  telegram_id: number
  phone_number: string
  first_name?: string
  last_name?: string
  username?: string
  loan_amount?: number
  loan_term?: number
  loan_purpose?: string
  monthly_income?: number
  created_at: string
}

export interface AuthSession {
  id: number
  user_id: number
  ip_address?: string
  user_agent?: string
  device_info?: string
  created_at: string
  is_active: boolean
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

// API методы для авторизации
export const authApi = {
  // Создание токена авторизации
  async createAuthToken(loanData?: {
    loan_amount?: number;
    loan_term?: number;
    loan_purpose?: string;
    monthly_income?: number;
  }): Promise<{ auth_token: string; telegram_url: string }> {
    const response = await api.post('/api/auth/telegram', loanData || {})
    return response.data
  },

  // Проверка статуса авторизации
  async checkAuthStatus(authToken: string): Promise<AuthResponse> {
    const response = await api.post('/api/auth/verify', { auth_token: authToken })
    return response.data
  },

  // Выход из системы
  async logout(): Promise<void> {
    await api.post('/api/auth/logout')
    Cookies.remove('access_token')
  },
}

// API методы для пользователей
export const userApi = {
  // Получение информации о текущем пользователе
  async getMe(): Promise<User> {
    const response = await api.get('/api/users/me')
    return response.data
  },

  // Получение сессий пользователя
  async getMySessions(): Promise<AuthSession[]> {
    const response = await api.get('/api/users/me/sessions')
    return response.data
  },

  // Получение информации об устройстве
  async getDeviceInfo(): Promise<{ device_info: string; ip_address: string }> {
    const response = await api.get('/api/users/me/device-info')
    return response.data
  },
} 