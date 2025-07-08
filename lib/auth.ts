import Cookies from 'js-cookie'
import { authApi, type User } from './api'

// Проверка авторизации пользователя
export function isAuthenticated(): boolean {
  const token = Cookies.get('access_token')
  console.log('🔍 isAuthenticated check:', { token: token ? 'EXISTS' : 'MISSING', tokenLength: token?.length })
  return !!token
}

// Сохранение токена авторизации
export function saveAuthToken(token: string): void {
  console.log('💾 Saving auth token:', { tokenLength: token.length, token: token.substring(0, 20) + '...' })
  
  Cookies.set('access_token', token, { 
    expires: 7, // 7 дней
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
  
  // Проверяем сразу после сохранения
  const savedToken = Cookies.get('access_token')
  console.log('✅ Token saved verification:', { 
    saved: savedToken ? 'YES' : 'NO', 
    matches: savedToken === token,
    environment: process.env.NODE_ENV
  })
}

// Удаление токена авторизации
export function removeAuthToken(): void {
  Cookies.remove('access_token')
}

// Получение токена авторизации
export function getAuthToken(): string | undefined {
  return Cookies.get('access_token')
}

// Выход из системы
export async function logout(): Promise<void> {
  try {
    await authApi.logout()
  } catch (error) {
    console.error('Ошибка при выходе:', error)
  } finally {
    removeAuthToken()
    window.location.href = '/'
  }
}

// Проверка и обработка параметров URL для завершения авторизации
export function handleAuthCallback(): string | null {
  if (typeof window === 'undefined') return null
  
  const urlParams = new URLSearchParams(window.location.search)
  const authToken = urlParams.get('auth_token')
  
  if (authToken) {
    // Удаляем параметр из URL
    const newUrl = window.location.pathname
    window.history.replaceState({}, '', newUrl)
    return authToken
  }
  
  return null
}

// Начало процесса авторизации через Telegram
export async function startTelegramAuth(loanData?: {
  loan_amount?: number;
  loan_term?: number;
  loan_purpose?: string;
  monthly_income?: number;
}): Promise<void> {
  try {
    const { telegram_url } = await authApi.createAuthToken(loanData)
    window.location.href = telegram_url
  } catch (error) {
    console.error('Ошибка при создании токена авторизации:', error)
    throw new Error('Не удалось начать авторизацию')
  }
}

// Завершение авторизации с токеном
export async function completeAuth(authToken: string): Promise<User> {
  try {
    console.log('🚀 Starting completeAuth with authToken:', authToken.substring(0, 20) + '...')
    
    const response = await authApi.checkAuthStatus(authToken)
    console.log('📥 API response:', { 
      hasAccessToken: !!response.access_token,
      accessTokenLength: response.access_token?.length,
      hasUser: !!response.user
    })
    
    saveAuthToken(response.access_token)
    
    // Дополнительная проверка после сохранения
    const isNowAuthenticated = isAuthenticated()
    console.log('🎯 Auth status after save:', { isNowAuthenticated })
    
    return response.user
  } catch (error) {
    console.error('❌ Ошибка при завершении авторизации:', error)
    throw new Error('Не удалось завершить авторизацию')
  }
} 