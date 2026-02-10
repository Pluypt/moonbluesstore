import { NextRequest, NextResponse } from 'next/server';
import { MOCK_SNEAKERS } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const keyword = (searchParams.get('keyword') || '').toLowerCase();
    
    // Check if we want to use real backend
    const BACKEND_URL = process.env.BACKEND_URL;

    if (BACKEND_URL) {
        try {
            const limit = searchParams.get('limit') || '20';
            const res = await fetch(`${BACKEND_URL}/search?keyword=${encodeURIComponent(keyword)}&limit=${limit}`, {
                next: { revalidate: 3600 }
            });
            if (res.ok) {
                const data = await res.json();
                return NextResponse.json(data);
            }
        } catch (error) {
            console.warn('Real backend failed, falling back to mock data');
        }
    }

    // Filter mock data for "Play Mode"
    const filtered = MOCK_SNEAKERS.filter(s => 
        s.shoeName.toLowerCase().includes(keyword) || 
        s.brand.toLowerCase().includes(keyword) ||
        s.styleID.toLowerCase().includes(keyword) ||
        keyword === ''
    );

    return NextResponse.json({
        success: true,
        count: filtered.length,
        data: filtered,
        note: "Running in Demo Mode (Mock Data)"
    });
}
