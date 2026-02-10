"use client";

import { useState } from 'react';

export default function AdminSyncPage() {
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<any>(null);
    const [upcomingLoading, setUpcomingLoading] = useState(false);
    const [upcomingStatus, setUpcomingStatus] = useState<any>(null);

    const handleSync = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!keyword.trim()) return;

        setLoading(true);
        setStatus(null);

        try {
            const res = await fetch(`/api/admin/sync?keyword=${encodeURIComponent(keyword)}&limit=15`);
            const data = await res.json();
            setStatus(data);
        } catch (error) {
            setStatus({ success: false, message: 'การเชื่อมต่อผิดพลาด' });
        } finally {
            setLoading(false);
        }
    };

    const handleImportUpcoming = async () => {
        setUpcomingLoading(true);
        setUpcomingStatus(null);
        try {
            const res = await fetch('/api/import-sneakers', { method: 'POST' });
            const data = await res.json();
            setUpcomingStatus(data);
        } catch (error) {
            setUpcomingStatus({ success: false, message: 'การเชื่อมต่อผิดพลาด' });
        } finally {
            setUpcomingLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 font-kanit">
            <h1 className="text-3xl font-black mb-8 text-urban-black">Admin: Sync Sneakers</h1>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-urban-light">
                <p className="text-urban-gray mb-6">
                    ใส่ชื่อรุ่นรองเท้าที่ต้องการดูดข้อมูลจากตลาดมาลงใน Firebase ของร้าน (เช่น "Jordan 1 High", "Nike Dunk", "Yeezy")
                </p>

                <form onSubmit={handleSync} className="flex gap-4">
                    <input
                        type="text"
                        placeholder="ชื่อรุ่น..."
                        className="flex-1 bg-urban-light border-none rounded-full px-6 py-4 focus:ring-2 focus:ring-brand-yellow outline-none"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-8 py-4 rounded-full font-bold text-white transition-all ${loading ? 'bg-urban-gray cursor-not-allowed' : 'bg-urban-black hover:bg-brand-blue shadow-lg'
                            }`}
                    >
                        {loading ? 'กำลังดึงข้อมูล...' : 'เริ่มดูดข้อมูล 🚀'}
                    </button>
                </form>

                {status && (
                    <div className={`mt-8 p-6 rounded-2xl border ${status.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <h3 className={`font-bold mb-2 ${status.success ? 'text-green-700' : 'text-red-700'}`}>
                            {status.success ? `สำเร็จ! อัปเดตข้อมูล ${status.count} รายการ` : 'เกิดข้อผิดพลาด'}
                        </h3>
                        {status.items && (
                            <ul className="text-sm text-urban-dark space-y-1 mt-4">
                                {status.items.map((item: any, i: number) => (
                                    <li key={i}>✅ {item.styleID} - {item.name}</li>
                                ))}
                            </ul>
                        )}
                        {status.error && <p className="text-red-600 text-sm">{status.error}</p>}
                    </div>
                )}
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-urban-light mt-8">
                <h2 className="text-2xl font-bold mb-4 text-urban-black">Import Upcoming Releases (NiceKicks)</h2>
                <p className="text-urban-gray mb-6">
                    ดึงข้อมูลตารางการวางจำหน่ายรองเท้า Air Jordan รุ่นใหม่ๆ จากเว็บ NiceKicks มาลงในระบบ
                </p>

                <button
                    onClick={handleImportUpcoming}
                    disabled={upcomingLoading}
                    className={`px-8 py-4 rounded-full font-bold text-white transition-all w-full md:w-auto ${upcomingLoading ? 'bg-urban-gray cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-lg'
                        }`}
                >
                    {upcomingLoading ? 'กำลังดึงข้อมูลจาก NiceKicks...' : 'ดึงข้อมูลสินค้าเข้าใหม่ 📅'}
                </button>

                {upcomingStatus && (
                    <div className={`mt-8 p-6 rounded-2xl border ${upcomingStatus.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <h3 className={`font-bold mb-2 ${upcomingStatus.success ? 'text-green-700' : 'text-red-700'}`}>
                            {upcomingStatus.success ? `สำเร็จ! ${upcomingStatus.message}` : 'เกิดข้อผิดพลาด'}
                        </h3>
                        {upcomingStatus.error && <p className="text-red-600 text-sm">{upcomingStatus.error}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
