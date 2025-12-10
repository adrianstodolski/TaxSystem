
/**
 * Safely formats currency values, handling both standard ISO 4217 codes (Fiat)
 * and non-standard Crypto codes (USDT, BTC, ETH) without crashing Intl.NumberFormat.
 */
export const safeFormatCurrency = (amount: number, currency: string = 'PLN'): string => {
    const safeCurrency = currency.toUpperCase();
    
    // Lista standardowych walut obsługiwanych przez Intl
    const fiatCurrencies = ['PLN', 'USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CNY', 'AUD', 'CAD', 'SEK', 'NOK'];

    if (fiatCurrencies.includes(safeCurrency)) {
        try {
            return new Intl.NumberFormat('pl-PL', { 
                style: 'currency', 
                currency: safeCurrency,
                maximumFractionDigits: 2 
            }).format(amount);
        } catch (e) {
            // Fallback in case of weird locale issues
            return `${amount.toFixed(2)} ${safeCurrency}`;
        }
    } else {
        // Custom formatting for Crypto
        // More precision for BTC/ETH, less for USDT/Stablecoins
        let decimals = 2;
        if (['BTC', 'ETH', 'SOL'].includes(safeCurrency)) decimals = 6;
        if (['USDT', 'USDC', 'DAI'].includes(safeCurrency)) decimals = 2;
        if (['SHIB', 'PEPE', 'BONK'].includes(safeCurrency)) decimals = 0; // Or high precision integers

        // Format number with spaces as thousands separators
        const formattedNumber = amount.toLocaleString('pl-PL', { 
            minimumFractionDigits: decimals, 
            maximumFractionDigits: decimals 
        });

        return `${formattedNumber} ${safeCurrency}`;
    }
};

export const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
};
