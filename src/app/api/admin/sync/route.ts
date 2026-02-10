import { NextRequest, NextResponse } from 'next/server';
import { syncSneakersToFirebase } from '@/lib/sync';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const keyword = searchParams.get('keyword');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!keyword) {
        return NextResponse.json({ 
            success: false, 
            message: 'กรุณาระบุ keyword (เช่น ?keyword=Jordan 1)' 
        }, { status: 400 });
    }

    try {
        const result = await syncSneakersToFirebase(keyword, limit);
        return NextResponse.json(result);
    } catch (error: any) {
        console.error('Sync API Error:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}
