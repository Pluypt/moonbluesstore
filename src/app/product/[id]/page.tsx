"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ImageGallery from '@/components/common/ImageGallery';
import RelatedProducts from '@/components/product/RelatedProducts';
import type { Sneaker } from '@/types/sneaker';
import { formatTHB } from '@/lib/price';

export default function ProductDetailPage() {
    const params = useParams();
    const styleID = params.id as string;

    const [product, setProduct] = useState<Sneaker | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDescOpen, setIsDescOpen] = useState(false);

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-24 text-center">
                <h2 className="text-2xl font-bold font-inter mb-4">Product Not Found</h2>
                <p className="text-urban-gray">{error || "The requested sneaker does not exist."}</p>
                <Link href="/search" className="inline-block mt-6 bg-urban-black text-white px-6 py-2 rounded-full font-bold">Back to Search</Link>
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
        <div className="bg-urban-white min-h-screen pb-safe">
            <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-12 pt-16 sm:pt-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">

                    {/* Left: Image Gallery (Mobile Swipe) */}
                    <div className="bg-white pb-4 sm:rounded-3xl overflow-hidden shadow-sm">
                        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-[40vh]">
                            {galleryImages.map((img, i) => (
                                <div key={i} className="min-w-full h-full snap-center flex items-center justify-center p-8 relative">
                                    <img src={img} alt={`${product.shoeName} ${i}`} className="max-h-full object-contain" />
                                    <span className="absolute bottom-2 right-4 text-xs text-urban-gray/50 bg-urban-light/30 px-2 py-1 rounded">{i + 1}/{galleryImages.length}</span>
                                </div>
                            ))}
                        </div>
                        {/* Desktop Gallery typically handled by ImageGallery component, assume it's adaptive or hide/show */}
                        <div className="hidden md:block">
                            <ImageGallery images={galleryImages} productName={product.shoeName} />
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="flex flex-col h-full px-4 sm:px-0">
                        {/* Header */}
                        <div className="mb-4 sm:mb-6">
                            <h2 className="text-urban-gray font-bold tracking-wider uppercase text-xs sm:text-sm mb-1 sm:mb-2">{product.brand}</h2>
                            <h1 className="text-2xl sm:text-4xl font-black font-inter text-urban-black leading-tight mb-2">
                                {product.shoeName}
                            </h1>
                            <p className="font-kanit text-urban-gray text-sm">SKU: {product.styleID}</p>
                        </div>

                        {/* Price Card */}
                        <div className="bg-urban-light/30 p-4 sm:p-6 rounded-2xl mb-6 border border-urban-light backdrop-blur-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs text-urban-gray font-bold uppercase tracking-wide mb-1 font-kanit">ราคาตลาดโดยประมาณ</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl sm:text-4xl font-black font-inter text-brand-blue">
                                            {formatTHB(lowestPrice)}
                                        </span>
                                        <span className="text-xs sm:text-sm text-urban-gray">THB</span>
                                    </div>
                                    <p className="text-[0.65rem] sm:text-xs text-urban-gray mt-1 font-kanit text-red-500">*ราคาขึ้นอยู่กับไซส์และค่าเงิน</p>
                                </div>
                                <div className="text-right">
                                    <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold inline-block mb-1">In Stock</div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Price Table */}
                        <div className="bg-white rounded-xl border border-urban-light overflow-hidden mb-6 shadow-sm">
                            <div className="bg-urban-black/5 px-4 py-2 border-b border-urban-light">
                                <h3 className="font-bold text-sm text-urban-dark font-kanit">เปรียบเทียบราคาต่างประเทศ</h3>
                            </div>
                            <div className="divide-y divide-urban-light/50">
                                <div className="flex justify-between px-4 py-3 text-sm">
                                    <span className="text-urban-gray">StockX</span>
                                    <span className="font-mono font-bold">{formatTHB(product.lowestResellPrice.stockX)}</span>
                                </div>
                                <div className="flex justify-between px-4 py-3 text-sm">
                                    <span className="text-urban-gray">GOAT</span>
                                    <span className="font-mono font-bold">{formatTHB(product.lowestResellPrice.goat)}</span>
                                </div>
                                <div className="flex justify-between px-4 py-3 text-sm">
                                    <span className="text-urban-gray">FlightClub</span>
                                    <span className="font-mono font-bold">{formatTHB(product.lowestResellPrice.flightClub)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Collapsible Description */}
                        {product.description && (
                            <div className="mb-6 border-b border-urban-light pb-4">
                                <button
                                    onClick={() => setIsDescOpen(!isDescOpen)}
                                    className="flex justify-between items-center w-full text-left font-bold text-urban-black mb-2 font-kanit text-sm sm:text-base focus:outline-none"
                                >
                                    รายละเอียดสินค้า
                                    <span className={`transform transition-transform ${isDescOpen ? 'rotate-180' : ''}`}>▼</span>
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${isDescOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 sm:max-h-none sm:opacity-100'}`}>
                                    <p className="text-urban-dark/80 text-xs sm:text-sm leading-relaxed font-kanit mt-2">
                                        {product.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-24 sm:mb-8">
                            <div className="p-3 sm:p-4 bg-white border border-urban-light rounded-xl">
                                <p className="text-[0.6rem] sm:text-xs text-urban-gray uppercase mb-1 font-kanit">สี (Colorway)</p>
                                <p className="font-bold text-xs sm:text-sm text-urban-black break-words leading-tight">{product.colorway}</p>
                            </div>
                            <div className="p-3 sm:p-4 bg-white border border-urban-light rounded-xl">
                                <p className="text-[0.6rem] sm:text-xs text-urban-gray uppercase mb-1 font-kanit">ราคาป้าย</p>
                                <p className="font-bold text-xs sm:text-sm text-urban-black">{formatTHB(product.retailPrice)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <RelatedProducts currentProduct={product} />
            </div>

            {/* Floating Sticky Actions (Mobile & Desktop) */}
            <div className="fixed bottom-[64px] md:bottom-0 left-0 w-full bg-white/95 backdrop-blur border-t border-urban-light p-4 z-40 pb-safe md:static md:bg-transparent md:border-0 md:px-0 md:my-20 md:z-auto">
                <div className="max-w-7xl mx-auto flex gap-4 md:block">
                    <a
                        href={lineUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-brand-blue text-white py-3 sm:py-4 px-6 rounded-full font-bold font-kanit text-base sm:text-lg flex items-center justify-center gap-3 shadow-xl hover:bg-urban-dark hover:scale-[1.02] transition-all"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.288 10.456c-.538-6.19-6.356-9.822-12.449-7.756C6.27 4.195 4.39 6.208 3.037 8.92c-.22.442-.423.894-.593 1.357-.757 2.062-.72 4.354.12 6.42.065.16.134.318.207.474.912 1.94 2.457 3.52 4.407 4.5l.39.196 2.06.635c.164.05.334.076.505.076.47 0 .93-.117 1.35-.348l.067-.038c1.656-.91 3.57-1.12 5.372-.605l.35.1c3.16.905 6.55-1.12 7.087-4.234.34-1.97.02-3.99-.92-5.75-.417-.79-.938-1.517-1.543-2.155zm-1.636 7.68c-.378 2.193-2.766 3.62-5.01 2.978l-.35-.1c-2.176-.622-4.5.3-6.155 2.15l-.042.048c-.628.715-1.782.52-2.138-.363-.787-1.956-1.077-4.085-.84-6.18.06-.525.176-1.043.344-1.543 1.144-3.4 4.54-5.518 8.016-5.006 4.344.64 7.217 4.67 6.512 8.97l-.337 2.046z" />
                        </svg>
                        เช็คราคา / สั่งซื้อ
                    </a>
                </div>
            </div>
        </div>
    );
}
