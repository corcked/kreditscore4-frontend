'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LoanForm from '@/components/LoanForm'
import { isAuthenticated, handleAuthCallback, completeAuth } from '@/lib/auth'

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [authInProgress, setAuthInProgress] = useState(false)

  useEffect(() => {
    checkAuthState()
  }, [])

  const checkAuthState = async () => {
    try {
      console.log('🏁 HomePage: Starting checkAuthState...')
      
      // Проверяем, есть ли уже авторизация
      const isAlreadyAuth = isAuthenticated()
      console.log('🔍 HomePage: Current auth status:', isAlreadyAuth)
      
      if (isAlreadyAuth) {
        console.log('✅ HomePage: Already authenticated, redirecting to dashboard...')
        router.push('/dashboard')
        return
      }

      // Проверяем, есть ли токен в URL (возврат из Telegram)
      const authToken = handleAuthCallback()
      console.log('🎫 HomePage: Auth token from URL:', authToken ? authToken.substring(0, 20) + '...' : 'NONE')
      
      if (authToken) {
        console.log('🚀 HomePage: Found auth token, starting completion...')
        setAuthInProgress(true)
        try {
          const user = await completeAuth(authToken)
          console.log('✅ HomePage: Auth completed successfully, user:', user.telegram_id)
          
          // Дополнительная проверка статуса авторизации
          const finalAuthCheck = isAuthenticated()
          console.log('🔐 HomePage: Final auth check before redirect:', finalAuthCheck)
          
          if (finalAuthCheck) {
            console.log('➡️ HomePage: Redirecting to dashboard...')
            router.push('/dashboard')
          } else {
            console.error('❌ HomePage: Auth completion failed - no token found after completion!')
            alert('Ошибка авторизации. Токен не сохранился.')
          }
        } catch (error) {
          console.error('❌ HomePage: Auth completion error:', error)
          alert('Ошибка авторизации. Попробуйте еще раз.')
        } finally {
          setAuthInProgress(false)
        }
      } else {
        console.log('📝 HomePage: No auth token, showing login form')
      }
    } catch (error) {
      console.error('❌ HomePage: General error in checkAuthState:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || authInProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">
            {authInProgress ? 'Завершение авторизации...' : 'Загрузка...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-16">
          <div className="inline-block p-3 bg-primary-100 rounded-2xl mb-6">
            <svg 
              className="w-12 h-12 text-primary-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
              />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-gradient">KreditScore4</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Безопасная авторизация через Telegram Bot с отображением персональных данных
          </p>
          
          <LoanForm className="max-w-md mx-auto" />
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card text-center">
            <div className="inline-block p-3 bg-telegram-100 rounded-xl mb-4">
              <svg 
                className="w-8 h-8 text-telegram-600" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.820 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Через Telegram
            </h3>
            <p className="text-gray-600">
              Быстрая и безопасная авторизация через ваш аккаунт Telegram
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-block p-3 bg-green-100 rounded-xl mb-4">
              <svg 
                className="w-8 h-8 text-green-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Безопасность
            </h3>
            <p className="text-gray-600">
              Все данные передаются в зашифрованном виде и надежно защищены
            </p>
          </div>

          <div className="card text-center">
            <div className="inline-block p-3 bg-blue-100 rounded-xl mb-4">
              <svg 
                className="w-8 h-8 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Аналитика
            </h3>
            <p className="text-gray-600">
              Детальная информация о ваших сессиях и устройствах
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="card max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Как это работает
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                1
              </div>
              <h4 className="font-semibold mb-2">Нажмите кнопку</h4>
              <p className="text-sm text-gray-600">Начните авторизацию через Telegram</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                2
              </div>
              <h4 className="font-semibold mb-2">Откройте бота</h4>
              <p className="text-sm text-gray-600">Перейдите в Telegram Bot по ссылке</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                3
              </div>
              <h4 className="font-semibold mb-2">Поделитесь номером</h4>
              <p className="text-sm text-gray-600">Отправьте номер телефона через бота</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                4
              </div>
              <h4 className="font-semibold mb-2">Готово!</h4>
              <p className="text-sm text-gray-600">Возвращайтесь и пользуйтесь системой</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 