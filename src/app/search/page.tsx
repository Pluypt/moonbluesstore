"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import ProductCard from '@/components/common/ProductCard';
import ProductSkeleton from '@/components/common/ProductSkeleton';
import { Sneaker } from '@/types/sneaker';

const ITEMS_PER_PAGE = 20;

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const keyword = searchParams.get('keyword');
    const pageParam = searchParams.get('page');
    const currentPage = pageParam ? parseInt(pageParam) : 1;

    const [products, setProducts] = useState<Sneaker[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!keyword) {
            setProducts([]);
            setLoading(false);
            return;
        }

        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch more items than needed to verify if "next page" exists (basic pagination)
                const limit = currentPage * ITEMS_PER_PAGE;
                const res = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}&limit=${limit}`);

                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await res.json();
                if (data.success) {
                    const allFetched = data.data;
                    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                    const pageData = allFetched.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                    setProducts(pageData);
                } else {
                    setProducts([]);
                    setError(data.error?.message || 'Something went wrong');
                }
            } catch (err: any) {
                console.error("Search Error:", err);
                setError("Could not connect to server. Please ensure the backend is running.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword, currentPage]);

    const handlePageChange = (newPage: number) => {
        router.push(`/search?keyword=${encodeURIComponent(keyword || '')}&page=${newPage}`);
    };

    return (
        <div className="bg-urban-white min-h-screen pb-20">
            {/* Header */}
            <div className="bg-urban-black text-urban-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-bold font-kanit tracking-tight uppercase">
                        {keyword ? `ผลลัพธ์สำหรับ "${keyword}"` : 'ค้นหา'}
                    </h1>
                    <p className="mt-2 text-urban-gray font-kanit">
                        หน้า {currentPage}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="text-urban-gray text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold font-inter text-urban-black mb-2">Oops! Something went wrong.</h2>
                        <p className="text-urban-gray mb-6">{error}</p>
                        <button onClick={() => window.location.reload()} className="bg-urban-black text-white px-6 py-2 rounded-full font-bold hover:bg-urban-dark transition-colors">
                            Try Again
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-urban-gray text-6xl mb-4">🔍</div>
                        <h2 className="text-2xl font-bold font-inter text-urban-black mb-2">ไม่พบสินค้า</h2>
                        <p className="text-urban-gray mb-6 font-kanit">ลองค้นหาด้วยคำทั่วไป เช่น "Nike", "Jordan", หรือ "Yeezy"</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up">
                            {products.map((product) => (
                                <ProductCard key={`${product.styleID}-${product.shoeName}`} product={product} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="mt-12 flex justify-center gap-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-6 py-2 rounded-full font-bold border border-urban-black transition-colors ${currentPage === 1
                                    ? 'opacity-50 cursor-not-allowed text-urban-gray border-urban-gray'
                                    : 'hover:bg-urban-black hover:text-white text-urban-black'
                                    }`}
                            >
                                &larr; ก่อนหน้า
                            </button>

                            <span className="flex items-center justify-center font-kanit font-bold text-urban-black px-4">
                                หน้า {currentPage}
                            </span>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={products.length < ITEMS_PER_PAGE}
                                className={`px-6 py-2 rounded-full font-bold border border-urban-black transition-colors ${products.length < ITEMS_PER_PAGE
                                    ? 'opacity-50 cursor-not-allowed text-urban-gray border-urban-gray'
                                    : 'hover:bg-urban-black hover:text-white text-urban-black'
                                    }`}
                            >
                                ถัดไป &rarr;
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-urban-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-urban-black"></div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
