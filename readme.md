# 🎨 AquaArt — Професійний аквагрим у Львові

Сайт-візитка для майстра аквагриму з виїздною роботою по Львову та області.

## 🚀 Швидкий старт

```bash
# Встановити залежності
npm install

# Запустити dev-режим (Tailwind watch)
npm run dev

# Зібрати для продакшну
npm run build
```

Після запуску `npm run dev` відкрийте `index.html` у браузері. Tailwind буде автоматично перебілджувати CSS при змінах.

## 📁 Структура проєкту

```
├── index.html                 # Головна сторінка (single-page)
├── src/
│   ├── input.css              # Tailwind CSS вхідний файл
│   ├── js/
│   │   ├── app.js             # Ініціалізація + FAQ accordion
│   │   ├── navigation.js      # Sticky header, мобільне меню
│   │   ├── gallery.js         # Lightbox + фільтрація портфоліо
│   │   ├── form.js            # Валідація форми + Formspree
│   │   ├── i18n.js            # Перемикач мови (UA/EN)
│   │   └── animations.js      # Scroll-reveal анімації
│   └── i18n/
│       ├── uk.json            # Українські тексти
│       └── en.json            # Англійські тексти
├── assets/
│   ├── images/                # Зображення (hero, portfolio, about)
│   └── icons/                 # SVG іконки
├── dist/
│   └── output.css             # Зібраний Tailwind CSS (auto-generated)
├── tailwind.config.js         # Конфігурація Tailwind
├── netlify.toml               # Netlify деплой конфіг
└── package.json               # npm scripts та залежності
```

## 🛠 Технології

- **HTML5** — семантична розмітка
- **Tailwind CSS v3** — стилізація (utility-first)
- **JavaScript (ES6+)** — інтерактив (модульна архітектура)
- **Formspree** — обробка форми (без бекенду)
- **Google Fonts** — Comfortaa + Inter
- **Netlify** — хостинг та CI/CD

## 📝 Форма зворотного зв'язку

Форма використовує [Formspree](https://formspree.io). Для налаштування:

1. Створіть акаунт на formspree.io
2. Створіть нову форму
3. Замініть `YOUR_FORM_ID` в `src/js/form.js` на ваш endpoint

Без налаштування форма працює в demo-режимі (дані виводяться в консоль).

## 🌐 Деплой

Сайт налаштований для автодеплою на Netlify:

1. Підключіть GitHub-репозиторій до Netlify
2. Build command: `npm run build`
3. Publish directory: `.`

## 📄 Ліцензія

ISC
