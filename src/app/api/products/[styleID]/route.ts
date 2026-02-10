import { NextRequest, NextResponse } from 'next/server';
import { MOCK_SNEAKERS } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: any }
) {
    const resolvedParams = await params;
    const styleID = resolvedParams.styleID;
    
    const BACKEND_URL = process.env.BACKEND_URL;

    if (BACKEND_URL) {
        try {
            const res = await fetch(`${BACKEND_URL}/products/${styleID}`);
            if (res.ok) {
                const data = await res.json();
                return NextResponse.json(data);
            }
        } catch (error) {
            console.warn('Real backend failed, falling back to mock data');
        }
    }

    // Find in mock data
    const product = MOCK_SNEAKERS.find(s => s.styleID === styleID);

    if (!product) {
        return NextResponse.json({ success: false, error: 'Product not found in Demo Mode' }, { status: 404 });
    }

    return NextResponse.json({ 
        success: true, 
        data: product,
        note: "Running in Demo Mode (Mock Data)"
    });
}
