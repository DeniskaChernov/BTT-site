import type { LegalDoc } from "./types";

export const TERMS_DOC: LegalDoc = {
  slug: "terms",
  effectiveDateIso: "2026-06-03",
  title: {
    ru: "Публичная оферта",
    uz: "Ommaviy oferta",
    en: "Public offer (terms of sale)",
  },
  kicker: {
    ru: "Bententrade · B2B · Ташкент",
    uz: "Bententrade · B2B · Toshkent",
    en: "Bententrade · B2B · Tashkent",
  },
  lead: {
    ru: "Условия оптовой и розничной продажи искусственного ротанга, плетёных кашпо и сопутствующих позиций через сайт bententrade.uz и согласованные каналы связи. Оформляя заказ, вы принимаете настоящую оферту.",
    uz: "Sun'iy rattan, qo'lda to'qilgan kashpo va tegishli mahsulotlarni bententrade.uz sayti va kelishilgan aloqa kanallari orqali ulgurji hamda chakana sotish shartlari. Buyurtma berish ushbu ofertani qabul qilish hisoblanadi.",
    en: "Terms for wholesale and retail sale of artificial rattan, handwoven planters, and related items via bententrade.uz and agreed contact channels. By placing an order you accept this offer.",
  },
  effectiveLabel: {
    ru: "Действует с",
    uz: "Kuchga kirgan sana",
    en: "Effective from",
  },
  contact: {
    ru: "Вопросы по договору и счёту: opt@bententrade.uz, +998 77 104 44 22, Telegram @bententradeuz. Реквизиты — на странице «Реквизиты компании» и по запросу.",
    uz: "Shartnoma va hisob-faktura bo'yicha: opt@bententrade.uz, +998 77 104 44 22, Telegram @bententradeuz. Rekvizitlar — «Kompaniya rekvizitlari» sahifasida va so'rov bo'yicha.",
    en: "Contract and invoice questions: opt@bententrade.uz, +998 77 104 44 22, Telegram @bententradeuz. Legal details — on Company details and on request.",
  },
  legalNotice: {
    ru: "Текст носит информационный характер для B2B-продаж в Республике Узбекистан. Для крупных контрактов и экспорта согласуйте индивидуальные условия. TODO(legal): подставить полное юридическое наименование, ИНН/ПИНФЛ, банковские реквизиты после утверждения юристом.",
    uz: "Matn O'zbekiston Respublikasida B2B savdo uchun axborot xarakteridadir. Yirik shartnomalar va eksport uchun alohida shartlarni kelishing. TODO(legal): to'liq yuridik nom, STIR/PINFL, bank rekvizitlarini huquqshunos tasdiqlagach kiriting.",
    en: "This text is informational for B2B sales in the Republic of Uzbekistan. For large contracts and export, agree separate terms. TODO(legal): insert full legal entity name, tax ID, and bank details after counsel review.",
  },
  tocLabel: {
    ru: "Содержание",
    uz: "Mundarija",
    en: "Contents",
  },
  sections: [
    {
      id: "general",
      title: {
        ru: "1. Общие положения",
        uz: "1. Umumiy qoidalar",
        en: "1. General provisions",
      },
      paragraphs: {
        ru: [
          "Настоящая публичная оферта (далее — «Оферта») определяет порядок заключения и исполнения договора купли-продажи между покупателем и продавцом — Bententrade, производство и оптовая продажа искусственного ротанга в г. Ташкенте, Республика Узбекистан.",
          "Оферта размещена на сайте bententrade.uz и действует для заказов, оформленных через корзину сайта, в Telegram, по e-mail или по телефону после подтверждения менеджером.",
          "Актуальная версия Оферты — на сайте; продолжение использования сервиса после публикации изменений означает согласие с обновлённым текстом, если иное не оговорено в письменном договоре.",
        ],
        uz: [
          "Ushbu ommaviy oferta (keyingi o'rinlarda — «Oferta») xaridor va sotuvchi — Bententrade o'rtasida Toshkent shahri, O'zbekiston Respublikasida sun'iy rattan ishlab chiqarish va ulgurji sotish bo'yicha oldi-sotdi shartnomasini tuzish va bajarish tartibini belgilaydi.",
          "Oferta bententrade.uz saytida joylashtirilgan va sayt savatchasi, Telegram, elektron pochta yoki menejer tasdiqlaganidan keyin telefon orqali rasmiylashtirilgan buyurtmalarga nisbatan qo'llaniladi.",
          "Ofertaning amaldagi versiyasi saytda; o'zgarishlar e'lon qilingandan keyin xizmatdan foydalanishni davom ettirish yozma shartnomada boshqacha kelishilmagan bo'lsa, yangilangan matn bilan rozilik bildiradi.",
        ],
        en: [
          "This public offer (the “Offer”) governs how a sale contract is formed and performed between the buyer and the seller — Bententrade, manufacturing and wholesale of artificial rattan in Tashkent, Republic of Uzbekistan.",
          "The Offer is published on bententrade.uz and applies to orders placed via the site cart, Telegram, email, or phone once confirmed by our team.",
          "The current version of the Offer is on the website; continued use of the service after updates are published constitutes acceptance of the revised text unless a written contract states otherwise.",
        ],
      },
    },
    {
      id: "parties",
      title: {
        ru: "2. Стороны и реквизиты",
        uz: "2. Tomonlar va rekvizitlar",
        en: "2. Parties and legal details",
      },
      paragraphs: {
        ru: [
          "Продавец: Bententrade, адрес производства и отгрузки — Республика Узбекистан, г. Ташкент. TODO(legal): полное наименование юридического лица / ИП, юридический и фактический адрес, ИНН, расчётный счёт.",
          "Покупатель: дееспособное физическое лицо, индивидуальный предприниматель или юридическое лицо, указавшее достоверные контактные и платёжные данные при оформлении заказа.",
          "Для юрлиц и опта от 5 кг и выше выставляется счёт и при необходимости заключается письменный договор; условия счёта не противоречат Оферте, если в договоре прямо не указано иное.",
        ],
        uz: [
          "Sotuvchi: Bententrade, ishlab chiqarish va jo'natish manzili — O'zbekiston Respublikasi, Toshkent shahri. TODO(legal): yuridik shaxs / YTT to'liq nomi, yuridik va haqiqiy manzil, STIR, hisob raqami.",
          "Xaridor: buyurtma berishda ishonchli kontakt va to'lov ma'lumotlarini ko'rsatgan layoqatli jismoniy shaxs, yakka tartibdagi tadbirkor yoki yuridik shaxs.",
          "Yuridik shaxslar va 5 kg dan boshlab ulgurji uchun hisob-faktura chiqariladi va kerak bo'lsa yozma shartnoma tuziladi; hisob shartlari Ofertaga zid emas, agar shartnomada boshqacha ko'rsatilmagan bo'lsa.",
        ],
        en: [
          "Seller: Bententrade, production and dispatch address — Republic of Uzbekistan, Tashkent. TODO(legal): full legal entity / sole proprietor name, registered and operating address, tax ID, bank account.",
          "Buyer: a capable individual, sole proprietor, or legal entity that provided accurate contact and payment details when placing an order.",
          "For businesses and wholesale from 5 kg upward we issue invoices and, where needed, a written contract; invoice terms do not conflict with this Offer unless the contract explicitly states otherwise.",
        ],
      },
    },
    {
      id: "order",
      title: {
        ru: "3. Заказ и подтверждение",
        uz: "3. Buyurtma va tasdiqlash",
        en: "3. Order and confirmation",
      },
      paragraphs: {
        ru: [
          "Заказ считается принятым к исполнению после подтверждения менеджером: наличие, срок производства (для позиций «под заказ»), ориентировочный вес, цветовая партия и способ доставки.",
          "В корзине и карточке товара указаны ориентировочные цены за кг (лестница объёма: от 5 кг, от 10 кг, от 12 кг) или за штуку для кашпо; итоговая сумма фиксируется в счёте или сообщении менеджера.",
          "Индивидуальные заказы (нестандартный цвет, резка, коллективная партия) оформляются по отдельному согласованию; отмена после запуска производства может быть ограничена.",
        ],
        uz: [
          "Buyurtma menejer tasdiqlagandan keyin bajarishga qabul qilingan hisoblanadi: mavjudlik, ishlab chiqarish muddati («buyurtma bo'yicha» pozitsiyalar uchun), taxminiy og'irlik, rang partiyasi va yetkazish usuli.",
          "Savatcha va mahsulot kartochkasida kg uchun taxminiy narxlar (hajm bo'yicha: 5 kg dan, 10 kg dan, 12 kg dan) yoki kashpo uchun dona narxi ko'rsatilgan; yakuniy summa hisob-faktura yoki menejer xabarida belgilanadi.",
          "Individual buyurtmalar (nostandart rang, kesish, kollektiv partiya) alohida kelishuv asosida; ishlab chiqarish boshlangach bekor qilish cheklanishi mumkin.",
        ],
        en: [
          "An order is accepted for fulfillment once confirmed by our team: stock, production lead time (for made-to-order lines), estimated weight, color batch, and delivery method.",
          "The cart and product pages show indicative per-kg prices (volume tiers: from 5 kg, 10 kg, 12 kg) or per-piece prices for planters; the final amount is stated on the invoice or in the manager’s message.",
          "Custom orders (non-standard color, cutting, collective batch) are agreed separately; cancellation after production starts may be limited.",
        ],
      },
    },
    {
      id: "pricing",
      title: {
        ru: "4. Цены и оплата",
        uz: "4. Narxlar va to'lov",
        en: "4. Pricing and payment",
      },
      paragraphs: {
        ru: [
          "Цены на сайте указаны в узбекских сумах (UZS), без НДС, если иное не указано в счёте для юрлица. Продавец вправе корректировать прайс при изменении себестоимости сырья; подтверждённый заказ сохраняет согласованную цену.",
          "Способы оплаты: перевод по реквизитам, оплата через согласованные платёжные сервисы (в т.ч. Telegram), наличный расчёт при самовывозе по договорённости.",
          "Отгрузка производится после поступления предоплаты или полной оплаты, если менеджер не согласовал отсрочку для проверенного B2B-клиента.",
        ],
        uz: [
          "Saytdagi narxlar o'zbek so'mida (UZS), yuridik shaxs hisob-fakturasida boshqacha ko'rsatilmagan bo'lsa QQSsiz. Sotuvchi xom ashyo tannarxi o'zgarganda praysni yangilash huquqiga ega; tasdiqlangan buyurtma kelishilgan narxni saqlaydi.",
          "To'lov usullari: rekvizitlar bo'yicha o'tkazma, kelishilgan to'lov xizmatlari (jumladan Telegram), kelishilgan holda olib ketishda naqd.",
          "Jo'natma oldindan to'lov yoki to'liq to'lov kelgandan keyin amalga oshiriladi, agar menejer tekshirilgan B2B mijoz uchun kechiktirishni kelishmagan bo'lsa.",
        ],
        en: [
          "Site prices are in Uzbek soums (UZS), exclusive of VAT unless the business invoice states otherwise. We may adjust list prices when raw-material costs change; a confirmed order keeps the agreed price.",
          "Payment methods: bank transfer to our details, agreed payment services (including Telegram), and cash on pickup by arrangement.",
          "Shipment occurs after prepayment or full payment unless our team agrees deferred terms for an established B2B customer.",
        ],
      },
    },
    {
      id: "delivery",
      title: {
        ru: "5. Доставка и передача товара",
        uz: "5. Yetkazib berish va topshirish",
        en: "5. Delivery and handover",
      },
      paragraphs: {
        ru: [
          "Доставка по Республике Узбекистан — через курьерские и транспортные службы по согласованию; стоимость и сроки сообщаются при подтверждении заказа. Самовывоз со склада/производства в Ташкенте — по предварительной записи.",
          "Риск случайной гибели или повреждения переходит к покупателю с момента передачи перевозчику или выдачи на складе при самовывозе, если договором не установлено иное.",
          "Покупатель обязан проверить количество рулонов/мест и целостность упаковки при получении; претензии по явным недостачам — в течение 3 рабочих дней с даты получения.",
        ],
        uz: [
          "O'zbekiston Respublikasi bo'ylab yetkazib berish — kelishilgan kuryer va transport xizmatlari orqali; narxi va muddati buyurtma tasdiqlanganda aytiladi. Toshkentdagi ombor/ishlab chiqarishdan olib ketish — oldindan kelishilgan vaqtda.",
          "Tasodifiy yo'qotish yoki shikastlanish xavfi mahsulot tashuvchiga topshirilgan yoki olib ketishda omborda berilgan paytdan boshlab xaridorga o'tadi, agar shartnomada boshqacha belgilanmagan bo'lsa.",
          "Xaridor qabul qilishda rulonlar/joylar soni va qadoq yaxlitligini tekshirishi shart; aniq yetishmovchilik bo'yicha da'volar — olingan kundan boshlab 3 ish kuni ichida.",
        ],
        en: [
          "Delivery within Uzbekistan is arranged via agreed courier and freight services; cost and timing are communicated when the order is confirmed. Pickup at our Tashkent warehouse/production is by appointment.",
          "Risk of accidental loss or damage passes to the buyer when goods are handed to the carrier or released at the warehouse on pickup, unless a contract provides otherwise.",
          "The buyer must check roll/piece count and packaging integrity on receipt; claims for obvious shortages — within 3 business days of receipt.",
        ],
      },
    },
    {
      id: "returns",
      title: {
        ru: "6. Возврат и обмен",
        uz: "6. Qaytarish va almashtirish",
        en: "6. Returns and exchange",
      },
      paragraphs: {
        ru: [
          "Стандартный ротанг в заводской упаковке, не вскрытый и не использованный в плетении, может быть возвращён по согласованию с менеджером в течение 7 календарных дней при сохранении товарного вида и этикетки партии.",
          "Индивидуальные заказы (резка, колер под проект, коллективная партия), а также кашпо ручной работы после отгрузки возврату не подлежат, кроме случаев производственного брака.",
          "Возврат денежных средств — на тот же платёжный канал в срок до 14 рабочих дней после приёмки возвращённого товара на склад.",
        ],
        uz: [
          "Zavod qadoqidagi, ochilmagan va to'qishda ishlatilmagan standart rattan menejer bilan kelishilgan holda 7 kalendar kuni ichida, tovar ko'rinishi va partiya yorlig'i saqlangan bo'lsa qaytarilishi mumkin.",
          "Individual buyurtmalar (kesish, loyiha rangi, kollektiv partiya) hamda jo'natilgandan keyin qo'l mehnati kashpolari ishlab chiqarish nuqsonidan tashqari qaytarilmaydi.",
          "Pul mablag'lari qaytarilishi — qabul qilingan to'lov kanaliga, qaytarilgan mahsulot omborga qabul qilingandan keyin 14 ish kunigacha.",
        ],
        en: [
          "Standard rattan in factory packaging, unopened and not used in weaving, may be returned by agreement with our team within 7 calendar days if resale condition and batch labels are intact.",
          "Custom orders (cut lengths, project color, collective batch) and handwoven planters after dispatch are not returnable except for proven manufacturing defects.",
          "Refunds are made to the original payment channel within up to 14 business days after the returned goods are accepted at the warehouse.",
        ],
      },
    },
    {
      id: "warranty",
      title: {
        ru: "7. Качество и гарантии",
        uz: "7. Sifat va kafolat",
        en: "7. Quality and warranty",
      },
      paragraphs: {
        ru: [
          "Продукция изготавливается с UV-стабилизацией для уличного и интерьерного применения в соответствии с описанием на карточке товара; оттенок допускает минимальное отклонение между партиями — рекомендуем заказывать одну партию на объект.",
          "Гарантия распространяется на скрытые производственные дефекты (расслоение, обрыв сердечника, критические включения) при соблюдении условий хранения и эксплуатации, заявленных в каталоге.",
          "Претензия подаётся с фото/видео, артикулом и датой отгрузки; решение — замена рулона, скидка на следующую партию или возврат по согласованию.",
        ],
        uz: [
          "Mahsulot mahsulot kartochkasidagi tavsifga muvofiq ochiq va ichki foydalanish uchun UV barqarorlashtirish bilan ishlab chiqariladi; rang partiyalar orasida minimal farq qilishi mumkin — obyekt uchun bitta partiyadan buyurtma qilish tavsiya etiladi.",
          "Kafolat yashirin ishlab chiqarish nuqsonlariga (qatlamlanish, yadro uzilishi, jiddiy aralashmalar) katalogda ko'rsatilgan saqlash va foydalanish shartlari bajarilganda taalluqli.",
          "Da'vo foto/video, artikel va jo'natma sanasi bilan yuboriladi; yechim — rulon almashtirish, keyingi partiyaga chegirma yoki kelishilgan holda qaytarish.",
        ],
        en: [
          "Products are manufactured with UV stabilization for outdoor and indoor use as described on the product page; shade may vary slightly between batches — we recommend ordering one batch per project.",
          "Warranty covers hidden manufacturing defects (delamination, core break, critical inclusions) when storage and use follow catalog guidelines.",
          "Claims must include photos/video, SKU, and shipment date; remedy may be roll replacement, credit on the next batch, or refund by agreement.",
        ],
      },
    },
    {
      id: "privacy-ref",
      title: {
        ru: "8. Персональные данные",
        uz: "8. Shaxsiy ma'lumotlar",
        en: "8. Personal data",
      },
      paragraphs: {
        ru: [
          "Обработка контактных и платёжных данных для исполнения заказа описана в Политике конфиденциальности (раздел /privacy). Использование сайта и cookie — в Политике cookies (/cookies).",
          "Покупатель подтверждает достоверность предоставленных данных и согласие на связь по заказу (телефон, e-mail, мессенджеры).",
        ],
        uz: [
          "Buyurtmani bajarish uchun kontakt va to'lov ma'lumotlarini qayta ishlash Maxfiylik siyosatida (/privacy) bayon qilingan. Sayt va cookie foydalanishi — Cookies siyosatida (/cookies).",
          "Xaridor taqdim etilgan ma'lumotlarning to'g'riligini va buyurtma bo'yicha aloqa (telefon, e-mail, messenjerlar) uchun roziligini tasdiqlaydi.",
        ],
        en: [
          "How we process contact and payment data to fulfill orders is described in the Privacy Policy (/privacy). Site and cookie use — in the Cookies Policy (/cookies).",
          "The buyer confirms that provided data is accurate and agrees to be contacted about the order (phone, email, messengers).",
        ],
      },
    },
    {
      id: "disputes",
      title: {
        ru: "9. Споры и применимое право",
        uz: "9. Nizolar va qo'llaniladigan huquq",
        en: "9. Disputes and governing law",
      },
      paragraphs: {
        ru: [
          "Стороны стремятся урегулировать разногласия переговорами; обязательный претензионный порядок — письмо на opt@bententrade.uz с ответом в течение 15 рабочих дней.",
          "При недостижении соглашения спор подлежит рассмотрению в судах Республики Узбекистан по месту нахождения продавца, если императивными нормами не предусмотрено иное.",
          "К отношениям применяется законодательство Республики Узбекистан.",
        ],
        uz: [
          "Tomonlar kelishmovchiliklarni muzokaralar bilan hal qilishga intiladi; majburiy da'vo tartibi — opt@bententrade.uz manziliga xat, 15 ish kuni ichida javob.",
          "Kelishuvga erishilmasa, nizo sotuvchi joylashgan joydagi O'zbekiston Respublikasi sudlarida ko'rib chiqiladi, agar imperativ normlar boshqacha belgilamasa.",
          "Munosabatlarga O'zbekiston Respublikasi qonunchiligi qo'llaniladi.",
        ],
        en: [
          "Parties seek to resolve disputes through negotiation; a mandatory claim process is an email to opt@bententrade.uz with a response within 15 business days.",
          "If no agreement is reached, disputes are submitted to courts of the Republic of Uzbekistan at the seller’s location unless mandatory rules require otherwise.",
          "Relations are governed by the laws of the Republic of Uzbekistan.",
        ],
      },
    },
    {
      id: "changes",
      title: {
        ru: "10. Изменение оферты",
        uz: "10. Ofertaga o'zgartirishlar",
        en: "10. Changes to this offer",
      },
      paragraphs: {
        ru: [
          "Продавец вправе обновлять Оферту; дата вступления в силу указывается в начале документа. Для уже подтверждённых заказов действуют условия на момент подтверждения.",
          "Архивные версии и вопросы по тексту — по запросу на opt@bententrade.uz.",
        ],
        uz: [
          "Sotuvchi Ofertani yangilash huquqiga ega; kuchga kirish sanasi hujjat boshida ko'rsatiladi. Allaqachon tasdiqlangan buyurtmalar uchun tasdiqlash paytidagi shartlar amal qiladi.",
          "Arxiv versiyalar va matn bo'yicha savollar — opt@bententrade.uz ga so'rov bilan.",
        ],
        en: [
          "The seller may update this Offer; the effective date is shown at the top of the document. Confirmed orders remain under the terms in force at confirmation.",
          "Archive versions and questions about the text — on request at opt@bententrade.uz.",
        ],
      },
    },
  ],
};
