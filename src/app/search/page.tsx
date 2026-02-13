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

    // Filters state
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<string>('newest');
    const [scrolled, setScrolled] = useState(false);

    const [products, setProducts] = useState<Sneaker[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter Options
    const brands = ["All", "Nike", "Jordan", "adidas", "New Balance", "Yeezy"];
    const prices = [
        { label: "ทุกราคา", value: "all" },
        { label: "ต่ำกว่า $100", value: "low" },
        { label: "$100 - $200", value: "mid" },
        { label: "$200+", value: "high" }
    ];
    const sorts = [
        { label: "ใหม่ล่าสุด", value: "newest" },
        { label: "ราคา: ต่ำ-สูง", value: "price_asc" },
        { label: "ราคา: สูง-ต่ำ", value: "price_desc" }
    ];

    // Handle Scroll for Back to Top
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) setScrolled(true);
            else setScrolled(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            
            // Artificial delay for smooth UX? No, let's keep it fast.
            
            try {
                // Construct basic query URL
                if (!keyword && !selectedBrand) {
                    // Default view if needed
                }

                const limit = currentPage * ITEMS_PER_PAGE;
                let url = `/api/search?keyword=${encodeURIComponent(keyword || '')}&limit=${limit}`;
                
                // Note: In a real app, pass filter params to API. 
                // Here we will filter client-side for demo if API doesn't support it, 
                // but let's assume we fetch normally and filter client side for now as the API context isn't fully visible.
                
                const res = await fetch(url);

                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await res.json();
                if (data.success) {
                    let allFetched: Sneaker[] = data.data;

                    // Client-side filtering simulation (since we don't know if API supports these params)
                    if (selectedBrand && selectedBrand !== "All") {
                        allFetched = allFetched.filter(p => p.brand?.toLowerCase().includes(selectedBrand.toLowerCase()));
                    }

                    if (priceRange && priceRange !== 'all') {
                        allFetched = allFetched.filter(p => {
                            const price = p.lowestResellPrice.stockX || p.retailPrice || 0;
                            if (priceRange === 'low') return price < 100;
                            if (priceRange === 'mid') return price >= 100 && price <= 200;
                            if (priceRange === 'high') return price > 200;
                            return true;
                        });
                    }

                    // Sort
                    if (sortBy === 'price_asc') {
                        allFetched.sort((a, b) => (a.lowestResellPrice.stockX || 0) - (b.lowestResellPrice.stockX || 0));
                    } else if (sortBy === 'price_desc') {
                        allFetched.sort((a, b) => (b.lowestResellPrice.stockX || 0) - (a.lowestResellPrice.stockX || 0));
                    }
                    // 'newest' is usually default from API

                    // Pagination logic
                    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                    const pageData = allFetched.slice(startIndex, startIndex + ITEMS_PER_PAGE);

                    setProducts(pageData);
                } else {
                    setProducts([]);
                    setError(data.error?.message || 'Something went wrong');
                }
            } catch (err: any) {
                console.error("Search Error:", err);
                setError("Could not connect to server.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [keyword, currentPage, selectedBrand, priceRange, sortBy]);

    const handlePageChange = (newPage: number) => {
        router.push(`/search?keyword=${encodeURIComponent(keyword || '')}&page=${newPage}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="bg-urban-white min-h-screen pb-20 pt-16 sm:pt-0">
            {/* Header with Sticky Filters */}
            <div className="bg-urban-black text-urban-white sticky top-0 sm:top-20 z-40 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-xl sm:text-3xl font-bold font-kanit tracking-tight uppercase truncate max-w-[300px] sm:max-w-none">
                            {keyword ? `"${keyword}"` : 'สินค้าทั้งหมด'}
                        </h1>
                        <p className="hidden sm:block mt-1 text-urban-gray font-kanit text-sm">
                            ผลลัพธ์การค้นหา
                        </p>
                    </div>
                    
                    {/* Sort Dropdown for Desktop */}
                    <div className="hidden sm:block">
                         <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-urban-dark text-white border border-urban-gray rounded-md px-3 py-1 text-sm font-kanit"
                        >
                            {sorts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                    </div>
                </div>

                {/* Mobile Scrollable Filters */}
                <div className="border-t border-urban-gray/30 overflow-x-auto no-scrollbar py-3 px-4 flex gap-2 sm:px-8 bg-urban-black/95 backdrop-blur">
                    {/* Brand Pills */}
                    {brands.map((brand) => (
                        <button
                            key={brand}
                            onClick={() => setSelectedBrand(brand === "All" ? null : brand)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold font-kanit transition-all ${
                                (brand === "All" && !selectedBrand) || selectedBrand === brand
                                    ? 'bg-brand-yellow text-brand-blue scale-105'
                                    : 'bg-urban-dark text-urban-gray border border-urban-gray/50'
                            }`}
                        >
                            {brand}
                        </button>
                    ))}
                    <div className="w-[1px] bg-urban-gray/50 h-6 mx-1"></div>
                     {/* Price Pills */}
                     {prices.slice(1).map((price) => (
                        <button
                            key={price.value}
                            onClick={() => setPriceRange(priceRange === price.value ? null : price.value)}
                            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold font-kanit transition-all ${
                                priceRange === price.value
                                    ? 'bg-brand-green text-white scale-105'
                                    : 'bg-urban-dark text-urban-gray border border-urban-gray/50'
                            }`}
                        >
                            {price.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
                {/* Pull to refresh visual hint (static) */}
                <div className="sm:hidden text-center text-urban-gray/50 text-xs mb-4 flex items-center justify-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                    <span>เลื่อนลงเพื่อดูเพิ่มเติม</span>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                        {[...Array(8)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="text-urban-gray text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold font-inter text-urban-black mb-2">Oops! Something went wrong.</h2>
                        <button onClick={() => window.location.reload()} className="bg-urban-black text-white px-6 py-2 rounded-full font-bold mt-4">
                            Try Again
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-urban-gray text-6xl mb-4">🔍</div>
                        <h2 className="text-xl font-bold font-inter text-urban-black mb-2">ไม่พบสินค้า</h2>
                        <button 
                            onClick={() => { setSelectedBrand(null); setPriceRange(null); router.push('/search'); }}
                            className="bg-urban-black text-white px-6 py-2 rounded-full font-bold mt-4 font-kanit"
                        >
                            ล้างตัวกรอง
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 animate-fade-in-up">
                            {products.map((product) => (
                                <ProductCard key={`${product.styleID}-${product.shoeName}`} product={product} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="mt-12 flex justify-center gap-4">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`px-4 sm:px-6 py-2 rounded-full font-bold border border-urban-black transition-colors text-sm ${currentPage === 1
                                    ? 'opacity-50 cursor-not-allowed text-urban-gray border-urban-gray'
                                    : 'hover:bg-urban-black hover:text-white text-urban-black'
                                    }`}
                            >
                                &larr;
                            </button>

                            <span className="flex items-center justify-center font-kanit font-bold text-urban-black px-4">
                                {currentPage}
                            </span>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={products.length < ITEMS_PER_PAGE}
                                className={`px-4 sm:px-6 py-2 rounded-full font-bold border border-urban-black transition-colors text-sm ${products.length < ITEMS_PER_PAGE
                                    ? 'opacity-50 cursor-not-allowed text-urban-gray border-urban-gray'
                                    : 'hover:bg-urban-black hover:text-white text-urban-black'
                                    }`}
                            >
                                &rarr;
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Back to Top Floating Button */}
            {scrolled && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-24 right-4 sm:bottom-10 sm:right-10 bg-brand-yellow text-urban-black p-3 rounded-full shadow-xl hover:scale-110 transition-transform z-50 animate-fade-in-up"
                    aria-label="Back to Top"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                </button>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-urban-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-urban-black"></div>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
