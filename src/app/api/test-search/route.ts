import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Test sneaks-api directly
        const SneaksAPI = require('sneaks-api');
        const sneaks = new SneaksAPI();

        const testKeywords = ['jordan', 'dunk', 'yeezy', 'air jordan 1'];
        const results: any = {};

        for (const keyword of testKeywords) {
            await new Promise((resolve) => {
                sneaks.getProducts(keyword, 5, (err: any, products: any[]) => {
                    results[keyword] = {
                        error: err ? err.message : null,
                        count: products ? products.length : 0,
                        hasData: !!(products && products.length > 0)
                    };
                    resolve(null);
                });
            });
        }

        return NextResponse.json({
            success: true,
            message: 'API Test Results',
            results
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
