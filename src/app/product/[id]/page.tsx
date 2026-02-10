"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import ImageGallery from '@/components/common/ImageGallery';
import type { Sneaker } from '@/types/sneaker';

export default function ProductDetailPage() {
    const params = useParams();
    const styleID = params.id as string;

    const [product, setProduct] = useState<Sneaker | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!styleID) return;

        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/products/${styleID}`);
                if (!res.ok) throw new Error('Product not found');

                const data = await res.json();
                if (data.success) {
                    setProduct(data.data);
                } else {
                    throw new Error(data.error);
                }
            } catch (err: any) {
                console.error(err);
                setError("Could not load product details.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [styleID]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="aspect-square bg-urban-light animate-pulse rounded-2xl"></div>
                    <div className="space-y-6">
                        <div className="h-8 bg-urban-light animate-pulse w-3/4 rounded"></div>
                        <div className="h-6 bg-urban-light animate-pulse w-1/2 rounded"></div>
                        <div className="h-32 bg-urban-light animate-pulse w-full rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-2xl font-bold font-inter mb-4">Product Not Found</h2>
                <p className="text-urban-gray">{error || "The requested sneaker does not exist."}</p>
            </div>
        );
    }

    // Calculate prices
    const lowestPrice = product.lowestResellPrice.stockX || product.retailPrice;

    // LINE Deep Link
    const lineMessage = `Hello, I'm interested in:\n\nModel: ${product.shoeName}\nSKU: ${product.styleID}\n\nPlease check the price and availability for Size: [ENTER SIZE]`;
    const lineUrl = `https://line.me/R/oaMessage/@moonbluesstore/?${encodeURIComponent(lineMessage)}`;

    // Images 
    const galleryImages = product.imageLinks.length > 0 ? product.imageLinks : [product.thumbnail];

    return (
        <div className="bg-urban-white min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                    {/* Left: Image Gallery */}
                    <div>
                        <ImageGallery images={galleryImages} productName={product.shoeName} />
                    </div>

                    {/* Right: Details */}
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-urban-gray font-bold tracking-wider uppercase text-sm mb-2">{product.brand}</h2>
                            <h1 className="text-3xl md:text-4xl font-black font-inter text-urban-black leading-tight mb-2">
                                {product.shoeName}
                            </h1>
                            <p className="font-kanit text-urban-gray">SKU: {product.styleID}</p>
                        </div>

                        {/* Price Card */}
                        <div className="bg-urban-light/50 p-6 rounded-2xl mb-8 border border-urban-light">
                            <p className="text-xs text-urban-gray font-bold uppercase tracking-wide mb-1 font-kanit">ราคาตลาดโดยประมาณ</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black font-inter text-urban-black">
                                    ${lowestPrice}
                                </span>
                                <span className="text-sm text-urban-gray">USD</span>
                            </div>
                            <p className="text-xs text-urban-gray mt-2 font-kanit">*ราคาอาจแตกต่างกันตามไซส์และกลไกตลาด</p>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <div className="mb-8">
                                <h3 className="font-bold text-urban-black mb-2 font-kanit">รายละเอียด</h3>
                                <p className="text-urban-dark/80 text-sm leading-relaxed font-kanit">
                                    {product.description}
                                </p>
                            </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-white border border-urban-light rounded-xl">
                                <p className="text-xs text-urban-gray uppercase mb-1 font-kanit">สี (Colorway)</p>
                                <p className="font-bold text-sm text-urban-black break-words">{product.colorway}</p>
                            </div>
                            <div className="p-4 bg-white border border-urban-light rounded-xl">
                                <p className="text-xs text-urban-gray uppercase mb-1 font-kanit">ราคาป้าย</p>
                                <p className="font-bold text-sm text-urban-black">${product.retailPrice}</p>
                            </div>
                        </div>

                        {/* CTA - Shiny/Sticky on mobile */}
                        <div className="mt-auto sticky bottom-4 z-20 md:static">
                            <a
                                href={lineUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-urban-black text-white py-4 px-6 rounded-full font-bold font-kanit text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-urban-dark hover:scale-[1.02] transition-all"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.288 10.456c-.538-6.19-6.356-9.822-12.449-7.756C6.27 4.195 4.39 6.208 3.037 8.92c-.22.442-.423.894-.593 1.357-.757 2.062-.72 4.354.12 6.42.065.16.134.318.207.474.912 1.94 2.457 3.52 4.407 4.5l.39.196 2.06.635c.164.05.334.076.505.076.47 0 .93-.117 1.35-.348l.067-.038c1.656-.91 3.57-1.12 5.372-.605l.35.1c3.16.905 6.55-1.12 7.087-4.234.34-1.97.02-3.99-.92-5.75-.417-.79-.938-1.517-1.543-2.155zm-1.636 7.68c-.378 2.193-2.766 3.62-5.01 2.978l-.35-.1c-2.176-.622-4.5.3-6.155 2.15l-.042.048c-.628.715-1.782.52-2.138-.363-.787-1.956-1.077-4.085-.84-6.18.06-.525.176-1.043.344-1.543 1.144-3.4 4.54-5.518 8.016-5.006 4.344.64 7.217 4.67 6.512 8.97l-.337 2.046z" />
                                </svg>
                                เช็คราคา / สั่งซื้อ
                            </a>
                            <p className="text-center text-xs text-urban-gray mt-3 md:hidden font-kanit">
                                ระบบจะนำท่านไปยัง LINE Official Account
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
