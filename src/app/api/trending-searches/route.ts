import { NextResponse } from 'next/server';
import { getTrendingSearches } from '@/lib/searchTracking';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const trending = await getTrendingSearches(8);
        
        return NextResponse.json({
            success: true,
            data: trending
        });
    } catch (error: any) {
        console.error('Trending searches API error:', error);
        return NextResponse.json({
            success: false,
            error: {
                message: error.message || 'Failed to fetch trending searches'
            }
        }, { status: 500 });
    }
}
