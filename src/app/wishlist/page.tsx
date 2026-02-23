"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getWishlist, clearWishlist, WishlistItem } from '@/lib/wishlist';
import WishlistButton from '@/components/common/WishlistButton';
import { formatTHB } from '@/lib/price';
import Image from 'next/image';

export default function WishlistPage() {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWishlist();

        const handleWishlistUpdate = () => {
            loadWishlist();
        };

        window.addEventListener('wishlistUpdated', handleWishlistUpdate);
        return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
    }, []);

    const loadWishlist = () => {
        setLoading(true);
        const items = getWishlist();
        setWishlist(items);
        setLoading(false);
    };

    const handleClearAll = () => {
        if (confirm('คุณต้องการลบสินค้าทั้งหมดออกจากรายการโปรดหรือไม่?')) {
            clearWishlist();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-urban-white pt-20 pb-24 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-urban-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-urban-white pt-20 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black font-inter text-urban-black mb-2">
                            ⭐ รายการโปรด
                        </h1>
                        <p className="text-urban-gray font-kanit">
                            {wishlist.length} รายการ
                        </p>
                    </div>
                    {wishlist.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="text-red-500 hover:text-red-600 font-kanit text-sm font-bold"
                        >
                            ลบทั้งหมด
                        </button>
                    )}
                </div>

                {/* Content */}
                {wishlist.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">💔</div>
                        <h2 className="text-2xl font-bold font-inter text-urban-black mb-2">
                            ยังไม่มีสินค้าในรายการโปรด
                        </h2>
                        <p className="text-urban-gray mb-6 font-kanit">
                            เริ่มเพิ่มสินค้าที่คุณชอบเพื่อติดตามราคาและข้อมูล
                        </p>
                        <Link
                            href="/search"
                            className="inline-block bg-urban-black text-white px-8 py-3 rounded-full font-bold font-kanit hover:bg-urban-dark transition-colors"
                        >
                            เริ่มค้นหาสินค้า
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((item) => {
                            const lowestPrice = item.lowestResellPrice?.stockX || item.retailPrice;
                            
                            return (
                                <div
                                    key={item.styleID}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group relative"
                                >
                                    {/* Wishlist Button */}
                                    <div className="absolute top-3 right-3 z-10">
                                        <WishlistButton
                                            product={{
                                                styleID: item.styleID,
                                                shoeName: item.shoeName,
                                                brand: item.brand,
                                                thumbnail: item.thumbnail,
                                                retailPrice: item.retailPrice,
                                                lowestResellPrice: item.lowestResellPrice,
                                                silhoutte: '',
                                                colorway: '',
                                                imageLinks: [],
                                                resellLinks: {},
                                                description: '',
                                                urlKey: ''
                                            }}
                                            size="small"
                                        />
                                    </div>

                                    <Link href={`/product/${item.styleID}`}>
                                        {/* Image */}
                                        <div className="aspect-square relative bg-urban-light/30 p-4 flex items-center justify-center overflow-hidden">
                                            <Image
                                                src={item.thumbnail}
                                                alt={item.shoeName}
                                                fill
                                                className="object-contain group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            <p className="text-xs text-urban-gray font-bold uppercase tracking-wider mb-1">
                                                {item.brand}
                                            </p>
                                            <h3 className="text-urban-black font-inter font-bold text-sm leading-tight mb-3 line-clamp-2 h-10">
                                                {item.shoeName}
                                            </h3>

                                            {/* Price */}
                                            <div className="flex items-baseline justify-between">
                                                <div>
                                                    <p className="text-xs text-urban-gray font-kanit">ราคาตลาด</p>
                                                    <p className="text-lg font-black text-brand-blue font-inter">
                                                        {formatTHB(lowestPrice)}
                                                    </p>
                                                </div>
                                                <div className="bg-urban-black text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
