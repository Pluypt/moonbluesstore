import { NextResponse } from 'next/server';
import { searchMockData, MOCK_SNEAKERS } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') || '';

    try {
        const results = searchMockData(keyword, 20);
        
        return NextResponse.json({
            success: true,
            keyword: keyword,
            totalMockData: MOCK_SNEAKERS.length,
            resultsCount: results.length,
            data: results
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
