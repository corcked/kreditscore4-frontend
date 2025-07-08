'use client'

import { useEffect, useState } from 'react'
import { userApi, type User, type AuthSession } from '@/lib/api'
import { logout } from '@/lib/auth'

interface UserInfoProps {
  className?: string
}

export default function UserInfo({ className = '' }: UserInfoProps) {
  const [user, setUser] = useState<User | null>(null)
  const [sessions, setSessions] = useState<AuthSession[]>([])
  const [deviceInfo, setDeviceInfo] = useState<{ device_info: string; ip_address: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [userData, sessionsData, deviceData] = await Promise.all([
        userApi.getMe(),
        userApi.getMySessions(),
        userApi.getDeviceInfo()
      ])
      
      setUser(userData)
      // Убеждаемся, что sessionsData - это массив
      setSessions(Array.isArray(sessionsData) ? sessionsData : [])
      setDeviceInfo(deviceData)
    } catch (err) {
      console.error('Ошибка загрузки данных:', err)
      setError('Не удалось загрузить данные пользователя')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      await logout()
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className={`card animate-pulse ${className}`}>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`card border-red-200 bg-red-50 ${className}`}>
        <div className="text-red-600 text-center">
          <p className="font-medium">Ошибка</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={loadUserData}
            className="mt-3 btn-secondary text-sm"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Основная информация о пользователе */}
      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Профиль пользователя
          </h2>
          <button
            onClick={handleLogout}
            className="btn-secondary text-sm"
          >
            Выйти
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Телефон</label>
            <p className="text-lg text-gray-900">{user.phone_number}</p>
          </div>
          
          {user.first_name && (
            <div>
              <label className="text-sm font-medium text-gray-500">Имя</label>
              <p className="text-lg text-gray-900">{user.first_name}</p>
            </div>
          )}
          
          {user.last_name && (
            <div>
              <label className="text-sm font-medium text-gray-500">Фамилия</label>
              <p className="text-lg text-gray-900">{user.last_name}</p>
            </div>
          )}
          
          {user.username && (
            <div>
              <label className="text-sm font-medium text-gray-500">Username</label>
              <p className="text-lg text-gray-900">@{user.username}</p>
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium text-gray-500">Telegram ID</label>
            <p className="text-lg text-gray-900 font-mono">{user.telegram_id}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-500">Дата регистрации</label>
            <p className="text-lg text-gray-900">{formatDate(user.created_at)}</p>
          </div>
        </div>
      </div>

      {/* Информация о займе */}
      {(user.loan_amount || user.loan_term || user.loan_purpose || user.monthly_income) && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Данные займа
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.loan_amount && (
              <div>
                <label className="text-sm font-medium text-gray-500">Сумма займа</label>
                <p className="text-lg text-gray-900">
                  {user.loan_amount.toLocaleString('ru-RU', { 
                    style: 'currency', 
                    currency: 'RUB',
                    minimumFractionDigits: 0 
                  })}
                </p>
              </div>
            )}
            
            {user.loan_term && (
              <div>
                <label className="text-sm font-medium text-gray-500">Срок займа</label>
                <p className="text-lg text-gray-900">
                  {user.loan_term} {user.loan_term === 1 ? 'месяц' : user.loan_term < 5 ? 'месяца' : 'месяцев'}
                </p>
              </div>
            )}
            
            {user.loan_purpose && (
              <div>
                <label className="text-sm font-medium text-gray-500">Цель займа</label>
                <p className="text-lg text-gray-900">{user.loan_purpose}</p>
              </div>
            )}
            
            {user.monthly_income && (
              <div>
                <label className="text-sm font-medium text-gray-500">Ежемесячный доход</label>
                <p className="text-lg text-gray-900">
                  {user.monthly_income.toLocaleString('ru-RU', { 
                    style: 'currency', 
                    currency: 'RUB',
                    minimumFractionDigits: 0 
                  })}
                </p>
              </div>
            )}
          </div>
          
          {/* Расчет платежа */}
          {user.loan_amount && user.loan_term && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Расчет платежа</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Ежемесячный платеж:</span>
                  <p className="font-semibold text-blue-900">
                    {Math.round(user.loan_amount * 1.15 / user.loan_term).toLocaleString('ru-RU', { 
                      style: 'currency', 
                      currency: 'RUB',
                      minimumFractionDigits: 0 
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-blue-600">Общая сумма:</span>
                  <p className="font-semibold text-blue-900">
                    {Math.round(user.loan_amount * 1.15).toLocaleString('ru-RU', { 
                      style: 'currency', 
                      currency: 'RUB',
                      minimumFractionDigits: 0 
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-blue-600">Переплата:</span>
                  <p className="font-semibold text-blue-900">
                    {Math.round(user.loan_amount * 0.15).toLocaleString('ru-RU', { 
                      style: 'currency', 
                      currency: 'RUB',
                      minimumFractionDigits: 0 
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Информация об устройстве */}
      {deviceInfo && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Информация об устройстве
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">IP адрес</label>
              <p className="text-lg text-gray-900 font-mono">{deviceInfo.ip_address}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Устройство</label>
              <p className="text-lg text-gray-900">{deviceInfo.device_info}</p>
            </div>
          </div>
        </div>
      )}

      {/* Активные сессии */}
      {Array.isArray(sessions) && sessions.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Активные сессии ({sessions.filter(s => s.is_active).length})
          </h3>
          
          <div className="space-y-3">
            {sessions.filter(s => s.is_active).map((session) => (
              <div 
                key={session.id}
                className="p-4 bg-gray-50 rounded-lg border"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">IP:</span>
                    <span className="ml-2 font-mono">{session.ip_address}</span>
                  </div>
                  
                  {session.device_info && (
                    <div>
                      <span className="font-medium text-gray-500">Устройство:</span>
                      <span className="ml-2">{session.device_info}</span>
                    </div>
                  )}
                  
                  <div>
                    <span className="font-medium text-gray-500">Вход:</span>
                    <span className="ml-2">{formatDate(session.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 