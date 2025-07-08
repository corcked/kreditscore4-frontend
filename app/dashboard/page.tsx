'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UserInfo from '@/components/UserInfo'
import { isAuthenticated } from '@/lib/auth'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // Проверяем авторизацию при загрузке страницы
    console.log('🏠 Dashboard page loaded, checking auth...')
    const authStatus = isAuthenticated()
    console.log('🔐 Dashboard auth check result:', authStatus)
    
    if (!authStatus) {
      console.log('❌ Not authenticated, redirecting to home...')
      router.push('/')
    } else {
      console.log('✅ Authenticated, staying on dashboard')
    }
  }, [router])

  // Если пользователь не авторизован, не показываем ничего
  const currentAuthStatus = isAuthenticated()
  console.log('🔄 Dashboard render auth check:', currentAuthStatus)
  
  if (!currentAuthStatus) {
    console.log('🚫 Rendering null due to no auth')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Управление вашими данными и сессиями</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-gray-500">
                Добро пожаловать в KreditScore4
              </div>
              
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <UserInfo />
      </div>
    </div>
  )
} 