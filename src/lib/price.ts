
export const THB_RATE = 35;

export function formatTHB(priceUSD: number | string | undefined | null): string {
    if (priceUSD === undefined || priceUSD === null) return 'N/A';
    
    let numPrice: number;
    if (typeof priceUSD === 'string') {
        // Remove strictly non-numeric chars except dot/minus if present in string but API returns numbers or clean strings usually
        // If string is "120" or "120.50"
        numPrice = parseFloat(priceUSD);
    } else {
        numPrice = priceUSD;
    }

    if (isNaN(numPrice)) return 'N/A';
    
    // Check if price is 0
    if (numPrice === 0) return 'N/A';

    const priceTHB = Math.round(numPrice * THB_RATE);
    return `฿${priceTHB.toLocaleString('th-TH')}`;
}
