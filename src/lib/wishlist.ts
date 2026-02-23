import { Sneaker } from '@/types/sneaker';

const WISHLIST_KEY = 'moonblue_wishlist';

export interface WishlistItem {
    styleID: string;
    shoeName: string;
    brand: string;
    thumbnail: string;
    retailPrice: number;
    lowestResellPrice: any;
    addedAt: number;
}

// Get all wishlist items
export function getWishlist(): WishlistItem[] {
    if (typeof window === 'undefined') return [];
    
    try {
        const stored = localStorage.getItem(WISHLIST_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading wishlist:', error);
        return [];
    }
}

// Add item to wishlist
export function addToWishlist(product: Sneaker): boolean {
    try {
        const wishlist = getWishlist();
        
        // Check if already in wishlist
        if (wishlist.some(item => item.styleID === product.styleID)) {
            return false;
        }
        
        const newItem: WishlistItem = {
            styleID: product.styleID,
            shoeName: product.shoeName,
            brand: product.brand,
            thumbnail: product.thumbnail,
            retailPrice: product.retailPrice,
            lowestResellPrice: product.lowestResellPrice,
            addedAt: Date.now()
        };
        
        wishlist.push(newItem);
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
        
        // Dispatch custom event for UI updates
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        
        return true;
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        return false;
    }
}

// Remove item from wishlist
export function removeFromWishlist(styleID: string): boolean {
    try {
        const wishlist = getWishlist();
        const filtered = wishlist.filter(item => item.styleID !== styleID);
        
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(filtered));
        
        // Dispatch custom event for UI updates
        window.dispatchEvent(new CustomEvent('wishlistUpdated'));
        
        return true;
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        return false;
    }
}

// Check if item is in wishlist
export function isInWishlist(styleID: string): boolean {
    const wishlist = getWishlist();
    return wishlist.some(item => item.styleID === styleID);
}

// Get wishlist count
export function getWishlistCount(): number {
    return getWishlist().length;
}

// Clear entire wishlist
export function clearWishlist(): void {
    localStorage.removeItem(WISHLIST_KEY);
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
}
