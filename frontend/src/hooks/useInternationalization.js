import { useState, useEffect, useContext, createContext, useCallback, useMemo } from 'react'

/**
 * Internationalization Context
 */
const I18nContext = createContext({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
  formatNumber: (number) => number,
  formatCurrency: (amount) => amount,
  formatDate: (date) => date,
  formatRelativeTime: (date) => date,
  isRTL: false,
  availableLocales: [],
  isLoading: false
})

/**
 * Default translations
 */
const defaultTranslations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.cart': 'Cart',
    'nav.account': 'Account',
    'nav.search': 'Search',
    'nav.wishlist': 'Wishlist',
    
    // Product
    'product.addToCart': 'Add to Cart',
    'product.buyNow': 'Buy Now',
    'product.outOfStock': 'Out of Stock',
    'product.inStock': 'In Stock',
    'product.price': 'Price',
    'product.originalPrice': 'Original Price',
    'product.discount': 'Discount',
    'product.reviews': 'Reviews',
    'product.rating': 'Rating',
    'product.description': 'Description',
    'product.specifications': 'Specifications',
    'product.relatedProducts': 'Related Products',
    
    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.quantity': 'Quantity',
    'cart.remove': 'Remove',
    'cart.subtotal': 'Subtotal',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.continueShopping': 'Continue Shopping',
    
    // Checkout
    'checkout.title': 'Checkout',
    'checkout.shippingAddress': 'Shipping Address',
    'checkout.billingAddress': 'Billing Address',
    'checkout.paymentMethod': 'Payment Method',
    'checkout.orderSummary': 'Order Summary',
    'checkout.placeOrder': 'Place Order',
    'checkout.processing': 'Processing...',
    
    // Forms
    'form.firstName': 'First Name',
    'form.lastName': 'Last Name',
    'form.email': 'Email',
    'form.password': 'Password',
    'form.confirmPassword': 'Confirm Password',
    'form.phone': 'Phone',
    'form.address': 'Address',
    'form.city': 'City',
    'form.state': 'State',
    'form.zipCode': 'ZIP Code',
    'form.country': 'Country',
    'form.required': 'Required',
    'form.invalid': 'Invalid',
    'form.save': 'Save',
    'form.cancel': 'Cancel',
    'form.submit': 'Submit',
    
    // Messages
    'message.success': 'Success!',
    'message.error': 'Error occurred',
    'message.loading': 'Loading...',
    'message.noResults': 'No results found',
    'message.tryAgain': 'Try again',
    
    // Common
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.more': 'More',
    'common.less': 'Less',
    'common.all': 'All',
    'common.none': 'None',
    'common.select': 'Select',
    'common.clear': 'Clear',
    'common.reset': 'Reset',
    'common.apply': 'Apply',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.search': 'Search',
    'common.new': 'New',
    'common.popular': 'Popular',
    'common.featured': 'Featured',
    'common.sale': 'Sale'
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.products': 'Productos',
    'nav.categories': 'Categorías',
    'nav.cart': 'Carrito',
    'nav.account': 'Cuenta',
    'nav.search': 'Buscar',
    'nav.wishlist': 'Lista de Deseos',
    
    // Product
    'product.addToCart': 'Añadir al Carrito',
    'product.buyNow': 'Comprar Ahora',
    'product.outOfStock': 'Agotado',
    'product.inStock': 'En Stock',
    'product.price': 'Precio',
    'product.originalPrice': 'Precio Original',
    'product.discount': 'Descuento',
    'product.reviews': 'Reseñas',
    'product.rating': 'Calificación',
    'product.description': 'Descripción',
    'product.specifications': 'Especificaciones',
    'product.relatedProducts': 'Productos Relacionados',
    
    // Cart
    'cart.title': 'Carrito de Compras',
    'cart.empty': 'Tu carrito está vacío',
    'cart.quantity': 'Cantidad',
    'cart.remove': 'Eliminar',
    'cart.subtotal': 'Subtotal',
    'cart.total': 'Total',
    'cart.checkout': 'Finalizar Compra',
    'cart.continueShopping': 'Continuar Comprando',
    
    // Checkout
    'checkout.title': 'Finalizar Compra',
    'checkout.shippingAddress': 'Dirección de Envío',
    'checkout.billingAddress': 'Dirección de Facturación',
    'checkout.paymentMethod': 'Método de Pago',
    'checkout.orderSummary': 'Resumen del Pedido',
    'checkout.placeOrder': 'Realizar Pedido',
    'checkout.processing': 'Procesando...',
    
    // Forms
    'form.firstName': 'Nombre',
    'form.lastName': 'Apellido',
    'form.email': 'Correo Electrónico',
    'form.password': 'Contraseña',
    'form.confirmPassword': 'Confirmar Contraseña',
    'form.phone': 'Teléfono',
    'form.address': 'Dirección',
    'form.city': 'Ciudad',
    'form.state': 'Estado',
    'form.zipCode': 'Código Postal',
    'form.country': 'País',
    'form.required': 'Requerido',
    'form.invalid': 'Inválido',
    'form.save': 'Guardar',
    'form.cancel': 'Cancelar',
    'form.submit': 'Enviar',
    
    // Messages
    'message.success': '¡Éxito!',
    'message.error': 'Ocurrió un error',
    'message.loading': 'Cargando...',
    'message.noResults': 'No se encontraron resultados',
    'message.tryAgain': 'Intentar de nuevo',
    
    // Common
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.cancel': 'Cancelar',
    'common.close': 'Cerrar',
    'common.back': 'Atrás',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.more': 'Más',
    'common.less': 'Menos',
    'common.all': 'Todos',
    'common.none': 'Ninguno',
    'common.select': 'Seleccionar',
    'common.clear': 'Limpiar',
    'common.reset': 'Restablecer',
    'common.apply': 'Aplicar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.search': 'Buscar',
    'common.new': 'Nuevo',
    'common.popular': 'Popular',
    'common.featured': 'Destacado',
    'common.sale': 'Oferta'
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.products': 'Produits',
    'nav.categories': 'Catégories',
    'nav.cart': 'Panier',
    'nav.account': 'Compte',
    'nav.search': 'Rechercher',
    'nav.wishlist': 'Liste de Souhaits',
    
    // Product
    'product.addToCart': 'Ajouter au Panier',
    'product.buyNow': 'Acheter Maintenant',
    'product.outOfStock': 'Rupture de Stock',
    'product.inStock': 'En Stock',
    'product.price': 'Prix',
    'product.originalPrice': 'Prix Original',
    'product.discount': 'Remise',
    'product.reviews': 'Avis',
    'product.rating': 'Note',
    'product.description': 'Description',
    'product.specifications': 'Spécifications',
    'product.relatedProducts': 'Produits Connexes',
    
    // Cart
    'cart.title': 'Panier d\'Achat',
    'cart.empty': 'Votre panier est vide',
    'cart.quantity': 'Quantité',
    'cart.remove': 'Supprimer',
    'cart.subtotal': 'Sous-total',
    'cart.total': 'Total',
    'cart.checkout': 'Commander',
    'cart.continueShopping': 'Continuer les Achats',
    
    // Common
    'common.yes': 'Oui',
    'common.no': 'Non',
    'common.ok': 'OK',
    'common.cancel': 'Annuler',
    'common.close': 'Fermer',
    'common.back': 'Retour',
    'common.next': 'Suivant',
    'common.previous': 'Précédent',
    'common.search': 'Rechercher',
    'common.new': 'Nouveau',
    'common.popular': 'Populaire',
    'common.featured': 'En Vedette',
    'common.sale': 'Solde'
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.categories': 'الفئات',
    'nav.cart': 'السلة',
    'nav.account': 'الحساب',
    'nav.search': 'البحث',
    'nav.wishlist': 'قائمة الأمنيات',
    
    // Product
    'product.addToCart': 'أضف إلى السلة',
    'product.buyNow': 'اشتري الآن',
    'product.outOfStock': 'نفد المخزون',
    'product.inStock': 'متوفر',
    'product.price': 'السعر',
    'product.originalPrice': 'السعر الأصلي',
    'product.discount': 'خصم',
    'product.reviews': 'المراجعات',
    'product.rating': 'التقييم',
    'product.description': 'الوصف',
    'product.specifications': 'المواصفات',
    'product.relatedProducts': 'منتجات ذات صلة',
    
    // Cart
    'cart.title': 'سلة التسوق',
    'cart.empty': 'سلتك فارغة',
    'cart.quantity': 'الكمية',
    'cart.remove': 'إزالة',
    'cart.subtotal': 'المجموع الفرعي',
    'cart.total': 'المجموع',
    'cart.checkout': 'الدفع',
    'cart.continueShopping': 'متابعة التسوق',
    
    // Common
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.ok': 'موافق',
    'common.cancel': 'إلغاء',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.search': 'بحث',
    'common.new': 'جديد',
    'common.popular': 'شائع',
    'common.featured': 'مميز',
    'common.sale': 'تخفيض'
  }
}

/**
 * Locale configurations
 */
const localeConfigs = {
  en: {
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: 'h:mm a',
    currency: 'USD',
    currencySymbol: '$',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      precision: 2
    }
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    currency: 'EUR',
    currencySymbol: '€',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      precision: 2
    }
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    currency: 'EUR',
    currencySymbol: '€',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      precision: 2
    }
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: 'HH:mm',
    currency: 'USD',
    currencySymbol: '$',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      precision: 2
    }
  }
}

/**
 * I18n Provider
 */
export const I18nProvider = ({ 
  children, 
  defaultLocale = 'en',
  translations = {},
  loadTranslations = null,
  persistLocale = true
}) => {
  const [locale, setLocaleState] = useState(() => {
    if (persistLocale && typeof window !== 'undefined') {
      return localStorage.getItem('locale') || defaultLocale
    }
    return defaultLocale
  })
  
  const [loadedTranslations, setLoadedTranslations] = useState(defaultTranslations)
  const [isLoading, setIsLoading] = useState(false)

  // Load translations for locale
  useEffect(() => {
    const loadLocaleTranslations = async () => {
      if (loadTranslations && typeof loadTranslations === 'function') {
        setIsLoading(true)
        try {
          const localeTranslations = await loadTranslations(locale)
          setLoadedTranslations(prev => ({
            ...prev,
            [locale]: {
              ...defaultTranslations[locale],
              ...localeTranslations
            }
          }))
        } catch (error) {
          console.error(`Failed to load translations for ${locale}:`, error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadLocaleTranslations()
  }, [locale, loadTranslations])

  // Merge custom translations
  useEffect(() => {
    if (Object.keys(translations).length > 0) {
      setLoadedTranslations(prev => {
        const merged = { ...prev }
        Object.keys(translations).forEach(lang => {
          merged[lang] = {
            ...merged[lang],
            ...translations[lang]
          }
        })
        return merged
      })
    }
  }, [translations])

  // Set locale with persistence
  const setLocale = useCallback((newLocale) => {
    setLocaleState(newLocale)
    
    if (persistLocale && typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale)
    }
    
    // Update document direction and lang
    if (typeof document !== 'undefined') {
      const config = localeConfigs[newLocale]
      document.documentElement.dir = config?.direction || 'ltr'
      document.documentElement.lang = newLocale
    }
  }, [persistLocale])

  // Translation function
  const t = useCallback((key, params = {}) => {
    const translations = loadedTranslations[locale] || loadedTranslations[defaultLocale] || {}
    let translation = translations[key] || key
    
    // Replace parameters
    Object.keys(params).forEach(param => {
      translation = translation.replace(`{{${param}}}`, params[param])
    })
    
    return translation
  }, [locale, defaultLocale, loadedTranslations])

  // Get current locale config
  const currentConfig = useMemo(() => {
    return localeConfigs[locale] || localeConfigs[defaultLocale]
  }, [locale, defaultLocale])

  // Number formatting
  const formatNumber = useCallback((number, options = {}) => {
    const config = currentConfig.numberFormat
    const precision = options.precision ?? config.precision
    
    if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
        ...options
      }).format(number)
    }
    
    // Fallback formatting
    const fixed = Number(number).toFixed(precision)
    const parts = fixed.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, config.thousands)
    return parts.join(config.decimal)
  }, [locale, currentConfig])

  // Currency formatting
  const formatCurrency = useCallback((amount, currency = null) => {
    const currencyCode = currency || currentConfig.currency
    
    if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode
      }).format(amount)
    }
    
    // Fallback formatting
    const formatted = formatNumber(amount)
    return `${currentConfig.currencySymbol}${formatted}`
  }, [locale, currentConfig, formatNumber])

  // Date formatting
  const formatDate = useCallback((date, options = {}) => {
    const dateObj = date instanceof Date ? date : new Date(date)
    
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        ...options
      }).format(dateObj)
    }
    
    // Fallback formatting
    return dateObj.toLocaleDateString()
  }, [locale])

  // Relative time formatting
  const formatRelativeTime = useCallback((date) => {
    const dateObj = date instanceof Date ? date : new Date(date)
    const now = new Date()
    const diffInSeconds = Math.floor((now - dateObj) / 1000)
    
    if (typeof Intl !== 'undefined' && Intl.RelativeTimeFormat) {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
      
      if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, 'second')
      } else if (diffInSeconds < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), 'minute')
      } else if (diffInSeconds < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour')
      } else {
        return rtf.format(-Math.floor(diffInSeconds / 86400), 'day')
      }
    }
    
    // Fallback
    return formatDate(dateObj)
  }, [locale, formatDate])

  // Available locales
  const availableLocales = useMemo(() => {
    return Object.keys(localeConfigs).map(code => ({
      code,
      ...localeConfigs[code]
    }))
  }, [])

  // Is RTL
  const isRTL = useMemo(() => {
    return currentConfig.direction === 'rtl'
  }, [currentConfig])

  const value = {
    locale,
    setLocale,
    t,
    formatNumber,
    formatCurrency,
    formatDate,
    formatRelativeTime,
    isRTL,
    availableLocales,
    isLoading,
    config: currentConfig
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

/**
 * Hook to use internationalization
 */
export const useI18n = () => {
  const context = useContext(I18nContext)
  
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  
  return context
}

/**
 * Translation hook
 */
export const useTranslation = () => {
  const { t, locale } = useI18n()
  
  return { t, locale }
}

/**
 * Locale detection hook
 */
export const useLocaleDetection = () => {
  const { setLocale, availableLocales } = useI18n()
  
  const detectLocale = useCallback(() => {
    if (typeof navigator !== 'undefined') {
      const browserLocales = [
        navigator.language,
        ...(navigator.languages || [])
      ]
      
      for (const browserLocale of browserLocales) {
        const code = browserLocale.split('-')[0]
        const available = availableLocales.find(locale => locale.code === code)
        
        if (available) {
          setLocale(code)
          return code
        }
      }
    }
    
    return null
  }, [setLocale, availableLocales])
  
  return { detectLocale }
}

/**
 * RTL layout hook
 */
export const useRTL = () => {
  const { isRTL } = useI18n()
  
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('rtl', isRTL)
      document.body.classList.toggle('ltr', !isRTL)
    }
  }, [isRTL])
  
  return { isRTL }
}

/**
 * Pluralization hook
 */
export const usePluralization = () => {
  const { locale, t } = useI18n()
  
  const plural = useCallback((key, count, params = {}) => {
    const pluralKey = count === 1 ? `${key}.singular` : `${key}.plural`
    return t(pluralKey, { count, ...params })
  }, [locale, t])
  
  return { plural }
}

export default {
  I18nProvider,
  useI18n,
  useTranslation,
  useLocaleDetection,
  useRTL,
  usePluralization
}