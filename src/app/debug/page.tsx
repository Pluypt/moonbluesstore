"use client";

import { useState } from 'react';

export default function DebugPage() {
    const [keyword, setKeyword] = useState('530');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const testMockAPI = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/mock-test?keyword=${keyword}`);
            const data = await res.json();
            setResult(data);
        } catch (error) {
            setResult({ error: 'Failed to fetch' });
        }
        setLoading(false);
    };

    const testSearchAPI = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/search?keyword=${keyword}&limit=20`);
            const data = await res.json();
            setResult(data);
        } catch (error) {
            setResult({ error: 'Failed to fetch' });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-white p-8 pt-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Debug Search API</h1>
                
                <div className="mb-6">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="border border-gray-300 rounded px-4 py-2 w-full mb-4"
                        placeholder="Enter keyword (e.g., 530, jordan, dunk)"
                    />
                    
                    <div className="flex gap-4">
                        <button
                            onClick={testMockAPI}
                            disabled={loading}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            Test Mock API
                        </button>
                        
                        <button
                            onClick={testSearchAPI}
                            disabled={loading}
                            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                        >
                            Test Search API
                        </button>
                    </div>
                </div>

                {loading && <p>Loading...</p>}

                {result && (
                    <div className="bg-gray-100 p-4 rounded">
                        <h2 className="font-bold mb-2">Result:</h2>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
