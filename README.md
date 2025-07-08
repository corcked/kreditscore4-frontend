# KreditScore4 Frontend

Next.js приложение с авторизацией через Telegram Bot.

## 🚀 Технологии

- **Next.js 15** - React фреймворк
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **Axios** - HTTP клиент

## 🔗 Связанные репозитории

- Backend: [kreditscore4-backend](../kreditscore4-backend)

## 🛠 Локальная разработка

```bash
# Установка зависимостей
npm install

# Переменные окружения
cp .env.example .env.local
# Настройте: NEXT_PUBLIC_API_URL

# Запуск
npm run dev
```

## 🚂 Деплой на Railway

1. **Создайте новый проект в Railway**
2. **Подключите этот репозиторий**
3. **Настройте переменные окружения:**
   - `NEXT_PUBLIC_API_URL` - URL вашего backend API

Railway автоматически определит Next.js проект и настроит деплой.

## 📋 Страницы

- `/` - главная страница с авторизацией
- `/dashboard` - личный кабинет пользователя

## 🎨 Компоненты

- `AuthButton` - кнопка авторизации через Telegram
- `UserInfo` - отображение данных пользователя

## 🔧 Структура проекта

```
app/
├── layout.tsx       # Основной layout
├── page.tsx         # Главная страница
└── dashboard/
    └── page.tsx     # Dashboard

components/
├── AuthButton.tsx   # Кнопка авторизации
└── UserInfo.tsx     # Информация о пользователе

lib/
├── api.ts          # API клиент
└── auth.ts         # Утилиты авторизации
```

## 🔄 Интеграция с Backend

Frontend подключается к backend через переменную `NEXT_PUBLIC_API_URL`. 
Убедитесь, что backend развернут и доступен перед запуском frontend.
