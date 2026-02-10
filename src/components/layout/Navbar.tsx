"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Popular searches in Thailand/General Sneaker culture
const POPULAR_SEARCHES = [
    "Nike Dunk Low",
    "Air Jordan 1",
    "Yeezy Slide",
    "New Balance 530",
    "Samba",
    "Air Force 1"
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const router = useRouter();

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const stored = localStorage.getItem('recentSearches');
        if (stored) {
            setRecentSearches(JSON.parse(stored));
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addToRecent = (keyword: string) => {
        const updated = [keyword, ...recentSearches.filter(k => k !== keyword)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchSubmit(search);
    };

    const searchSubmit = (keyword: string) => {
        if (keyword.trim()) {
            addToRecent(keyword.trim());
            router.push(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
            setIsOpen(false);
            setShowSuggestions(false);
            setSearch(keyword.trim()); // update input
        }
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-urban-light sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                        <Link href="/" className="font-kanit font-black text-2xl tracking-tighter text-brand-blue hover:text-urban-dark transition-colors flex flex-col items-start leading-none group">
                            <span className="relative text-3xl">MOONBLUES<span className="text-brand-yellow">STORE</span></span>
                            <span className="text-[0.6rem] tracking-[0.3em] text-urban-gray font-inter group-hover:text-brand-yellow transition-colors mt-1 uppercase">Premium Streetwear</span>
                        </Link>

                    {/* Desktop Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
                        <form
                            ref={formRef}
                            onSubmit={handleSearch}
                            className="w-full"
                        >
                            <input
                                type="text"
                                placeholder="ค้นหารุ่นสินค้า, รุ่นยอดนิยม..."
                                className="w-full bg-urban-light text-urban-dark rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-urban-black placeholder-urban-gray text-sm font-kanit transition-shadow relative z-20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                            />
                            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-urban-gray hover:text-urban-black z-20">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </button>

                            {/* Suggestion Dropdown */}
                            {showSuggestions && (
                                <div className="absolute top-12 left-0 w-full bg-white border border-urban-light rounded-xl shadow-xl z-10 overflow-hidden py-2 animate-fade-in-up">
                                    {recentSearches.length > 0 && (
                                        <div className="mb-2 border-b border-urban-light pb-2">
                                            <h4 className="px-4 py-2 text-xs font-bold text-urban-gray uppercase tracking-wider font-kanit">ค้นหาล่าสุด</h4>
                                            {recentSearches.map((term, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => searchSubmit(term)}
                                                    className="w-full text-left px-4 py-2 hover:bg-urban-light text-sm font-kanit text-urban-dark flex items-center gap-2 transition-colors"
                                                >
                                                    <span className="text-urban-gray">🕒</span> {term}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div>
                                        <h4 className="px-4 py-2 text-xs font-bold text-urban-gray uppercase tracking-wider font-kanit">ยอดนิยม 🔥</h4>
                                        {POPULAR_SEARCHES.map((term, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => searchSubmit(term)}
                                                className="w-full text-left px-4 py-2 hover:bg-urban-light text-sm font-kanit text-urban-dark flex items-center gap-2 transition-colors"
                                            >
                                                <span className="text-urban-gray">📈</span> {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </form>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex md:items-center space-x-6">
                        <Link href="/" className="text-urban-dark hover:text-urban-black font-kanit font-bold text-base tracking-wide">หน้าแรก</Link>
                        <Link href="/search?keyword=new" className="text-urban-dark hover:text-urban-black font-kanit font-bold text-base tracking-wide">สินค้าใหม่</Link>
                        <Link href="/search?keyword=popular" className="text-urban-dark hover:text-urban-black font-kanit font-bold text-base tracking-wide">ยอดนิยม</Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden gap-4">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-urban-black hover:bg-urban-light focus:outline-none transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-urban-white border-t border-urban-light absolute w-full shadow-lg">
                    <div className="px-4 pt-4 pb-2">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="ค้นหา..."
                                className="w-full bg-urban-light text-urban-dark rounded-lg py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-urban-black font-kanit"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-urban-gray">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </button>
                        </form>
                    </div>
                    <div className="pt-2 pb-6 space-y-1 px-4">
                        <Link href="/" className="block px-3 py-3 rounded-md text-base font-bold font-kanit text-urban-black hover:bg-urban-light" onClick={() => setIsOpen(false)}>
                            หน้าแรก
                        </Link>
                        <Link href="/search?keyword=new" className="block px-3 py-3 rounded-md text-base font-bold font-kanit text-urban-black hover:bg-urban-light" onClick={() => setIsOpen(false)}>
                            สินค้าใหม่
                        </Link>
                        <Link href="/search?keyword=popular" className="block px-3 py-3 rounded-md text-base font-bold font-kanit text-urban-black hover:bg-urban-light" onClick={() => setIsOpen(false)}>
                            ยอดนิยม
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
