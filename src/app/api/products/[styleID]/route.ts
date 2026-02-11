import { NextRequest, NextResponse } from 'next/server';
import { getProductByStyleID } from '@/lib/sneaks';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ styleID: string }> }
) {
    const { styleID } = await params;

    try {
        const product = await getProductByStyleID(styleID);

        if (!product) {
            return NextResponse.json({
                success: false,
                error: 'Product not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: product
        });
    } catch (error: any) {
        console.error('Product API error:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch product details'
        }, { status: 500 });
    }
}
