"use client";

import { useEffect, useState } from 'react';
import { Sneaker } from '@/types/sneaker';
import ProductCard from '@/components/common/ProductCard';

interface RelatedProductsProps {
    currentProduct: Sneaker;
}

export default function RelatedProducts({ currentProduct }: RelatedProductsProps) {
    const [relatedProducts, setRelatedProducts] = useState<Sneaker[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            setLoading(true);
            try {
                // Use silhouette if available for better relevance, otherwise brand
                const keyword = currentProduct.silhoutte || currentProduct.brand;
                if (!keyword) return;

                const res = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}&limit=8`);
                const data = await res.json();

                if (data.success) {
                    // Filter out current product
                    const filtered = data.data.filter((p: Sneaker) => p.styleID !== currentProduct.styleID);
                    setRelatedProducts(filtered);
                }
            } catch (err) {
                console.error("Failed to fetch related products", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRelated();
    }, [currentProduct]);

    if (!loading && relatedProducts.length === 0) return null;

    return (
        <div className="mt-12 sm:mt-16 border-t border-urban-light pt-10">
            <h2 className="text-xl sm:text-2xl font-bold font-kanit text-urban-black mb-6">
                สินค้าที่เกี่ยวข้อง
            </h2>

            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-[3/4] bg-urban-light animate-pulse rounded-xl"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                    {relatedProducts.slice(0, 4).map((product) => (
                        <ProductCard key={product.styleID} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
