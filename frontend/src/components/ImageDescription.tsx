import React, { useState } from 'react';
import { describeImage } from '../api/client';

export const ImageDescription: React.FC = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [result, setResult] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setResult(null);
        try {
            const description = await describeImage(imageUrl);
            setResult(description);
            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="p-4 border rounded shadow-md bg-white">
            <h2 className="text-xl font-bold mb-4">Product Image Description</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                        type="url"
                        className="mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                    {status === 'loading' ? 'Generating...' : 'Generate Description'}
                </button>
                {status === 'error' && <p className="text-red-600">Error generating description.</p>}
                {result && (
                    <div className="mt-4 p-4 bg-gray-50 rounded">
                        <h3 className="font-semibold mb-2">Generated Description:</h3>
                        <p className="text-gray-800">{result}</p>
                    </div>
                )}
            </form>
        </div>
    );
};
