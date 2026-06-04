import type { LegalDoc } from "./types";

export const COOKIES_DOC: LegalDoc = {
  slug: "cookies",
  effectiveDateIso: "2026-06-03",
  title: {
    ru: "Политика cookies",
    uz: "Cookies siyosati",
    en: "Cookies Policy",
  },
  kicker: {
    ru: "Bententrade · bententrade.uz",
    uz: "Bententrade · bententrade.uz",
    en: "Bententrade · bententrade.uz",
  },
  lead: {
    ru: "Сайт использует cookie и локальное хранилище браузера для работы корзины, языка, запоминания согласия на необязательные cookie и (при вашем согласии) аналитики. Ниже — перечень, сроки и способы управления.",
    uz: "Sayt savatcha, til, ixtiyoriy cookie-larga rozilikni eslab qolish va (roziligingiz bilan) analitika uchun cookie va brauzer local storage dan foydalanadi. Quyida ro'yxat, muddatlar va boshqarish usullari.",
    en: "The site uses cookies and browser local storage for the cart, language, remembering consent to optional cookies, and (with your consent) analytics. Below: list, retention, and how to control them.",
  },
  effectiveLabel: {
    ru: "Действует с",
    uz: "Kuchga kirgan sana",
    en: "Effective from",
  },
  contact: {
    ru: "Вопросы: opt@bententrade.uz. Подробнее о персональных данных — Политика конфиденциальности (/privacy).",
    uz: "Savollar: opt@bententrade.uz. Shaxsiy ma'lumotlar — Maxfiylik siyosati (/privacy).",
    en: "Questions: opt@bententrade.uz. Personal data — Privacy Policy (/privacy).",
  },
  legalNotice: {
    ru: "Отключение строго необходимых cookie может нарушить работу корзины и оформления заказа. Необязательные cookie (аналитика) включаются только после записи согласия в cookie btt_consent.",
    uz: "Majburiy cookie-larni o'chirish savatcha va buyurtma berishni buzishi mumkin. Ixtiyoriy cookie (analitika) faqat btt_consent cookie-ga rozilik yozilgandan keyin yoqiladi.",
    en: "Disabling strictly necessary cookies may break the cart and checkout. Optional cookies (analytics) load only after consent is stored in the btt_consent cookie.",
  },
  tocLabel: {
    ru: "Содержание",
    uz: "Mundarija",
    en: "Contents",
  },
  sections: [
    {
      id: "what",
      title: {
        ru: "1. Что такое cookie",
        uz: "1. Cookie nima",
        en: "1. What are cookies",
      },
      paragraphs: {
        ru: [
          "Cookie — небольшие текстовые файлы, которые сайт сохраняет в вашем браузере. Локальное хранилище (localStorage) похоже по назначению, но данные не отправляются автоматически на каждый запрос.",
          "Bententrade использует их для удобства B2B-заказов: сохранить корзину между визитами, язык интерфейса и ваш выбор по аналитике.",
        ],
        uz: [
          "Cookie — sayt brauzeringizga saqlaydigan kichik matn fayllari. LocalStorage maqsad jihatidan o'xshash, lekin har so'rovda avtomatik yuborilmaydi.",
          "Bententrade ularni B2B buyurtmalar qulayligi uchun ishlatadi: tashriflar orasida savatchani, interfeys tilini va analitika bo'yicha tanlovingizni saqlash.",
        ],
        en: [
          "Cookies are small text files the site stores in your browser. Local storage is similar but is not sent automatically on every request.",
          "Bententrade uses them for B2B convenience: keeping your cart between visits, UI language, and your analytics preference.",
        ],
      },
    },
    {
      id: "consent",
      title: {
        ru: "2. Согласие: cookie btt_consent",
        uz: "2. Rozilik: btt_consent cookie",
        en: "2. Consent: btt_consent cookie",
      },
      paragraphs: {
        ru: [
          "При первом визите (или после сброса cookie) баннер запрашивает согласие на необязательные категории. Ваш выбор записывается в cookie с именем btt_consent (срок — до 12 месяцев, затем запрос может повториться).",
          "Значение btt_consent кодирует: только необходимые; необходимые + аналитика; или отказ от аналитики при сохранении работы сайта. Изменить выбор можно через настройки баннера (если доступны) или очистив cookie в браузере.",
        ],
        uz: [
          "Birinchi tashrifda (yoki cookie tozalangach) banner ixtiyoriy toifalar uchun rozilik so'raydi. Tanlovingiz btt_consent nomli cookie-ga yoziladi (muddati — 12 oygacha, keyin so'rov takrorlanishi mumkin).",
          "btt_consent qiymati: faqat zarur; zarur + analitika; yoki analitikadan voz kechish sayt ishlashini saqlagan holda. Tanlovni banner sozlamalari (mavjud bo'lsa) yoki brauzerda cookie tozalash orqali o'zgartirish mumkin.",
        ],
        en: [
          "On first visit (or after cookies are cleared) a banner asks for consent to optional categories. Your choice is stored in a cookie named btt_consent (up to 12 months, then you may be asked again).",
          "btt_consent encodes: necessary only; necessary + analytics; or decline analytics while keeping core site functions. You can change your choice via the banner settings (when shown) or by clearing cookies in the browser.",
        ],
      },
    },
    {
      id: "cart",
      title: {
        ru: "3. Корзина и оформление заказа",
        uz: "3. Savatcha va buyurtma",
        en: "3. Cart and checkout",
      },
      paragraphs: {
        ru: [
          "Для хранения позиций корзины между сессиями используются строго необходимые cookie и/или localStorage (идентификатор корзины, состав, количество). Без них повторный визит не восстановит выбранные рулоны и кашпо.",
          "Данные корзины не используются для рекламного профилирования третьими лицами; при оформлении заказа сведения передаются менеджеру в рамках Политики конфиденциальности.",
        ],
        uz: [
          "Sessiyalar orasida savatcha pozitsiyalarini saqlash uchun majburiy cookie va/yoki localStorage (savatcha identifikatori, tarkib, miqdor) ishlatiladi. Ularsiz qayta tashrifda tanlangan rulonlar va kashpolar tiklanmaydi.",
          "Savatcha ma'lumotlari uchinchi tomonlar reklama profili uchun ishlatilmaydi; buyurtma berishda ma'lumotlar Maxfiylik siyosati doirasida menejerga uzatiladi.",
        ],
        en: [
          "Strictly necessary cookies and/or localStorage keep cart items between sessions (cart id, lines, quantities). Without them a return visit will not restore selected rolls and planters.",
          "Cart data is not used for third-party ad profiling; when you place an order, details are passed to our team under the Privacy Policy.",
        ],
      },
    },
    {
      id: "locale",
      title: {
        ru: "4. Язык и локаль",
        uz: "4. Til va lokal",
        en: "4. Language and locale",
      },
      paragraphs: {
        ru: [
          "Выбранный язык (ru / uz / en) сохраняется в cookie или localStorage, чтобы не спрашивать предпочтение на каждой странице. Это необходимая cookie для корректной работы маршрутов /ru, /uz, /en.",
          "Смена языка в переключателе сайта обновляет сохранённое значение.",
        ],
        uz: [
          "Tanlangan til (ru / uz / en) har sahifada so'ramaslik uchun cookie yoki localStorage-da saqlanadi. Bu /ru, /uz, /en marshrutlari uchun zarur cookie hisoblanadi.",
          "Saytdagi til almashtirgich yangilangan qiymatni yozadi.",
        ],
        en: [
          "Your chosen language (ru / uz / en) is stored in a cookie or localStorage so we do not ask on every page. This is a necessary cookie for /ru, /uz, /en routes.",
          "Changing language in the site switcher updates the stored value.",
        ],
      },
    },
    {
      id: "analytics",
      title: {
        ru: "5. Аналитика",
        uz: "5. Analitika",
        en: "5. Analytics",
      },
      paragraphs: {
        ru: [
          "При согласии в btt_consent могут устанавливаться cookie аналитических сервисов (например, для подсчёта посещений страниц каталога, воронки корзины и улучшения UX). Список конкретных поставщиков указывается в баннере или обновлениях к этой Политике.",
          "Без согласия аналитические скрипты не загружаются или работают в обезличенном режиме без идентификаторов, если это технически реализовано.",
        ],
        uz: [
          "btt_consent roziligi bilan analitika xizmatlari cookie-lari o'rnatilishi mumkin (masalan, katalog sahifalari tashrifi, savatcha voronkasi va UX yaxshilash). Aniq provayderlar ro'yxati bannerda yoki ushbu Siyosat yangilanishlarida ko'rsatiladi.",
          "Rozilik bo'lmasa, analitika skriptlari yuklanmaydi yoki identifikatorsiz anonim rejimda ishlaydi (texnik jihatdan amalga oshirilgan bo'lsa).",
        ],
        en: [
          "With consent in btt_consent, analytics service cookies may be set (e.g. to measure catalog page views, cart funnel, and improve UX). Specific providers are listed in the banner or updates to this Policy.",
          "Without consent, analytics scripts are not loaded or run in a de-identified mode without persistent IDs where implemented.",
        ],
      },
    },
    {
      id: "third-party",
      title: {
        ru: "6. Сторонние сервисы",
        uz: "6. Uchinchi tomon xizmatlari",
        en: "6. Third-party services",
      },
      paragraphs: {
        ru: [
          "Встроенные виджеты (например, карта, Telegram, платёжные iframe) могут устанавливать собственные cookie по политикам соответствующих операторов. Мы рекомендуем ознакомиться с их документами при переходе по внешним ссылкам.",
        ],
        uz: [
          "O'rnatilgan vidjetlar (masalan, xarita, Telegram, to'lov iframe) tegishli operatorlar siyosatiga ko'ra o'z cookie-larini qo'yishi mumkin. Tashqi havolalar bo'yicha ularning hujjatlari bilan tanishishni tavsiya qilamiz.",
        ],
        en: [
          "Embedded widgets (e.g. maps, Telegram, payment iframes) may set their own cookies under those operators’ policies. Review their documents when you follow external links.",
        ],
      },
    },
    {
      id: "manage",
      title: {
        ru: "7. Управление cookie",
        uz: "7. Cookie-larni boshqarish",
        en: "7. Managing cookies",
      },
      paragraphs: {
        ru: [
          "Вы можете удалить или заблокировать cookie в настройках браузера (Chrome, Safari, Firefox, Edge и др.). Блокировка всех cookie отключит корзину и сохранение языка.",
          "Режим «не отслеживать» (DNT) учитывается, если сайт поддерживает соответствующую настройку; приоритет имеет явный выбор в btt_consent.",
        ],
        uz: [
          "Brauzer sozlamalarida cookie-larni o'chirish yoki bloklash mumkin (Chrome, Safari, Firefox, Edge va boshqalar). Barcha cookie-larni bloklash savatcha va til saqlashni o'chiradi.",
          "«Kuzatmasin» (DNT) rejimi sayt qo'llab-quvvatlasa hisobga olinadi; ustuvor — btt_consent dagi aniq tanlov.",
        ],
        en: [
          "You can delete or block cookies in your browser settings (Chrome, Safari, Firefox, Edge, etc.). Blocking all cookies will disable the cart and saved language.",
          "Do Not Track (DNT) is honored where the site supports it; your explicit btt_consent choice takes precedence.",
        ],
      },
    },
    {
      id: "updates",
      title: {
        ru: "8. Изменения политики",
        uz: "8. Siyosat o'zgarishlari",
        en: "8. Policy changes",
      },
      paragraphs: {
        ru: [
          "Мы обновляем перечень cookie при подключении новых сервисов. Актуальная версия — на bententrade.uz/cookies с датой вступления в силу в шапке документа.",
        ],
        uz: [
          "Yangi xizmatlar ulanganda cookie ro'yxati yangilanadi. Amaldagi versiya — hujjat boshidagi sana bilan bententrade.uz/cookies da.",
        ],
        en: [
          "We update the cookie list when new services are added. The current version is at bententrade.uz/cookies with the effective date at the top.",
        ],
      },
    },
  ],
};
