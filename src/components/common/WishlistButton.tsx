"use client";

import { useState, useEffect } from 'react';
import { addToWishlist, removeFromWishlist, isInWishlist } from '@/lib/wishlist';
import { Sneaker } from '@/types/sneaker';

interface WishlistButtonProps {
    product: Sneaker;
    size?: 'small' | 'medium' | 'large';
    showLabel?: boolean;
}

export default function WishlistButton({ product, size = 'medium', showLabel = false }: WishlistButtonProps) {
    const [isInList, setIsInList] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsInList(isInWishlist(product.styleID));

        const handleWishlistUpdate = () => {
            setIsInList(isInWishlist(product.styleID));
        };

        window.addEventListener('wishlistUpdated', handleWishlistUpdate);
        return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    }, [product.styleID]);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isInList) {
            removeFromWishlist(product.styleID);
        } else {
            addToWishlist(product);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 600);
        }
    };

    const sizeClasses = {
        small: 'w-8 h-8',
        medium: 'w-10 h-10',
        large: 'w-12 h-12'
    };

    const iconSizes = {
        small: 'w-4 h-4',
        medium: 'w-5 h-5',
        large: 'w-6 h-6'
    };

    return (
        <button
            onClick={handleToggle}
            className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all ${
                isInList
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white/90 backdrop-blur text-urban-gray hover:bg-white hover:text-red-500'
            } shadow-lg hover:scale-110 active:scale-95 ${isAnimating ? 'animate-bounce' : ''}`}
            aria-label={isInList ? 'Remove from wishlist' : 'Add to wishlist'}
            title={isInList ? 'ลบออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
        >
            {showLabel ? (
                <span className="flex items-center gap-2 px-4 font-kanit text-sm font-bold">
                    <svg
                        className={iconSizes[size]}
                        fill={isInList ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                    {isInList ? 'ลบออก' : 'เพิ่มในรายการโปรด'}
                </span>
            ) : (
                <svg
                    className={iconSizes[size]}
                    fill={isInList ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                </svg>
            )}
        </button>
    );
}
