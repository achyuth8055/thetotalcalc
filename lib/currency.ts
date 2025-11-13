// Currency configuration based on region
export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'en-IN',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'en-EU',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    locale: 'en-AU',
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    locale: 'en-CA',
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    locale: 'en-SG',
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    locale: 'ar-AE',
  },
  SAR: {
    code: 'SAR',
    symbol: '﷼',
    name: 'Saudi Riyal',
    locale: 'ar-SA',
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    locale: 'ja-JP',
  },
};

// Country to currency mapping
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  IN: 'INR', // India
  US: 'USD', // United States
  GB: 'GBP', // United Kingdom
  AU: 'AUD', // Australia
  CA: 'CAD', // Canada
  SG: 'SGD', // Singapore
  AE: 'AED', // UAE
  SA: 'SAR', // Saudi Arabia
  JP: 'JPY', // Japan
  DE: 'EUR', // Germany
  FR: 'EUR', // France
  IT: 'EUR', // Italy
  ES: 'EUR', // Spain
  NL: 'EUR', // Netherlands
  BE: 'EUR', // Belgium
  AT: 'EUR', // Austria
  PT: 'EUR', // Portugal
  IE: 'EUR', // Ireland
  GR: 'EUR', // Greece
  FI: 'EUR', // Finland
};

/**
 * Detect user's currency based on their IP location
 */
export async function detectCurrency(): Promise<CurrencyConfig> {
  try {
    // Check if currency is already saved in localStorage
    const savedCurrency = localStorage.getItem('preferredCurrency');
    if (savedCurrency && CURRENCIES[savedCurrency]) {
      return CURRENCIES[savedCurrency];
    }

    // Try to detect from IP using ipapi.co (free, no API key required)
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch location');
    }

    const data = await response.json();
    const countryCode = data.country_code;

    // Map country to currency
    const currencyCode = COUNTRY_TO_CURRENCY[countryCode] || 'USD';
    const currency = CURRENCIES[currencyCode];

    // Save to localStorage for future visits
    localStorage.setItem('preferredCurrency', currencyCode);
    localStorage.setItem('detectedCountry', countryCode);

    return currency;
  } catch (error) {
    console.error('Currency detection failed:', error);
    
    // Fallback: try to detect from browser timezone
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Common timezone to currency mapping
      if (timezone.includes('Asia/Kolkata') || timezone.includes('Asia/Calcutta')) {
        return CURRENCIES.INR;
      } else if (timezone.includes('America/New_York') || timezone.includes('America/Los_Angeles')) {
        return CURRENCIES.USD;
      } else if (timezone.includes('Europe/London')) {
        return CURRENCIES.GBP;
      } else if (timezone.includes('Australia')) {
        return CURRENCIES.AUD;
      } else if (timezone.includes('Asia/Singapore')) {
        return CURRENCIES.SGD;
      } else if (timezone.includes('Asia/Dubai')) {
        return CURRENCIES.AED;
      }
    } catch (timezoneError) {
      console.error('Timezone detection failed:', timezoneError);
    }

    // Ultimate fallback to USD
    return CURRENCIES.USD;
  }
}

/**
 * Format currency with proper locale and symbol
 */
export function formatCurrency(
  value: number,
  currency: CurrencyConfig,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(currency.locale, {
    style: 'currency',
    currency: currency.code,
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: CurrencyConfig): string {
  return currency.symbol;
}

/**
 * Update preferred currency
 */
export function setPreferredCurrency(currencyCode: string): void {
  if (CURRENCIES[currencyCode]) {
    localStorage.setItem('preferredCurrency', currencyCode);
  }
}

/**
 * Get all available currencies for selector
 */
export function getAllCurrencies(): CurrencyConfig[] {
  return Object.values(CURRENCIES);
}
