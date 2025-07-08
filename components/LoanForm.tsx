'use client'

import { useState } from 'react'
import { startTelegramAuth } from '@/lib/auth'

interface LoanFormProps {
  className?: string
}

export default function LoanForm({ className = '' }: LoanFormProps) {
  const [loanAmount, setLoanAmount] = useState<string>('')
  const [loanTerm, setLoanTerm] = useState<string>('')
  const [loanPurpose, setLoanPurpose] = useState<string>('')
  const [monthlyIncome, setMonthlyIncome] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const loanPurposeOptions = [
    { value: '', label: 'Выберите цель займа' },
    { value: 'На личные нужды', label: 'На личные нужды' },
    { value: 'Покупка техники', label: 'Покупка техники' },
    { value: 'Ремонт дома', label: 'Ремонт дома' },
    { value: 'Медицинские расходы', label: 'Медицинские расходы' },
    { value: 'Образование', label: 'Образование' },
    { value: 'Путешествие', label: 'Путешествие' },
    { value: 'Погашение других долгов', label: 'Погашение других долгов' },
    { value: 'Другое', label: 'Другое' }
  ]

  const formatNumber = (value: string): string => {
    // Удаляем все кроме цифр
    const numbers = value.replace(/\D/g, '')
    // Форматируем с пробелами
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    // Валидация суммы займа
    const amount = parseInt(loanAmount.replace(/\s/g, ''))
    if (!amount || amount < 1000) {
      newErrors.loanAmount = 'Минимальная сумма займа: 1 000 ₽'
    } else if (amount > 5000000) {
      newErrors.loanAmount = 'Максимальная сумма займа: 5 000 000 ₽'
    }

    // Валидация срока займа
    const term = parseInt(loanTerm)
    if (!term || term < 1) {
      newErrors.loanTerm = 'Минимальный срок: 1 месяц'
    } else if (term > 60) {
      newErrors.loanTerm = 'Максимальный срок: 60 месяцев'
    }

    // Валидация цели займа
    if (!loanPurpose) {
      newErrors.loanPurpose = 'Выберите цель займа'
    }

    // Валидация дохода
    const income = parseInt(monthlyIncome.replace(/\s/g, ''))
    if (!income || income < 1000) {
      newErrors.monthlyIncome = 'Минимальный доход: 1 000 ₽'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const loanData = {
        loan_amount: parseInt(loanAmount.replace(/\s/g, '')),
        loan_term: parseInt(loanTerm),
        loan_purpose: loanPurpose,
        monthly_income: parseInt(monthlyIncome.replace(/\s/g, ''))
      }

      await startTelegramAuth(loanData)
    } catch (error) {
      console.error('Ошибка при отправке данных займа:', error)
      alert('Произошла ошибка. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Заявка на займ
        </h2>
        <p className="text-gray-600">
          Заполните данные для получения займа через Telegram
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Сумма займа */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Желаемая сумма займа *
          </label>
          <div className="relative">
            <input
              type="text"
              value={loanAmount}
              onChange={(e) => setLoanAmount(formatNumber(e.target.value))}
              placeholder="100 000"
              className={`w-full p-3 border rounded-lg text-lg ${
                errors.loanAmount ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
            />
            <span className="absolute right-3 top-3 text-gray-500">₽</span>
          </div>
          {errors.loanAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.loanAmount}</p>
          )}
        </div>

        {/* Срок займа */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Срок займа *
          </label>
          <div className="relative">
            <input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              placeholder="12"
              min="1"
              max="60"
              className={`w-full p-3 border rounded-lg text-lg ${
                errors.loanTerm ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
            />
            <span className="absolute right-3 top-3 text-gray-500">мес.</span>
          </div>
          {errors.loanTerm && (
            <p className="mt-1 text-sm text-red-600">{errors.loanTerm}</p>
          )}
        </div>

        {/* Цель займа */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Цель займа *
          </label>
          <select
            value={loanPurpose}
            onChange={(e) => setLoanPurpose(e.target.value)}
            className={`w-full p-3 border rounded-lg text-lg ${
              errors.loanPurpose ? 'border-red-300 bg-red-50' : 'border-gray-300'
            } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
          >
            {loanPurposeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.loanPurpose && (
            <p className="mt-1 text-sm text-red-600">{errors.loanPurpose}</p>
          )}
        </div>

        {/* Ежемесячный доход */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ежемесячный доход *
          </label>
          <div className="relative">
            <input
              type="text"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(formatNumber(e.target.value))}
              placeholder="50 000"
              className={`w-full p-3 border rounded-lg text-lg ${
                errors.monthlyIncome ? 'border-red-300 bg-red-50' : 'border-gray-300'
              } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
            />
            <span className="absolute right-3 top-3 text-gray-500">₽</span>
          </div>
          {errors.monthlyIncome && (
            <p className="mt-1 text-sm text-red-600">{errors.monthlyIncome}</p>
          )}
        </div>

        {/* Расчет примерного платежа */}
        {loanAmount && loanTerm && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Примерный расчет:</h4>
            <div className="text-sm text-blue-800">
              <p>Ежемесячный платеж: <span className="font-semibold">
                {Math.round(parseInt(loanAmount.replace(/\s/g, '')) * 1.15 / parseInt(loanTerm || '1')).toLocaleString('ru-RU')} ₽
              </span></p>
              <p>Общая сумма к возврату: <span className="font-semibold">
                {Math.round(parseInt(loanAmount.replace(/\s/g, '')) * 1.15).toLocaleString('ru-RU')} ₽
              </span></p>
              <p className="text-xs mt-1 text-blue-600">*Расчет приблизительный, ставка 15% годовых</p>
            </div>
          </div>
        )}

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full btn-telegram flex items-center justify-center 
            gap-3 px-6 py-4 text-lg 
            disabled:opacity-50 disabled:cursor-not-allowed
            transform transition-all duration-200 
            hover:scale-105 active:scale-95
            shadow-lg hover:shadow-xl
          `}
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              <span>Отправка...</span>
            </>
          ) : (
            <>
              <svg 
                className="w-6 h-6" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.820 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span>Получить займ через Telegram</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Нажимая кнопку, вы соглашаетесь с обработкой персональных данных и условиями предоставления займа
        </p>
      </form>
    </div>
  )
} 