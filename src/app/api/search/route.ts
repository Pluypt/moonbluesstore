import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/sneaks';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword') || '';
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : 20;
    
    try {
        const products = await getProducts(keyword, limit);
        
        return NextResponse.json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error: any) {
        console.error('Search API error:', error);
        return NextResponse.json({
            success: false,
            error: {
                message: error.message || 'Failed to fetch sneakers'
            }
        }, { status: 500 });
    }
}
