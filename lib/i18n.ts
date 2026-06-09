// Lightweight i18n dictionary for the UI chrome.
// Each key maps to per-language strings; missing languages fall back to English.
// Long-form content (calculator rule text, legal pages) intentionally stays in
// English to avoid mistranslating financial/legal terms.

export type Lang = "en" | "es" | "fr" | "de" | "it" | "no" | "ru" | "zh" | "ar";

type Entry = Partial<Record<Lang, string>> & { en: string };

export const MESSAGES: Record<string, Entry> = {
  "nav.calculators": { en: "Calculators", es: "Calculadoras", fr: "Calculatrices", de: "Rechner", it: "Calcolatrici", no: "Kalkulatorer", ru: "Калькуляторы", zh: "计算器", ar: "الحاسبات" },
  "nav.benefits": { en: "Benefits", es: "Beneficios", fr: "Aides", de: "Leistungen", it: "Sussidi", no: "Ytelser", ru: "Пособия", zh: "福利", ar: "الإعانات" },
  "nav.propertyTax": { en: "Property Tax", es: "Impuesto predial", fr: "Taxe foncière", de: "Grundsteuer", it: "Imposta immobiliare", no: "Eiendomsskatt", ru: "Налог на имущество", zh: "房产税", ar: "ضريبة العقار" },
  "nav.taxCredits": { en: "Tax Credits", es: "Créditos fiscales", fr: "Crédits d'impôt", de: "Steuergutschriften", it: "Crediti d'imposta", no: "Skattefradrag", ru: "Налоговые льготы", zh: "税收抵免", ar: "الإعفاءات الضريبية" },
  "nav.about": { en: "About", es: "Acerca de", fr: "À propos", de: "Über uns", it: "Chi siamo", no: "Om oss", ru: "О нас", zh: "关于", ar: "حول" },
  "nav.blog": { en: "Blog", es: "Blog", fr: "Blog", de: "Blog", it: "Blog", no: "Blogg", ru: "Блог", zh: "博客", ar: "المدونة" },

  "common.search": { en: "Search", es: "Buscar", fr: "Rechercher", de: "Suchen", it: "Cerca", no: "Søk", ru: "Поиск", zh: "搜索", ar: "بحث" },
  "common.allRegions": { en: "All Countries", es: "Todos los países", fr: "Tous les pays", de: "Alle Länder", it: "Tutti i paesi", no: "Alle land", ru: "Все страны", zh: "所有国家", ar: "كل البلدان" },

  "hero.badge": { en: "Updated for the 2025 Tax Year", es: "Actualizado para el año fiscal 2025", fr: "Mis à jour pour l'année fiscale 2025", de: "Aktualisiert für das Steuerjahr 2025", it: "Aggiornato per l'anno fiscale 2025", no: "Oppdatert for skatteåret 2025", ru: "Обновлено для 2025 налогового года", zh: "已更新至2025纳税年度", ar: "محدّث للسنة الضريبية 2025" },
  "hero.titleA": { en: "Find benefits, exemptions, and tax savings you", es: "Descubre beneficios, exenciones y ahorros fiscales a los que", fr: "Trouvez les aides, exonérations et économies d'impôt auxquelles vous", de: "Finden Sie Leistungen, Befreiungen und Steuerersparnisse, die Ihnen", it: "Scopri sussidi, esenzioni e risparmi fiscali a cui", no: "Finn ytelser, fritak og skattebesparelser du", ru: "Узнайте о пособиях, льготах и налоговой экономии, на которые вы", zh: "发现你可能有资格获得的福利、减免和税收优惠", ar: "اكتشف الإعانات والإعفاءات والوفورات الضريبية التي" },
  "hero.titleHighlight": { en: "may qualify for", es: "puedes tener derecho", fr: "pourriez avoir droit", de: "zustehen könnten", it: "potresti avere diritto", no: "kan ha rett til", ru: "можете претендовать", zh: "", ar: "قد تكون مؤهلاً لها" },
  "hero.subtitle": { en: "Free calculators and guided eligibility checks for individuals and families. Get clear, unbiased answers to complex financial questions.", es: "Calculadoras gratuitas y comprobaciones de elegibilidad guiadas para personas y familias. Obtén respuestas claras e imparciales a preguntas financieras complejas.", fr: "Calculatrices gratuites et vérifications d'éligibilité guidées pour les particuliers et les familles. Obtenez des réponses claires et impartiales à des questions financières complexes.", de: "Kostenlose Rechner und geführte Anspruchsprüfungen für Einzelpersonen und Familien. Erhalten Sie klare, neutrale Antworten auf komplexe Finanzfragen.", it: "Calcolatrici gratuite e verifiche guidate dell'idoneità per individui e famiglie. Ottieni risposte chiare e imparziali a domande finanziarie complesse.", no: "Gratis kalkulatorer og veiledede kvalifiseringssjekker for enkeltpersoner og familier. Få klare, objektive svar på kompliserte økonomiske spørsmål.", ru: "Бесплатные калькуляторы и пошаговая проверка права для частных лиц и семей. Получите ясные и объективные ответы на сложные финансовые вопросы.", zh: "为个人和家庭提供免费计算器和引导式资格检查。对复杂的财务问题获得清晰、客观的答案。", ar: "حاسبات مجانية وفحوصات أهلية موجَّهة للأفراد والعائلات. احصل على إجابات واضحة ومحايدة للأسئلة المالية المعقّدة." },
  "hero.searchPlaceholder": { en: "Search benefits, tax credits, exemptions...", es: "Buscar beneficios, créditos fiscales, exenciones...", fr: "Rechercher aides, crédits d'impôt, exonérations...", de: "Leistungen, Steuergutschriften, Befreiungen suchen...", it: "Cerca sussidi, crediti d'imposta, esenzioni...", no: "Søk ytelser, skattefradrag, fritak...", ru: "Поиск пособий, льгот, освобождений...", zh: "搜索福利、税收抵免、减免……", ar: "ابحث عن الإعانات والإعفاءات الضريبية..." },
  "hero.startCheck": { en: "Start Free Check", es: "Comenzar verificación gratis", fr: "Commencer la vérification", de: "Kostenlos prüfen", it: "Verifica gratuita", no: "Start gratis sjekk", ru: "Начать проверку", zh: "免费开始检查", ar: "ابدأ الفحص المجاني" },
  "hero.browse": { en: "Browse Calculators", es: "Ver calculadoras", fr: "Parcourir les calculatrices", de: "Rechner durchsuchen", it: "Sfoglia le calcolatrici", no: "Bla i kalkulatorer", ru: "Все калькуляторы", zh: "浏览计算器", ar: "تصفّح الحاسبات" },

  "home.chooseRegion": { en: "Choose Your Region", es: "Elige tu región", fr: "Choisissez votre région", de: "Region wählen", it: "Scegli la tua regione", no: "Velg din region", ru: "Выберите регион", zh: "选择您的地区", ar: "اختر منطقتك" },
  "home.viewAll": { en: "View all", es: "Ver todo", fr: "Voir tout", de: "Alle anzeigen", it: "Vedi tutto", no: "Se alle", ru: "Показать все", zh: "查看全部", ar: "عرض الكل" },
  "home.browseCategories": { en: "Browse Categories", es: "Explorar categorías", fr: "Parcourir les catégories", de: "Kategorien durchsuchen", it: "Sfoglia le categorie", no: "Bla i kategorier", ru: "Категории", zh: "浏览分类", ar: "تصفّح الفئات" },
  "home.howItWorks": { en: "How it Works", es: "Cómo funciona", fr: "Comment ça marche", de: "So funktioniert's", it: "Come funziona", no: "Slik fungerer det", ru: "Как это работает", zh: "工作原理", ar: "كيف يعمل" },
  "home.howWeCalculate": { en: "How we calculate", es: "Cómo calculamos", fr: "Comment nous calculons", de: "Wie wir rechnen", it: "Come calcoliamo", no: "Slik regner vi", ru: "Как мы считаем", zh: "我们如何计算", ar: "كيف نحسب" },
  "home.faq": { en: "Frequently asked questions", es: "Preguntas frecuentes", fr: "Questions fréquentes", de: "Häufige Fragen", it: "Domande frequenti", no: "Vanlige spørsmål", ru: "Частые вопросы", zh: "常见问题", ar: "الأسئلة الشائعة" },

  "dir.heading": { en: "Free Calculators and Eligibility Checkers", es: "Calculadoras y verificadores de elegibilidad gratuitos", fr: "Calculatrices et vérificateurs d'éligibilité gratuits", de: "Kostenlose Rechner und Anspruchsprüfer", it: "Calcolatrici e verificatori di idoneità gratuiti", no: "Gratis kalkulatorer og kvalifiseringssjekkere", ru: "Бесплатные калькуляторы и проверка права", zh: "免费计算器和资格检查工具", ar: "حاسبات ومدققات أهلية مجانية" },
  "dir.tools": { en: "Tools Available", es: "herramientas disponibles", fr: "outils disponibles", de: "Tools verfügbar", it: "strumenti disponibili", no: "verktøy tilgjengelig", ru: "инструментов доступно", zh: "个可用工具", ar: "أداة متاحة" },
  "dir.filters": { en: "Filters", es: "Filtros", fr: "Filtres", de: "Filter", it: "Filtri", no: "Filtre", ru: "Фильтры", zh: "筛选", ar: "عوامل التصفية" },
  "dir.reset": { en: "Reset All", es: "Restablecer", fr: "Réinitialiser", de: "Zurücksetzen", it: "Reimposta", no: "Nullstill", ru: "Сбросить", zh: "重置", ar: "إعادة ضبط" },
  "dir.country": { en: "Country / Region", es: "País / Región", fr: "Pays / Région", de: "Land / Region", it: "Paese / Regione", no: "Land / Region", ru: "Страна / Регион", zh: "国家/地区", ar: "البلد / المنطقة" },
  "dir.category": { en: "Category", es: "Categoría", fr: "Catégorie", de: "Kategorie", it: "Categoria", no: "Kategori", ru: "Категория", zh: "分类", ar: "الفئة" },
  "dir.taxYear": { en: "Tax Year", es: "Año fiscal", fr: "Année fiscale", de: "Steuerjahr", it: "Anno fiscale", no: "Skatteår", ru: "Налоговый год", zh: "纳税年度", ar: "السنة الضريبية" },
  "dir.searchPh": { en: "Search by tool name or keyword...", es: "Buscar por nombre o palabra clave...", fr: "Rechercher par nom ou mot-clé...", de: "Nach Name oder Stichwort suchen...", it: "Cerca per nome o parola chiave...", no: "Søk etter navn eller nøkkelord...", ru: "Поиск по названию или ключевому слову...", zh: "按名称或关键词搜索……", ar: "ابحث بالاسم أو الكلمة المفتاحية..." },
  "dir.showingFor": { en: "Showing tools for", es: "Mostrando herramientas para", fr: "Outils pour", de: "Tools für", it: "Strumenti per", no: "Viser verktøy for", ru: "Показаны инструменты для", zh: "正在显示以下地区的工具：", ar: "عرض أدوات" },
  "dir.showAll": { en: "Show all regions", es: "Mostrar todas las regiones", fr: "Afficher toutes les régions", de: "Alle Regionen anzeigen", it: "Mostra tutte le regioni", no: "Vis alle regioner", ru: "Показать все регионы", zh: "显示所有地区", ar: "عرض كل المناطق" },
  "dir.none": { en: "No calculators found", es: "No se encontraron calculadoras", fr: "Aucune calculatrice trouvée", de: "Keine Rechner gefunden", it: "Nessuna calcolatrice trovata", no: "Ingen kalkulatorer funnet", ru: "Калькуляторы не найдены", zh: "未找到计算器", ar: "لم يتم العثور على حاسبات" },

  "consent.text": { en: "We use cookies for essential features, analytics, and advertising (Google AdSense).", es: "Usamos cookies para funciones esenciales, analítica y publicidad (Google AdSense).", fr: "Nous utilisons des cookies pour les fonctions essentielles, l'analyse et la publicité (Google AdSense).", de: "Wir verwenden Cookies für wesentliche Funktionen, Analyse und Werbung (Google AdSense).", it: "Usiamo i cookie per funzioni essenziali, analisi e pubblicità (Google AdSense).", no: "Vi bruker informasjonskapsler til nødvendige funksjoner, analyse og annonsering (Google AdSense).", ru: "Мы используем файлы cookie для основных функций, аналитики и рекламы (Google AdSense).", zh: "我们使用 Cookie 用于基本功能、分析和广告（Google AdSense）。", ar: "نستخدم ملفات تعريف الارتباط للوظائف الأساسية والتحليلات والإعلانات (Google AdSense)." },
  "consent.accept": { en: "Accept all", es: "Aceptar todo", fr: "Tout accepter", de: "Alle akzeptieren", it: "Accetta tutto", no: "Godta alle", ru: "Принять все", zh: "全部接受", ar: "قبول الكل" },
  "consent.reject": { en: "Reject non-essential", es: "Rechazar no esenciales", fr: "Refuser non essentiels", de: "Nicht notwendige ablehnen", it: "Rifiuta non essenziali", no: "Avvis ikke-nødvendige", ru: "Отклонить необязательные", zh: "拒绝非必要", ar: "رفض غير الضرورية" },

  "banner.proceed": { en: "Proceed to", es: "Ir a", fr: "Accéder à", de: "Weiter zu", it: "Vai a", no: "Gå til", ru: "Перейти к", zh: "前往", ar: "انتقل إلى" },
  "banner.detected": { en: "We detected you're in", es: "Detectamos que estás en", fr: "Nous avons détecté que vous êtes en", de: "Wir haben erkannt, dass Sie in", it: "Abbiamo rilevato che ti trovi in", no: "Vi oppdaget at du er i", ru: "Мы определили, что вы находитесь в", zh: "我们检测到您位于", ar: "اكتشفنا أنك في" },
  "banner.calculators": { en: "calculators", es: "calculadoras de", fr: "calculatrices", de: "Rechnern", it: "calcolatrici", no: "kalkulatorer", ru: "калькуляторам", zh: "计算器", ar: "حاسبات" },

  "footer.resources": { en: "Resources", es: "Recursos", fr: "Ressources", de: "Ressourcen", it: "Risorse", no: "Ressurser", ru: "Ресурсы", zh: "资源", ar: "موارد" },
  "footer.legal": { en: "Legal", es: "Legal", fr: "Mentions légales", de: "Rechtliches", it: "Note legali", no: "Juridisk", ru: "Правовая информация", zh: "法律", ar: "قانوني" },
  "footer.company": { en: "Company", es: "Empresa", fr: "Entreprise", de: "Unternehmen", it: "Azienda", no: "Selskap", ru: "Компания", zh: "公司", ar: "الشركة" },
  "footer.stayUpdated": { en: "Stay updated", es: "Mantente al día", fr: "Restez informé", de: "Bleiben Sie informiert", it: "Resta aggiornato", no: "Hold deg oppdatert", ru: "Будьте в курсе", zh: "保持更新", ar: "ابقَ على اطلاع" },
};

export function translate(key: string, lang: Lang): string {
  const entry = MESSAGES[key];
  if (!entry) return key;
  return entry[lang] ?? entry.en;
}
