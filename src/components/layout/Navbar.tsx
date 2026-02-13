"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Sneaker } from '@/types/sneaker';

// Popular searches in Thailand/General Sneaker culture
const POPULAR_SEARCHES = [
    "Nike Dunk Low",
    "Air Jordan 1",
    "Yeezy Slide",
    "New Balance 530",
    "Samba",
    "Air Force 1"
];

// Bottom Nav Link Component
const BottomNavLink = ({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) => (
    <Link href={href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${active ? 'text-brand-blue' : 'text-urban-gray'}`}>
        <div className={`p-1.5 rounded-full transition-all ${active ? 'bg-brand-blue/10 transform -translate-y-1' : ''}`}>
            {icon}
        </div>
        <span className="text-[0.6rem] font-bold font-kanit">{label}</span>
    </Link>
);

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const router = useRouter();
    const pathname = usePathname();

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
        <>
            {/* Top Navbar */}
            <nav className="bg-white/95 backdrop-blur-md border-b border-urban-light fixed top-0 w-full z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 sm:h-20 items-center">
                        {/* Logo */}
                        <Link href="/" className="font-kanit font-black text-xl sm:text-2xl tracking-tighter text-brand-blue hover:text-urban-dark transition-colors flex flex-col items-start leading-none group">
                            <span className="relative text-2xl sm:text-3xl">MOONBLUE<span className="text-brand-yellow">.</span>s</span>
                            <span className="hidden sm:block text-[0.6rem] tracking-[0.3em] text-urban-gray font-inter group-hover:text-brand-yellow transition-colors mt-1 uppercase">Premium Streetwear</span>
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
                                    <div className="absolute top-12 left-0 w-full bg-white border border-urban-light rounded-xl shadow-xl z-20 overflow-hidden py-2 animate-fade-in-up">
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
                            <a href="https://line.me/R/ti/p/@moonbluesstore" target="_blank" className="bg-brand-green text-white px-4 py-1.5 rounded-full font-bold font-kanit text-sm hover:bg-green-600 transition-colors">
                            Line Contact
                            </a>
                        </div>
                        
                        {/* Mobile Search Icon (To open full search page) */}
                        <Link href="/search" className="md:hidden p-2 text-urban-black">
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </Link>

                    </div>
                </div>
            </nav>

            {/* Bottom Navigation (Mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-urban-light z-50 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center h-16">
                    <BottomNavLink 
                        href="/" 
                        active={pathname === '/'}
                        label="Home" 
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>}
                    />
                    <BottomNavLink 
                        href="/search" 
                        active={pathname === '/search' && !search}
                        label="Search" 
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>}
                    />
                     <BottomNavLink 
                        href="/search?keyword=popular" 
                        active={pathname.includes('popular')}
                        label="Popular" 
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>}
                    />
                    <a href="https://line.me/R/ti/p/@moonbluesstore" target="_blank" className="flex flex-col items-center justify-center w-full h-full space-y-1 text-urban-gray hover:text-brand-green">
                         <div className="p-1.5 rounded-full">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 5.51 2 9.84c0 2.96 2.1 5.56 5.16 6.94l-.84 3.06c-.08.28.24.51.5.38l3.66-2.02c.5.08 1.02.12 1.52.12 5.52 0 10-3.51 10-7.84S17.52 2 12 2z"/></svg>
                         </div>
                         <span className="text-[0.6rem] font-bold font-kanit">Line OA</span>
                    </a>
                </div>
            </div>
        </>
    );
}
