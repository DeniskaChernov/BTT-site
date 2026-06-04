import type { LegalDoc } from "./types";

export const PRIVACY_DOC: LegalDoc = {
  slug: "privacy",
  effectiveDateIso: "2026-06-03",
  title: {
    ru: "Политика конфиденциальности",
    uz: "Maxfiylik siyosati",
    en: "Privacy Policy",
  },
  kicker: {
    ru: "Bententrade · обработка данных",
    uz: "Bententrade · ma'lumotlarni qayta ishlash",
    en: "Bententrade · data processing",
  },
  lead: {
    ru: "Как Bententrade (Ташкент, Узбекистан) собирает и использует персональные данные при работе сайта bententrade.uz, оформлении заказов B2B/B2C и поддержке клиентов.",
    uz: "Bententrade (Toshkent, O'zbekiston) bententrade.uz saytida, B2B/B2C buyurtmalarda va mijozlarni qo'llab-quvvatlashda shaxsiy ma'lumotlarni qanday to'plashi va ishlatishi.",
    en: "How Bententrade (Tashkent, Uzbekistan) collects and uses personal data when you use bententrade.uz, place B2B/B2C orders, and contact our team.",
  },
  effectiveLabel: {
    ru: "Действует с",
    uz: "Kuchga kirgan sana",
    en: "Effective from",
  },
  contact: {
    ru: "Запросы по данным: opt@bententrade.uz. Ответ в разумный срок, обычно до 15 рабочих дней.",
    uz: "Ma'lumotlar bo'yicha so'rovlar: opt@bententrade.uz. Javob odatda 15 ish kunigacha.",
    en: "Data requests: opt@bententrade.uz. We respond within a reasonable time, typically within 15 business days.",
  },
  legalNotice: {
    ru: "Политика дополняет Публичную оферту и не заменяет консультацию юриста для трансграничных схем. TODO(legal): указать оператора персональных данных (наименование, адрес, ответственное лицо) после регистрации обработки.",
    uz: "Siyosat Ommaviy ofertani to'ldiradi va transchegaraviy sxemalar uchun huquqshunos maslahatini almashtirmaydi. TODO(legal): ma'lumotlar operatori (nom, manzil, mas'ul shaxs) ro'yxatdan o'tgach ko'rsatiladi.",
    en: "This policy supplements the Public Offer and does not replace legal advice for cross-border setups. TODO(legal): name the personal-data operator (entity, address, DPO) after registration.",
  },
  tocLabel: {
    ru: "Содержание",
    uz: "Mundarija",
    en: "Contents",
  },
  sections: [
    {
      id: "scope",
      title: {
        ru: "1. Область действия",
        uz: "1. Qo'llanish doirasi",
        en: "1. Scope",
      },
      paragraphs: {
        ru: [
          "Политика описывает обработку данных посетителей и клиентов Bententrade — производителя и оптового продавца искусственного ротанга и плетёных кашпо в Ташкенте.",
          "Распространяется на данные, переданные через формы сайта, корзину, checkout, e-mail, телефон, Telegram и при визите на производство/склад по записи.",
        ],
        uz: [
          "Siyosat Toshkentda sun'iy rattan va qo'l bilan to'qilgan kashpo ishlab chiqaruvchi va ulgurji sotuvchi Bententrade tashrif buyuruvchilari va mijozlarining ma'lumotlarini qayta ishlashni tavsiflaydi.",
          "Sayt shakllari, savatcha, checkout, elektron pochta, telefon, Telegram va kelishilgan vaqtda ishlab chiqarish/omborga tashrif orqali uzatilgan ma'lumotlarga tatbiq etiladi.",
        ],
        en: [
          "This policy describes how we process data of visitors and customers of Bententrade — manufacturer and wholesaler of artificial rattan and handwoven planters in Tashkent.",
          "It applies to data submitted via site forms, cart, checkout, email, phone, Telegram, and when you visit production/warehouse by appointment.",
        ],
      },
    },
    {
      id: "controller",
      title: {
        ru: "2. Оператор данных",
        uz: "2. Ma'lumotlar operatori",
        en: "2. Data controller",
      },
      paragraphs: {
        ru: [
          "Оператор: Bententrade, Республика Узбекистан, г. Ташкент. TODO(legal): полное юридическое наименование, ИНН, почтовый адрес для корреспонденции.",
          "Контакт по вопросам конфиденциальности: opt@bententrade.uz, +998 77 104 44 22.",
        ],
        uz: [
          "Operator: Bententrade, O'zbekiston Respublikasi, Toshkent shahri. TODO(legal): to'liq yuridik nom, STIR, yozishmalar uchun pochta manzili.",
          "Maxfiylik bo'yicha aloqa: opt@bententrade.uz, +998 77 104 44 22.",
        ],
        en: [
          "Controller: Bententrade, Republic of Uzbekistan, Tashkent. TODO(legal): full legal name, tax ID, correspondence address.",
          "Privacy contact: opt@bententrade.uz, +998 77 104 44 22.",
        ],
      },
    },
    {
      id: "categories",
      title: {
        ru: "3. Какие данные мы обрабатываем",
        uz: "3. Qanday ma'lumotlar qayta ishlanadi",
        en: "3. Data we process",
      },
      paragraphs: {
        ru: [
          "Мы можем обрабатывать следующие категории данных в объёме, необходимом для заявленных целей:",
        ],
        uz: [
          "Belgilangan maqsadlar uchun zarur hajmda quyidagi toifalardagi ma'lumotlar qayta ishlanishi mumkin:",
        ],
        en: [
          "We may process the following categories as needed for the purposes below:",
        ],
      },
      bullets: {
        ru: [
          "Идентификация и контакты: имя, телефон, e-mail, название компании, ИНН/реквизиты (для B2B).",
          "Данные заказа: состав корзины, адрес доставки, комментарии, история обращений.",
          "Платёжные сведения: реквизиты для счёта; данные банковских карт обрабатываются платёжными провайдерами, а не хранятся на нашем сервере, если вы не передаёте их иным способом.",
          "Технические данные: IP, тип браузера, язык интерфейса, cookie (см. Политику cookies).",
          "Переписка в мессенджерах и почте — по вашей инициативе.",
        ],
        uz: [
          "Identifikatsiya va kontaktlar: ism, telefon, e-mail, kompaniya nomi, STIR/rekvizitlar (B2B uchun).",
          "Buyurtma ma'lumotlari: savatcha tarkibi, yetkazish manzili, izohlar, murojaatlar tarixi.",
          "To'lov ma'lumotlari: hisob-faktura rekvizitlari; bank kartalari ma'lumotlari to'lov provayderlari tomonidan qayta ishlanadi va serverimizda saqlanmaydi (boshqa usul bilan yubormagan bo'lsangiz).",
          "Texnik ma'lumotlar: IP, brauzer turi, interfeys tili, cookie (Cookies siyosatiga qarang).",
          "Messenjer va pochta yozishmalari — sizning tashabbusingiz bilan.",
        ],
        en: [
          "Identity and contact: name, phone, email, company name, tax ID/details (for B2B).",
          "Order data: cart contents, delivery address, comments, inquiry history.",
          "Payment info: invoice details; card data is processed by payment providers, not stored on our server unless you send it another way.",
          "Technical data: IP, browser type, UI language, cookies (see Cookies Policy).",
          "Messenger and email correspondence — when you contact us.",
        ],
      },
    },
    {
      id: "purposes",
      title: {
        ru: "4. Цели обработки",
        uz: "4. Qayta ishlash maqsadlari",
        en: "4. Purposes",
      },
      paragraphs: {
        ru: [
          "Персональные данные используются для:",
        ],
        uz: [
          "Shaxsiy ma'lumotlar quyidagilar uchun ishlatiladi:",
        ],
        en: [
          "We use personal data to:",
        ],
      },
      bullets: {
        ru: [
          "приёма и исполнения заказов, выставления счетов и отгрузки;",
          "консультаций по подбору ротанга, кашпо и оптовых партий;",
          "уведомлений о статусе заказа и логистике;",
          "улучшения сайта и безопасности (аналитика с вашего согласия — см. cookie);",
          "соблюдения требований законодательства и защиты законных интересов при спорах.",
        ],
        uz: [
          "buyurtmalarni qabul qilish va bajarish, hisob-faktura va jo'natma;",
          "rattan, kashpo va ulgurji partiyalarni tanlash bo'yicha maslahat;",
          "buyurtma holati va logistika haqida xabarnomalar;",
          "saytni yaxshilash va xavfsizlik (roziligingiz bilan analitika — cookie qarang);",
          "qonunchilik talablariga rioya va nizolarda qonuniy manfaatlarni himoya qilish.",
        ],
        en: [
          "accept and fulfill orders, invoicing, and shipping;",
          "advise on rattan, planters, and wholesale batches;",
          "notify you about order status and logistics;",
          "improve the site and security (analytics with your consent — see cookies);",
          "comply with law and protect legitimate interests in disputes.",
        ],
      },
    },
    {
      id: "legal-basis",
      title: {
        ru: "5. Основания обработки",
        uz: "5. Qayta ishlash asoslari",
        en: "5. Legal bases",
      },
      paragraphs: {
        ru: [
          "Обработка осуществляется на основании исполнения договора (оферта/счёт), вашего согласия (маркетинговые рассылки — только при отдельной подписке), законного интереса (безопасность сайта, учёт претензий) и обязанностей, предусмотренных законом Республики Узбекистан.",
          "Вы вправе отозвать согласие, если обработка на нём основана; отзыв не отменяет законность обработки до отзыва.",
        ],
        uz: [
          "Qayta ishlash shartnomani bajarish (oferta/hisob), roziligingiz (marketing — faqat alohida obuna bilan), qonuniy manfaat (sayt xavfsizligi, da'volarni hisobga olish) va O'zbekiston Respublikasi qonunida nazarda tutilgan majburiyatlar asosida amalga oshiriladi.",
          "Agar qayta ishlash rozilikka asoslangan bo'lsa, rozilikni qaytarib olish huquqiga egasiz; qaytarish qaytarishgacha qayta ishlashning qonuniyligini bekor qilmaydi.",
        ],
        en: [
          "Processing is based on contract performance (offer/invoice), your consent (marketing only with separate opt-in), legitimate interest (site security, claims handling), and duties under the laws of Uzbekistan.",
          "You may withdraw consent where processing relies on it; withdrawal does not affect lawfulness before withdrawal.",
        ],
      },
    },
    {
      id: "sharing",
      title: {
        ru: "6. Передача третьим лицам",
        uz: "6. Uchinchi shaxslarga uzatish",
        en: "6. Sharing with third parties",
      },
      paragraphs: {
        ru: [
          "Мы не продаём персональные данные. Передача возможна ограниченному кругу получателей:",
        ],
        uz: [
          "Shaxsiy ma'lumotlar sotilmaydi. Cheklangan qabul qiluvchilarga uzatish mumkin:",
        ],
        en: [
          "We do not sell personal data. Disclosure may occur to a limited set of recipients:",
        ],
      },
      bullets: {
        ru: [
          "курьерские и транспортные компании — адрес и контакт для доставки;",
          "платёжные и банковские сервисы — для приёма оплаты;",
          "хостинг, почта, CRM/аналитика — по договору обработки и только в объёме задачи;",
          "государственные органы — по законному запросу.",
        ],
        uz: [
          "kuryer va transport kompaniyalari — yetkazish uchun manzil va kontakt;",
          "to'lov va bank xizmatlari — to'lovni qabul qilish uchun;",
          "hosting, pochta, CRM/analitika — qayta ishlash shartnomasi bo'yicha va faqat vazifa hajmida;",
          "davlat organlari — qonuniy so'rov bo'yicha.",
        ],
        en: [
          "couriers and carriers — address and contact for delivery;",
          "payment and banking services — to receive payment;",
          "hosting, email, CRM/analytics — under processing agreements and only as needed;",
          "public authorities — on lawful request.",
        ],
      },
    },
    {
      id: "retention",
      title: {
        ru: "7. Срок хранения",
        uz: "7. Saqlash muddati",
        en: "7. Retention",
      },
      paragraphs: {
        ru: [
          "Данные заказов и первичные документы хранятся в сроки, необходимые для бухгалтерского и налогового учёта, и для разрешения претензий (как правило, не менее 3 лет с даты отгрузки, если закон не требует дольше).",
          "Данные обращений в поддержку — до 24 месяцев с последнего контакта, если вы не просите удалить раньше и нет законного основания хранить дольше.",
          "Технические логи и cookie — согласно Политике cookies и настройкам сервисов.",
        ],
        uz: [
          "Buyurtma ma'lumotlari va dastlabki hujjatlar buxgalteriya va soliq hisobi hamda da'volarni hal qilish uchun zarur muddatda saqlanadi (odatda jo'natmadan kamida 3 yil, agar qonun uzoqroq talab qilmasa).",
          "Qo'llab-quvvatlash murojaatlari — oxirgi aloqadan 24 oygacha, agar erta o'chirishni so'ramasangiz va qonuniy asos bo'lmasa.",
          "Texnik loglar va cookie — Cookies siyosati va xizmat sozlamalariga muvofiq.",
        ],
        en: [
          "Order and primary records are kept as required for accounting, tax, and claims (typically at least 3 years from shipment unless law requires longer).",
          "Support inquiries — up to 24 months from last contact unless you request earlier deletion and we have no lawful reason to keep them.",
          "Technical logs and cookies — per the Cookies Policy and service settings.",
        ],
      },
    },
    {
      id: "rights",
      title: {
        ru: "8. Ваши права",
        uz: "8. Sizning huquqlaringiz",
        en: "8. Your rights",
      },
      paragraphs: {
        ru: [
          "В пределах применимого законодательства вы можете:",
        ],
        uz: [
          "Qo'llanadigan qonunchilik doirasida siz quyidagilarga haqsiz:",
        ],
        en: [
          "Where applicable law allows, you may:",
        ],
      },
      bullets: {
        ru: [
          "запросить доступ, исправление или удаление данных;",
          "ограничить обработку или возразить против обработки на основании законного интереса;",
          "отозвать согласие на маркетинг;",
          "подать жалобу в уполномоченный орган — при наличии такого органа в вашей юрисдикции.",
        ],
        uz: [
          "ma'lumotlarga kirish, tuzatish yoki o'chirishni so'rash;",
          "qayta ishlashni cheklash yoki qonuniy manfaat asosidagi qayta ishlashga e'tiroz bildirish;",
          "marketing roziligini qaytarib olish;",
          "vakolatli organga shikoyat — yurisdiksiyangizda bunday organ bo'lsa.",
        ],
        en: [
          "request access, correction, or deletion;",
          "restrict processing or object to processing based on legitimate interest;",
          "withdraw marketing consent;",
          "lodge a complaint with a supervisory authority where one exists in your jurisdiction.",
        ],
      },
    },
    {
      id: "updates",
      title: {
        ru: "9. Обновления политики",
        uz: "9. Siyosat yangilanishlari",
        en: "9. Policy updates",
      },
      paragraphs: {
        ru: [
          "Мы можем обновлять Политику; актуальная версия публикуется на bententrade.uz/privacy с указанием даты вступления в силу.",
          "Существенные изменения по активным заказам доводим до сведения по e-mail или в личном кабинете/Telegram, если это технически возможно.",
          "Использование cookie регулируется отдельным документом: /cookies.",
        ],
        uz: [
          "Siyosatni yangilashimiz mumkin; amaldagi versiya bententrade.uz/privacy da kuchga kirish sanasi bilan e'lon qilinadi.",
          "Faol buyurtmalar bo'yicha muhim o'zgarishlar e-mail yoki shaxsiy kabinet/Telegram orqali yetkaziladi (texnik jihatdan mumkin bo'lsa).",
          "Cookie foydalanishi alohida hujjat bilan tartibga solinadi: /cookies.",
        ],
        en: [
          "We may update this Policy; the current version is published at bententrade.uz/privacy with the effective date.",
          "Material changes affecting active orders will be communicated by email or account/Telegram where feasible.",
          "Cookie use is covered separately at /cookies.",
        ],
      },
    },
  ],
};
