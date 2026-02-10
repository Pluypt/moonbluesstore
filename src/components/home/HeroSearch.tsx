"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSearch() {
    const [search, setSearch] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/search?keyword=${encodeURIComponent(search.trim())}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="w-full relative group z-20">
            <input
                type="text"
                placeholder="ค้นหารุ่นสินค้าที่ต้องการ..."
                className="w-full bg-white text-urban-dark text-lg px-8 py-4 rounded-full font-kanit tracking-wide focus:outline-none focus:ring-4 focus:ring-brand-blue/30 shadow-lg transition-all placeholder-gray-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand-yellow text-brand-blue p-3 rounded-full hover:bg-yellow-400 transition-all shadow-md group-hover:scale-105"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </button>
        </form>
    );
}
